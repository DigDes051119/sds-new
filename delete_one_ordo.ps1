$baseUrl = "https://hniqpnuqqsmqpolxgbav.supabase.co"
$apiKey = "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu"

$headers = @{
    "apikey" = $apiKey
    "Authorization" = "Bearer $apiKey"
    "Content-Type" = "application/json"
}

# Fetch translations
Write-Output "Fetching translations..."
$transRes = Invoke-RestMethod -Uri "$baseUrl/rest/v1/sds_translations?select=*" -Method Get -Headers $headers
$transObj = $transRes[0].data

# Fetch project details
Write-Output "Fetching project details..."
$detailRes = Invoke-RestMethod -Uri "$baseUrl/rest/v1/sds_project_details?select=*" -Method Get -Headers $headers
$detailObj = $detailRes[0].data

$langs = @('ru', 'en', 'kg')

foreach ($lang in $langs) {
    if ($transObj.$lang -and $transObj.$lang.projects -and $transObj.$lang.projects.items) {
        $transObj.$lang.projects.items = @($transObj.$lang.projects.items | Where-Object { $_.id -ne 'one-ordo-resort' })
        Write-Output "Removed 'one-ordo-resort' from projects items ($lang)"
    }
    if ($detailObj.$lang -and $detailObj.$lang.'one-ordo-resort') {
        $detailObj.$lang.PSObject.Properties.Remove('one-ordo-resort')
        Write-Output "Deleted 'one-ordo-resort' details ($lang)"
    }
}

# Convert back to JSON and update Supabase
$transJson = @{ data = $transObj } | ConvertTo-Json -Depth 100
$detailJson = @{ data = $detailObj } | ConvertTo-Json -Depth 100

Write-Output "Updating sds_translations in Supabase..."
Invoke-RestMethod -Uri "$baseUrl/rest/v1/sds_translations?id=eq.1" -Method Patch -Headers $headers -Body $transJson

Write-Output "Updating sds_project_details in Supabase..."
Invoke-RestMethod -Uri "$baseUrl/rest/v1/sds_project_details?id=eq.1" -Method Patch -Headers $headers -Body $detailJson

Write-Output "Successfully deleted ONE ORDO RESORT project from Supabase database!"
