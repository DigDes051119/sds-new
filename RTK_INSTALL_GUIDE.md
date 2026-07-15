# RTK (Rust Token Killer) — Инструкция по установке для AI-агента

## Что это

**RTK** — CLI-утилита, которая фильтрует вывод команд, сокращая потребление токентов AI-агентом на **60–90%**. Все команды (`build`, `test`, `git`, `npm` и т.д.) работают как обычно, но вывод становится компактнее.

## Установка (Windows)

Выполни следующие шаги последовательно:

### 1. Узнай последнюю версию

```bash
# Получить JSON с информацией о последнем релизе
curl -s https://api.github.com/repos/rtk-ai/rtk/releases/latest | findstr "tag_name"
```

### 2. Скачай бинарник для Windows

```bash
curl -L -o rtk.zip https://github.com/rtk-ai/rtk/releases/latest/download/rtk-x86_64-pc-windows-msvc.zip
```

### 3. Распакуй

```bash
powershell -Command "Expand-Archive -Path rtk.zip -DestinationPath rtk_temp -Force"
```

### 4. Скопируй в папку на PATH

```bash
# Создай папку
if not exist %USERPROFILE%\rtk mkdir %USERPROFILE%\rtk

# Скопируй exe
copy rtk_temp\rtk.exe %USERPROFILE%\rtk\rtk.exe
```

### 5. Добавь в PATH

**Вариант A — через `setx` (простой):**
```cmd
setx PATH "%PATH%;%USERPROFILE%\rtk"
```

**Вариант B — через PowerShell (если `setx` падает из-за длины PATH):**
```powershell
[Environment]::SetEnvironmentVariable('PATH', [Environment]::GetEnvironmentVariable('PATH','User') + ';C:\Users\%USERNAME%\rtk', 'User')
```

### 6. Проверь установку

Используй полный путь (т.к. текущая сессия ещё не обновила PATH):

```bash
C:\Users\%USERNAME%\rtk\rtk.exe --version
```

Ожидаемый ответ: `rtk 0.43.0` (или новее).

### 7. Настрой глобально

```bash
%USERPROFILE%\rtk\rtk.exe init --global
```

Это добавит хуки в `~/.claude/CLAUDE.md`.

### 8. Проверь, что RTK работает

```bash
%USERPROFILE%\rtk\rtk.exe git status
```

## Использование

Просто добавь префикс `rtk` перед любой командой.

**До (без RTK):**
```bash
npx vite build      # → много шума, ~8КБ токенов
git status          # → весь вывод git
```

**После (с RTK):**
```bash
rtk npx vite build  # → только суть, ~800Б токенов
rtk git status      # → компактный статус
```

Главное правило — **всегда писать `rtk` перед командой**. Даже в цепочках:

```bash
# ❌ ПЛОХО
git add . && git commit -m "msg" && git push

# ✅ ХОРОШО
rtk git add . && rtk git commit -m "msg" && rtk git push
```

Где RTK не умеет фильтровать — он просто пропускает вывод как есть, так что безопасно всегда.

## Windows-specific предостережения

- **PowerShell** не поддерживает `&&` — используй `cmd /c "команда"` для цепочек
- **Пути с пробелами** — экранируй кавычками: `cd "D:\My Project"`
- **PATH** обновляется только для новых процессов — в текущей сессии используй полный путь

## Экономия токенов (таблица)

| Категория | Пример | Экономия |
|-----------|--------|----------|
| Сборка | `rtk npx vite build` | 70-87% |
| Тесты | `rtk vitest` | 90-99% |
| Git | `rtk git status` | 59-80% |
| Файлы | `rtk ls`, `rtk read` | 60-75% |
| Пакеты | `rtk pnpm install` | 90% |

---

Готово. После этих шагов AI-агент будет тратить в 3–10 раз меньше токенов на команды.
