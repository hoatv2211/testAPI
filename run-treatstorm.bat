@echo off
setlocal enabledelayedexpansion

echo ======================================
echo   Treatstorm QR Voting - Local Server
echo ======================================
echo.

cd /d "%~dp0treatstorm-qr-backend"

echo [1/2] Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo [2/2] Starting development server...
echo.

:: Get local IP address
for /f "tokens=2 delims=[]" %%a in ('ping -4 -n 1 %COMPUTERNAME% ^| findstr /r "\[.*\]"') do set LOCALIP=%%a
if not defined LOCALIP set LOCALIP=localhost

echo ======================================
echo   SERVER READY!
echo ======================================
echo.
echo Main Page (QR Code):   http://%LOCALIP%:3000
echo Voting Page:            http://%LOCALIP%:3000/vote?session=default
echo.
echo Press Ctrl+C to stop the server
echo.
echo NOTE: Use your computer's IP address (not localhost)
echo       so phones on the same network can connect.
echo.

call npm run dev
