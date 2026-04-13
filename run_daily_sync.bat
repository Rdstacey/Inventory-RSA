@echo off
REM Daily sync: compress photos into repo copy, refresh JSON from DB, push to GitHub.
REM Point Windows Task Scheduler at this file (full path), or run manually.

cd /d "%~dp0"
python SyncToPython.py %*
exit /b %ERRORLEVEL%
