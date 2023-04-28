import torch
from peft import PeftModel, PeftConfig
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig, AutoModelForSeq2SeqLM
from ..classes import ModelData

class CodeGenerationPipeline:
    def __init__(self, data = ModelData):
        self.data = data

    def load_model_generate(self):
        config = PeftConfig.from_pretrained(self.data.model_generate)

        quantization_config = BitsAndBytesConfig(llm_int8_enable_fp32_cpu_offload=True)

        model_generate = AutoModelForCausalLM.from_pretrained(
                config.base_model_name_or_path, 
                return_dict=True, 
                load_in_8bit=True, 
                quantization_config=quantization_config,
                #device_map="auto",
                offload_folder = "./offload"
        )

        self.tokenizer_generate = AutoTokenizer.from_pretrained(config.base_model_name_or_path)
    
        model_generate = PeftModel.from_pretrained(model_generate, self.data.model_generate)

        model_generate = model_generate.merge_and_unload()
        model_generate.config.use_cache = True

        self.model_generate = model_generate

    def generate(self, prompt: str, **kwargs):
        batch = self.tokenizer_generate(prompt, return_tensors='pt')
        
        with torch.cuda.amp.autocast():
            output_tokens = self.model_generate.generate(**batch, **kwargs)
        
        return self.tokenizer_generate.decode(output_tokens[0], skip_special_tokens=True)


    def load_model_summarize(self):
        config = PeftConfig.from_pretrained(self.data.model_summarize)

        quantization_config = BitsAndBytesConfig(llm_int8_enable_fp32_cpu_offload=True)

        model_summarize = AutoModelForSeq2SeqLM.from_pretrained(
                config.base_model_name_or_path, 
                return_dict=True, 
                load_in_8bit=True, 
                quantization_config=quantization_config,
                #device_map="auto",
                offload_folder = "./offload"
        )

        self.tokenizer_summarize = AutoTokenizer.from_pretrained(config.base_model_name_or_path)
    
        model_summarize = PeftModel.from_pretrained(model_summarize, self.data.model_summarize)

        model_summarize = model_summarize.merge_and_unload()
        model_summarize.config.use_cache = True

        self.model_summarize = model_summarize

    def summarize(self, generated_code: str, **kwargs):
        batch = self.tokenizer_summarize(generated_code, return_tensors='pt')
        
        with torch.cuda.amp.autocast():
            output_tokens = self.model_summarize.generate(**batch, **kwargs)
        
        return self.tokenizer_summarize.decode(output_tokens[0], skip_special_tokens=True)

