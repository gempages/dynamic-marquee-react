#!/bin/bash
set -e

npm ci
npm link
npm run build

cd demo
npm install
npm link dynamic-marquee-react
npm run build

echo "Done!"
