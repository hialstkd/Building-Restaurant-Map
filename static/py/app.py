from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
import json

file = '../yelp_academic_dataset_business.json'

with open(file) as f:
  data = json.load(f)

print(data)

# app = Flask(__name__)
# #mongo = PyMongo(app, uri="mongodb://localhost:27017/_______")

# @app.route('/data')
# def data():
#     file = '../yelp_academic_dataset_business.json'
#     data = pd.read_json(file)

#     return data
#     #data = mongo.db.collection.find_one()
#     #return render_template("index.html", dict=data)



# #-------------------------
# if __name__ == "__main__":
#     app.run(debug=True)