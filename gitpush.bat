@echo off
cd /d "d:\project\LILOULOVE"

echo ========== Git Status ==========
git status

echo.
echo ========== Adding all files ==========
git add .

echo.
echo ========== Committing ==========
git commit -m "更新: 线条小狗IP主题、正计时器、天气运势、恋爱任务、背景图、音乐播放器"

echo.
echo ========== Pushing to GitHub ==========
git push origin main

echo.
echo ========== Done! ==========
pause
