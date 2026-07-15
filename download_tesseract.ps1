$url = "https://github.com/UB-Mannheim/tesseract/releases/download/v5.4.0.20240606/tesseract-ocr-w64-setup-5.4.0.20240606.exe"
$output = "$env:TEMP\tesseract_installer.exe"
Write-Output "Downloading from: $url"
Write-Output "Saving to: $output"
Invoke-WebRequest -Uri $url -OutFile $output -UseBasicParsing -ErrorAction Stop
if (Test-Path $output) {
    $size = (Get-Item $output).Length
    Write-Output "DOWNLOADED: $size bytes"
} else {
    Write-Output "DOWNLOAD_FAILED: File not created"
    exit 1
}
