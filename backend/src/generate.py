from .classes import GenerationData
from .model.codegen import CodeGenerationPipeline

def code_generation(data = GenerationData):
    model_pipeline = CodeGenerationPipeline(data.model_data)
    pipe = model_pipeline.load_generation_pipe()

    
    gen_kwargs = {
        "do_sample": True,
        "temperature": 0.8,
        "max_new_tokens": 150,
        "top_p": 0.9,
        "top_k": 0,
        "pad_token_id": pipe.tokenizer.pad_token_id if pipe.tokenizer.pad_token_id else pipe.tokenizer.eos_token_id,
        "eos_token_id": pipe.tokenizer.eos_token_id
    }
    
    code_gens = model_pipeline.run_code_generation(pipe, data.prompt, num_completions = 1, **gen_kwargs)

    if code_gens:
        return code_gens[0]
    else:
        return "Generation failed !"
