import csv
import os

import requests
import json
from dotenv import load_dotenv

# Load environment variables into the os environment
load_dotenv()

# Get the API key from the environment variable
API_KEY = os.environ.get('OMDB_API_KEY')

# Connect to OMDB API
def get_movie_data(imdbID):
    # Request data from the OMDB API with the provided IMDB id.
    # Return object formatted as JSON dictionary

    # Make sure IMDB ID is not empty
    if imdbID is None:
        raise ValueError("IMDB ID not set")

    #  Request movie information to OMDB API
    r = requests.get(f'https://www.omdbapi.com/?apikey={API_KEY}&i={imdbID}')
    return r.json()


# Create movies.csv file to store movies data
def create_csv_file(data):
    with open('data/movies.csv', 'w', newline='') as csvfile:
        
        # Create a sequence of keys to identify order of values to be written
        fieldnames = ['imdbID', 'Title', 'Year', 'Runtime', 'Genre', 'Awards', 'BoxOffice', 'Ratings','Language', 'Director', 'Actors']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        for movie in data:
            # For each value in fieldnames, get the value then write the row
            writer.writerow({field: movie[field] for field in fieldnames})


# Get data for each movie in the movies_IMDB.csv file
def main():

    with open('data/movies_IMDB.csv') as csv_file:
        fieldnames = ['Movie', 'IMDB']
        reader = csv.DictReader(csv_file)
        headers = reader.fieldnames

        movies = []
        for row in reader:
             # Get movie data from OMDB API
            movie_data = get_movie_data(row['IMDB'])

            # Check if 'imdbID' is in movie_data
            if 'imdbID' in movie_data:
                # Check received movie imdbID matches the one in the CSV file
                if movie_data['imdbID'] == row['IMDB']:
                     movies.append(movie_data)
                else:
                    continue
            else:
                 continue

            # Pass the movies list to the `create_csv_file` function
        create_csv_file(movies)


if __name__ == '__main__':
    main()

print('Data retrieved successfully')