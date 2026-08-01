from sentence_transformers import SentenceTransformer
import faiss
import json
import sys
import os

# Usage:
# python retrieve.py "<question>" "<meetingId>"
#
# meetingId can be:
#   - actual MongoDB meeting id
#   - "all" (search across all meetings)

question = sys.argv[1]
meeting_id = sys.argv[2]

# Load embedding model
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VECTORSTORE_DIR = os.path.join(BASE_DIR, "..", "vectorstore")

index_path = os.path.join(VECTORSTORE_DIR, "faiss.index")
metadata_path = os.path.join(VECTORSTORE_DIR, "metadata.json")

# Check if vector store exists
if not os.path.exists(index_path) or not os.path.exists(metadata_path):
    print("[]")
    sys.exit()

# Load FAISS index
index = faiss.read_index(index_path)

# Load metadata
with open(metadata_path, "r", encoding="utf-8") as f:
    metadata = json.load(f)

# Create query embedding
query_embedding = model.encode([question]).astype("float32")

# Retrieve more candidates because some may belong to other meetings
k = min(10, len(metadata))

distances, indices = index.search(query_embedding, k)

results = []

for rank, idx in enumerate(indices[0]):

    if idx == -1:
        continue

    item = metadata[idx]

    # Skip other meetings unless searching all
    if meeting_id != "all" and item["meetingId"] != meeting_id:
        continue

    results.append({
        "meetingId": item["meetingId"],
        "chunkId": item["chunkId"],
        "text": item["text"],
        "startWord": item["startWord"],
        "endWord": item["endWord"],
        "score": float(distances[0][rank])
    })

# Return only top 5 filtered chunks
results = results[:5]

print(json.dumps(results, ensure_ascii=False))