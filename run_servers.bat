cd %~dp0/jsonserver
start /min "" "vrpn_server.exe" 
cd ..
start /min "python" "server.py" 