#! /bin/bash

echo -e "Start running the script..."
cd ../

echo -e "Start building the app..."
wails build --clean -trimpath -upx -upxflags "-9 --lzma"

echo -e "End running the script!"
