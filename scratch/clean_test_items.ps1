$Url = "https://hniqpnuqqsmqpolxgbav.supabase.co/rest/v1/sds_translations?id=eq.1"
$Headers = @{
    "apikey" = "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu"
    "Authorization" = "Bearer sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu"
}

$raw = (Invoke-WebRequest -Uri $Url -Method Get -Headers $Headers).Content
$jsonObj = ConvertFrom-Json $raw
$data = $jsonObj[0].data

$langs = @("ru", "en", "kg", "zh", "ar", "de")
foreach ($l in $langs) {
    if ($data.$l -and $data.$l.concepts -and $data.$l.concepts.items) {
        $filtered = @($data.$l.concepts.items | Where-Object { $_.id -ne "test001" -and $_.id -ne "test002" })
        $data.$l.concepts.items = $filtered
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

Invoke-RestMethod -Uri $Url -Method Patch -Headers $updateHeaders -Body ([System.Text.Encoding]::UTF8.GetBytes($body))
Write-Host "Cleaned test items from Supabase concepts!"
