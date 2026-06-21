# GEO Copilot — 一键部署 Demo 到 GitHub Pages
# 使用方法: 在项目根目录运行 .\deploy-demo.ps1

$ErrorActionPreference = "Stop"
$projectRoot = $PSScriptRoot

Write-Host "1/3 构建前端..." -ForegroundColor Cyan
Set-Location "$projectRoot\apps\web"
$env:NEXT_PUBLIC_USE_MOCK = "true"
npx next build
if ($LASTEXITCODE -ne 0) { throw "构建失败" }

Write-Host "2/3 部署到 gh-pages 分支..." -ForegroundColor Cyan
$tempDir = "$env:TEMP\geo-deploy"
Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force $tempDir | Out-Null
Copy-Item -Path "$projectRoot\apps\web\out\*" -Destination $tempDir -Recurse -Force
$null = New-Item -ItemType File -Path "$tempDir\.nojekyll" -Force

Set-Location $tempDir
git init
git checkout -b gh-pages
git config user.name "frt6skfg49-byte"
git config user.email "frt6skfg49@privaterelay.appleid.com"
git add -A
git commit -m "Deploy $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git remote add origin https://github.com/frt6skfg49-byte/GEO-Copilot.git
git push origin gh-pages --force

Set-Location $projectRoot

Write-Host "3/3 完成!" -ForegroundColor Green
Write-Host ""
Write-Host "Demo 地址: https://frt6skfg49-byte.github.io/GEO-Copilot/" -ForegroundColor Yellow
Write-Host "(可能需要等待 1-2 分钟让 GitHub Pages 刷新缓存)" -ForegroundColor Gray
