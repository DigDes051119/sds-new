$dir = "D:\Steel Drake Studio Team\SDST web site\Олег Ермаков Google Chrome"
$files = Get-ChildItem -Path $dir -File
$targetUtf8 = [System.Text.Encoding]::UTF8.GetBytes("sds_archive_items")

Write-Host "Scanning files in $dir"
foreach ($file in $files) {
    if ($file.Extension -eq ".ldb" -or $file.Extension -eq ".log") {
        $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
        
        for ($i = 0; $i -lt ($bytes.Length - 50); $i++) {
            $match = $true
            for ($j = 0; $j -lt $targetUtf8.Length; $j++) {
                if ($bytes[$i+$j] -ne $targetUtf8[$j]) {
                    $match = $false
                    break
                }
            }
            if ($match) {
                Write-Host "Found in $($file.Name) at $i"
                $start = [Math]::Max(0, $i - 100)
                $end = [Math]::Min($bytes.Length - 1, $i + 150000)
                $chunk = $bytes[$start..$end]
                $str16 = [System.Text.Encoding]::Unicode.GetString($chunk)
                
                # Write to the current directory
                $outPath = "D:\Steel Drake Studio Team\SDST web site\oleg_$($file.Name)_$i.txt"
                [System.IO.File]::WriteAllText($outPath, $str16)
            }
        }
    }
}
Write-Host "Done scanning."
