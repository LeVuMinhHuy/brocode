#!/bin/bash

pip install -r requirements.txt
uvicorn src.main:app
