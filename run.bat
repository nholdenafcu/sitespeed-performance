@echo off
setlocal EnableDelayedExpansion

set DOCKER_CONTAINER=sitespeedio/sitespeed.io:26.1.0
set DOCKER_SETUP=--cap-add=NET_ADMIN --shm-size=2g --rm -v /config:/config -v %cd:\=/%:/sitespeed.io -v /etc/localtime:/etc/localtime:ro -e MAX_OLD_SPACE_SIZE=3072
set DESKTOP_BROWSERS_DOCKER=chrome firefox
set DESKTOP_BROWSERS=chrome firefox edge
set EMULATED_MOBILE_BROWSERS=chrome

for %%f in (%~dp0tests\*.txt %~dp0tests\*.js) do (
    for %%a in (%DESKTOP_BROWSERS_DOCKER%) do (
        set FILENAME=tests/%%~nf.js
        set CONFIG_FILE=config/%%~nf.json
        if exist "!CONFIG_FILE!" (echo "Using config file !CONFIG_FILE!") else (echo "Missing config file !CONFIG_FILE%!")
        docker run %DOCKER_SETUP% %DOCKER_CONTAINER% --config !CONFIG_FILE! -b %%a !FILENAME! --multi
    )
)

docker volume prune -f
timeout 20
