@echo off
echo ==============================================
echo 🚀 TECHGEAR HUB - GIT PUSH UTILITY
echo ==============================================
echo.
echo Remote URL: https://github.com/hassanbinyahya/techgear_web.git
echo.
echo Staging any unstaged changes...
git add .
echo.
echo Committing changes...
git commit -m "Auto-commit before pushing from push utility script"
echo.
echo Pushing code to GitHub...
git push -u origin master
echo.
echo ==============================================
echo ✓ Code successfully pushed!
echo ==============================================
pause
