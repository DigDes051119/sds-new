$Url = "https://hniqpnuqqsmqpolxgbav.supabase.co/rest/v1/sds_translations?id=eq.1"
$Headers = @{
    "apikey" = "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu"
    "Authorization" = "Bearer sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu"
}

Write-Host "Fetching concepts from Supabase..."
$raw = (Invoke-WebRequest -Uri $Url -Method Get -Headers $Headers).Content
$jsonObj = ConvertFrom-Json $raw
$items = $jsonObj[0].data.en.concepts.items
$itemsJson = ConvertTo-Json $items -Depth 10

Write-Host "Reading i18n.ts..."
$i18nPath = "d:\Steel Drake Studio Team\SDST web site\src\app\i18n.ts"
$i18nContent = [System.IO.File]::ReadAllText($i18nPath)

$targetBlock = @"
    concepts: {
      title: "Concepts & Vision",
      items: $itemsJson,
    },
"@

# Replace empty concepts block in i18n.ts
$newContent = $i18nContent -replace 'concepts:\s*\{\s*title:\s*"Concepts & Vision",\s*items:\s*\[\s*\],\s*\}', $targetBlock

[System.IO.File]::WriteAllText($i18nPath, $newContent, [System.Text.Encoding]::UTF8)
Write-Host "i18n.ts updated with concepts items!"
