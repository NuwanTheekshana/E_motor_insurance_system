import json
import requests

url = 'https://ee81-35-197-108-72.ngrok-free.app/cover_prediction'

input_data_for_model = {
    'POL_SI': 4750000,
    'POL_MAKE_YEAR': 2018,
    'POL_FUEL': 6,
    'POL_VEH_CAT': 21,
    'POL_VEH_USAGE': 1
}

input_json = json.dumps(input_data_for_model)

try:
    response = requests.post(url, data=input_json)
    response.raise_for_status()  # Raise an exception for HTTP errors
    print(response.text)
except requests.exceptions.RequestException as e:
    print(f"An error occurred: {e}")
