@echo off
REM JaiMentorship Frontend - Production Deploy Script (Windows)
REM Usage: deploy.bat <api-domain>
REM Example: deploy.bat https://api.jaimentorship.kg

setlocal enabledelayedexpansion

if "%1"=="" (
  echo Error: API domain not provided
  echo Usage: deploy.bat ^<api-domain^>
  echo Example: deploy.bat https://api.jaimentorship.kg
  exit /b 1
)

set API_DOMAIN=%1
set PROJECT_NAME=jaimentorship-frontend
set REGION=us-central1

echo.
echo ========================================
echo JaiMentorship Frontend Production Deploy
echo ========================================
echo API Domain: %API_DOMAIN%
echo Region: %REGION%
echo.

REM Step 1: Install dependencies
echo [1/4] Installing dependencies...
call npm install
if !errorlevel! neq 0 (
  echo Error: npm install failed
  exit /b 1
)
echo Done!
echo.

REM Step 2: Build project
echo [2/4] Building project...
call npm run build
if not exist "dist\" (
  echo Error: Build failed - dist folder not created
  exit /b 1
)
echo Done!
echo.

REM Step 3: Deploy to Cloud Run
echo [3/4] Deploying to Google Cloud Run...
gcloud run deploy %PROJECT_NAME% ^
  --source . ^
  --platform managed ^
  --region %REGION% ^
  --set-env-vars="VITE_API_BASE_URL=%API_DOMAIN%" ^
  --allow-unauthenticated ^
  --memory=256Mi ^
  --cpu=1

if !errorlevel! neq 0 (
  echo Error: Deployment failed
  exit /b 1
)
echo Done!
echo.

REM Step 4: Get service URL
echo [4/4] Getting service URL...
for /f "delims=" %%i in ('gcloud run services describe %PROJECT_NAME% --region %REGION% --format "value(status.url)"') do set SERVICE_URL=%%i
echo Done!
echo.

REM Step 5: Summary
echo ========================================
echo DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Service URL: %SERVICE_URL%
echo API Domain: %API_DOMAIN%
echo Region: %REGION%
echo.
echo Next steps:
echo 1. Test the application at: %SERVICE_URL%
echo 2. Verify all features work (auth, bookings, profiles)
echo 3. Check error handling with network issues
echo 4. Monitor Cloud Run logs: gcloud run logs read %PROJECT_NAME% --region %REGION%
echo.
echo Happy deploying!

