@echo off
echo Building ha-schedule-card...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Build failed!
    pause
    exit /b 1
)

echo Compressing to ha-schedule-card.js.gz...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$src='dist/ha-schedule-card.js'; $dst='dist/ha-schedule-card.js.gz'; $in=[IO.File]::OpenRead($src); $out=[IO.File]::Create($dst); $gz=[IO.Compression.GZipStream]::new($out,[IO.Compression.CompressionMode]::Compress); $in.CopyTo($gz); $gz.Close();$out.Close();$in.Close(); Write-Host ('  ha-schedule-card.js      ' + [math]::Round((Get-Item $src).Length/1KB,1) + ' KB'); Write-Host ('  ha-schedule-card.js.gz  ' + [math]::Round((Get-Item $dst).Length/1KB,1) + ' KB')"

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Compression failed!
    pause
    exit /b 1
)

echo.
echo Done! Copy these files to config\www\ in Home Assistant:
echo   dist\ha-schedule-card.js
echo   dist\ha-schedule-card.js.gz
echo.

:: השהייה של שנייה כדי להציג את הודעת ההצלחה לפני סגירת החלון
timeout /t 1 >nul
