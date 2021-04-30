@echo off

color 3
title Discord Bot Module Initialization

if exist node_modules (
    echo Looks like there already exists a node_modules folder.
    echo Well, if you're getting any errors while trying to start the bot, simply try 'npm i' to install everything else that might be missing.
    call npm i -g nodemon
) else (
    echo Installing node_modules...
    echo.
    call npm i
)

pause>nul