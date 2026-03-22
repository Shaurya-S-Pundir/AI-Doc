import faiss
import numpy as np

class VectorStore:
    def __init__(self, dimension=384):
        self.index = faiss.IndexFlatL2(dimension)
        self.text_chunks = []

    def add_embeddings(self, embeddings, chunks):
        self.index.add(np.array(embeddings))
        self.text_chunks.extend(chunks)

    def search(self, query_embedding, k=5):
        distances, indices = self.index.search(
            np.array([query_embedding]), k
        )

        results = []
        for i in indices[0]:
            if i != -1 and i < len(self.text_chunks):
                results.append(self.text_chunks[i])

        return results