from flask import Flask
from flask import request
from flask import render_template
import socket
import json

UDP_IP = "127.0.0.1"
UDP_PORT = 7777

def is_number(s):
    try:
        float(s)
        return True
    except ValueError:
        return False 

def encodeText(text):
	return json.dumps({
		'type': 4,
		'data': text
	})

def encodeButton(num, state):
	return json.dumps({
		'type': 2,
		'button': int(num),
		'state': state
	})

def encodeAnalog(num, value):
	return json.dumps({
		'type': 3,
		'num': int(num),
		'data': value
	})
def encodeTracker(num, quat, pos):
	return json.dumps({
		'type': 1,
		'id': int(num),
		'quat': quat,
		'pos': pos
	})

def sendToVRPN(message):
	sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
	sock.sendto(message, (UDP_IP, UDP_PORT))
	sock.close()

app = Flask(__name__)

@app.route("/")
def page():
		return render_template('index.html')

@app.route("/apps/<appname>")
def loadpage(appname):
		return render_template("apps/"+appname+'.html')

@app.route("/dynamic/index.html")
def loadcustompage():
		title = eval(request.args.get('title'))
		buttons = eval(request.args.get('buttons'))
		return render_template("/dynamic/index.html", buttons = buttons, title = title)

@app.route("/button/<button_name>", methods=['POST'])
def pressButton(button_name):
	print("Request data", request.form["state"])
	#converting state to Python boolean values
	if request.form["state"] == "true":
		data = True
	else:
		data = False
	sendToVRPN(encodeButton(button_name, data))
	return "OK"

@app.route("/text/<text_string>", methods=['POST'])
def sendText(text_string):
	print("Request data", request.form["data"])
	data = str(request.form["data"])
	sendToVRPN(encodeText(data))
	return "OK"

@app.route("/analog/<int:channel>", methods=['POST'])
def updateAnalog(channel):
	print("Request data", request.form["state"])
	if is_number(request.form["state"]):
		data = float(request.form["state"])
		sendToVRPN(encodeAnalog(channel,data))
	else:
		print("Request was not a number.")
	return "OK"

if __name__ == "__main__":
	app.debug = True
	# app.run() #local machine access only
	app.run(host='0.0.0.0') #make server externally visible
