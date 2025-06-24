import tempfile
from typing import List
import httpx
import os
import json

from ..core.element import ScriptSentence
from tqdm.asyncio import tqdm

VIDEO_DB_PATH = os.path.join(tempfile.gettempdir(), "video_db.json")

class VideoDB:
    _instance = None
    _db = {}

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(VideoDB, cls).__new__(cls)
        return cls._instance

    def save(self, project_id: str, file_path: str, metadata: dict, script: List[ScriptSentence]) -> None:
        self._db[project_id] = {
            "file_path": file_path,
            "metadata": metadata,
            "script": script,
        }

    def get(self, project_id: str) -> dict:
        if project_id not in self._db:
            raise KeyError(f"Project ID '{project_id}' not found.")
        return self._db[project_id]

    def delete(self, project_id: str) -> None:
        if project_id not in self._db:
            raise KeyError(f"Project ID '{project_id}' not found.")
        del self._db[project_id]

    def reset(self) -> None:
        # Delete all video files and clear the DB
        for video in self._db.values():
            file_path = video.get("file_path")
            if file_path and os.path.exists(file_path):
                try:
                    os.remove(file_path)
                except Exception:
                    pass
        self._db.clear()

video_db = VideoDB()

def save_video_information(project_id: str, file_path: str, metadata: dict, script: List[ScriptSentence]) -> None:
    """비디오 id와 파일 경로 및 메타데이터를 저장"""
    video_db.save(project_id, file_path, metadata, script)

def get_video_information(project_id: str) -> dict:
    """비디오 id로 파일 경로 및 메타데이터를 반환"""
    return video_db.get(project_id)

async def download_video(video_url: str) -> str:
    """비디오 다운로드 (진행률 표시)"""
    if video_url.startswith("gs://"):
        # Handle Google Cloud Storage download
        try:
            from google.cloud import storage
        except ImportError:
            raise ImportError("google-cloud-storage library is required for gs:// URLs. Install with 'pip install google-cloud-storage'.")

        # Parse bucket and blob name
        path = video_url[5:]
        bucket_name, blob_name = path.split("/", 1)
        suffix = os.path.splitext(blob_name)[-1] or ".mp4"
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
        temp_file.close()
        
        client = storage.Client()
        bucket = client.bucket(bucket_name)
        blob = bucket.blob(blob_name)
        blob.download_to_filename(temp_file.name)
        return temp_file.name

    try:
        async with httpx.AsyncClient(timeout=300.0) as client:
            async with client.stream("GET", video_url) as response:
                response.raise_for_status()

                suffix = '.mp4'
                content_type = response.headers.get('content-type', '')
                if 'webm' in content_type:
                    suffix = '.webm'
                elif 'avi' in content_type:
                    suffix = '.avi'

                total = int(response.headers.get('content-length', 0))
                with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
                    downloaded = 0
                    async for chunk in tqdm(response.aiter_bytes(chunk_size=8192), total=total // 8192 + 1, desc="Downloading video"):
                        temp_file.write(chunk)
                        downloaded += len(chunk)
                    return temp_file.name 

    except Exception as e:
        raise Exception(f"Failed to download video: {str(e)}")




## def save

# 테스트용 dummy_video 예시 데이터 생성
dummy_script = [
    ScriptSentence(
        index=i,
        speaker="발표자",
        content=content,
        timestamp=None
    )
    for i, content in enumerate([
        "안녕하세요!",
        "오늘 발표를 맡게된 제 이름은 오원준입니다!",
        "여러분들 GPT를 사용해 보신 적이 있으신가요?",
        "저는 자주쓰는데요, 정말 유용한 것 같아요.",
        "아마 여러분들도 일상 생활에서, 과제를하면서, 혹은 발표를 준비할 때 많이 사용하실 것 같아요.",
        "그래서 오늘은 GPT에 대해서 발표해 보려고 합니다.",
        "GPT는 Generative Pre-trained Transformer의 약자로, 자연어 처리 분야에서 혁신적인 모델입니다.",
        "이 모델은 대량의 텍스트 데이터를 학습하여, 주어진 입력에 대해 자연스러운 언어로 응답할 수 있는 능력을 가지고 있습니다.",
        "BERT는 Bidirectional Encoder Representations from Transformers의 약자로, 주로 문장 이해에 초점을 맞춘 모델입니다.",
        "GPT는 텍스트 생성, 번역, 요약, 질문 응답 등 다양한 분야에서 사용되고 있습니다.",
        "텍스트 생성, 번역, 요약, 질문 응답은 어려운 문제입니다.",
        "여기까지 질문 있으신가요?",
        "질문이 없으시다면, 다음으로 넘어가겠습니다.",
        "그렇다면 새로나온 GPT-4는 어떤 점이 다를까요?",
        "GPT-4는 이전 모델들에 비해 더 많은 데이터와 더 깊은 네트워크 구조를 가지고 있습니다.",
        "이로 인해 더 정확하고 자연스러운 언어 생성이 가능해졌습니다.",
        "또한, GPT-4는 멀티모달 기능을 지원하여, 텍스트뿐만 아니라 이미지와 비디오 데이터도 처리할 수 있습니다.",
        "이러한 기능은 다양한 응용 프로그램에서 혁신적인 변화를 가져올 것으로 기대됩니다.",
        "이제 GPT-4의 활용 사례를 살펴보겠습니다.",
        "음... PT-4는 고객 지원 시스템에서 사용되어, 고객의 질문에 대한 신속하고 정확한 응답을 제공합니다.",
        "또한, 콘텐츠 생성 도구로 활용되어, 블로그 포스트, 기사, 소설 등의 다양한 콘텐츠를 자동으로 생성할 수 있습니다.",
        "마지막으로, GPT-4는 교육 분야에서도 활용될 수 있습니다.",
        "기술의 발전은 윤리적인 문제를 동반할 수 있습니다.",
        "예를 들어, AI가 생성한 콘텐츠의 저작권 문제, 개인정보 보호 문제 등이 있습니다. 맞죠?",
        "따라서, 이러한 문제를 해결하기 위한 연구와 논의가 필요합니다.",
        "음 우리는 개인정보 유출 문제, AI의 편향성 문제 등 다양한 윤리적 문제를 해결하기 위해 노력해야 합니다.",
        "이제 발표를 마치기 전에, GPT-4의 미래에 대해 이야기해 보겠습니다.",
        "GPT-4는 앞으로도 계속 발전할 것으로 예상됩니다.",
        "AI 기술은 계속해서 발전하고 있으며, GPT-4는 그 중 하나입니다.",
        "우리는 이러한 기술을 활용하여 더 나은 세상을 만들 수 있을 것입니다.",
        "다음 으로는, GPT-4의 한계에 대해 이야기해 보겠습니다.",
        "GPT-4는 여전히 몇 가지 한계를 가지고 있습니다.",
        "예를 들어, GPT는 여전히 인간의 감정을 이해하지 못합니다.",
        "또한, GPT는 여전히 인간의 창의성을 대체할 수 없습니다.",
        "따라서, AI는 인간의 보조 도구로 활용되어야 합니다.",
        "AI는 인간의 능력을 보완하고, 더 나은 결과를 도출하는 데 도움을 줄 수 있습니다.",
        "하지만, AI는 인간의 역할을 대체할 수 없습니다.",
        "우리는 AI와 인간이 협력하여 더 나은 결과를 도출할 수 있도록 노력해야 합니다.",
        "혹시 질문 있으신가요?",
        "질문이 없으시다면, 발표를 마치겠습니다.",
        "감사합니다!",
    ])
]

dummy_metadata = {
    "presentation_id": "12345",
    "formality": "formal",
    "target_audience": "general public",
    "tone": "informative"
}

save_video_information(
    project_id="dummy_video",
    file_path="/tmp/dummy_video.mp4",
    metadata=dummy_metadata,
    script=dummy_script
)