@echo off
setlocal EnableDelayedExpansion

SET LOGFILE=\var\log\sitespeed.io\sitespeed.io.log

SET CONTROL_FILE=%~dp0sitespeed.run

if exist "%CONTROL_FILE%" (
  echo "%CONTROL_FILE% exist, do you have running tests?"
  exit 1
) else (
  type nul > sitespeed.run
)

for /L %%N in (1,0,10) do (
    @REM git pull
    .\run.bat

    if exist "%CONTROL_FILE%" (
        echo "%CONTROL_FILE% found. Make another run ..."
    ) else (
        echo "%CONTROL_FILE% not found - stopping after cleaning up ..."
        docker system prune --all --volumes -f
        echo "Exit"
        exit 0
    )
)