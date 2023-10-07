#/bin/bash

src_userhost="aigc@192.168.3.8"
src_dist="/aidata/aiservice/aidraw_service/virtual_tryon/Segment-Anything-Fe/dist"
dest_dist="/home/web/web_service/dist"
dest_dist_bak="/home/web/web_service/dist.bak"

static_dir="/home/web/web_service/static"

if [ -d $dest_dist ]; then
   if [ -d $dest_dist_bak ]; then
      rm -fr $dest_dist_bak
   fi
   mv $dest_dist $dest_dist_bak
fi

echo "start syn dist"
scp -r $sr_userhost:$src_dist $dest_dist 
echo "finish syn dist"

time=$(date "+%Y%m%d-%H%M%S")
static_bak=$static_dir.$time
if [ -d $static_dir ]; then
   mv $static_dir $static_bak
fi

echo "static bak finish"
mv $dest_dist $static_dir
cp -r $static_bak/outimage $static_dir
echo "dist to static finish"

echo "start stop nginx"
systemctl stop nginx
echo "nginx stopped!"
sleep 1
echo "start nginx"
systemctl start nginx
echo "nginx started!"
