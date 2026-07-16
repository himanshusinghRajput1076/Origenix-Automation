
param(
    [string]$ZipPath = "$env:USERPROFILE\Downloads\origenix-outreach-platform-v2.zip",
    [string]$TargetPath = "E:\Origenix Automation"
)

$ErrorActionPreference = "Stop"

Write-Host "Origenix Automation Setup" -ForegroundColor Cyan
Write-Host "Zip: $ZipPath"
Write-Host "Target: $TargetPath"

if (-not (Test-Path $ZipPath)) {
    throw "Project ZIP not found at: $ZipPath"
}

if (-not (Test-Path "E:\")) {
    throw "Drive E: is not available."
}

New-Item -ItemType Directory -Force -Path $TargetPath | Out-Null

$temp = Join-Path $env:TEMP "origenix-automation-extract"
if (Test-Path $temp) {
    Remove-Item $temp -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $temp | Out-Null

Expand-Archive -Path $ZipPath -DestinationPath $temp -Force

$source = Get-ChildItem $temp -Directory | Select-Object -First 1
if (-not $source) {
    throw "No project folder found inside ZIP."
}

Get-ChildItem $source.FullName -Force | ForEach-Object {
    Copy-Item $_.FullName -Destination $TargetPath -Recurse -Force
}

$envExample = Join-Path $TargetPath ".env.example"
$envFile = Join-Path $TargetPath ".env"

if ((Test-Path $envExample) -and (-not (Test-Path $envFile))) {
    Copy-Item $envExample $envFile
}

Write-Host ""
Write-Host "Project copied successfully." -ForegroundColor Green
Write-Host "Next commands:" -ForegroundColor Yellow
Write-Host "cd `"$TargetPath`""
Write-Host "npm install"
Write-Host "npm run db:push"
Write-Host "npm run dev"
