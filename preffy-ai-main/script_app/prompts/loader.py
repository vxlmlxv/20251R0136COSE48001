from ..core.config import (
    settings
)


def get_prompt(
    service_name: str = "script_analysis",
    function_name: str = "speech_act",
    prompt_version: str = "1.0",
    prompt_type: str = "system",
) -> dict[str, str]:
    prompt_path = (
        settings.ROOT_DIR
        / "prompts"
        / service_name
        / function_name
        / prompt_version
        / f"{prompt_type}.txt"
    )
    return open(prompt_path, encoding="utf-8").read()