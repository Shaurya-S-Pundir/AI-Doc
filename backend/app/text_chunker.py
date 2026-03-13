import os
from typing import List, Dict
import nltk

import pdfplumber
from docx import Document

import nltk

try:
    from nltk.tokenize import sent_tokenize
    sent_tokenize("Test sentence.")
except LookupError:
    nltk.download('punkt_tab')
    from nltk.tokenize import sent_tokenize

from nltk.tokenize import sent_tokenize

def extract_text(file_path: str) -> str:
   #Extract text from PDF, TXT file
    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".pdf":
        text = ''
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() + "\n"
        return text

    elif ext == ".docx":
        doc = Document(file_path)
        return "\n".join([p.text for p in doc.paragraphs])
    
    elif ext == ".txt":
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    
    else:
        raise ValueError(f"Unsupported file type: {ext}")

def chunk_text(text: str, max_tokens: int = 500) -> List[str]:
    sentences = sent_tokenize(text)
    chunks = []
    current_chunk = ""
    current_tokens = 0

    for sentence in sentences:
        # Approximate token count by word count; replace with tokenizer if precise
        sentence_tokens = len(sentence.split())
        
        if current_tokens + sentence_tokens > max_tokens:
            if current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = sentence
            current_tokens = sentence_tokens
        else:
            current_chunk += " " + sentence
            current_tokens += sentence_tokens
    
    if current_chunk:
        chunks.append(current_chunk.strip())
    
    return chunks

def file_to_chunks(file_path: str, max_tokens: int = 500) -> List[Dict]:
    """Extract text from a file and split into chunks with metadata."""
    text = extract_text(file_path)
    chunks = chunk_text(text, max_tokens)
    
    return [{"chunk": c, "source_file": os.path.basename(file_path)} for c in chunks]


# Example usage
if __name__ == "__main__":
    test_file = "example.pdf"  # replace with your test file
    chunks = file_to_chunks(test_file)
    print(f"Generated {len(chunks)} chunks from {test_file}")
    for i, c in enumerate(chunks[:3]):
        print(f"\n--- Chunk {i+1} ---\n{c['chunk'][:300]}...")  # preview first 300 chars

