$ErrorActionPreference = "Stop"

$source = Split-Path -Parent $MyInvocation.MyCommand.Path
$targetRoot = "B:\作品集网站"
$target = Join-Path $targetRoot "New project"

Write-Host "源项目：" $source
Write-Host "目标位置：" $target

if (!(Test-Path "B:\")) {
  throw "没有检测到 B 盘，请确认 B 盘已连接。"
}

New-Item -ItemType Directory -Force -Path $targetRoot | Out-Null
New-Item -ItemType Directory -Force -Path $target | Out-Null

Write-Host "正在复制项目文件，请稍等..."

robocopy $source $target /E /XD ".git" ".agents" /XF "move-project-to-b-drive.ps1" | Out-Host

$startFile = Join-Path $target "打开作品集预览-B盘.cmd"
$cmd = @"
@echo off
cd /d "$target"
"C:\Users\88\AppData\Local\OpenAI\Codex\runtimes\cua_node\1b23c930bdf84ed6\bin\node.exe" ".\node_modules\vite\bin\vite.js" --host 0.0.0.0 --port 4173
pause
"@
Set-Content -LiteralPath $startFile -Value $cmd -Encoding Default

Write-Host ""
Write-Host "迁移完成。"
Write-Host "新项目位置：" $target
Write-Host "以后可以双击启动：" $startFile
Write-Host ""
Write-Host "注意：确认 B 盘项目能正常预览后，再删除 C 盘原项目。"
