<!--vite congi-->
ls
<!--initialise & add dependencies-->
npm init -y
npm i vue
npm i -D vite @vitejs/plugin-vue

<!--install pinia-->
npm i pinia

<!--push to github-->
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/JYceeee/joyce_rwa.git
git push -u origin main

<!--新建并切换到新分支、保存修改、提交、推送到 GitHub-->
git checkout -b 20251002-4
git add .
git commit -m "20251002-4"
git push origin 20251002-4

git push -f origin main

cd Website
npm run dev

cd Mysql
node index.js