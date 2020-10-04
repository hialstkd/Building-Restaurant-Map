# Import dependencies
import pymongo
import json
import pandas as pd
import numpy as np

# Read in the file location and turn it into a pandas dataframe
business_file = "../../Yelp/yelp_academic_dataset_business.json"
business_pd = pd.read_json(business_file, lines=True)

# business_pd.head()

# Create a new dataframe by filtering the selected column indices
business_data = business_pd.filter(items = ["name", "state", "postal_code", "latitude", "longitude", "stars", "review_count", "categories"])

# business_data.head()

# Find all the unique states in the dataframe
business_data["state"].unique()

# Create an array that will hold the states to remove, any state not in the US will be removed
remove = ["QC", "ON", "AB", "XWY", "BC", "YT", "HPL", "DOW", "MB", "DUR"]

# Run a loop to remove all the states outside the US
for state in remove:
    business_data.drop(business_data[business_data["state"] == f'{state}'].index, inplace=True)

# Check to see if the states were removed
business_data["state"].unique()

# Check to see if all columns have the same amount of data
business_data.count()

# Replace all empty cells with NaN in the categories column
business_data["categories"].replace("", np.nan, inplace=True)

# Drop all NaN from the category column
business_data.dropna(subset = ["categories"], inplace=True)

# Now we only have data with values in every column
business_data.count()

# Filter the categories row for businesses that are Restaurants
cleaned = business_data[business_data['categories'].str.contains("Restaurant")]

# cleaned.head()

# Reset the index so we can iterate through the data and load it into the database
cleaned = cleaned.reset_index(drop=True)

# cleaned.count()

# Setup connection to mongodb
conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)

# Select database and collection to use
db = client.restaurants
data = db.data

# Run a loop through the length of the dataframe
# Create table and append values for each business
for x in range(len(cleaned)):
    data.insert_one(
        {
            "name": cleaned["name"][x],
            "state": cleaned["state"][x],
            "postal_code": cleaned["postal_code"][x],
            "latitude": cleaned["latitude"][x],
            "longitude": cleaned["longitude"][x],
            "stars": cleaned["stars"][x],
            "review_count": int(cleaned["review_count"][x]),
            "categories": cleaned["categories"][x]
        }
    )