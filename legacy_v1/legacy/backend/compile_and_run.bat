@echo off
echo Compiling C Backend with MinGW Fix...
gcc -nostdinc -I C:/MinGW/x86_64-w64-mingw32/include -I C:/MinGW/lib/gcc/x86_64-w64-mingw32/13.2.0/include -I C:/MinGW/lib/gcc/x86_64-w64-mingw32/13.2.0/include/ssp main.c -o server.exe -lws2_32
if %errorlevel% neq 0 (
    echo.
    echo ❌ Compilation Failed!
    pause
    exit /b %errorlevel%
)
echo ✅ Compilation Successful!
echo Starting Server...
server.exe
