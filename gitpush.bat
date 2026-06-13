@echo off
cd /d "d:\project\LILOULOVE"

echo Step 1: Delete local large file
del "images\bg\*.crdownload" 2>nul

echo Step 2: Remove file from entire git history
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch images/bg/生日.mp4.crdownload" --prune-empty --tag-name-filter cat -- --all

echo Step 3: Clean up git
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo Step 4: Add gitignore
echo *.crdownload >> .gitignore
echo *.mp4 >> .gitignore

echo Step 5: Commit and push
git add .
git commit -m "移除大文件、添加gitignore"
git push origin main --force
echo Done!
pause
