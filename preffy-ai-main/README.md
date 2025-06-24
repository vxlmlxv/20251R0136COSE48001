python -m uvicorn script_app.main:app --host 0.0.0.0 --port 8000 --reload

PYTHONPATH=. pytest -s tests/script.py


TODO:
피드백 인덱스가 겹칠 경우 대비할,
중복처리 모듈 만들어야함.