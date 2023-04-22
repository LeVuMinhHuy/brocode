from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from classes import Code, ModelData, GenerationData
from generate import code_generation

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.post("/gen/code")
def gen_code(code: Code):
    print(code)
    model_data = ModelData(model="Daoguang/PyCodeGPT")
    gen_data = GenerationData(model_data=model_data, prompt=code.data)
    return code_generation(gen_data)

