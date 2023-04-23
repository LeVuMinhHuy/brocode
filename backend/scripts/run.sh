#!/bin/bash

pip install -r requirements.cpu.txt
uvicorn src.main:app --host 0.0.0.0 --port 8000
