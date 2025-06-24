import json
import asyncio
import itertools
from pydantic import BaseModel, Field
from typing import Dict, List, Any

from .io import (
    FeedbackOutput,
)

from ...core.client import (
    async_openai_client,
)
from ...core.element import (
    ScriptSentence
)
from ...core.config import (
    settings
)
from ...prompts.loader import (
    get_prompt
)
from ...utils.llm_utils import (
    SingleTurnScriptLLM,
    SingleTurnScriptLLMWithSlidingWindow
)


WINDOW_SIZE = 4
WINDOW_OVERLAP = 0


all_in_one_feedback_system_prompt = get_prompt(
    service_name="script_feedback",
    function_name="all_in_one",
    prompt_version=settings.PARAPHRASE_PROMPT_VERSION,
    prompt_type="system",
)
all_in_one_feedback_user_prompt = get_prompt(
    service_name="script_feedback",
    function_name="all_in_one",
    prompt_version=settings.PARAPHRASE_PROMPT_VERSION,
    prompt_type="user",
)


class Feedback(SingleTurnScriptLLMWithSlidingWindow):
    def __init__(self):
        super().__init__(
            system_prompt=all_in_one_feedback_system_prompt,
            user_prompt=all_in_one_feedback_user_prompt,
            output_model=FeedbackOutput,
            window_size=WINDOW_SIZE,
            window_overlap=WINDOW_OVERLAP,
        )

    async def get_feedback(
        self, 
        script: List[ScriptSentence],
        metadata: Dict[str, Any],
    ) -> FeedbackOutput:
        output_with_dup = await self.do(
            script=script,
            metadata=metadata
        )

        return FeedbackOutput(
            output=output_with_dup
        )
        
    
if __name__ == "__main__":
    import asyncio
    from pprint import pprint

    script = [
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
    ]

    script = [
        ScriptSentence(
            index=i, content=c,
        ) for i, c in enumerate(script)
    ]

    elements = asyncio.run(Feedback().get_feedback(
        script, metadata={
            'Target Audience': 'professional',
            'Formality': 'formal',
        }
    ))
    for element in elements.output:
        print(f"Index: {element.index}")
        print(f"  Need Feedback: {element.need_feedback}")
        if element.feedback_detail:
            print(f"    - Audience/Formality Feedback: {element.feedback_detail.audience_and_formality_feedback}")
            print(f"    - Delivery Feedback: {element.feedback_detail.delivery_feedback}")
            print(f"    - Clarity Feedback: {element.feedback_detail.clarity_feedback}")
            print(f"    - Revised Sentence: {element.feedback_detail.revise_suggestion}")
        print("===")

# class ParaphraseFeedbackOutputElement(BaseModel):
#     index: int = Field(
#         ..., description="Index of the sentence in the script"
#     )
#     original: str = Field(
#         ..., description="The original sentence from the script"
#     )
#     suggestion: str = Field(
#         ..., description="The suggested revision for the sentence"
#     )
#     reason: str = Field(
#         ..., description="The reason for the suggested revision"
#     )