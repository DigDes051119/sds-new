$Url = "https://hniqpnuqqsmqpolxgbav.supabase.co/rest/v1/sds_translations?id=eq.1"
$Headers = @{
    "apikey" = "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu"
    "Authorization" = "Bearer sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu"
}

Write-Host "Fetching translations from Supabase..."
$raw = (Invoke-WebRequest -Uri $Url -Method Get -Headers $Headers).Content
$jsonObj = ConvertFrom-Json $raw
$data = $jsonObj[0].data

$removeIds = @("evodrone", "iphone-iq-concept-2018", "sony-zeus", "ps5-concept-2018", "tesla-sd-concept")
$langs = @("ru", "en", "kg", "zh", "ar", "de")

foreach ($l in $langs) {
    if ($data.$l -and $data.$l.products -and $data.$l.products.items) {
        $initialCount = $data.$l.products.items.Count
        $filtered = @($data.$l.products.items | Where-Object { $removeIds -notcontains $_.id })
        $data.$l.products.items = $filtered
        Write-Host "[$l] Removed items from products. Count went from $initialCount to $($filtered.Count)"
    }
}

$body = @{
    data = $data
} | ConvertTo-Json -Depth 100

$updateHeaders = @{
    "apikey" = "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu"
    "Authorization" = "Bearer sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu"
    "Content-Type" = "application/json"
    "Prefer" = "return=minimal"
}

Write-Host "Saving updated data back to Supabase..."
Invoke-RestMethod -Uri $Url -Method Patch -Headers $updateHeaders -Body ([System.Text.Encoding]::UTF8.GetBytes($body))
Write-Host "SUCCESS! Database updated successfully - 5 projects removed from Products section."
