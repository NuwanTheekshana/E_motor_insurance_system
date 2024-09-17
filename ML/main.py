from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import pickle

app = FastAPI()

with open('vehicle_cover_predict.pkl', 'rb') as model_file:
    xgboost_model_hyp = pickle.load(model_file)

class InputData(BaseModel):
    POL_SI: float
    POL_MAKE_YEAR: int
    POL_FUEL: int
    POL_VEH_CAT: int
    POL_VEH_USAGE: int

cover_names = [
    "THIRD PARTY PROPERTY DAMAGE",
    "FLOOD",
    "STRIKE RIOT AND CIVIL COMMOTION",
    "TERRORISM",
    "NATURAL PERILS",
    "EXCLUDED ITEMS",
    "HIRE VEHICLES",
    "TOWING CHARGES",
    "DRIVING TUTION",
    "OMINI BUSES",
    "PAB",
    "BREAKAGE GLASS",
    "LEARNER DRIVER"
]

@app.get("/")
def read_root():
    return {"message": "Vehicle Coverage Prediction API"}


@app.post("/predict_covers/")
def predict_covers(input_data: InputData):
    input_df = pd.DataFrame([input_data.dict()])

    try:
        predicted_output = xgboost_model_hyp.predict(input_df)
        predicted_covers = {cover_name: value for cover_name, value in zip(cover_names, predicted_output[0])}
        selected_covers = [cover for cover, value in predicted_covers.items() if value == 1]

        return {"selected_covers": selected_covers}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
