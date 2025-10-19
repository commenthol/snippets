#!/usr/bin/env bash

function dev {
	echo
}

function bump {
	pnpm -r exec c4u $@
	c4u $@
}

if test -z "$1"; then
	./run.sh dev
else
	$1 ${*:2}
fi
