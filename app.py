from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
from bson import json_util
from bson.objectid import ObjectId
import json

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/restaurants"
mongo = PyMongo(app)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/map')
def map():
    return render_template('map.html')

@app.route('/data', methods = ['GET'])
def data():
    yelp_data = list(mongo.db.data.find({}, {'_id': False}).limit(100))
    return json.dumps(yelp_data, default=json_util.default)

#-------------------------
if __name__ == "__main__":
    app.run(debug=True)