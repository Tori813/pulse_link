@echo off
echo Updating facility pages with dark theme support...

REM Create js directory if it doesn't exist
if not exist "js" mkdir js

REM Copy the theme switcher to the js directory
copy /Y theme-switcher.js js\

REM Update each facility page
for %%f in (
    clinics.html
    pharmacies.html
    laboratories.html
    diagnostic-centers.html
    rehabilitation-centers.html
) do (
    if exist "%%f" (
        echo Updating %%~nxf...
        
        REM Add theme switcher to head
        findstr /v "</head>" "%%f" > temp.html
        (
            echo     ^<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"^>
            echo     ^<link rel="stylesheet" href="dark-theme.css"^>
            echo     ^<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet"^>
            echo     ^<script src="js/theme-switcher.js"^>^</script^>
            echo ^</head^
        ) >> temp.html
        
        REM Update body styles
        powershell -Command "(Get-Content temp.html) -replace 'body\s*\{', 'body { transition: background-color 0.3s ease, color 0.3s ease;' | Set-Content temp2.html"
        
        REM Update header styles
        powershell -Command "(Get-Content temp2.html) -replace '\.header\s*\{', '.header { transition: background-color 0.3s ease, color 0.3s ease;' | Set-Content temp3.html"
        
        REM Update facility card styles
        powershell -Command "(Get-Content temp3.html) -replace '\.facility-card\s*\{', '.facility-card { transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease;' | Set-Content temp4.html"
        
        move /Y temp4.html "%%f"
        del temp*.html
    ) else (
        echo Warning: %%~nxf not found, skipping...
    )
)

echo Update complete!
pause
