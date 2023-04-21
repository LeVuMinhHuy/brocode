-   [FastAPI](https://fastapi.tiangolo.com/)
-   [PyCodeGPT](https://github.com/microsoft/PyCodeGPT) shoutout Microsoft I guess

## TODO

-   [ ] [P-tuning v2](https://github.com/THUDM/P-tuning-v2) tuning the PyCodeGPT LLM with P-tuning v2
-   [ ] [AlphaCode Dataset](https://github.com/deepmind/code_contests) using this downstream dataset
-   [ ] Apply langchain and pinecone to store solutions, then user can ask about existed problems

## How to run

you should have a [virtualenv](https://virtualenv.pypa.io/en/latest/), although it optional

if you didn't install virtualenv, run only step 3

```
1. virtualenv backend
2. source backend/bin/activate
3. ./scripts/run.sh
```

then open your `http://localhost:8000/docs`
