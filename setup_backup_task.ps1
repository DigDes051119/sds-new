Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "SETUP AUTOMATIC BACKUP (EVERY 2 HOURS)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$WorkingDir = "d:\Steel Drake Studio Team\SDST web site"
$Action = New-ScheduledTaskAction -Execute "node" -Argument "auto_backup.cjs" -WorkingDirectory $WorkingDir
$Trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Hours 2)

try {
    Register-ScheduledTask -TaskName "SDST_Website_Backup" -Action $Action -Trigger $Trigger -Force -ErrorAction Stop
    Write-Host "`n[SUCCESS] Task 'SDST_Website_Backup' registered in Windows Task Scheduler!" -ForegroundColor Green
    Write-Host "Windows will automatically run backup every 2 hours." -ForegroundColor Green
    Write-Host "Backup location: d:\Steel Drake Studio Team\SDST web site\backups\`n" -ForegroundColor Yellow
} catch {
    Write-Host "`n[ERROR] Could not create task: $_" -ForegroundColor Red
}
