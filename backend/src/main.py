from fastapi import FastAPI
from classes import Code, ModelData, GenerationData
from generate import code_generation

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.post("/gen/code")
def gen_code(code: Code):
    model_data = ModelData(model="Daoguang/PyCodeGPT")
    gen_data = GenerationData(model_data=model_data, prompt=code.data)
    return code_generation(gen_data)

