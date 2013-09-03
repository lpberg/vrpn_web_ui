from flask import Flask
from flask import request
from flask import render_template
app = Flask(__name__)

@app.route("/",methods=['POST', 'GET'])
def hello():
	if request.method == 'POST':
		return render_template('index.html', key=request.form['key'])
	else:
		return render_template('index.html')
	
@app.route("/buttons/<button_name>", methods=['POST', 'GET'])
def pressButton(button_name):
	if request.method == 'POST':
		print "You pressed the %s button" % button_name
		return render_template('index.html')
	else:
		return render_template('index.html')

# @app.route('/text/<string>', methods=['POST', 'GET'])
# def show_post(string):
    # return 'Posted %s' % string


	
if __name__ == "__main__":
	app.debug = True
	app.run() #local machine access only
	# app.run(host='0.0.0.0') #make server externally visible