@echo off
chcp 65001 > nul
robocopy "D:\Steel Drake Studio Team\Новая папка\SDST web site\dist" "d:\Steel Drake Studio Team\SDST web site\public\old" /E
exit /b 0
