from .model.codegen import CodeGenerationPipeline
from .classes import ModelData

def init_model(model_data = ModelData):
    model_pipeline = CodeGenerationPipeline(model_data)
    model_pipeline.load_model()

    return model_pipeline

def code_generation(prompt = str, model_pipeline = CodeGenerationPipeline):
    #gen_kwargs = {
    #    "temperature": model_pipeline.data.temperature,
    #    "max_new_tokens": model_pipeline.data.max_new_tokens,
    #    "top_p": model_pipeline.data.top_p,
    #    "top_k": model_pipeline.data.top_k,
    #}

    gen_kwargs = {
    #    "temperature": model_pipeline.data.temperature,
        "max_new_tokens": 70,
    #    "top_p": model_pipeline.data.top_p,
    #    "top_k": model_pipeline.data.top_k,
    }
    
    code_gen = model_pipeline.generate(prompt, **gen_kwargs)

    if code_gen:
        return code_gen
    else:
        return "Generation failed !"
