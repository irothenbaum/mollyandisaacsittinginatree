for file in *.jpg
do
    ffmpeg -i "$file" -vf "scale='if(gt(iw, ih),400,-1)':'if(gt(ih, iw),400,-1)'" "thumb_$file"
done