#!/usr/bin/env python3
"""Zoetrope — final audio mix: voice + ducked music bed + SFX, loudness-normalized.

Usage:
  python3 mix_audio.py --voice voice.mp3 [--music bed.wav] [--sfx-plan sfx-plan.json]
                       [--music-db -20] [--sfx-db -10] [--lufs -14] --out mix.wav

sfx-plan.json: [{"file": "whoosh.wav", "at": 1.5}, ...]  (seconds)
Requires ffmpeg on PATH.
"""
import argparse, json, os, subprocess, sys, tempfile


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit(f"ffmpeg failed:\n{r.stderr[-2000:]}")
    return r


def duration(path):
    r = run(["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
             "-of", "csv=p=0", path])
    return float(r.stdout.strip())


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--voice", required=True)
    p.add_argument("--music", default=None)
    p.add_argument("--sfx-plan", default=None)
    p.add_argument("--music-db", type=float, default=-20.0)
    p.add_argument("--sfx-db", type=float, default=-10.0)
    p.add_argument("--lufs", type=float, default=-14.0)
    p.add_argument("--out", required=True)
    a = p.parse_args()

    inputs = [a.voice]
    filters = []
    mix_labels = []

    # voice (reference)
    filters.append("[0:a]aresample=44100[voice]")
    mix_labels.append("[voice]")

    total = duration(a.voice)

    if a.music:
        inputs.append(a.music)
        mdur = duration(a.music)
        loops = int(total / mdur) + 1
        # loop music to cover voice, duck under voice with sidechain, fade out last 1.5s
        filters.append(
            f"[1:a]aloop=loop={loops}:size=2e9,atrim=0:{total + 1.5},"
            f"afade=t=in:st=0:d=0.5,afade=t=out:st={max(0, total - 0.5):.2f}:d=1.5[musicraw]"
        )
        filters.append("[musicraw]volume={:.2f}dB[musicvol]".format(a.music_db))
        filters.append("[musicvol][voice]sidechaincompress=threshold=0.02:ratio=6:attack=20:release=300[musicduck]")
        mix_labels.append("[musicduck]")

    if a.sfx_plan:
        with open(a.sfx_plan, encoding="utf-8") as f:
            plan = json.load(f)
        for i, item in enumerate(plan):
            inputs.append(item["file"])
            idx = len(inputs) - 1
            delay_ms = int(float(item["at"]) * 1000)
            filters.append(f"[{idx}:a]aresample=44100,volume={a.sfx_db:.2f}dB,adelay={delay_ms}|{delay_ms}[sfx{i}]")
            mix_labels.append(f"[sfx{i}]")

    n = len(mix_labels)
    filters.append("".join(mix_labels) + f"amix=inputs={n}:normalize=0[premix]")
    filters.append(f"[premix]loudnorm=I={a.lufs}:TP=-1.5:LRA=11[out]")

    cmd = ["ffmpeg", "-y"]
    for i in inputs:
        cmd += ["-i", i]
    cmd += ["-filter_complex", ";".join(filters), "-map", "[out]", a.out]
    run(cmd)
    print(f"[mix] {n} sources -> {a.out} ({duration(a.out):.1f}s, {a.lufs} LUFS)")


if __name__ == "__main__":
    main()
