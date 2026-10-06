#!/usr/bin/env python3
"""Generate Zoetrope's bundled audio assets (WAV, 44.1kHz, 16-bit)."""
import numpy as np, wave, os

SR = 44100
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "audio")
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)

def save(name, x):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.89
    data = (x * 32767).astype(np.int16)
    with wave.open(os.path.join(OUT, name), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(data.tobytes())
    print(f"{name}: {len(x)/SR:.2f}s")

def env_exp(n, decay):  # exponential decay envelope
    return np.exp(-np.linspace(0, decay, n))

def sweep(t, f0, f1, curve=2.0):
    phase = 2 * np.pi * (f0 * t + (f1 - f0) / (t[-1] or 1) * t**2 / 2 * curve / curve)
    return np.sin(phase)

# --- whoosh: band-swept noise, 0.55s ---
n = int(SR * 0.55); t = np.arange(n) / SR
noise = rng.standard_normal(n)
e = np.sin(np.pi * np.clip(t / 0.55, 0, 1)) ** 1.5
sm = np.convolve(noise, np.ones(64) / 64, mode="same")
save("whoosh.wav", sm * e * 1.6)

# --- pop: 180Hz sine burst, 0.18s ---
n = int(SR * 0.18); t = np.arange(n) / SR
pop = np.sin(2 * np.pi * 180 * t) * env_exp(n, 9) + 0.4 * np.sin(2 * np.pi * 520 * t) * env_exp(n, 16)
save("pop.wav", pop)

# --- riser: 1.2s rising sweep + noise, ends abruptly (cut lands on the beat) ---
n = int(SR * 1.2); t = np.arange(n) / SR
r = sweep(t, 220, 1400)
rn = np.convolve(rng.standard_normal(n), np.ones(32) / 32, mode="same") * 0.4
e = (t / 1.2) ** 2
save("riser.wav", (r + rn) * e)

# --- impact: 55Hz thump + click, 0.7s ---
n = int(SR * 0.7); t = np.arange(n) / SR
imp = np.sin(2 * np.pi * 55 * t) * env_exp(n, 6)
click = rng.standard_normal(int(SR * 0.02)) * env_exp(int(SR * 0.02), 30)
imp[: len(click)] += click * 0.5
imp += 0.3 * np.sin(2 * np.pi * 110 * t) * env_exp(n, 10)
save("impact.wav", imp)

def chord(freqs, dur, sr=SR):
    n = int(sr * dur); t = np.arange(n) / sr
    x = sum(np.sin(2 * np.pi * f * t) for f in freqs) / len(freqs)
    return x

def pad_note(freqs, dur):
    """soft pad with slow attack/release for seamless-ish loops"""
    x = chord(freqs, dur)
    n = len(x)
    a = np.linspace(0, 1, n) ** 0.5  # slow in
    r = (1 - np.linspace(0, 1, n)) ** 0.5  # slow out
    lfo = 1 + 0.06 * np.sin(2 * np.pi * 0.5 * np.arange(n) / SR)
    return x * a * r * lfo

# --- music-bed-chill: Am9 -> Fmaj9 pad loop, 16s ---
A, C, E, G, B = 220.0, 261.63, 329.63, 392.0, 493.88
F, D = 174.61, 293.66
seg = 8.0
chill = np.concatenate([
    pad_note([A / 2, C, E, B], seg),
    pad_note([F, A / 1.0, C, G], seg),
])
chill += 0.15 * np.convolve(rng.standard_normal(len(chill)), np.ones(200) / 200, mode="same")
save("music-bed-chill.wav", chill)

# --- music-bed-energy: 120BPM pulse loop, 16s ---
bpm = 120; beat = 60 / bpm
n = int(SR * 16); t = np.arange(n) / SR
bassline = np.zeros(n)
notes = [110, 110, 130.81, 98]  # A A C G
for i in range(int(16 / beat)):
    f = notes[i % 4]
    s = int(i * beat * SR); e = min(n, s + int(beat * SR))
    tt = np.arange(e - s) / SR
    bassline[s:e] += np.sin(2 * np.pi * f * tt) * env_exp(e - s, 4)
kick = np.zeros(n)
for i in range(int(16 / beat)):
    s = int(i * beat * SR)
    L = int(0.12 * SR)
    if s + L <= n:
        tt = np.arange(L) / SR
        kick[s:s + L] += np.sin(2 * np.pi * 60 * tt) * env_exp(L, 12)
hats = rng.standard_normal(n) * 0.06
gate = (np.sin(2 * np.pi * (1 / beat) * t) > 0.3).astype(float)
energy = bassline * 0.8 + kick * 0.9 + hats * gate
save("music-bed-energy.wav", energy)

print("done ->", os.path.abspath(OUT))
