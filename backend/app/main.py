from fastapi import FastAPI
from app.api.routes import router
from pathlib import Path
from fastapi import UploadFile, File
from app.text_chunker import file_to_chunks

app = FastAPI(title="AI Doc Q&A", version="1.0.0")

app.include_router(router)

DOCS_DIR = Path(__file__).resolve().parent.parent.parent / "documents"
DOCS_DIR.mkdir(exist_ok=True)


    

@app.get("/health")
def health_check():
    return {"status": "ok"}



@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = DOCS_DIR / file.filename
    with open(file_path, "wb") as f:
        f.write(await file.read())
    chunks = file_to_chunks(file_path)

    return {
        "filename": file.filename, 
        "status": "uploaded",
        "chunks_preview": [c['chunk'][:200] for c in chunks]
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="[IP_ADDRESS]", port=8000)

