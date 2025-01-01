import os

import uvicorn
from agent import stream_graph
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

app = FastAPI()

# CORSミドルウェアを追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],  # 本番環境では適切なオリジンを指定してください
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Input(BaseModel):
    product_detail: str


@app.post("/api/stream_graph")
def api_stream_graph(input: Input):
    return StreamingResponse(
        stream_graph(input.product_detail), media_type="application/json; charset=utf-8"
    )


if __name__ == "__main__":
    # Default port of LWA is 8080
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", "8080")))
