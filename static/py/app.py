from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
from bson import json_util
from bson.objectid import ObjectId
import json


# conn = "mongodb://localhost:27017"
# client = pymongo.MongoClient(conn)

# Select database and collection to use
# db = client.restaurants
# data = db.data

# example = data.find_one()
# #print(example)


app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/restaurants"
mongo = PyMongo(app)


@app.route('/data', methods = ['GET'])
def data():
    yelp_data = list(mongo.db.data.find({}, {'_id': False}).limit(5))
    return json.dumps(yelp_data, default=json_util.default)
    #return render_template('index.html', data=yelp_data)



#-------------------------
if __name__ == "__main__":
    app.run(debug=True)