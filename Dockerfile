FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
      curl \
      gnupg \
      ca-certificates \
      ffmpeg \
      && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
      && apt-get install -y --no-install-recommends nodejs \
      && rm -rf /var/lib/apt/lists/*

COPY server ./server
COPY client ./client

RUN pip install --no-cache-dir -r server/requirements.txt \
    && cd server && npm install --omit=dev \
    && cd ../client && npm install && npm run build

ENV NODE_ENV=production
ENV PORT=5000

WORKDIR /app/server

EXPOSE 5000

CMD ["node", "server.js"]
