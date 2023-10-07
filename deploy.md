1 git addres
  https://github.com/Bruce-yangs/Segment-Anything-Fe.git

2 install node.js
  A node 16以上版本
  B 安装yarn,  npm install --g yarn
  C 进入文件夹，安装依赖包， yarn install (依赖安装包)
  D 依赖包安装完后，即可启动， 执行： yarn start

3 package， yarn build
  代码改动完成，需要部署时， 打包执行  yarn build, 最终生成dist文件夹

4 deploy
  将deploy.sh部署到服务目录下，比如：/home/web/web_service   
  注意修改 deploy.sh 的 src_userhost 和 src_dist 的路径
  运行 deploy.sh
