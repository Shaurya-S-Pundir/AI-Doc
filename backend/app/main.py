from app.services.embedding_service import EmbeddingService
from app.api.routes import router
from pathlib import Path
from fastapi import UploadFile, FastAPI, Query
from app.text_chunker import extract_text, chunk_text
from app.services.vector_store import VectorStore
from pydantic import BaseModel
from typing import List
from langchain_text_splitters import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,      # 300–500 sweet spot
    chunk_overlap=100    # keeps context continuity
)

# Request schema
class QueryRequest(BaseModel):
    query: str

# App init
app = FastAPI(title="AI Doc Q&A", version="1.0.0")

# Services
embedding_service = EmbeddingService()
vector_store = VectorStore()

app.include_router(router)

# Documents folder
DOCS_DIR = Path(__file__).resolve().parent.parent.parent / "documents"
DOCS_DIR.mkdir(exist_ok=True)

# Health check
@app.get("/health")
def health_check():
    return {"status": "ok"}

# Upload endpoint
@app.post("/upload")
async def upload_file(file: UploadFile):
    file_path = DOCS_DIR / file.filename

    # 1. Save file
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    # 2. Extract text
    text = extract_text(file_path)

    # 3. Better chunking ✅
    chunks = text_splitter.split_text(text)

    # 4. Generate embeddings
    embeddings = embedding_service.embed_chunks(chunks)

    # 5. Store in vector DB
    vector_store.add_embeddings(embeddings, chunks)

    return {
        "message": "Document uploaded and indexed",
        "chunks": len(chunks)
    }
# Query endpoint
@app.post("/query")
async def ask_query(request: QueryRequest):
    query = request.query

    # ✅ Check cache first
    if query in cache:
        return {"answer": cache[query]}

    query_embedding = embedding_service.embed_query(query)
    docs = vector_store.search(query_embedding, k=10)

    if not docs:
        return {"answer": "Answer not found in the document."}

    top_chunks = docs[:4]
    context = "\n\n".join(top_chunks)

    prompt = f"""
You are an AI assistant.

Answer ONLY using the provided context.
If the answer is not in the context, say:
"Answer not found in the document."

Context:
{context}

Question:
{query}

Answer:
"""

    response = llm.invoke(prompt)
    answer = response.content.strip()

    # ✅ Save to cache
    cache[query] = answer
    print("QUERY:", query)
    print("CHUNKS RETRIEVED:", len(docs))
    print("TOP CHUNKS:", top_chunks[:2])  # preview

    return {"answer": answer}