$installer = "$env:TEMP\tesseract_installer.exe"
$installPath = "C:\Program Files\Tesseract-OCR"

Write-Output "Installing Tesseract silently..."

# Run installer silently
Start-Process -FilePath $installer -ArgumentList "/S" -Wait -NoNewWindow

# Wait a moment for install to settle
Start-Sleep -Seconds 2

# Check if installed
if (Test-Path "$installPath\tesseract.exe") {
    Write-Output "INSTALLED: Tesseract found at $installPath"
} else {
    Write-Output "WARNING: Tesseract not found at default path, checking alternatives..."
    # Try common alternative paths
    $alternatives = @(
        "${env:ProgramFiles}\Tesseract-OCR\tesseract.exe",
        "${env:ProgramFiles(x86)}\Tesseract-OCR\tesseract.exe",
        "${env:LOCALAPPDATA}\Programs\Tesseract-OCR\tesseract.exe"
    )
    foreach ($alt in $alternatives) {
        if (Test-Path $alt) {
            Write-Output "INSTALLED: Found at $alt"
            $installPath = Split-Path $alt -Parent
            break
        }
    }
}

# Add to system PATH
if (Test-Path "$installPath\tesseract.exe") {
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
    if ($currentPath -notlike "*$installPath*") {
        [Environment]::SetEnvironmentVariable("Path", "$currentPath;$installPath", "Machine")
        # Also update current session PATH
        $env:Path += ";$installPath"
        Write-Output "PATH_UPDATED: Added $installPath to system PATH"
    } else {
        Write-Output "PATH_OK: $installPath already in PATH"
    }

    # Verify
    $version = & "$installPath\tesseract.exe" --version 2>&1 | Select-Object -First 1
    Write-Output "VERSION: $version"
} else {
    Write-Output "INSTALL_FAILED: Tesseract not found"
    exit 1
}

# Clean up
Remove-Item $installer -Force
Write-Output "CLEANUP: Installer removed"
