@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul 2>&1

:: ============================================================
::  ha-schedule-card — Release Script
::  Usage: release.bat [patch|minor|major] ["release message"] [-y]
::  Example: release.bat patch "Fix RTL chevron direction"
::           release.bat minor "Add weekly compact view" -y
::           release.bat major "Breaking config rename"
:: ============================================================

set "REPO_DIR=%~dp0"
set "BUMP_TYPE=%~1"
set "RELEASE_MSG=%~2"
set "AUTO_YES=%~3"
set "DIST_FILE=dist\ha-schedule-card.js"

:: ── Colours (reliable ESC via prompt trick — works in subprocesses) ──
for /f %%a in ('"prompt $E & for %%b in (1) do rem"') do set "ESC=%%a"
set "C_RESET=%ESC%[0m"
set "C_BOLD=%ESC%[1m"
set "C_RED=%ESC%[91m"
set "C_GREEN=%ESC%[92m"
set "C_YELLOW=%ESC%[93m"
set "C_CYAN=%ESC%[96m"
set "C_BLUE=%ESC%[94m"
set "C_DIM=%ESC%[2m"

:: ── Helpers ─────────────────────────────────────────────────
goto :main

:print_header
    echo.
    echo %C_BOLD%%C_BLUE%╔══════════════════════════════════════════════╗%C_RESET%
    echo %C_BOLD%%C_BLUE%║      ha-schedule-card  Release Tool          ║%C_RESET%
    echo %C_BOLD%%C_BLUE%╚══════════════════════════════════════════════╝%C_RESET%
    echo.
    exit /b 0

:step
    echo %C_BOLD%%C_CYAN%[*] %~1%C_RESET%
    exit /b 0

:ok
    echo %C_GREEN%[OK] %~1%C_RESET%
    exit /b 0

:warn
    echo %C_YELLOW%[!] %~1%C_RESET%
    exit /b 0

:fail
    echo.
    echo %C_RED%%C_BOLD%[ERR] %~1%C_RESET%
    echo.
    exit /b 1

:usage
    echo.
    echo %C_BOLD%Usage:%C_RESET%
    echo   release.bat %C_CYAN%^<patch^|minor^|major^>%C_RESET% ["message"] [-y]
    echo.
    echo %C_BOLD%Examples:%C_RESET%
    echo   release.bat patch
    echo   release.bat minor "Add Arabic translation"
    echo   release.bat major "Breaking config rename"
    echo   release.bat patch "Fix RTL bug" -y    (auto-confirm all prompts)
    echo.
    echo %C_BOLD%Version types:%C_RESET%
    echo   %C_CYAN%patch%C_RESET%  -- bug fixes              1.1.0 -^> 1.1.1
    echo   %C_CYAN%minor%C_RESET%  -- new features           1.1.0 -^> 1.2.0
    echo   %C_CYAN%major%C_RESET%  -- breaking changes       1.1.0 -^> 2.0.0
    echo.
    exit /b 0

:: ── Main ────────────────────────────────────────────────────
:main
call :print_header

cd /d "%REPO_DIR%"

:: ── 1. Validate arguments ────────────────────────────────────
call :step "Validating arguments..."

if "%BUMP_TYPE%"=="" (
    call :warn "No bump type provided."
    call :usage
    if /i not "%AUTO_YES%"=="-y" pause
    exit /b 1
)
if /i not "%BUMP_TYPE%"=="patch" if /i not "%BUMP_TYPE%"=="minor" if /i not "%BUMP_TYPE%"=="major" (
    call :fail "Invalid bump type: '%BUMP_TYPE%'. Must be patch, minor, or major."
    call :usage
    if /i not "%AUTO_YES%"=="-y" pause
    exit /b 1
)
call :ok "Bump type: %C_CYAN%%BUMP_TYPE%%C_RESET%"

:: ── 2. Check required tools ──────────────────────────────────
call :step "Checking required tools..."

where git >nul 2>&1 || ( call :fail "git not found in PATH." & if /i not "%AUTO_YES%"=="-y" pause & exit /b 1 )
where npm >nul 2>&1 || ( call :fail "npm not found in PATH." & if /i not "%AUTO_YES%"=="-y" pause & exit /b 1 )
where gh  >nul 2>&1 || ( call :fail "GitHub CLI (gh) not found. Install from https://cli.github.com" & if /i not "%AUTO_YES%"=="-y" pause & exit /b 1 )

call :ok "git, npm, gh -- all found"

:: ── 3. Check git status ──────────────────────────────────────
call :step "Checking git working directory..."

git diff --quiet HEAD >nul 2>&1
if errorlevel 1 (
    echo.
    echo %C_YELLOW%  Uncommitted changes detected:%C_RESET%
    git status --short
    echo.
    if /i "%AUTO_YES%"=="-y" (
        set "CONFIRM=Y"
    ) else (
        set /p "CONFIRM=  Commit all changes before releasing? [Y/n]: "
    )
    if /i "!CONFIRM!"=="n" (
        call :fail "Aborted. Please commit or stash your changes first."
        if /i not "%AUTO_YES%"=="-y" pause
        exit /b 1
    )
    echo.
)

:: Check we are on master / main
for /f %%B in ('git rev-parse --abbrev-ref HEAD') do set "CURRENT_BRANCH=%%B"
if /i not "!CURRENT_BRANCH!"=="master" if /i not "!CURRENT_BRANCH!"=="main" (
    call :warn "You are on branch '!CURRENT_BRANCH!', not master/main."
    if /i "%AUTO_YES%"=="-y" (
        set "CONFIRM=y"
    ) else (
        set /p "CONFIRM=  Continue anyway? [y/N]: "
    )
    if /i not "!CONFIRM!"=="y" (
        call :fail "Aborted."
        if /i not "%AUTO_YES%"=="-y" pause
        exit /b 1
    )
)
call :ok "On branch: !CURRENT_BRANCH!"

:: ── 4. Pull latest ──────────────────────────────────────────
call :step "Pulling latest from origin..."

git pull --rebase origin !CURRENT_BRANCH! >nul 2>&1
if errorlevel 1 (
    call :fail "git pull failed. Resolve conflicts and try again."
    if /i not "%AUTO_YES%"=="-y" pause
    exit /b 1
)
call :ok "Up to date with origin"

:: ── 5. Read current version from HEAD ────────────────────────
call :step "Reading current version from HEAD..."

set "CURRENT_VERSION="
for /f "tokens=2 delims=:, " %%V in ('git show HEAD:package.json ^| findstr /C:"\"version\""') do (
    if not defined CURRENT_VERSION set "CURRENT_VERSION=%%~V"
)
set "CURRENT_VERSION=!CURRENT_VERSION:"=!"

if "!CURRENT_VERSION!"=="" (
    call :fail "Could not read version from HEAD:package.json"
    if /i not "%AUTO_YES%"=="-y" pause
    exit /b 1
)
call :ok "Current version: %C_CYAN%v!CURRENT_VERSION!%C_RESET%"

:: ── 6. Calculate next version ───────────────────────────────
call :step "Calculating new version (%BUMP_TYPE%)..."

for /f "tokens=1,2,3 delims=." %%A in ("!CURRENT_VERSION!") do (
    set /a "VER_MAJOR=%%A"
    set /a "VER_MINOR=%%B"
    set /a "VER_PATCH=%%C"
)

if /i "%BUMP_TYPE%"=="major" (
    set /a "VER_MAJOR+=1"
    set "VER_MINOR=0"
    set "VER_PATCH=0"
) else if /i "%BUMP_TYPE%"=="minor" (
    set /a "VER_MINOR+=1"
    set "VER_PATCH=0"
) else (
    set /a "VER_PATCH+=1"
)

set "NEW_VERSION=!VER_MAJOR!.!VER_MINOR!.!VER_PATCH!"
set "NEW_TAG=v!NEW_VERSION!"

echo.
echo   %C_DIM%  !CURRENT_VERSION!  --^>  %C_RESET%%C_BOLD%%C_GREEN%!NEW_VERSION!%C_RESET%
echo.

:: Confirm
if /i "%AUTO_YES%"=="-y" (
    echo   Auto-confirming release !NEW_TAG!...
) else (
    set /p "CONFIRM=  Proceed with release !NEW_TAG!? [Y/n]: "
    if /i "!CONFIRM!"=="n" (
        call :warn "Release cancelled by user."
        pause
        exit /b 0
    )
)
echo.

:: ── 7. Check tag doesn't already exist ──────────────────────
git tag | findstr /x /c:"!NEW_TAG!" >nul 2>&1
if not errorlevel 1 (
    call :fail "Tag '!NEW_TAG!' already exists. Delete it first with: git tag -d !NEW_TAG!"
    if /i not "%AUTO_YES%"=="-y" pause
    exit /b 1
)

:: ── 8. Bump version in package.json ─────────────────────────
call :step "Updating version in package.json..."

powershell -NoProfile -Command "(Get-Content package.json -Raw) -replace '\"version\": \"!CURRENT_VERSION!\"', '\"version\": \"!NEW_VERSION!\"' | Set-Content package.json -NoNewline -Encoding utf8"
if errorlevel 1 (
    call :fail "Failed to update package.json"
    if /i not "%AUTO_YES%"=="-y" pause
    exit /b 1
)
call :ok "package.json updated to !NEW_VERSION!"

:: ── 8b. Bump CARD_VERSION in src/const.ts ───────────────────
call :step "Updating CARD_VERSION in src/const.ts..."

powershell -NoProfile -Command "(Get-Content src/const.ts -Raw) -replace 'CARD_VERSION = \"!CURRENT_VERSION!\"', 'CARD_VERSION = \"!NEW_VERSION!\"' | Set-Content src/const.ts -NoNewline -Encoding utf8"
if errorlevel 1 (
    call :warn "Could not update src/const.ts (continuing anyway)"
) else (
    call :ok "src/const.ts updated to !NEW_VERSION!"
)

:: ── 9. Build ─────────────────────────────────────────────────
call :step "Building project (npm run build)..."
echo.

npm run build
if errorlevel 1 (
    echo.
    call :fail "Build failed. Rolling back package.json..."
    powershell -NoProfile -Command "(Get-Content package.json -Raw) -replace '\"version\": \"!NEW_VERSION!\"', '\"version\": \"!CURRENT_VERSION!\"' | Set-Content package.json -NoNewline -Encoding utf8"
    powershell -NoProfile -Command "(Get-Content src/const.ts -Raw) -replace 'CARD_VERSION = \"!NEW_VERSION!\"', 'CARD_VERSION = \"!CURRENT_VERSION!\"' | Set-Content src/const.ts -NoNewline -Encoding utf8"
    if /i not "%AUTO_YES%"=="-y" pause
    exit /b 1
)

echo.
if not exist "%DIST_FILE%" (
    call :fail "Build output not found: %DIST_FILE%"
    if /i not "%AUTO_YES%"=="-y" pause
    exit /b 1
)

for %%F in ("%DIST_FILE%") do set "DIST_SIZE=%%~zF"
set /a "DIST_KB=%DIST_SIZE% / 1024"
call :ok "Built %DIST_FILE% (!DIST_KB! KB)"

:: ── 10. Stage and commit ─────────────────────────────────────
call :step "Staging changes..."

git add -u
git add package.json src/const.ts "%DIST_FILE%"
if errorlevel 1 ( call :fail "git add failed" & if /i not "%AUTO_YES%"=="-y" pause & exit /b 1 )
call :ok "Staged all modified tracked files"

:: Build commit message
if "%RELEASE_MSG%"=="" (
    set "COMMIT_MSG=chore: release !NEW_TAG!"
) else (
    set "COMMIT_MSG=chore: release !NEW_TAG! - %RELEASE_MSG%"
)

call :step "Committing..."
git commit -m "!COMMIT_MSG!"
if errorlevel 1 ( call :fail "git commit failed" & if /i not "%AUTO_YES%"=="-y" pause & exit /b 1 )
call :ok "Committed: !COMMIT_MSG!"

:: ── 11. Create tag ───────────────────────────────────────────
call :step "Creating tag !NEW_TAG!..."

git tag -a "!NEW_TAG!" -m "Release !NEW_TAG!"
if errorlevel 1 ( call :fail "git tag failed" & if /i not "%AUTO_YES%"=="-y" pause & exit /b 1 )
call :ok "Tag created: !NEW_TAG!"

:: ── 12. Push ─────────────────────────────────────────────────
call :step "Pushing to origin..."

git push origin !CURRENT_BRANCH!
if errorlevel 1 ( call :fail "git push (branch) failed" & if /i not "%AUTO_YES%"=="-y" pause & exit /b 1 )

git push origin "!NEW_TAG!"
if errorlevel 1 ( call :fail "git push (tag) failed" & if /i not "%AUTO_YES%"=="-y" pause & exit /b 1 )

call :ok "Pushed branch and tag to origin"

:: ── 13. Create GitHub release ────────────────────────────────
call :step "Creating GitHub release !NEW_TAG!..."

if "%RELEASE_MSG%"=="" (
    set "RELEASE_NOTES=Release !NEW_TAG!"
) else (
    set "RELEASE_NOTES=%RELEASE_MSG%"
)

gh release create "!NEW_TAG!" "%DIST_FILE%" ^
    --title "!NEW_TAG!" ^
    --notes "## Schedule Card !NEW_TAG!

!RELEASE_NOTES!

### Installation
Search for **Schedule Card** in HACS -> Frontend, or download `ha-schedule-card.js` and place it in `config/www/`."

if errorlevel 1 ( call :fail "gh release create failed" & if /i not "%AUTO_YES%"=="-y" pause & exit /b 1 )
call :ok "GitHub release created"

:: ── 14. Done ─────────────────────────────────────────────────
echo.
echo %C_BOLD%%C_GREEN%╔══════════════════════════════════════════════╗%C_RESET%
echo %C_BOLD%%C_GREEN%║   Release !NEW_TAG! published successfully!%C_RESET%%C_BOLD%%C_GREEN%   ║%C_RESET%
echo %C_BOLD%%C_GREEN%╚══════════════════════════════════════════════╝%C_RESET%
echo.
echo   Repository:  https://github.com/yosef-chai/ha-schedule-card
echo   Release:     https://github.com/yosef-chai/ha-schedule-card/releases/tag/!NEW_TAG!
echo.

endlocal
if /i not "%~3"=="-y" pause
exit /b 0
