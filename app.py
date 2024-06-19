from flask import Flask, jsonify
from pymongo import MongoClient
from flask_cors import CORS # install using e.i., pip install Flask-CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes (this is just for testing purposes and not for production code)

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/') 
db = client['movies_db']

@app.route('/api/movies', methods=['GET'])
def get_movies():
    movies = list(db['movies'].find({}, {'_id': 0}))  
    return jsonify(movies)

@app.route('/api/movies_ratings', methods=['GET'])
def get_movies_ratings():
    movies_ratings = list(db['movies_ratings'].find({}, {'_id': 0})) 
    return jsonify(movies_ratings)

if __name__ == '__main__':
    app.run(debug=True)