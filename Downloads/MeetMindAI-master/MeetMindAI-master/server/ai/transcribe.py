from faster_whisper import WhisperModel
import sys

audio_path = sys.argv[1]

model = WhisperModel(
    "base",
    device="cpu",
    compute_type="int8"
)

segments, info = model.transcribe(audio_path)

transcript = ""

for segment in segments:
    transcript += segment.text + " "

print(transcript.strip())