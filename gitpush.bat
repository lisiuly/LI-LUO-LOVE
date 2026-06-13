@echo off
cd /d "d:\project\LILOULOVE"

echo Removing large file from git...
git rm --cached "images/bg/生日.mp4.crdownload" 2>nul
git rm --cached "images/bg/*.crdownload" 2>nul
del "images\bg\*.crdownload" 2>nul

echo.
echo Adding .gitignore for large files...
echo *.crdownload >> .gitignore
echo *.mp4 >> .gitignore

git add .
git commit -m "移除大文件、添加gitignore"
git push origin main
echo Done!
pause
