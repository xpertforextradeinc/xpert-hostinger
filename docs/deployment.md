# Hostinger Deployment Guide - Order Management System

## Overview

This guide provides comprehensive instructions for deploying the Xpert Forex Trade Order Management System on Hostinger. It covers database setup, file uploads, SSL configuration, monitoring, and maintenance procedures.

**Last Updated:** December 19, 2025  
**Version:** 1.0  
**Target Environment:** Hostinger Shared Hosting / VPS

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Database Setup](#database-setup)
4. [Application Deployment](#application-deployment)
5. [File Uploads Configuration](#file-uploads-configuration)
6. [SSL Configuration](#ssl-configuration)
7. [Environment Configuration](#environment-configuration)
8. [Monitoring & Logging](#monitoring--logging)
9. [Performance Optimization](#performance-optimization)
10. [Troubleshooting](#troubleshooting)
11. [Maintenance & Updates](#maintenance--updates)

---

## Prerequisites

### Required Access
- Hostinger account with cPanel/hPanel access
- FTP/SFTP credentials
- SSH access (if VPS)
- Database credentials (MySQL/MariaDB)
- Domain name with DNS control

### System Requirements
- PHP 8.0 or higher
- MySQL 5.7+ or MariaDB 10.3+
- Composer (for dependency management)
- Node.js 14+ (if using frontend build tools)
- Minimum 2GB disk space (recommended 5GB+)
- Support for file uploads (min 100MB per file)

### Required PHP Extensions
```
- mysql/mysqli
- pdo_mysql
- curl
- json
- mbstring
- gd (for image processing)
- zip
- xml
- fileinfo
- intl
```

Verify extensions in Hostinger cPanel:
1. Go to **Home > Software > PHP Configuration**
2. Check **Extensions** tab
3. Enable required extensions if missing

---

## Pre-Deployment Checklist

- [ ] Hostinger account created and domain configured
- [ ] SSH access enabled (if VPS)
- [ ] PHP version set to 8.0+ in cPanel
- [ ] MySQL database created with user
- [ ] SSL certificate provisioned (Let's Encrypt via cPanel)
- [ ] Backup of existing data (if migrating)
- [ ] Application code ready and tested locally
- [ ] `.env` file prepared with Hostinger-specific settings
- [ ] File upload directories created with proper permissions
- [ ] Composer dependencies resolved
- [ ] Database migrations tested

---

## Database Setup

### Step 1: Create Database via cPanel

1. **Access cPanel** → Home > Databases > MySQL Databases
2. **Create New Database:**
   - Name: `xpert_order_db` (use your domain prefix)
   - Click **Create Database**

3. **Create Database User:**
   - Username: `xpert_user`
   - Password: Generate strong password (min 8 chars with mixed case, numbers, symbols)
   - Click **Create User**

4. **Assign Privileges:**
   - Select your database and user
   - Click **Add User to Database**
   - Select **All Privileges**

### Step 2: Database Configuration Details

```
Database Name: xpert_order_db
Database Host: localhost (internal Hostinger connection)
Username: xpert_user
Password: [Your Strong Password]
Port: 3306 (default)
```

### Step 3: Initialize Database Schema

**Via cPanel phpMyAdmin:**

1. Access phpMyAdmin from cPanel
2. Select your database: `xpert_order_db`
3. Click **Import** tab
4. Upload `database/migrations/initial_schema.sql` (if available)
5. Click **Go**

**Via SSH (VPS):**

```bash
mysql -h localhost -u xpert_user -p xpert_order_db < database/migrations/initial_schema.sql
```

### Step 4: Run Database Migrations

If using migration system:

```bash
php artisan migrate --force
# or for custom migration tool
php scripts/migrate.php
```

### Step 5: Create Database Backups

**Automated Backup Setup:**

1. In cPanel → Home > Backups
2. Configure daily database backups
3. Download backups periodically to local storage

---

## Application Deployment

### Step 1: Upload Application Files

**Using SFTP (Recommended for security):**

```bash
sftp hostinger_username@your-domain.com
cd public_html
put -r /path/to/xpert-hostinger/* .
```

**Using FTP via FileManager:**

1. Login to Hostinger cPanel
2. Go to File Manager → public_html
3. Upload all application files
4. Ensure `.htaccess` is uploaded (may be hidden)

### Step 2: Directory Structure

After upload, verify structure:

```
public_html/
├── .htaccess
├── .env
├── public/
│   ├── index.php
│   ├── css/
│   ├── js/
│   └── images/
├── app/
├── config/
├── database/
├── storage/
│   ├── uploads/
│   ├── logs/
│   └── temp/
├── vendor/
├── routes/
├── views/
├── composer.json
└── README.md
```

### Step 3: Set File Permissions

**Via SSH/Terminal:**

```bash
# Set directory permissions (755)
find /home/username/public_html -type d -exec chmod 755 {} \;

# Set file permissions (644)
find /home/username/public_html -type f -exec chmod 644 {} \;

# Writable directories (775)
chmod -R 775 /home/username/public_html/storage
chmod -R 775 /home/username/public_html/uploads
chmod 775 /home/username/public_html/bootstrap/cache

# Executable script
chmod +x /home/username/public_html/artisan
```

**Via File Manager GUI:**

1. Right-click directory → Change Permissions
2. For directories: `755`
3. For files: `644`
4. For writable directories: `775`
5. Check "Apply recursively"

### Step 4: Install Composer Dependencies

**Via SSH (Recommended):**

```bash
cd /home/username/public_html
php composer.phar install --no-dev --optimize-autoloader
# or if composer is available
composer install --no-dev --optimize-autoloader
```

**If Composer Not Available:**

1. Download Composer at hostinger:
   ```bash
   curl -sS https://getcomposer.org/installer | php
   php composer.phar install --no-dev --optimize-autoloader
   ```

### Step 5: Generate Application Key (Laravel)

```bash
php artisan key:generate
# Update .env with the generated key
```

---

## File Uploads Configuration

### Step 1: Create Upload Directories

```bash
mkdir -p /home/username/public_html/storage/uploads/orders
mkdir -p /home/username/public_html/storage/uploads/invoices
mkdir -p /home/username/public_html/storage/uploads/documents
mkdir -p /home/username/public_html/storage/uploads/temp

# Set permissions
chmod 755 /home/username/public_html/storage/uploads
chmod 775 /home/username/public_html/storage/uploads/orders
chmod 775 /home/username/public_html/storage/uploads/invoices
chmod 775 /home/username/public_html/storage/uploads/documents
chmod 775 /home/username/public_html/storage/uploads/temp
```

### Step 2: Configure PHP Upload Limits

**In cPanel PHP Configuration:**

1. Go to Home > Software > PHP Configuration
2. Update settings:
   - `upload_max_filesize`: `100M` (or as needed)
   - `post_max_size`: `100M`
   - `max_execution_time`: `300`
   - `max_input_time`: `300`
   - `memory_limit`: `256M`

3. Click **Save**

**Or in `.htaccess` (if PHP-FPM):**

```apache
php_value upload_max_filesize 100M
php_value post_max_size 100M
php_value max_execution_time 300
php_value max_input_time 300
php_value memory_limit 256M
```

### Step 3: Configure Upload Handling in Application

**In `.env`:**

```
UPLOAD_MAX_SIZE=104857600
UPLOAD_PATH=storage/uploads
ALLOWED_EXTENSIONS=pdf,doc,docx,xls,xlsx,jpg,jpeg,png,gif
```

**In application config (if available):**

```php
'uploads' => [
    'max_size' => 104857600, // 100MB in bytes
    'max_file_size' => 104857600,
    'allowed_extensions' => ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'gif'],
    'upload_path' => storage_path('uploads'),
    'temp_path' => storage_path('uploads/temp'),
],
```

### Step 4: Create Upload Cleanup Script

**Script: `scripts/cleanup_uploads.php`**

```php
<?php
/**
 * Cleanup old temporary upload files
 * Run via cron job daily
 */

$upload_dir = __DIR__ . '/../storage/uploads/temp';
$max_age = 86400 * 7; // 7 days in seconds
$now = time();

if (is_dir($upload_dir)) {
    $files = scandir($upload_dir);
    foreach ($files as $file) {
        $file_path = $upload_dir . '/' . $file;
        if (is_file($file_path)) {
            if ($now - filemtime($file_path) > $max_age) {
                unlink($file_path);
                echo "Deleted: " . $file . "\n";
            }
        }
    }
}
?>
```

**Schedule via cPanel Cron Jobs:**

1. Home > Advanced > Cron Jobs
2. Add new cron job:
   - **Command:** `php /home/username/public_html/scripts/cleanup_uploads.php`
   - **Time:** Daily at 2:00 AM
   - Click **Add Cron Job**

---

## SSL Configuration

### Step 1: Obtain SSL Certificate

**Using Let's Encrypt (Free, Recommended):**

1. In cPanel → Home > Security > SSL/TLS
2. Click **Issue, view, or delete SSL certificates**
3. Click **Let's Encrypt for cPanel**
4. Enter your domain (with and without www)
5. Click **Issue**

**For Multiple Domains:**

- Select all domain variations you need
- Let's Encrypt will auto-renew every 90 days

### Step 2: Enable HTTPS

**Automatic Redirect (via cPanel):**

1. Go to cPanel > Home > Domains
2. Click on your domain
3. Enable **Force HTTPS Redirect**

**Manual Configuration in `.htaccess`:**

```apache
# Force HTTPS and www
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
    
    RewriteCond %{HTTP_HOST} !^www\. [NC]
    RewriteRule ^(.*)$ https://www.%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

### Step 3: Update Application Configuration

**In `.env`:**

```
APP_URL=https://your-domain.com
FORCE_HTTPS=true
```

**In PHP config (if applicable):**

```php
'secure' => true,
'secure_cookies' => true,
'http_only_cookies' => true,
```

### Step 4: HSTS Header Configuration

**In `.htaccess`:**

```apache
<IfModule mod_headers.c>
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>
```

### Step 5: Monitor Certificate Expiration

- Hostinger auto-renews Let's Encrypt certificates
- Verify renewal status in cPanel > SSL/TLS monthly
- Set calendar reminder for 30 days before expiration (backup)

---

## Environment Configuration

### Step 1: Create and Configure `.env` File

**File: `public_html/.env`**

```env
# Application Settings
APP_NAME="Xpert Order Management"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com
APP_KEY=base64:YOUR_GENERATED_KEY_HERE

# Database Configuration
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=xpert_order_db
DB_USERNAME=xpert_user
DB_PASSWORD=your_strong_password_here

# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=587
MAIL_USERNAME=your_email@your-domain.com
MAIL_PASSWORD=your_email_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@your-domain.com
MAIL_FROM_NAME="Xpert Order Management"

# File Upload Settings
UPLOAD_MAX_SIZE=104857600
UPLOAD_PATH=storage/uploads
ALLOWED_EXTENSIONS=pdf,doc,docx,xls,xlsx,jpg,jpeg,png,gif

# Session Configuration
SESSION_DRIVER=file
SESSION_LIFETIME=120

# Cache Configuration
CACHE_DRIVER=file

# Queue Configuration (if using)
QUEUE_DRIVER=sync

# Monitoring & Logging
LOG_CHANNEL=single
LOG_LEVEL=warning

# Third-party Integrations
PAYMENT_GATEWAY=stripe
PAYMENT_KEY=your_payment_key
PAYMENT_SECRET=your_payment_secret
```

### Step 2: Secure `.env` File

**Permissions:**

```bash
chmod 600 /home/username/public_html/.env
```

**In `.htaccess` (prevent direct access):**

```apache
<Files .env>
    Order allow,deny
    Deny from all
</Files>
```

### Step 3: Test Configuration

```bash
php artisan config:cache
php artisan config:clear
```

---

## Monitoring & Logging

### Step 1: Configure Application Logging

**In `.env`:**

```env
LOG_CHANNEL=single
LOG_LEVEL=warning
LOG_PATH=storage/logs
```

**Create log directory:**

```bash
mkdir -p /home/username/public_html/storage/logs
chmod 775 /home/username/public_html/storage/logs
```

### Step 2: Set Up Error Logging

**In `.htaccess`:**

```apache
# Log PHP errors
php_flag log_errors On
php_value error_log /home/username/public_html/storage/logs/php-error.log
```

### Step 3: Monitor Application Health

**Create monitoring script: `scripts/health_check.php`**

```php
<?php
/**
 * Health Check Script
 * Returns JSON status of application health
 */

$health = [
    'status' => 'healthy',
    'timestamp' => date('Y-m-d H:i:s'),
    'checks' => []
];

// Database check
try {
    $pdo = new PDO(
        'mysql:host=' . $_ENV['DB_HOST'] . ';dbname=' . $_ENV['DB_DATABASE'],
        $_ENV['DB_USERNAME'],
        $_ENV['DB_PASSWORD']
    );
    $health['checks']['database'] = 'OK';
} catch (Exception $e) {
    $health['status'] = 'error';
    $health['checks']['database'] = 'FAILED: ' . $e->getMessage();
}

// Disk space check
$disk_free = disk_free_space('/home/username/public_html');
$disk_total = disk_total_space('/home/username/public_html');
$disk_usage_percent = ($disk_total - $disk_free) / $disk_total * 100;

if ($disk_usage_percent > 90) {
    $health['status'] = 'warning';
    $health['checks']['disk'] = 'CRITICAL: ' . round($disk_usage_percent, 2) . '% used';
} else {
    $health['checks']['disk'] = 'OK: ' . round($disk_usage_percent, 2) . '% used';
}

// File permissions check
$writable_dirs = [
    'storage/uploads',
    'storage/logs',
    'storage/uploads/temp'
];

foreach ($writable_dirs as $dir) {
    $full_path = '/home/username/public_html/' . $dir;
    if (!is_writable($full_path)) {
        $health['status'] = 'error';
        $health['checks'][$dir] = 'NOT WRITABLE';
    } else {
        $health['checks'][$dir] = 'OK';
    }
}

header('Content-Type: application/json');
echo json_encode($health);
?>
```

### Step 4: Set Up Cron Job for Monitoring

**In cPanel Cron Jobs:**

1. Add new job:
   ```
   * * * * * curl -s https://your-domain.com/health-check.php >> /home/username/public_html/storage/logs/health-check.log
   ```

2. Check logs daily:
   ```bash
   tail -f /home/username/public_html/storage/logs/health-check.log
   ```

### Step 5: Monitor via Hostinger Dashboard

1. Go to **Hosting > Manage > Analytics**
2. Monitor:
   - Bandwidth usage
   - Disk space usage
   - CPU usage
   - Database usage
3. Set up email alerts for threshold breaches

---

## Performance Optimization

### Step 1: Enable Caching

**Browser Caching in `.htaccess`:**

```apache
<IfModule mod_expires.c>
    ExpiresActive On
    
    # Images
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    
    # CSS & JS
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    
    # Fonts
    ExpiresByType font/ttf "access plus 1 year"
    ExpiresByType font/otf "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
    
    # Default
    ExpiresDefault "access plus 2 days"
</IfModule>
```

### Step 2: Enable GZIP Compression

**In `.htaccess`:**

```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain text/html text/xml
    AddOutputFilterByType DEFLATE text/css text/javascript
    AddOutputFilterByType DEFLATE application/xml application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml application/javascript
    AddOutputFilterByType DEFLATE application/json
</IfModule>
```

### Step 3: Optimize Database Queries

**Create indexes for frequently queried columns:**

```sql
ALTER TABLE orders ADD INDEX idx_user_id (user_id);
ALTER TABLE orders ADD INDEX idx_status (status);
ALTER TABLE orders ADD INDEX idx_created_at (created_at);
ALTER TABLE order_items ADD INDEX idx_order_id (order_id);
```

### Step 4: Optimize Images

- Compress images before upload (use tools like TinyPNG)
- Serve WebP format where supported
- Use responsive images with srcset

### Step 5: Minify Assets

**Install build tools if needed:**

```bash
npm install -g webpack webpack-cli
npm install
npm run production
```

---

## Troubleshooting

### Issue: 500 Internal Server Error

**Check error log:**
```bash
tail -f /home/username/public_html/storage/logs/php-error.log
```

**Common causes:**
1. Incorrect file permissions (should be 755 for dirs, 644 for files)
2. Missing PHP extensions
3. Database connection issues
4. Syntax errors in PHP code

**Solutions:**
1. Fix permissions: `find . -type d -exec chmod 755 {} \; && find . -type f -exec chmod 644 {} \;`
2. Check required PHP extensions in cPanel
3. Test database connection with phpMyAdmin
4. Review recent code changes

### Issue: 403 Forbidden

**Causes:**
1. Incorrect directory permissions
2. `.htaccess` configuration issues
3. IP restrictions

**Solutions:**
1. Ensure directories are readable: `chmod 755`
2. Validate `.htaccess` syntax
3. Check IP whitelisting rules

### Issue: Database Connection Failed

**Check credentials:**
```php
$dsn = 'mysql:host=localhost;dbname=xpert_order_db';
$username = 'xpert_user';
$password = 'your_password';

try {
    $pdo = new PDO($dsn, $username, $password);
    echo "Connected!";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
```

**Verify:**
- Database name is correct in `.env`
- Username has privileges for database
- Password is correct
- Host is `localhost` for Hostinger

### Issue: File Upload Fails

**Check:**
1. Upload directory permissions: `chmod 775 storage/uploads`
2. PHP limits in cPanel: `upload_max_filesize`, `post_max_size`
3. Disk space availability: `df -h`
4. File type restrictions in application

### Issue: Emails Not Sending

**Verify SMTP settings in `.env`:**
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=587
MAIL_USERNAME=your_email@your-domain.com
MAIL_PASSWORD=your_email_password
MAIL_ENCRYPTION=tls
```

**Test email connection:**
```bash
php artisan tinker
# Or use mail testing tool
```

---

## Maintenance & Updates

### Daily Tasks

1. **Monitor error logs:**
   ```bash
   tail -f storage/logs/laravel.log
   ```

2. **Check disk usage:**
   - Hostinger Dashboard > Analytics
   - Alert if > 80%

3. **Verify HTTPS is working:**
   - Visit https://your-domain.com
   - Check for green lock icon

### Weekly Tasks

1. **Database backup:**
   - Download via cPanel Backups
   - Store in secure location

2. **Review error logs:**
   - Check for patterns
   - Address recurring issues

3. **Test critical functions:**
   - Login functionality
   - File upload feature
   - Order creation/management

### Monthly Tasks

1. **Security updates:**
   - Update Composer packages: `composer update`
   - Review PHP version compatibility
   - Check for security patches

2. **Performance review:**
   - Analyze Hostinger Analytics
   - Optimize slow queries
   - Clean up temp files

3. **SSL certificate check:**
   - Verify certificate validity in cPanel
   - Confirm HSTS headers are active

### Quarterly Tasks

1. **Major updates:**
   - Update application framework
   - Test in staging environment first
   - Deploy during low-traffic period

2. **Security audit:**
   - Review access logs
   - Check for suspicious activity
   - Update security headers

3. **Database optimization:**
   - Run OPTIMIZE on tables: `OPTIMIZE TABLE orders;`
   - Review and update indexes
   - Archive old records if needed

### Update Procedure

**Safe Update Process:**

1. **Create backup:**
   ```bash
   mysqldump -u xpert_user -p xpert_order_db > backup_$(date +%Y%m%d).sql
   ```

2. **Update dependencies:**
   ```bash
   composer update --no-dev --optimize-autoloader
   ```

3. **Clear caches:**
   ```bash
   php artisan cache:clear
   php artisan config:clear
   php artisan view:clear
   ```

4. **Run migrations (if needed):**
   ```bash
   php artisan migrate --force
   ```

5. **Verify functionality:**
   - Test critical features
   - Monitor error logs
   - Check performance metrics

---

## Useful Commands Reference

### SSH Access

```bash
# Connect to Hostinger VPS
ssh username@your-domain.com

# Or with IP
ssh username@your-ip-address
```

### File Management

```bash
# List files with permissions
ls -la

# Change permissions recursively
chmod -R 755 /path/to/directory

# Change ownership
chown -R username:group /path/to/directory
```

### Database Management

```bash
# Connect to database
mysql -h localhost -u xpert_user -p xpert_order_db

# Backup database
mysqldump -u xpert_user -p xpert_order_db > backup.sql

# Restore database
mysql -u xpert_user -p xpert_order_db < backup.sql
```

### Application Commands

```bash
# Clear application caches
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Create application key
php artisan key:generate
```

---

## Support & Resources

### Hostinger Support Channels

- **Live Chat:** Available 24/7 in Hostinger Dashboard
- **Email Support:** support@hostinger.com
- **Knowledge Base:** https://support.hostinger.com
- **Community Forum:** https://hostinger.com/community

### Application Resources

- **Documentation:** See README.md in repository
- **Issue Tracker:** GitHub Issues in xpert-hostinger repo
- **Development:** Contact development team for custom configurations

### Emergency Contacts

- **System Administrator:** [Contact information]
- **Database Administrator:** [Contact information]
- **Security Team:** [Contact information]

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-19 | Initial deployment guide created |

---

## Approval & Sign-off

- **Document Owner:** XpertForex Trade Inc.
- **Last Reviewed:** 2025-12-19
- **Next Review:** 2026-03-19

---

**For questions or updates to this guide, please contact the development team or submit an issue in the repository.**
