
from Users import User
from flask import Flask, request, json, session, render_template, redirect, url_for

app = Flask(__name__)

@app.route('/')
def index():
	return render_template("index.html")

@app.route('/register', methods=['GET', 'POST'])
def register():
	if request.method == 'POST':
		req_data = request.get_json()
		username = req_data['username']
		password = req_data['password']

		if User(username).register(password):
			session['username'] = username
			return redirect(url_for('index'))
	return render_template("register.html")

@app.route('/login', methods=['GET', 'POST'])
def login():
	if request.method == 'POST':
		req_data = request.get_json()
		username = req_data['username']
		password = req_data['password']
		
		if User(username).verify_password(password):
			session['username'] = username
			return redirect(url_for('index'))
	return render_template("login.html")

@app.route('/logout')
def logout():
	session.pop('username', none)
	return redirect(url_for('index'))



			
