import os
import re
import argparse
from tqdm import tqdm
from transformers import pipeline, set_seed
from transformers import AutoTokenizer, AutoModelForCausalLM
from transformers.pipelines.base import Pipeline
from classes import ModelData

class CodeGenerationPipeline:
    def __init__(self, data = ModelData):
        self.data = data

    def load_generation_pipe(self):
        model = AutoModelForCausalLM.from_pretrained(self.data.model)
        tokenizer = AutoTokenizer.from_pretrained(self.data.model)
    
        pipe = pipeline(
            'text-generation',
            model=model,
            tokenizer=tokenizer,
            device="cpu" # Have no CUDA installed https://discuss.huggingface.co/t/is-transformers-using-gpu-by-default/8500
        )
    
        print("load generation pipeline from {} over, vocab size = {}, eos id = {}, gpu device = {}.".format(
            self.data.model , len(tokenizer), tokenizer.eos_token_id, self.data.gpu_device)
        )
    
        self.pipe = pipe
    
    def extract_function_block(string):
        return re.split("\nclass|\ndef|\n#|\n@|\nprint|\nif", string)[0].rstrip()
    
    def run_code_generation(self, prompt, **gen_kwargs):
        set_seed(123)
    
        code_gens = self.pipe(prompt,
            num_return_sequences= kwargs.get('num_completions'),
            **gen_kwargs
        )
    
        return [extract_function_block(code_gen["generated_text"][len(prompt):]) for code_gen in code_gens]
