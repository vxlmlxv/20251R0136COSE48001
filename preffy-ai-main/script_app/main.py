from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi import Request
from fastapi import APIRouter
from fastapi import Depends
import atexit
from .utils.transcript_utils import video_db
import logging
import signal
import sys

from .api.v1 import (
    routers,
)
from .core import (
    config,
    exceptions
)


app = FastAPI(
    title=config.settings.PROJECT_NAME,
    description=config.settings.PROJECT_DESCRIPTION,
    version=config.settings.PROJECT_VERSION,
)


# Exception handlers
app.add_exception_handler(Exception, exceptions.general_exception_handler)
app.add_exception_handler(exceptions.HTTPException, exceptions.http_exception_handler)


# CORS settings
origins = [
    "http://localhost",
    "http://127.0.0.1",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}
    
# Include routers
app.include_router(
    routers.router
)

def on_shutdown(*args, **kwargs):
    video_db.reset()
    print("Application is shutting down. Video database has been reset.")

atexit.register(on_shutdown)

def handle_sigterm(signum, frame):
    on_shutdown()
    sys.exit(0)

signal.signal(signal.SIGINT, handle_sigterm)
signal.signal(signal.SIGTERM, handle_sigterm)