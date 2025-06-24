import os
import subprocess
import tempfile
from typing import List
from script_app.core.element import ScriptSentence

from ...core.config import settings

OPENAI_API_KEY = settings.OPENAI_API_KEY
OPENAI_API_URL = "https://api.openai.com/v1/audio/transcriptions"

def split_mp4(mp4_path: str, segment_length: int = 600, overlap: int = 5) -> List[str]:
    """
    mp4 파일을 segment_length(초) 단위로 분할하되, 각 구간마다 overlap(초)만큼 겹치게 분할하여 임시 파일 경로 리스트 반환
    """
    temp_dir = tempfile.mkdtemp()
    segment_paths = []
    # 전체 길이 추출
    cmd = [
        "ffprobe", "-v", "error", "-show_entries",
        "format=duration", "-of",
        "default=noprint_wrappers=1:nokey=1", mp4_path
    ]
    total_duration = float(subprocess.check_output(cmd).decode().strip())
    start = 0
    idx = 0
    while start < total_duration:
        output_path = os.path.join(temp_dir, f"segment_{idx:03d}.mp4")
        cmd = [
            "ffmpeg", "-y",
            "-ss", str(start),
            "-i", mp4_path,
            "-t", str(segment_length + overlap if start + segment_length + overlap < total_duration else total_duration - start),
            "-c", "copy",
            output_path
        ]
        subprocess.run(cmd, check=True)
        segment_paths.append(output_path)
        start += segment_length
        idx += 1
    return segment_paths

def transcribe_mp4_to_script_sentences(mp4_path: str, language: str = "ko") -> List[ScriptSentence]:
    """
    30분 이상의 mp4 파일도 처리 가능하도록 분할(겹침 포함) 후 Whisper API로 전사하여 ScriptSentence 리스트로 반환
    """
    segment_length = 600  # 10분
    overlap = 5          # 5초 겹침
    segment_paths = split_mp4(mp4_path, segment_length=segment_length, overlap=overlap)
    all_sentences: List[ScriptSentence] = []
    last_end_time = 0.0

    for segment_idx, segment_path in enumerate(segment_paths):
        sentences = transcribe_single_mp4(segment_path, language)
        filtered = []
        for s in sentences:
            # 겹치는 부분(이전 segment의 마지막 end_time 이전)은 제거
            start_time = float(s.timestamp.split('-')[0])
            if start_time >= last_end_time:
                filtered.append(s)
        if filtered:
            last_end_time = float(filtered[-1].timestamp.split('-')[1])
        # 인덱스 보정
        idx_offset = all_sentences[-1].index + 1 if all_sentences else 0
        for s in filtered:
            s.index += idx_offset
        all_sentences.extend(filtered)
    return all_sentences

def transcribe_single_mp4(mp4_path: str, language: str = "en") -> List[ScriptSentence]:
    """
    Whisper API로 단일 mp4 파일을 전사
    """
    import requests
    from script_app.core.element import ScriptSentence

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
    }
    with open(mp4_path, "rb") as f:
        files = {
            "file": (os.path.basename(mp4_path), f, "video/mp4"),
        }
        data = {
            "model": "whisper-1",
            "response_format": "verbose_json",
            "language": language,
            "timestamp_granularities[]": "segment"
        }
        print(f"Transcribing {mp4_path} with Whisper API...")
        response = requests.post(OPENAI_API_URL, headers=headers, files=files, data=data)
        response.raise_for_status()
        result = response.json()

    segments = result.get("segments", [])
    
    for seg in segments:
        print(f"Segment {seg.get('id', 'unknown')} - {seg.get('start', 0):.2f} to {seg.get('end', 0):.2f}: {seg.get('text', '')}")
    
    script_sentences = []
    for idx, seg in enumerate(segments):
        script_sentences.append(
            ScriptSentence(
                index=idx,
                speaker="발표자",
                content=seg.get("text", "").strip(),
                timestamp=f"{seg.get('start', 0):.2f}-{seg.get('end', 0):.2f}"
            )
        )
    return script_sentences