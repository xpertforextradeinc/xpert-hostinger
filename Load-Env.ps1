function Load-Env {
    param([string]$Path = ".env")

    if (-Not (Test-Path $Path)) {
        Write-Host ".env file not found"
        return
    }

    Get-Content $Path | ForEach-Object {
        if ($_ -match "^\s*$" -or $_ -match "^\s*#") { return }
        $parts = $_ -split "=", 2
        $key = $parts[0]
        $value = $parts[1]
        Set-Item -Path Env:$key -Value $value
    }

    Write-Host ".env loaded into PowerShell environment"
}
