# Sanarip Med AI — Landing Page

Инновационный медицинский лендинг цифровой экосистемы здравоохранения Кыргызстана (AI-триаж, скорая помощь 103, визуальная диагностика травм, интеграция с клиниками и врачами).

## Быстрый старт локально

```bash
# 1. Установка зависимостей
npm install

# 2. Запуск фронтенд dev-сервера
npm run dev

# 3. (Опционально) Запуск Node.js бэкенда
npm run server
```

## Сборка и деплой

### 1. Деплой на поддомен (например, `sanarip.steeldrakestudio.com`):
В настройках Cloudflare Pages:
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: (укажите папку, если проект лежит в монорепозитории)
- **Custom domains**: добавьте `sanarip.steeldrakestudio.com`

### 2. Деплой в подпапку (например, `вашдомен.com/sanarip-med-ai`):
Установите переменную окружения в Cloudflare Pages:
- `VITE_BASE_PATH=/sanarip-med-ai/`
