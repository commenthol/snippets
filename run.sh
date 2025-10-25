#!/usr/bin/env bash

function dev {
	echo
}

function bump {
	pnpm -r exec c4u $@
	c4u $@
}

function types {
  local f=$(find ./src/node/http/*.js)
  for file in $f; do
    if [[ "$file" == *"test.js"* ]]; then
      continue
    fi
    echo "---- $file ----"
    npx tsc --skipLibCheck --allowJS --checkJS --noEmit --noImplicitAny false --esModuleInterop --module esnext $file
  done
}

if test -z "$1"; then
	./run.sh dev
else
	$1 ${*:2}
fi
