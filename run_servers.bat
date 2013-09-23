cd %~dp0/jsonserver
start "" "vrpn_server.exe" 
cd ..
start "python" "server.py" 