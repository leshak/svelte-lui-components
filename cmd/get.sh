#!/bin/bash

echo "Downloading LUI components..."

# Create a temporary directory and store its name in a variable.
TEMPD=$(mktemp -d)
ZIPFILE="$TEMPD/lui.zip"

curl -o $ZIPFILE -s -L https://github.com/leshak/svelte-lui-components/archive/refs/heads/master.zip

echo "Extracting..."
unzip -qq $ZIPFILE "svelte-lui-components-master/lui/*" -d $TEMPD

echo "Backup..."
time_stamp=$(date +%Y-%m-%d_%H-%M-%S)
tar cjf "src/lib/components/lui_${time_stamp}.tar.bz2" src/lib/components/lui/

rm -rf src/lib/components/lui
mkdir -p src/lib/components/lui
mv $TEMPD/svelte-lui-components-master/lui/* src/lib/components/lui

echo "Cleaning up..."
rm -rf $TEMPD

echo "Done!"
