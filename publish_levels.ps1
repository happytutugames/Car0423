param(
  [string]$LevelsPath = "$env:USERPROFILE\Downloads\levels.js",
  [string]$RepoPath = "D:\Car0423",
  [string]$Branch = "master"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $RepoPath)) {
  throw "RepoPath 不存在: $RepoPath"
}

$target = Join-Path $RepoPath "levels.js"
if (-not (Test-Path $LevelsPath)) {
  throw "LevelsPath 不存在: $LevelsPath"
}

Copy-Item -Path $LevelsPath -Destination $target -Force

$git = "C:\Program Files\Git\cmd\git.exe"
if (-not (Test-Path $git)) {
  throw "未找到 git: $git"
}

Push-Location $RepoPath
try {
  & $git add $target
  & $git diff --cached --quiet
  if ($LASTEXITCODE -eq 0) {
    Write-Host "levels.js 相对上次提交无变化，跳过 commit/push"
    return
  }
  $msg = @"
Update levels from level editor.

Sync levels.js exported from level_editor.html.
"@
  $tmpMsg = Join-Path $RepoPath ".git\COMMIT_MSG_FROM_SCRIPT.txt"
  Set-Content -Path $tmpMsg -Value $msg -NoNewline
  & $git commit -F $tmpMsg
  & $git push origin $Branch
  Write-Host "完成: 已覆盖 levels.js 并推送到 origin/$Branch"
}
finally {
  Pop-Location
}
