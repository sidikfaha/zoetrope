#!/usr/bin/env node
// Zoetrope — transcribe voiceover to word-level captions.json via local whisper.cpp.
// Usage: node transcribe_captions.mjs <audio-in> <captions-out.json> [--model medium.en] [--lang en]
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const [input, out] = process.argv.slice(2);
if (!input || !out) {
  console.error('usage: node transcribe_captions.mjs <audio> <captions.json> [--model m] [--lang l]');
  process.exit(1);
}
const arg = (name, dflt) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : dflt;
};
const model = arg('model', 'medium.en');
const lang = arg('lang', undefined);

const { installWhisperCpp, downloadWhisperModel, transcribe, toCaptions } =
  await import('@remotion/install-whisper-cpp');

const whisperPath = path.join(process.cwd(), 'whisper.cpp');
if (!fs.existsSync(whisperPath)) {
  console.log('>> installing whisper.cpp (one-time)');
  await installWhisperCpp({ to: whisperPath, version: '1.5.5' });
}
const modelFile = path.join(whisperPath, `ggml-${model}.bin`);
if (!fs.existsSync(modelFile)) {
  console.log(`>> downloading model ${model} (one-time)`);
  await downloadWhisperModel({ model, folder: whisperPath });
}

// whisper.cpp wants 16kHz WAV
const wav = input.replace(/\.[^.]+$/, '') + '.16k.wav';
const ffmpeg = process.platform === 'darwin' && !which('ffmpeg') ? 'npx remotion ffmpeg' : 'ffmpeg';
execSync(`${ffmpeg} -y -i "${input}" -ar 16000 "${wav}"`, { stdio: 'inherit' });

const result = await transcribe({
  model,
  whisperPath,
  whisperCppVersion: '1.5.5',
  inputPath: wav,
  tokenLevelTimestamps: true, // dtw word timing — do not turn off
  ...(lang ? { language: lang } : {}),
});
const { captions } = toCaptions({ whisperCppOutput: result });
fs.writeFileSync(out, JSON.stringify(captions, null, 2));
fs.unlinkSync(wav);
console.log(`>> ${captions.length} words -> ${out}`);

function which(cmd) {
  try { execSync(`command -v ${cmd}`, { stdio: 'pipe' }); return true; } catch { return false; }
}
