#!/usr/bin/env python3
"""Zoetrope — human-like voiceover synthesis, tiered.

Usage:
  python3 voiceover.py script.txt --out voiceover.mp3 [--voice aria] [--rate -4%] [--pitch +0Hz]
                      [--engine auto|elevenlabs|edge|openai] [--timings timings.json]

Script format: one line per beat (blank lines ignored). Line breaks define beat
boundaries; per-line and per-word timings are written to --timings (JSON) so
Remotion scenes and captions can sync to the real audio.

Engine tiers (auto): ElevenLabs (ELEVENLABS_API_KEY) -> edge-tts (free default)
-> OpenAI (OPENAI_API_KEY).
"""
import argparse, asyncio, json, os, sys, urllib.request

VOICES = {
    # Multilingual "HD" neural voices — noticeably more human than the single-language ones
    "andrew": "en-US-AndrewMultilingualNeural",
    "ava": "en-US-AvaMultilingualNeural",
    "brian": "en-US-BrianMultilingualNeural",
    "emma": "en-US-EmmaMultilingualNeural",
    # Classic single-language voices (fallback / lighter)
    "aria": "en-US-AriaNeural", "guy": "en-US-GuyNeural",
    "jenny": "en-US-JennyNeural", "christopher": "en-US-ChristopherNeural",
    "sonia": "en-GB-SoniaNeural", "ryan": "en-GB-RyanNeural",
}
ELEVEN_VOICES = {  # friendly alias -> well-known public voice id
    "rachel": "21m00Tcm4TlvDq8ikWAM", "domi": "AZnzlk1XvdvUeBnXmlld",
    "bella": "EXAVITQu4vr4xnSDxMaL", "josh": "TxGEqnHWrfWFTfGW9XjX",
    "adam": "pNInz6obpgDQGcFmaJgB",
}


def read_lines(path):
    with open(path, encoding="utf-8") as f:
        lines = [l.strip() for l in f.read().splitlines()]
    return [l for l in lines if l]


def synth_edge(lines, voice, rate, pitch, out, timings_path):
    try:
        import edge_tts
    except ImportError:
        sys.exit("edge-tts missing. Run: python3 -m pip install edge-tts")
    voice = VOICES.get(voice, voice)
    import tempfile, wave, struct  # noqa: F401

    async def run():
        segments, all_words, offset_ms = [], [], 0.0
        part_files = []
        for i, line in enumerate(lines):
            part = f"{out}.part{i}.mp3"
            comm = edge_tts.Communicate(line, voice, rate=rate, pitch=pitch, boundary="WordBoundary")
            words = []
            with open(part, "wb") as fh:
                async for chunk in comm.stream():
                    if chunk["type"] == "audio":
                        fh.write(chunk["data"])
                    elif chunk["type"] == "WordBoundary":
                        words.append({
                            "word": chunk["text"],
                            "startMs": offset_ms + chunk["offset"] / 10000,
                            "endMs": offset_ms + (chunk["offset"] + chunk["duration"]) / 10000,
                        })
            part_files.append(part)
            if words:
                dur = words[-1]["endMs"] - offset_ms
            else:
                dur = 0
            segments.append({"index": i, "text": line,
                             "startMs": offset_ms, "endMs": offset_ms + dur})
            all_words.extend(words)
            offset_ms += dur  # sentence-final pauses inside each line give natural spacing
        # concat mp3 parts (mp3 frames concatenate cleanly for same settings)
        with open(out, "wb") as o:
            for p in part_files:
                with open(p, "rb") as fh:
                    o.write(fh.read())
                os.remove(p)
        return segments, all_words, offset_ms

    segments, words, total = asyncio.run(run())
    if timings_path:
        with open(timings_path, "w", encoding="utf-8") as f:
            json.dump({"engine": "edge-tts", "voice": voice, "durationMs": total,
                       "segments": segments, "words": words}, f, indent=2, ensure_ascii=False)
    print(f"[edge-tts] {voice} -> {out} ({total/1000:.1f}s, {len(lines)} beats)")


def synth_elevenlabs(lines, voice, out, timings_path):
    key = os.environ.get("ELEVENLABS_API_KEY")
    if not key:
        sys.exit("ELEVENLABS_API_KEY not set")
    voice_id = ELEVEN_VOICES.get(voice, voice if voice not in VOICES else ELEVEN_VOICES["rachel"])
    # Use the with-timestamps endpoint to keep word sync.
    import base64
    segments, all_words, offset_ms = [], [], 0.0
    audio = b""
    for i, line in enumerate(lines):
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/with-timestamps?output_format=mp3_44100_128"
        body = json.dumps({
            "text": line, "model_id": "eleven_multilingual_v2",
            "voice_settings": {"stability": 0.45, "similarity_boost": 0.75, "style": 0.4},
        }).encode()
        req = urllib.request.Request(url, data=body, method="POST",
            headers={"xi-api-key": key, "Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=120) as r:
            data = json.loads(r.read())
        audio += base64.b64decode(data["audio_base64"])
        align = data.get("normalized_alignment") or {}
        chars, cstarts, cends = align.get("characters", []), align.get("character_start_times_seconds", []), align.get("character_end_times_seconds", [])
        # rebuild word timings from char alignment
        words, cur, wstart = [], "", None
        for ch, cs, ce in zip(chars, cstarts, cends):
            if ch.strip() == "":
                if cur:
                    words.append({"word": cur, "startMs": offset_ms + wstart * 1000, "endMs": offset_ms + ce * 1000})
                    cur, wstart = "", None
            else:
                if wstart is None: wstart = cs
                cur += ch
        if cur:
            words.append({"word": cur, "startMs": offset_ms + wstart * 1000, "endMs": offset_ms + cends[-1] * 1000})
        dur = (cends[-1] if cends else 0) * 1000
        segments.append({"index": i, "text": line, "startMs": offset_ms, "endMs": offset_ms + dur})
        all_words.extend(words)
        offset_ms += dur  # concatenated audio has no extra gap; keep timings honest
    with open(out, "wb") as f:
        f.write(audio)
    if timings_path:
        with open(timings_path, "w", encoding="utf-8") as f:
            json.dump({"engine": "elevenlabs", "voice": voice_id, "durationMs": offset_ms,
                       "segments": segments, "words": all_words}, f, indent=2, ensure_ascii=False)
    print(f"[elevenlabs] {voice_id} -> {out} ({offset_ms/1000:.1f}s, {len(lines)} beats)")


def synth_openai(lines, voice, out, timings_path):
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        sys.exit("OPENAI_API_KEY not set")
    voice = voice if voice not in VOICES else "alloy"
    audio = b""
    for line in lines:
        body = json.dumps({"model": "gpt-4o-mini-tts", "input": line, "voice": voice,
                           "instructions": "Sound like a confident, warm human narrator for a product video."}).encode()
        req = urllib.request.Request("https://api.openai.com/v1/audio/speech", data=body, method="POST",
            headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=120) as r:
            audio += r.read()
    with open(out, "wb") as f:
        f.write(audio)
    print(f"[openai-tts] {voice} -> {out}. Note: no word timings from this engine; run transcribe_captions.mjs for captions.")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("script")
    p.add_argument("--out", default="voiceover.mp3")
    p.add_argument("--voice", default="andrew")
    p.add_argument("--rate", default="-6%")
    p.add_argument("--pitch", default="+0Hz")
    p.add_argument("--engine", default="auto", choices=["auto", "elevenlabs", "edge", "openai"])
    p.add_argument("--timings", default=None)
    a = p.parse_args()

    lines = read_lines(a.script)
    if not lines:
        sys.exit("script is empty")
    timings = a.timings or os.path.splitext(a.out)[0] + ".timings.json"

    engine = a.engine
    if engine == "auto":
        if os.environ.get("ELEVENLABS_API_KEY"):
            engine = "elevenlabs"
        else:
            engine = "edge"
    if engine == "elevenlabs":
        synth_elevenlabs(lines, a.voice, a.out, timings)
    elif engine == "openai":
        synth_openai(lines, a.voice, a.out, timings)
    else:
        synth_edge(lines, a.voice, a.rate, a.pitch, a.out, timings)


if __name__ == "__main__":
    main()
