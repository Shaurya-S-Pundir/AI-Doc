from sentence_transformers import SentenceTransformer

class EmbeddingService:
    def __init__(self):
        print("Loading embedding model...")
        self.model = SentenceTransformer("all-MiniLM-L6-v2")


    def embed_chunks(self, chunks):
        return self.model.encode(chunks)

    def embed_query(self, query):
        return self.model.encode([query])[0]