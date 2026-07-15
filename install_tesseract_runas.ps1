$installer = "$env:TEMP\tesseract_installer.exe"
$installPath = "$env:LOCALAPPDATA\Tesseract-OCR"

$p = New-Object System.Diagnostics.Process
$p.StartInfo.FileName = $installer
$p.StartInfo.Arguments = "/S /D=$installPath"
$p.StartInfo.Verb = "runas"
$p.StartInfo.UseShellExecute = $true
$p.Start()
$p.WaitForExit()

if (Test-Path "$installPath\tesseract.exe") {
    Write-Output "INSTALLED"
    & "$installPath\tesseract.exe" --version 2>&1 | Select-Object -First 1
    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
    if ($userPath -notlike "*$installPath*") {
        [Environment]::SetEnvironmentVariable("Path", "$userPath;$installPath", "User")
        $env:Path += ";$installPath"
        Write-Output "PATH_UPDATED"
    }
} else {
    Write-Output "FAILED"
}
