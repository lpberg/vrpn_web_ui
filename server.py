from flask import Flask
from flask import request
from flask import render_template

import socket

UDP_IP = "127.0.0.1"
UDP_PORT = 7777


import json

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
def hello():
		return render_template('index.html')
	
@app.route("/button/<button_name>", methods=['POST'])
def pressButton(button_name):
	print("Request data", request.form["state"])
	if request.form["state"] == "true":
		data = True
	else:
		data = False
	sendToVRPN(encodeButton(button_name, data))
	return "OK"

@app.route("/analog/<int:channel>", methods=['POST'])
def updateAnalog(channel):
	print("Request data", request.form["state"])
	data = float(request.form["state"])
	sendToVRPN(encodeAnalog(channel, data))
	return "OK"

# @app.route('/text/<string>', methods=['POST', 'GET'])
# def show_post(string):
    # return 'Posted %s' % string


	
if __name__ == "__main__":
	app.debug = True
	app.run() #local machine access only
	# app.run(host='0.0.0.0') #make server externally visible