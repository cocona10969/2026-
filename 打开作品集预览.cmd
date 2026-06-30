@echo off
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-preview.ps1"
timeout /t 2 /nobreak >nul
start "" "http://localhost:4173/"
