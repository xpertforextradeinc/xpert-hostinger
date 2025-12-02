@echo off
echo ================================================
echo   HOSTINGER SFTP CONNECTION
echo ================================================
echo.
echo Host: 157.173.208.8
echo Port: 65002
echo User: u404533250
echo.
echo Commands:
echo   ls -la              : List all files
echo   rm -rf wp-*         : Delete WordPress
echo   put index.html      : Upload file
echo   put -r css          : Upload folder
echo   exit                : Disconnect
echo.
echo ================================================
echo.

sftp -P 65002 u404533250@157.173.208.8
