# Quick Deploy Script - Upload to Hostinger via SFTP
# Run this after making changes to deploy instantly

Write-Host "🚀 Deploying Xpert Forex Trade to Hostinger..." -ForegroundColor Cyan

# SFTP Configuration
$hostname = "157.173.208.8"
$port = 65002
$username = "u404533250"
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
    Write-Host "Using WinSCP for deployment..." -ForegroundColor Green

    # For password-based auth (less secure, prompts for password)
    # $password = Read-Host -Prompt "Enter SFTP password for $username" -AsSecureString
    # $plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))
    # $sessionUrl = "sftp://${username}:${plainPassword}@${hostname}:${port}"
    
    # Recommended: Use a saved site in WinSCP configured with an SSH key
    $sessionUrl = "sftp://${username}@${hostname}:${port}"

    $sessionScript = @"
open $sessionUrl -hostkey="ssh-rsa 2048 ..." # Replace with your server's host key
cd $remotePath
"@
    
    foreach ($file in $files) {
        $sessionScript += "put `"$localPath\$file`" `"$file`"`n"
    }
    
    $sessionScript += "exit"
    
    $sessionScript | winscp.com /script=-
}
else {
}
else {
    # Manual upload instructions
    Write-Host ""
    Write-Host "⚠️ WinSCP not found. Please install it and configure a site for automated deployments." -ForegroundColor Yellow
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
Write-Host "🌐 Website will be live at: https://xpertforextrad.eu" -ForegroundColor Cyan
