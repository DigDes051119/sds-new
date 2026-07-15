# Check if tesseract is findable via PATH
$foundInPath = $false
$paths = $env:Path -split ';'
foreach ($p in $paths) {
    if (Test-Path "$p\tesseract.exe") {
        Write-Output "FOUND_IN_PATH: $p\tesseract.exe"
        $foundInPath = $true
    }
}
if (-not $foundInPath) {
    Write-Output "NOT_IN_PATH"
}
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -like "*Tesseract*") {
    Write-Output "USER_PATH: yes"
} else {
    Write-Output "USER_PATH: no"
}
$machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
if ($machinePath -like "*Tesseract*") {
    Write-Output "MACHINE_PATH: yes"
} else {
    Write-Output "MACHINE_PATH: no"
}
