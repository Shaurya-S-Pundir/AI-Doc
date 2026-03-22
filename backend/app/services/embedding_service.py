from sentence_transformers import SentenceTransformer
from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv

class EmbeddingService:
    def __init__(self):
        load_dotenv()

        print("Loading embedding model...")
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

        self.llm = ChatGroq(
            model="llama-3.3-70b-versatile"
        )

    def embed_chunks(self, chunks):
        return self.model.encode(chunks).tolist()

    def embed_query(self, query):
        return self.model.encode(query).tolist()