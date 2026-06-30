$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$node = Get-ChildItem "$env:LOCALAPPDATA\OpenAI\Codex\runtimes\cua_node\*\bin\node.exe" -ErrorAction Stop |
  Sort-Object LastWriteTime -Descending |
  Select-Object -First 1 -ExpandProperty FullName
$vite = Join-Path $projectRoot 'node_modules\vite\bin\vite.js'

$existing = Get-NetTCPConnection -LocalPort 4173 -State Listen -ErrorAction SilentlyContinue
if ($existing) {
  exit 0
}

$command = "cd /d `"$projectRoot`" && `"$node`" `"$vite`" --host 0.0.0.0 --port 4173"

Start-Process `
  -FilePath "$env:ComSpec" `
  -ArgumentList @('/k', $command) `
  -WorkingDirectory $projectRoot
