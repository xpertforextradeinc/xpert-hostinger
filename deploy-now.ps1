# Quick Deploy Script - Upload to Hostinger via SFTP
# Run this after making changes to deploy instantly

Write-Host "🚀 Deploying Xpert Forex Trade to Hostinger..." -ForegroundColor Cyan

# SFTP Configuration
$hostname = "157.173.208.8"
$port = 65002
$username = "u404533250"
$password = "Change Kapacity`$55"
$remotePath = "/domains/xpertforextrad.eu/public_html"
$localPath = "C:\Users\USER\Projects\xpert-hostinger"

# Files to upload
$files = @(
    "index.html",
    "signals-history.html",
    "sitemap.xml",
    "robots.txt",
    "css/style.css",
    "js/main.js",
    "js/signals.js",
    "js/payments.js",
    "js/affiliate.js",
    "js/bot-integration.js",
    "js/signal-history.js",
    "pages/forex-basics.html",
    "pages/risk-management.html"
)

Write-Host "📁 Files to upload: $($files.Count)" -ForegroundColor Yellow

# Use WinSCP for upload (if installed)
if (Get-Command winscp.com -ErrorAction SilentlyContinue) {
    Write-Host "Using WinSCP..." -ForegroundColor Green
    
    $sessionScript = @"
open sftp://${username}:${password}@${hostname}:${port}
cd $remotePath
"@
    
    foreach ($file in $files) {
        $sessionScript += "put `"$localPath\$file`" `"$remotePath/$file`"`n"
    }
    
    $sessionScript += "exit"
    
    $sessionScript | winscp.com /script=-
} else {
    # Manual upload instructions
    Write-Host ""
    Write-Host "⚠️ WinSCP not found. Manual upload required:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1: Use VS Code SFTP Extension" -ForegroundColor Cyan
    Write-Host "1. Install extension: Natizyskunk.sftp" -ForegroundColor White
    Write-Host "2. Open Command Palette (Ctrl+Shift+P)" -ForegroundColor White
    Write-Host "3. Run: SFTP: Upload Project" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 2: Use FileZilla" -ForegroundColor Cyan
    Write-Host "Host: $hostname" -ForegroundColor White
    Write-Host "Port: $port" -ForegroundColor White
    Write-Host "Username: $username" -ForegroundColor White
    Write-Host "Password: [hidden]" -ForegroundColor White
    Write-Host "Upload to: $remotePath" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 3: Install WinSCP" -ForegroundColor Cyan
    Write-Host "Download: https://winscp.net/eng/download.php" -ForegroundColor White
    Write-Host "Then run this script again" -ForegroundColor White
}

Write-Host ""
Write-Host "✅ Next: Update bot URL in production" -ForegroundColor Green
Write-Host "   Current: http://localhost:8080" -ForegroundColor Gray
Write-Host "   For now, keep bot running locally" -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 Website will be live at: https://xpertforextrad.eu" -ForegroundColor Cyan
