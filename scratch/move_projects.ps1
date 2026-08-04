$Url = "https://hniqpnuqqsmqpolxgbav.supabase.co/rest/v1/sds_translations?id=eq.1"
$Headers = @{
    "apikey" = "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu"
    "Authorization" = "Bearer sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu"
}

Write-Host "Fetching translations from Supabase..."
$raw = (Invoke-WebRequest -Uri $Url -Method Get -Headers $Headers).Content
$jsonObj = ConvertFrom-Json $raw

$data = $jsonObj[0].data
$targetIds = @("evodrone", "iphone-iq-concept-2018", "sony-zeus", "ps5-concept-2018", "tesla-sd-concept")
$langs = @("ru", "en", "kg", "zh", "ar", "de")
$modifiedCount = 0

foreach ($lang in $langs) {
    if (-not $data.PSObject.Properties[$lang]) { continue }
    $langData = $data.$lang
    
    if (-not $langData.products) { $langData | Add-Member -NotePropertyName "products" -NotePropertyValue ([PSCustomObject]@{ items = @() }) }
    if (-not $langData.concepts) { $langData | Add-Member -NotePropertyName "concepts" -NotePropertyValue ([PSCustomObject]@{ items = @() }) }
    
    $productsItems = [System.Collections.ArrayList]@($langData.products.items)
    $conceptsItems = [System.Collections.ArrayList]@($langData.concepts.items)
    $productDetails = $langData.productDetail.products

    foreach ($id in $targetIds) {
        $pItem = $null
        for ($i = 0; $i -lt $productsItems.Count; $i++) {
            if ($productsItems[$i].id -eq $id) {
                $pItem = $productsItems[$i]
                $productsItems.RemoveAt($i)
                break
            }
        }

        if ($pItem -ne $null) {
            $details = $null
            if ($productDetails -and $productDetails.PSObject.Properties[$id]) {
                $details = $productDetails.$id
                $productDetails.PSObject.Properties.Remove($id)
            }

            # Add to concepts if not present
            $exists = $false
            for ($j = 0; $j -lt $conceptsItems.Count; $j++) {
                if ($conceptsItems[$j].id -eq $id) {
                    $exists = $true
                    break
                }
            }

            if (-not $exists) {
                $null = $conceptsItems.Add($pItem)
                Write-Host "[$lang] Moved '$id' to concepts."
            }
            $modifiedCount++
        }
    }

    $langData.products.items = $productsItems.ToArray()
    $langData.concepts.items = $conceptsItems.ToArray()
}

if ($modifiedCount -gt 0) {
    Write-Host "Saving back to Supabase..."
    $payloadJson = ConvertTo-Json $jsonObj[0] -Depth 100 -Compress
    # We only need to patch the 'data' field
    $patchBody = @{ data = $data } | ConvertTo-Json -Depth 100 -Compress
    
    $patchHeaders = @{
        "apikey" = "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu"
        "Authorization" = "Bearer sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu"
        "Content-Type" = "application/json"
        "Prefer" = "return=representation"
    }

    $patchResp = Invoke-RestMethod -Uri $Url -Method Patch -Headers $patchHeaders -Body ([System.Text.Encoding]::UTF8.GetBytes($patchBody))
    Write-Host "SUCCESS! Database updated successfully."
} else {
    Write-Host "No modifications needed."
}
