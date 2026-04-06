from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import json
import re
#from openai import OpenAI
from google import genai
from pydantic import Field

# Load environment variables
load_dotenv()
print(f"Key loaded: {os.getenv('GEMINI_API_KEY')[:5]}...")
#client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI(title="AI Prototype Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisResponse(BaseModel):
    summary: str
    requirements: list[str] = Field(
        min_length=1, 
        max_length=5, 
        description="Exactly 5 key technical requirements."
    )
    features: list[str] = Field(
        min_length=1, 
        max_length=5, 
        description="Exactly 5 proposed product features."
    )
    success_metrics: list[str] = Field(
        max_length=5, 
        description="5 measurable KPIs to track success (e.g., 'Reduce latency by 20%')."
    )


class RequestData(BaseModel):
    input: str

@app.post("/analyze", response_model=AnalysisResponse)
def analyze(req: RequestData):
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash", 
            contents=f"Analyze the following customer problem: {req.input}",
            config={
                "response_mime_type": "application/json",
                "response_schema": AnalysisResponse,
                "system_instruction": "You are an expert product engineer."
                 "Provide a high-level summary, then list EXACTLY 5 requirements and EXACTLY 5 features "
                 "and 5 measurable success metrics (KPIs)."
                 "Be concise and technical. "
            }
        )

        # Access the parsed object directly
        if not response.parsed:
            raise HTTPException(status_code=502, detail="AI returned empty response")
        return response.parsed

    except Exception as e:
        print(f"ACTUAL ERROR: {type(e).__name__}: {e}") 
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def root():
    return {"message": "Backend is running"}
