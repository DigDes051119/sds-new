const fs = require('fs');
const path = require('path');

const SUPABASE_URL = "https://hniqpnuqqsmqpolxgbav.supabase.co";
const SUPABASE_KEY = "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu";

// Настройка пути к Google Диску (оставьте пустым для автоопределения или укажите вручную)
let GOOGLE_DRIVE_DIR = ''; 

// Папка для бэкапов
const BACKUP_BASE_DIR = path.join(__dirname, 'backups');
const MEDIA_DIR = path.join(BACKUP_BASE_DIR, 'media');

if (!fs.existsSync(BACKUP_BASE_DIR)) fs.mkdirSync(BACKUP_BASE_DIR, { recursive: true });
if (!fs.existsSync(MEDIA_DIR)) fs.mkdirSync(MEDIA_DIR, { recursive: true });

// Функция рекурсивного копирования папки кода (игнорируя node_modules, .git, backups, dist, .claude, etc.)
function copyDirSync(src, dest) {
    if (!fs.existsSync(src)) return;
    fs.mkdirSync(dest, { recursive: true });
    let entries = [];
    try {
        entries = fs.readdirSync(src, { withFileTypes: true });
    } catch {
        return;
    }

    for (let entry of entries) {
        if (['node_modules', '.git', 'backups', 'dist', '.claude', '.agents', '.codewhale', '.rtk'].includes(entry.name)) continue;

        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        try {
            const stat = fs.statSync(srcPath);
            if (stat.isDirectory()) {
                copyDirSync(srcPath, destPath);
            } else if (stat.isFile()) {
                fs.copyFileSync(srcPath, destPath);
            }
        } catch (err) {
            // ignore inaccessible files / broken symlinks
        }
    }
}

// Функция для скачивания файла по URL
async function downloadFile(url, destPath) {
    if (fs.existsSync(destPath)) return;
    try {
        const res = await fetch(url);
        if (!res.ok) return;
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(destPath, buffer);
        console.log(`  [Медиа] Сохранен: ${path.basename(destPath)}`);
    } catch (e) {
        console.warn(`  [Медиа Ошибка] Не удалось скачать ${url}: ${e.message}`);
    }
}

// Поиск всех ссылок на медиафайлы в объекте
function extractUrls(obj, urls = new Set()) {
    if (!obj) return urls;
    if (typeof obj === 'string') {
        if (obj.startsWith('http://') || obj.startsWith('https://')) {
            if (obj.match(/\.(webp|png|jpg|jpeg|svg|mp4|gif)($|\?)/i) || obj.includes('/storage/v1/object/public/')) {
                urls.add(obj);
            }
        }
    } else if (Array.isArray(obj)) {
        obj.forEach(item => extractUrls(item, urls));
    } else if (typeof obj === 'object') {
        Object.values(obj).forEach(val => extractUrls(val, urls));
    }
    return urls;
}

function getLocalTimestamp() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const y = now.getFullYear();
    const m = pad(now.getMonth() + 1);
    const d = pad(now.getDate());
    const hh = pad(now.getHours());
    const mm = pad(now.getMinutes());
    const ss = pad(now.getSeconds());
    return `${y}-${m}-${d}_${hh}-${mm}-${ss}`;
}

async function runBackup() {
    const timestamp = getLocalTimestamp();
    console.log(`\n========================================`);
    console.log(`🚀 ЗАПУСК ПОЛНОГО БЭКАПА (КОД + БД + МЕДИА): ${new Date().toLocaleString()}`);
    console.log(`========================================`);

    const currentBackupDir = path.join(BACKUP_BASE_DIR, `backup_${timestamp}`);
    const codeBackupDir = path.join(currentBackupDir, 'site_and_admin_code');
    const dbBackupDir = path.join(currentBackupDir, 'database_dump');

    fs.mkdirSync(currentBackupDir, { recursive: true });
    fs.mkdirSync(dbBackupDir, { recursive: true });

    // 1. БЭКАП ИСХОДНОГО КОДА САЙТА И АДМИНКИ
    console.log(`📁 1/3 Копирование исходного кода сайта и админки...`);
    copyDirSync(__dirname, codeBackupDir);
    console.log(`✅ Исходный код сайта и админки успешно сохранен в: site_and_admin_code/`);

    // 2. БЭКАП БАЗЫ ДАННЫХ
    console.log(`\n🗄️ 2/3 Выгрузка таблиц базы данных Supabase...`);
    const tables = ['sds_translations', 'sds_project_details', 'sds_archive_items', 'sds_leads', 'sds_admin_logs'];
    const allMediaUrls = new Set();
    const dbDump = {};

    for (const table of tables) {
        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
                headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
            });
            if (res.ok) {
                const data = await res.json();
                dbDump[table] = data;
                fs.writeFileSync(path.join(dbBackupDir, `${table}.json`), JSON.stringify(data, null, 2), 'utf8');
                console.log(`  - Таблица ${table}: сохранена (${data.length} записей)`);
                
                extractUrls(data, allMediaUrls);
            } else {
                console.warn(`  ⚠️ Не удалось скачать ${table}: HTTP ${res.status}`);
            }
        } catch (e) {
            console.error(`  ❌ Ошибка таблицы ${table}: ${e.message}`);
        }
    }
    fs.writeFileSync(path.join(dbBackupDir, 'full_db_dump.json'), JSON.stringify(dbDump, null, 2), 'utf8');

    // 3. БЭКАП МЕДИАФАЙЛОВ И КАРТИНОК
    console.log(`\n🖼️ 3/3 Найдено уникальных фото/видео: ${allMediaUrls.size}`);
    console.log(`📥 Скачивание материалов в папку backups/media...`);

    let downloadedCount = 0;
    for (const url of allMediaUrls) {
        const urlObj = new URL(url);
        const filename = path.basename(urlObj.pathname);
        const safeFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, '_');
        const mediaPath = path.join(MEDIA_DIR, safeFilename);

        if (!fs.existsSync(mediaPath)) {
            await downloadFile(url, mediaPath);
            downloadedCount++;
        }
    }

    console.log(`✅ Скачано новых медиафайлов: ${downloadedCount}`);

    // 4. СИНХРОНИЗАЦИЯ С GOOGLE DRIVE
    let targetGdriveDir = GOOGLE_DRIVE_DIR;
    if (!targetGdriveDir) {
        // Попытка автоопределения путей Google Диска на Windows
        const possiblePaths = [
            'G:\\My Drive\\SDST backups',
            'G:\\Мой диск\\SDST backups',
            path.join(process.env.USERPROFILE || 'C:\\Users\\Default', 'Google Drive\\My Drive\\SDST backups'),
            path.join(process.env.USERPROFILE || 'C:\\Users\\Default', 'Google Диск\\Мой диск\\SDST backups')
        ];
        for (const p of possiblePaths) {
            const parent = path.dirname(p);
            if (fs.existsSync(parent)) {
                targetGdriveDir = p;
                break;
            }
        }
    }

    if (targetGdriveDir) {
        console.log(`\n☁️ 4/4 Синхронизация бэкапа с Google Диском...`);
        try {
            const cloudBackupDir = path.join(targetGdriveDir, `backup_${timestamp}`);
            fs.mkdirSync(cloudBackupDir, { recursive: true });
            
            // Копируем файлы бэкапа кода и БД
            copyDirSync(path.join(currentBackupDir, 'site_and_admin_code'), path.join(cloudBackupDir, 'site_and_admin_code'));
            copyDirSync(path.join(currentBackupDir, 'database_dump'), path.join(cloudBackupDir, 'database_dump'));
            
            // Копируем медиафайлы в единую облачную папку media
            const cloudMediaDir = path.join(targetGdriveDir, 'media');
            fs.mkdirSync(cloudMediaDir, { recursive: true });
            
            const localMediaFiles = fs.readdirSync(MEDIA_DIR);
            let copiedMediaCount = 0;
            for (const file of localMediaFiles) {
                const srcPath = path.join(MEDIA_DIR, file);
                const destPath = path.join(cloudMediaDir, file);
                if (!fs.existsSync(destPath)) {
                    fs.copyFileSync(srcPath, destPath);
                    copiedMediaCount++;
                }
            }
            
            console.log(`✅ Успешно синхронизировано с Google Диском: ${targetGdriveDir}`);
            if (copiedMediaCount > 0) {
                console.log(`  - Отправлено новых медиафайлов в облако: ${copiedMediaCount}`);
            }
        } catch (e) {
            console.warn(`  ⚠️ Не удалось скопировать на Google Диск: ${e.message}`);
            console.log(`  👉 Проверьте, запущен ли клиент Google Диск и правильный ли путь.`);
        }
    } else {
        console.log(`\n☁️ 4/4 Пропуск синхронизации с Google Диском (папка Google Drive не обнаружена).`);
        console.log(`👉 Вы можете указать точный путь к папке Google Диска в переменной GOOGLE_DRIVE_DIR на строке 8 в auto_backup.cjs`);
    }

    console.log(`\n========================================`);
    console.log(`🎉 ПОЛНЫЙ БЭКАП УСПЕШНО ЗАВЕРШЕН!`);
    console.log(`Путь к локальной копии: backups/backup_${timestamp}`);
    console.log(`========================================\n`);
}

if (require.main === module) {
    runBackup();
}

module.exports = { runBackup };
