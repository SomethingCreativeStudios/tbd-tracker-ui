#!/bin/sh
for file in /usr/share/nginx/html/index.html;

do
  if [ ! -f $file.tmpl.html ]; then
    cp $file $file.tmpl.html
  fi

  envsubst < $file.tmpl.html > $file
done
echo "Starting Nginx"
nginx -g 'daemon off;'