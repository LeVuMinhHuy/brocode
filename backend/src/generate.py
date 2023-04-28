from .model.codegen import CodeGenerationPipeline
from .classes import ModelData

def init_model(model_data = ModelData):
    model_pipeline = CodeGenerationPipeline(model_data)

    model_pipeline.load_model_generate()
    model_pipeline.load_model_summarize()

    return model_pipeline

def process(prompt = str, model_pipeline = CodeGenerationPipeline, continue_count = int):
    gen_kwargs = {
    #    "temperature": model_pipeline.data.temperature,
        "max_new_tokens": 80 + continue_count * 15,
    #    "top_p": model_pipeline.data.top_p,
    #    "top_k": model_pipeline.data.top_k,
    }

    sum_kwargs = {
        "max_new_tokens": 36,
    }
    
    code_gen = model_pipeline.generate(prompt, **gen_kwargs)

    code_gen_only= code_gen.split("class Solution:")[1]
    code_sum = model_pipeline.summarize(code_gen_only if code_gen_only else code_gen, **sum_kwargs)

    return {"code": code_gen, "summary": code_sum}

