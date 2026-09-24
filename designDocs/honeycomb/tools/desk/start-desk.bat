@echo off
title Honeycomb Desk
cd /d "%~dp0..\..\..\.."
node "!designDocs\honeycomb\tools\desk\server.js"
rem Exit code 20 means the desk was already running: the message stays up for a few seconds, then the window closes.
if %errorlevel% equ 20 (
	timeout /t 8 >nul
	exit /b
)
echo.
echo The desk stopped. Press a key to close this window.
pause >nul
