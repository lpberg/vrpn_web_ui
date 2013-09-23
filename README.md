vrpn_web_ui
===========
VRPN_Web_UI is a simple web-based interface to VRPN ([Virtual Reality Peripheral Network][vrpn]) using the Python microframework [Flask][flask]. Once set up, one can send VRPN Buttons, Analog and Text values to a running VRPN JSON server. The included HTML templates incorporate CSS, Jquery, and Juery UI (In "static" directory).

Install & Dependencies
----------------------
- [Python][python] programming language
- [Flask Microframework][flaskInstall] for Python
- [VRPN][vrpn]

### Getting Started
1. Launch VRPN Server (with vrpn_Tracker_JsonNet enabled)
2. Modify UDP_IP (VRPN Server IP) and UDP_PORT (VRPN Server Port) lines in server.py respectively.
3. Start Flask server (server.py) in root directory.
4. Open a web-broswer and navigate to localhost (typically 127.0.0.1). 


[vrpn]:http://www.cs.unc.edu/Research/vrpn/
[flask]:http://flask.pocoo.org/
[python]:http://www.python.org
[flaskinstall]:http://flask.pocoo.org/docs/installation/#installation
