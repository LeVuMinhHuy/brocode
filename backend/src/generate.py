from .model.codegen import CodeGenerationPipeline
from .classes import ModelData

def init_model(model_data = ModelData):
    model_pipeline = CodeGenerationPipeline(model_data)

    model_pipeline.load_model_generate()
    model_pipeline.load_model_summarize()

    return model_pipeline

def process(prompt = str, model_pipeline = CodeGenerationPipeline):
    gen_kwargs = {
    #    "temperature": model_pipeline.data.temperature,
        "max_new_tokens": 200,
    #    "top_p": model_pipeline.data.top_p,
    #    "top_k": model_pipeline.data.top_k,
    }

    sum_kwargs = {
        "max_new_tokens": 100,
    }
    
    code_gen = model_pipeline.generate(prompt, **gen_kwargs)
    code_sum = model_pipeline.summarize(code_gen, **sum_kwargs)

    return {"code": code_gen, "summary": code_sum}

