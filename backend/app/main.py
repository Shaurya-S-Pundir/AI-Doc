from app.services.embedding_service import EmbeddingService
from app.api.routes import router
from pathlib import Path
from fastapi import UploadFile, File, FastAPI, Query
from app.text_chunker import extract_text, chunk_text
from app.services.vector_store import VectorStore

app = FastAPI(title="AI Doc Q&A", version="1.0.0")

embedding_service = None
vector_store = VectorStore()
app.include_router(router)

DOCS_DIR = Path(__file__).resolve().parent.parent.parent / "documents"
DOCS_DIR.mkdir(exist_ok=True)


@app.on_event("startup")
def load_model():
    global embedding_service
    embedding_service = EmbeddingService()

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/upload")
async def upload_file(file: UploadFile):
 
    file_path = DOCS_DIR/file.filename
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    text = extract_text(file_path)

    chunks = chunk_text(text)

    embeddings = embedding_service.embed_chunks(chunks)

    vector_store.add_embeddings(embeddings, chunks)

    return {"message": "Document uploaded and indexed"}

@app.post("/query")
async def ask_query(query: str = Query(...)):
    
    query_embedding = embedding_service.embed_query(query)
    results = vector_store.search(
        query_embedding,
        k=5
    )
    return results


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="[IP_ADDRESS]", port=8000)

