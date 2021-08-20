#!/usr/bin/env sh

CWD=$(cd -P -- "$(dirname -- "$0")" && pwd -P)

cd "$CWD"

git clone --depth 2 https://github.com/commenthol/self-signed-certs

cd self-signed-certs
./root_ca.sh
./site.sh

cd "$CWD"

cp \
  self-signed-certs/certs/root_ca.crt \
  self-signed-certs/certs/site.crt \
  self-signed-certs/certs/site.key \
  .

rm -rf self-signed-certs