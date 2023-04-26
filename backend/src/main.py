import sys

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.logger import logger
from .classes import Code, ModelData, Settings
from .generate import code_generation, init_model

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

settings = Settings()

if settings.USE_NGROK:
    from pyngrok import ngrok

    port = sys.argv[sys.argv.index("--port") + 1] if "--port" in sys.argv else 8000
    ngrok.set_auth_token("1kolQ1WJrVjCBuLsMNbIQi3GXqI_3oAccyUEqR473xXNsZN8p")

    public_url = ngrok.connect(port).public_url

    print(public_url)
    logger.info("ngrok tunnel \"{}\" -> \"http://127.0.0.1:{}\"".format(public_url, port))

    settings.BASE_URL = public_url

model_data = ModelData(model="mhhmm/codegen-2B-lora")
model_pipeline = init_model(model_data)

@app.get("/")
async def read_root():
    return {"message": "Hello World"}

@app.post("/gen/code")
async def gen_code(code: Code):
    return code_generation(prompt=code.data, model_pipeline=model_pipeline)
