import torch
from peft import PeftModel, PeftConfig
from transformers import AutoModelForCausalLM, AutoTokenizer
from ..classes import ModelData

class CodeGenerationPipeline:
    def __init__(self, data = ModelData):
        self.data = data

    def load_model(self):
        config = PeftConfig.from_pretrained(self.data.model)
        model = AutoModelForCausalLM.from_pretrained(config.base_model_name_or_path, return_dict=True, load_in_8bit=True, device_map='auto')
        tokenizer = AutoTokenizer.from_pretrained(config.base_model_name_or_path)
    
        model = PeftModel.from_pretrained(model, self.data.model)

        return model

    def code_gen(self, prompt: str, **kwargs):
        batch = tokenizer(prompt, return_tensors='pt')
        
        with torch.cuda.amp.autocast():
            output_tokens = model.generate(**batch, **kwargs)
        
        return tokenizer.decode(output_tokens[0], skip_special_tokens=True)
