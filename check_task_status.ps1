$Task = Get-ScheduledTask -TaskName "SDST_Website_Backup" -ErrorAction SilentlyContinue
if ($Task) {
    $Info = Get-ScheduledTaskInfo -TaskName "SDST_Website_Backup"
    Write-Host "========================================================" -ForegroundColor Cyan
    Write-Host " STATUS WINDOWS TASK SCHEDULER: SDST_Website_Backup" -ForegroundColor Cyan
    Write-Host "========================================================" -ForegroundColor Cyan
    Write-Host "Task Name     : "$Task.TaskName
    Write-Host "State         : "$Task.State
    Write-Host "Last Run Time : "$Info.LastRunTime
    Write-Host "Next Run Time : "$Info.NextRunTime
    Write-Host "Last Result   : "$Info.LastTaskResult
    Write-Host "========================================================" -ForegroundColor Cyan
} else {
    Write-Host "Task 'SDST_Website_Backup' not found!" -ForegroundColor Red
}
