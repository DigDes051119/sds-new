const { runBackup } = require('./auto_backup.cjs');

const TWO_HOURS_MS = 2 * 60 * 60 * 1000; // 2 часа

console.log("🤖 АВТОМАТИЧЕСКАЯ СЛУЖБА БЭКАПА ЗАПУЩЕНА!");
console.log("Первый бэкап выполняется прямо сейчас, затем каждые 2 часа...");

// Первый запуск при старте
runBackup();

// Повтор каждые 2 часа
setInterval(() => {
    runBackup();
}, TWO_HOURS_MS);
