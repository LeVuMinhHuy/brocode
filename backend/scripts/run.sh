#!/bin/bash

pip install -r requirements.txt
cd src
uvicorn main:app --reload
