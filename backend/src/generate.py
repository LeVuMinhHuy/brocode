from .classes import GenerationData
from .model.codegen import CodeGenerationPipeline

def code_generation(data = GenerationData):
    model_pipeline = CodeGenerationPipeline(data.model_data)
    model = model_pipeline.load_model()

    gen_kwargs = {
        "temperature": data.temperature,
        "max_new_tokens": data.max_new_tokens,
        "top_p": data.top_p,
        "top_k": data.top_k,
    }
    
    code_gen = model_pipeline.generate(data.prompt, **gen_kwargs)

    if code_gen:
        return code_gen
    else:
        return "Generation failed !"
