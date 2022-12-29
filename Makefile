PWD = $(shell pwd)

default: build image file

run:
	echo "not imp"

dev:
	yarn build:dev

test:
	yarn build:test

image:
	docker build -t rewon/ifarm-admin:latest .

file:
	docker save -o ifarm-admin rewon/ifarm-admin:latest
