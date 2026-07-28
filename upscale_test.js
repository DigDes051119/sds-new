const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const SUPABASE_URL = "https://hniqpnuqqsmqpolxgbav.supabase.co";
const SUPABASE_KEY = "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu";

const INPUT_IMG = path.join(__dirname, 'backups', 'media', 'item_1784797373843_0.webp');
const OUTPUT_IMG = path.join(__dirname, 'backups', 'media', 'item_1784797373843_0_upscaled.webp');
const REALESRGAN_DIR = path.join(__dirname, 'realesrgan-bin');
const REALESRGAN_EXE = path.join(REALESRGAN_DIR, 'realesrgan-ncnn-vulkan.exe');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  console.log("=== ТЕСТОВЫЙ АПСКЕЙЛ ИЗОБРАЖЕНИЯ ===");

  // 1. Проверяем наличие исходного изображения
  if (!fs.existsSync(INPUT_IMG)) {
    console.error(`Ошибка: Исходное изображение не найдено по пути: ${INPUT_IMG}`);
    rl.close();
    return;
  }

  // 2. Скачиваем Real-ESRGAN, если его нет
  if (!fs.existsSync(REALESRGAN_EXE)) {
    console.log("1. Скачивание и распаковка Real-ESRGAN (это займет около 10-20 секунд)...");
    try {
      if (!fs.existsSync(REALESRGAN_DIR)) {
        fs.mkdirSync(REALESRGAN_DIR);
      }
      
      // Скачиваем архив через curl (встроен в Windows 10/11)
      const zipPath = path.join(__dirname, 'realesrgan.zip');
      console.log("-> Скачивание zip...");
      execSync(`curl -L -o "${zipPath}" "https://github.com/xinntao/Real-ESRGAN-ncnn-vulkan/releases/download/v0.2.0/realesrgan-ncnn-vulkan-v0.2.0-windows.zip"`, { stdio: 'inherit' });
      
      // Распаковываем через tar (встроен в Windows 10/11)
      console.log("-> Распаковка...");
      execSync(`tar -xf "${zipPath}" -C "${REALESRGAN_DIR}"`, { stdio: 'inherit' });
      
      // Удаляем архив
      fs.unlinkSync(zipPath);
      console.log("✅ Утилита успешно установлена.");
    } catch (e) {
      console.error("❌ Ошибка при установке Real-ESRGAN:", e.message);
      rl.close();
      return;
    }
  } else {
    console.log("1. Real-ESRGAN уже установлен.");
  }

  // 3. Запускаем апскейл
  console.log("\n2. Запуск ИИ-улучшения изображения (апскейл)...");
  try {
    // Запуск утилиты (по умолчанию увеличивает в 4 раза)
    // Используем модель realesrgan-x4plus, которая отлично подходит для рендеров и фото
    const cmd = `"${REALESRGAN_EXE}" -i "${INPUT_IMG}" -o "${OUTPUT_IMG}" -n realesrgan-x4plus`;
    console.log(`Выполнение: ${cmd}`);
    execSync(cmd, { stdio: 'inherit' });
    console.log("✅ Изображение успешно улучшено!");
  } catch (e) {
    console.error("❌ Ошибка при апскейле изображения:", e.message);
    rl.close();
    return;
  }

  // 4. Логин в Supabase для загрузки
  console.log("\n3. Авторизация в Supabase для загрузки на сайт...");
  const email = await question("Введите ваш email администратора: ");
  const password = await question("Введите ваш пароль: ");

  console.log("-> Авторизация...");
  let token = "";
  try {
    const authRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const authData = await authRes.json();
    if (!authRes.ok) {
      throw new Error(authData.error_description || authData.message || "Неверные учетные данные");
    }
    token = authData.access_token;
    console.log("✅ Авторизация успешна!");
  } catch (e) {
    console.error("❌ Ошибка авторизации:", e.message);
    rl.close();
    return;
  }

  // 5. Загрузка файла в Supabase Storage
  console.log("\n4. Загрузка улучшенного изображения в облако...");
  try {
    const fileBuffer = fs.readFileSync(OUTPUT_IMG);
    const pathOnStorage = "archive/item_1784797373843_0.webp"; // Путь к файлу в бакете assets
    
    // Загружаем методом PUT для перезаписи
    const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/assets/${pathOnStorage}`, {
      method: 'PUT',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'image/webp'
      },
      body: fileBuffer
    });

    if (!uploadRes.ok) {
      const err = await uploadRes.json().catch(() => ({ message: uploadRes.statusText }));
      throw new Error(err.message || "Не удалось загрузить файл");
    }

    console.log("\n🎉 ПОЛНЫЙ УСПЕХ! Изображение iPhone 8 Concept (слайд 6) успешно заменено на улучшенную версию!");
    console.log("Обновите страницу на сайте или в админке, чтобы оценить разницу.");
  } catch (e) {
    console.error("❌ Ошибка при загрузке в Supabase:", e.message);
  }

  rl.close();
}

main().catch((e) => {
  console.error(e);
  rl.close();
});
