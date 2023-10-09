from fastapi import FastAPI, Query, Path, Depends
from typing import Annotated
import uvicorn
import requests
from requests.auth import HTTPBasicAuth
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from decouple import config
# from jose import JWTError, jwt
# from fastapi.exceptions import HTTPException
# from fastapi.security import OAuth2PasswordBearer

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)

API_URL = config("API_URL")
API_USER = config("API_USER")
API_KEY = config("API_KEY")
# USERNAME = config("USERNAME")
# PASSWORD = config("PASSWORD")
# SECRET_KEY = config("SECRET_KEY")

# class User(BaseModel):
#     username: str
#     password: str

# def create_access_token(data: dict):
#     encoded_jwt = jwt.encode(data, SECRET_KEY, algorithm="HS256")
#     return encoded_jwt

# def decode_access_token(token: str = Depends(oauth2_scheme)):
#     try:
#         decoded_jwt = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
#         return decoded_jwt
#     except JWTError:
#         return None

@app.get("/customers/search/{search_value}")
async def get_customer_by_name(search_value: Annotated[str, Path(..., min_length=3)]):
    try:
        params = {"last_name": search_value}
        auth = HTTPBasicAuth(API_USER, API_KEY)
        response_array = []
        response = requests.get(API_URL + "customers/search", auth=auth, params=params)

        if response.status_code == 200:
            response_array = response.json()
            previous_length = len(response_array)
            i = 1
            while previous_length == 250:
                i += 1
                params = {"last_name": search_value, "p": i}
                response = requests.get(API_URL + "customers/search", auth=auth, params=params)
                if response.status_code == 200:
                    response_array += response.json()
                    previous_length = len(response.json())
                else:
                    return {"error": response.json()["details"]}
        else:
            return {"error": response.json()["details"]}
        
        params = {"email": search_value}
        response = requests.get(API_URL + "customers/search", auth=auth, params=params)

        if response.status_code == 200:
            previous_length = len(response.json())
            for customer in response.json():
                if customer not in response_array:
                    response_array.append(customer)
            i = 1
            while previous_length == 250:
                i += 1
                params = {"email": search_value, "p": i}
                response = requests.get(API_URL + "customers/search", auth=auth, params=params)
                if response.status_code == 200:
                    for customer in response.json():
                        if customer not in response_array:
                            response_array.append(customer)
                    previous_length = len(response.json())
                else:
                    return {"error": response.json()["details"]}
        else:
            return {"error": response.json()["details"]}
        
        return {
            "response": response_array,
            "msg": "success"
        }
    except Exception as e:
        return {"error": e}


@app.get("/customer/{customer_id}/sales")
async def get_customer_sales(customer_id: Annotated[int, Path(..., ge=1)], page: Annotated[int, Query(..., ge=1)] = 1):
    try:
        auth = HTTPBasicAuth(API_USER, API_KEY)
        response = requests.get(API_URL + f"customer/{customer_id}/sales/", auth=auth)

        if response.status_code == 200:
            start_index = 5 * (page - 1)
            end_index = start_index + 5
            return {
                "response": response.json()[start_index:end_index],
                "msg": "success",
                "length": len(response.json())
            }
        else:
            return {"error": response.json()["details"]}
    except Exception as e:
        return {"error": e}


@app.get("/sales/{sale_id}")
async def get_products_by_sale(sale_id: Annotated[int, Path(..., ge=0)]):
    try:
        auth = HTTPBasicAuth(API_USER, API_KEY)
        response = requests.get(API_URL + f"sales/{sale_id}", auth=auth)

        if response.status_code == 200:
            return {
                "response": response.json(),
                "msg": "success"
            }
        else:
            return {"error": response.json()["details"]}
    except Exception as e:
        return {"error": e}

# @app.post("/login")
# async def login(user: User):
#     if user.username == USERNAME and user.password == PASSWORD:
#         access_token = create_access_token({"sub": user.username})
#         return {"access_token": access_token, "token_type": "bearer"}
#     else:
#         raise HTTPException(status_code=401, detail="Login failed")


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8765, reload=True)
