$content = Get-Content "src\app\pages\AdminProjectsEditor.tsx" -Raw -Encoding UTF8

$content = $content -replace 'AdminProjectsEditor', 'AdminWebUiUxEditor'
$content = $content -replace 'Управление проектами', 'Управление проектами WEB / UI UX'
$content = $content -replace '\.projects\.items', '.webUiUx.items'
$content = $content -replace 't\.projects', 't.webUiUx'
$content = $content -replace 'translations\[lang\]\.projects', 'translations[lang].webUiUx'
$content = $content -replace 'translations\.ru\.projects', 'translations.ru.webUiUx'
$content = $content -replace 'translations\.en\.projects', 'translations.en.webUiUx'
$content = $content -replace 'translations\.kg\.projects', 'translations.kg.webUiUx'

$content = $content -replace 'newTranslations\.ru\.projects', 'newTranslations.ru.webUiUx'
$content = $content -replace 'newTranslations\.en\.projects', 'newTranslations.en.webUiUx'
$content = $content -replace 'newTranslations\.kg\.projects', 'newTranslations.kg.webUiUx'

# Remove the Synq restore block which might mess up things
$content = $content -replace '(?s)// Restore Synq project automatically.*?}, \[\]\);', ''

[System.IO.File]::WriteAllText("d:\Steel Drake Studio Team\SDST web site\src\app\pages\AdminWebUiUxEditor.tsx", $content, [System.Text.Encoding]::UTF8)
