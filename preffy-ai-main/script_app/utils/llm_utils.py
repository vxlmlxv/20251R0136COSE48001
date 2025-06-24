import asyncio
import json
from typing import List, Dict, Any
from pydantic import BaseModel

from ..core.client import (
    async_openai_client,
)
from ..core.element import (
    ScriptSentence,
)
from ..core.config import (
    settings,
)
from .utils import (
    sliding_window,
)


class SingleTurnScriptLLM:
    
    def __init__(
        self, 
        system_prompt: str, user_prompt: str,
        output_model: type
    ):
        self.system_prompt = system_prompt
        self.user_prompt = user_prompt
        
        self.output_model = output_model
        if not issubclass(self.output_model, BaseModel):
            raise ValueError("output_model must be a subclass of BaseModel")
        if "output" not in getattr(self.output_model, "__fields__", {}):
            raise ValueError("output_model must have an 'output' field")
 
    async def do(
        self,
        script: List[ScriptSentence],
        metadata: Dict[str, Any],
    ):
        metadata_str = ""
        for key, value in metadata.items():
            if isinstance(value, str):
                metadata_str += f"|{key}|{value}|\n"
            else:
                metadata_str += f"|{key}|{json.dumps(value)}|\n"

        script_str = ""
        script_str += "|index|content|\n"
        script_str += "|---|---|\n"
        for s in script:
            script_str += f"|{s.index}|{s.content}|\n"
        
        output = await async_openai_client.beta.chat.completions.parse(
            model=settings.OPENAI_MODEL_NAME,
            messages=[
                {
                    "role": "system", 
                    "content": self.system_prompt
                },
                {
                    "role": "user", 
                    "content": self.user_prompt.format(
                        script=script_str, metadata=metadata_str
                    )
                },
            ],
            temperature=0,
            response_format=self.output_model
        )
        
        output = output.choices[0].message.parsed.output
        
        return output


class SingleTurnScriptLLMWithSlidingWindow:
    
    def __init__(
        self, 
        system_prompt: str, user_prompt: str,
        output_model: type,
        window_size: int, window_overlap: int
    ):
        self.system_prompt = system_prompt
        self.user_prompt = user_prompt
        
        self.output_model = output_model
        if not issubclass(self.output_model, BaseModel):
            raise ValueError("output_model must be a subclass of BaseModel")
        if "output" not in getattr(self.output_model, "__fields__", {}):
            raise ValueError("output_model must have an 'output' field")
        
        self.window_size = window_size
        self.window_overlap = window_overlap
        
        self._seen_indices = set()  # To track seen indices across windows
 
    async def _do_window(
        self,
        script: List[ScriptSentence],
        metadata: Dict[str, Any],
    ):
        metadata_str = ""
        for key, value in metadata.items():
            if isinstance(value, str):
                metadata_str += f"|{key}|{value}|\n"
            else:
                metadata_str += f"|{key}|{json.dumps(value)}|\n"

        script_str = ""
        script_str += "|index|content|\n"
        script_str += "|---|---|\n"
        for s in script:
            script_str += f"|{s.index}|{s.content}|\n"
        
        # Debugging output
        # print(self.system_prompt)
        # print(self.user_prompt.format(
        #     script=script_str, metadata=metadata
        # ))
        
        output = await async_openai_client.beta.chat.completions.parse(
            model=settings.OPENAI_MODEL_NAME,
            messages=[
                {
                    "role": "system", 
                    "content": self.system_prompt
                },
                {
                    "role": "user", 
                    "content": self.user_prompt.format(
                        script=script_str, metadata=metadata_str
                    )
                },
            ],
            temperature=0,
            response_format=self.output_model
        )
        
        output = output.choices[0].message.parsed.output
        
        if isinstance(output, list) and all(hasattr(item, "index") for item in output):
            # Remove overlapping elements based on index except for the first window
            if hasattr(self, "_seen_indices"):
                output = [item for item in output if item.index not in self._seen_indices]
                self._seen_indices.update(item.index for item in output)
        
        return output
    
    async def do(
        self,
        script: List[ScriptSentence],
        metadata: Dict[str, Any],
    ):

        tasks = []
        for window in sliding_window(
            script, 
            window_size=self.window_size, 
            window_overlap=self.window_overlap,
            include_last_window=True
        ):
            tasks.append(
                self._do_window(
                    script=window,
                    metadata=metadata
                )
            )
            
        output = await asyncio.gather(*tasks)
        if isinstance(output, list) and all(isinstance(item, list) for item in output):
            # Flatten the list of lists into a single list
            output = sum(output, [])
        elif isinstance(output, list) and all(isinstance(item, self.output_model) for item in output):
            # If output is already a flat list of output_model instances, no need to flatten
            pass
        
        return output
    
    
if __name__ == "__main__":
    
    import asyncio
    from ..core.element import ScriptSentence
    from pydantic import BaseModel

    async def main():
        
        class DummyOutputModel(BaseModel):
            output: str
        
        script = [
            ScriptSentence(index=0, content="Hello, how are you?"),
            ScriptSentence(index=1, content="I am fine, thank you!"),
            ScriptSentence(index=2, content="What about you?"),
        ]
        metadata = {"author": "John Doe", "date": "2023-10-01"}
        
        llm = SingleTurnScriptLLMWithSlidingWindow(
            system_prompt="opinion about the sentences in the script.",
            user_prompt="Here is the script:\n{script}\nMetadata:\n{metadata}",
            output_model=DummyOutputModel,
            window_size=2,
            window_overlap=1
        )
        
        output = await llm.do(script, metadata)
        print(output)

    asyncio.run(main())