import asyncio
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from starlite import Response, status_codes

from .endpoints import (
    script
)

router = APIRouter(
    prefix="/api/v1"
)

router.include_router(
    script.router
)