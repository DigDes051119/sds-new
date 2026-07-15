-- ============================================================
-- Supabase SQL: Cache-Control для ВСЕХ существующих файлов
-- ============================================================
-- Запусти в Supabase Dashboard → SQL Editor → New query
-- Это обновит метаданные всех файлов в бакете 'assets',
-- добавив cache-control: public, max-age=31536000, immutable
-- Браузеры будут кешировать файлы на 1 год без перепроверки.
-- ============================================================

-- 1. Показать текущее состояние (сколько файлов без cache-control)
SELECT 
  COUNT(*) AS files_without_cache_control
FROM storage.objects o
JOIN storage.buckets b ON o.bucket_id = b.id
WHERE b.name = 'assets' 
  AND (o.metadata IS NULL OR o.metadata->>'cacheControl' IS NULL);

-- 2. Обновить cache-control для всех файлов в бакете 'assets'
UPDATE storage.objects
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{cacheControl}',
  '"public, max-age=31536000, immutable"'
)
WHERE bucket_id = (SELECT id FROM storage.buckets WHERE name = 'assets');

-- 3. Проверить результат
SELECT 
  name AS file_path,
  metadata->>'cacheControl' AS cache_control,
  metadata->>'size' AS file_size
FROM storage.objects o
JOIN storage.buckets b ON o.bucket_id = b.id
WHERE b.name = 'assets'
ORDER BY name
LIMIT 20;
