uglifyjs h.js -c toplevel -m toplevel > h.min.js
gzip -k h.min.js
ls -al
#rm -rf h.min.js*
