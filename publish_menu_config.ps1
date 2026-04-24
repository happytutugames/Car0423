param(
  [string]$ConfigPath = "$env:USERPROFILE\Downloads\menu_config.json",
  [string]$RepoPath = "D:\Car0423",
  [string]$Branch = "master"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $RepoPath)) {
  throw "RepoPath 不存在: $RepoPath"
}

$target = Join-Path $RepoPath "menu_config.json"
if (-not (Test-Path $ConfigPath)) {
  throw "ConfigPath 不存在: $ConfigPath"
}

Copy-Item -Path $ConfigPath -Destination $target -Force

$git = "C:\Program Files\Git\cmd\git.exe"
if (-not (Test-Path $git)) {
  throw "未找到 git: $git"
}

Push-Location $RepoPath
try {
  & $git add $target
  $msg = @"
Update cloud menu_config from local editor.

Sync menu_config.json exported from editor and publish latest menu setup.
"@
  $tmpMsg = Join-Path $RepoPath ".git\COMMIT_MSG_FROM_SCRIPT.txt"
  Set-Content -Path $tmpMsg -Value $msg -NoNewline
  & $git commit -F $tmpMsg
  & $git push origin $Branch
  Write-Host "完成: 已覆盖 menu_config.json 并推送到 origin/$Branch"
}
finally {
  Pop-Location
}
