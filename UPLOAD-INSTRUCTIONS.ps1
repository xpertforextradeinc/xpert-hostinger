# 🚀 UPLOAD TO HOSTINGER NOW
# Quick PowerShell script using PSFTP (PuTTY's SFTP client)

$host = "157.173.208.8"
$port = "65002"
$user = "u404533250"
$pass = "Change Kapacity`$55"
$remotePath = "/domains/xpertforextrad.eu/public_html"

Write-Host "🚀 Uploading to Hostinger..." -ForegroundColor Cyan

# Create batch file for PSFTP
$batchContent = @"
cd $remotePath
lcd C:\Users\USER\Projects\xpert-hostinger
put index.html
put signals-history.html
put sitemap.xml
put robots.txt
cd css
lcd css
put style.css
cd ..
lcd ..
cd js
lcd js
put main.js
put signals.js
put payments.js
put affiliate.js
put bot-integration.js
put signal-history.js
cd ..
lcd ..
cd pages
lcd pages
put forex-basics.html
put risk-management.html
quit
"@

$batchFile = "C:\Users\USER\Projects\xpert-hostinger\upload_batch.txt"
$batchContent | Out-File -FilePath $batchFile -Encoding ASCII

Write-Host "📁 Batch file created" -ForegroundColor Green
Write-Host ""
Write-Host "🔧 MANUAL UPLOAD OPTIONS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Option 1: WinSCP (Recommended)" -ForegroundColor Cyan
Write-Host "  1. Download: https://winscp.net/eng/download.php" -ForegroundColor White
Write-Host "  2. Install and open WinSCP" -ForegroundColor White
Write-Host "  3. Click 'New Site'" -ForegroundColor White
Write-Host "  4. File protocol: SFTP" -ForegroundColor White
Write-Host "  5. Host: $host" -ForegroundColor White
Write-Host "  6. Port: $port" -ForegroundColor White
Write-Host "  7. Username: $user" -ForegroundColor White
Write-Host "  8. Password: [your password]" -ForegroundColor White
Write-Host "  9. Click Login, then drag files to upload" -ForegroundColor White
Write-Host ""
Write-Host "Option 2: FileZilla" -ForegroundColor Cyan
Write-Host "  1. Download: https://filezilla-project.org/" -ForegroundColor White
Write-Host "  2. Host: sftp://$host" -ForegroundColor White
Write-Host "  3. Username: $user" -ForegroundColor White
Write-Host "  4. Password: [your password]" -ForegroundColor White
Write-Host "  5. Port: $port" -ForegroundColor White
Write-Host "  6. Connect and upload files" -ForegroundColor White
Write-Host ""
Write-Host "Option 3: VS Code SFTP Extension" -ForegroundColor Cyan
Write-Host "  1. Open Command Palette (Ctrl+Shift+P)" -ForegroundColor White
Write-Host "  2. Type: SFTP: Upload Project" -ForegroundColor White
Write-Host "  3. Select 'Hostinger' configuration" -ForegroundColor White
Write-Host "  4. Wait for upload to complete" -ForegroundColor White
Write-Host ""
Write-Host "✅ Files to upload (13 files):" -ForegroundColor Green
Write-Host "   - index.html" -ForegroundColor Gray
Write-Host "   - signals-history.html" -ForegroundColor Gray
Write-Host "   - sitemap.xml, robots.txt" -ForegroundColor Gray
Write-Host "   - css/style.css" -ForegroundColor Gray
Write-Host "   - js/*.js (6 files)" -ForegroundColor Gray
Write-Host "   - pages/*.html (2 files)" -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 After upload, your site will be live at:" -ForegroundColor Cyan
Write-Host "   https://xpertforextrad.eu" -ForegroundColor White -BackgroundColor Blue
Write-Host ""
