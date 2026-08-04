$Url = "https://hniqpnuqqsmqpolxgbav.supabase.co/rest/v1/sds_translations?id=eq.1"
$Headers = @{
    "apikey" = "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu"
    "Authorization" = "Bearer sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu"
}

Write-Host "Fetching current remote sds_translations..."
$raw = (Invoke-WebRequest -Uri $Url -Method Get -Headers $Headers).Content
$jsonObj = ConvertFrom-Json $raw
$data = $jsonObj[0].data

# Define 5 moved concept items
$conceptItemsRu = @(
    @{ id = "evodrone"; img = "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785433766519.webp"; name = "Evodrone"; category = "Индустриальный дизайн"; categoryKey = "industrial" },
    @{ id = "iphone-iq-concept-2018"; img = "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785435568845.webp"; name = "Iphone IQ concept 2018"; category = "Индустриальный дизайн"; categoryKey = "industrial" },
    @{ id = "sony-zeus"; img = "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785056660421.webp"; name = "SONY ZEUS"; category = "Концептуальный дизайн"; categoryKey = "concept" },
    @{ id = "ps5-concept-2018"; img = "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785657893376.webp"; name = "PS5 concept 2018"; category = "Индустриальный дизайн"; categoryKey = "industrial" },
    @{ id = "tesla-sd-concept"; img = "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785057676457.webp"; name = "TESLA SD CONCEPT"; category = "Индустриальный дизайн"; categoryKey = "industrial" }
)

$conceptItemsEn = @(
    @{ id = "evodrone"; img = "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785433766519.webp"; name = "Evodrone"; category = "Industrial design"; categoryKey = "industrial" },
    @{ id = "iphone-iq-concept-2018"; img = "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785435568845.webp"; name = "Iphone IQ concept 2018"; category = "Industrial design"; categoryKey = "industrial" },
    @{ id = "sony-zeus"; img = "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785056660421.webp"; name = "SONY ZEUS"; category = "Concept design"; categoryKey = "concept" },
    @{ id = "ps5-concept-2018"; img = "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785657893376.webp"; name = "PS5 concept 2018"; category = "Industrial design"; categoryKey = "industrial" },
    @{ id = "tesla-sd-concept"; img = "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785057676457.webp"; name = "TESLA SD CONCEPT"; category = "Industrial design"; categoryKey = "industrial" }
)

$langs = @("ru", "en", "kg", "zh", "ar", "de")
foreach ($l in $langs) {
    if (-not $data.$l.concepts) {
        $data.$l | Add-Member -MemberType NoteProperty -Name "concepts" -Value @{ title = "Concepts & Vision"; items = @() }
    }
    if ($l -eq "ru") {
        $data.$l.concepts.items = $conceptItemsRu
    } else {
        $data.$l.concepts.items = $conceptItemsEn
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

Write-Host "Updating Supabase database..."
Invoke-RestMethod -Uri $Url -Method Patch -Headers $updateHeaders -Body ([System.Text.Encoding]::UTF8.GetBytes($body))
Write-Host "SUCCESSFULLY PUSHED CONCEPTS TO SUPABASE FOR ALL LANGUAGES!"
