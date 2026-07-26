from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import json
import os
import sys

# Usage:
# python embed.py <meetingId> "<transcript>"

meeting_id = sys.argv[1]
transcript = sys.argv[2]

# Load embedding model
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# ---------- Chunking ----------
def chunk_text(text, chunk_size=200, overlap=50):
    words = text.split()

    chunks = []
    chunk_id = 0

    start = 0

    while start < len(words):

        end = min(start + chunk_size, len(words))

        chunk = " ".join(words[start:end])

        chunks.append({
            "chunkId": chunk_id,
            "text": chunk,
            "startWord": start,
            "endWord": end
        })

        chunk_id += 1
        start += chunk_size - overlap

    return chunks

chunks = chunk_text(transcript)

# ---------- Generate embeddings ----------
texts = [c["text"] for c in chunks]

embeddings = model.encode(texts)

dimension = embeddings.shape[1]

# ---------- Create vector store folder ----------
os.makedirs("vectorstore", exist_ok=True)

index_path = "vectorstore/faiss.index"
metadata_path = "vectorstore/metadata.json"

# ---------- Load existing index ----------
if os.path.exists(index_path):

    index = faiss.read_index(index_path)

    if os.path.exists(metadata_path):
        with open(metadata_path, "r") as f:
            metadata = json.load(f)
    else:
        metadata = []

else:

    index = faiss.IndexFlatL2(dimension)
    metadata = []

# ---------- Add vectors ----------
index.add(np.array(embeddings).astype("float32"))

# ---------- Save metadata ----------
for chunk in chunks:

    metadata.append({
        "meetingId": meeting_id,
        "chunkId": chunk["chunkId"],
        "text": chunk["text"],
        "startWord": chunk["startWord"],
        "endWord": chunk["endWord"]
    })

with open(metadata_path, "w") as f:
    json.dump(metadata, f, indent=4)

faiss.write_index(index, index_path)

print("Embeddings stored successfully.")