import os
import re
import argparse
from tqdm import tqdm
from transformers import pipeline, set_seed
from transformers import AutoTokenizer, AutoModelForCausalLM
from transformers.pipelines.base import Pipeline
from ..classes import ModelData

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
            device_map="auto"
          )

        return pipe
    
    def extract_function_block(self, string):
        return re.split("\nclass|\ndef|\n#|\n@|\nprint|\nif", string)[0].rstrip()
    
    def run_code_generation(self, pipe, prompt, num_completions = 1, **gen_kwargs):
        set_seed(123)

        code_gens = pipe(prompt,
            num_return_sequences = num_completions,
            **gen_kwargs
        )
    
        return [self.extract_function_block(code_gen["generated_text"][len(prompt):]) for code_gen in code_gens]
