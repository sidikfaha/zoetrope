#!/usr/bin/env bash
# Zoetrope — scaffold a Remotion project with everything the template needs.
# Usage: bash setup_project.sh <project-dir>
set -euo pipefail

DIR="${1:?usage: setup_project.sh <project-dir>}"

if [ ! -d "$DIR" ]; then
  echo ">> scaffolding blank Remotion project in $DIR"
  npx --yes create-video@latest --blank "$DIR"
fi

cd "$DIR"

echo ">> installing Zoetrope dependencies"
npm install --save @remotion/captions @remotion/google-fonts @remotion/transitions

# FX toolbox: every @remotion/* package must match the project's remotion version exactly
RV=$(node -p "String(require('./package.json').dependencies.remotion || 'latest').replace(/[\^~]/g, '')")
echo ">> installing FX packages pinned to remotion $RV"
npm install --save "@remotion/paths@$RV" "@remotion/shapes@$RV" "@remotion/three@$RV" three @react-three/fiber
# optional, for Lottie JSON animations (see references/animation-recipes.md):
# npm install --save "@remotion/lottie@$RV" lottie-web

npm install --save-dev @remotion/install-whisper-cpp

# 3D renders need WebGL in headless Chrome, otherwise THREE.WebGLRenderer context errors
if [ -f remotion.config.ts ] && ! grep -q setChromiumOpenGlRenderer remotion.config.ts; then
  echo 'Config.setChromiumOpenGlRenderer("angle");' >> remotion.config.ts
  echo ">> enabled WebGL renderer in remotion.config.ts"
fi

echo ">> done. Next:"
echo "   1. copy the template scenes: cp -R <plugin>/assets/remotion-template/src/* $DIR/src/"
echo "   2. npm run dev   (Studio preview)"
