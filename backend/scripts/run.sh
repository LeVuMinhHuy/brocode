#!/bin/bash

pip install -r requirements.cpu.txt
uvicorn src.main:app
