#!/bin/bash
set -e # Exit with nonzero exit code if anything fails

mkdir -p out

cp index.html out/

# Copy Basic Video Chat
cp -r Basic\ Video\ Chat out/
sed -i -- 's/http:\/\/YOUR-SERVER-URL/https:\/\/opentok-web-samples-backend.herokuapp.com/g' out/Basic\ Video\ Chat/js/config.js

# Copy Signaling
cp -r Signaling out/
sed -i -- 's/http:\/\/YOUR-SERVER-URL/https:\/\/opentok-web-samples-backend.herokuapp.com/g' out/Signaling/js/config.js

# Copy Archiving
cp -r Archiving out/
sed -i -- 's/http:\/\/YOUR-SERVER-URL/https:\/\/opentok-web-samples-backend.herokuapp.com/g' out/Archiving/js/config.js

# Copy Publish-Canvas
cp -r Publish-Canvas out/

# Copy Publish-Canvas
cp -r Publish-Video out/

# Copy Stereo-Audio
cp -r Stereo-Audio out/
sed -i -- 's/http:\/\/YOUR-SERVER-URL/https:\/\/opentok-web-samples-backend.herokuapp.com/g' out/Stereo-Audio/js/config.js

# Copy Stream Filter
cp -r Stream-Filter out/
sed -i -- 's/http:\/\/YOUR-SERVER-URL/https:\/\/opentok-web-samples-backend.herokuapp.com/g' out/Stream-Filter/js/config.js

# Build Angular Sample
cd Angular-Basic-Video-Chat
npm install
sed -i -- 's/http:\/\/YOUR-SERVER-URL/https:\/\/opentok-web-samples-backend.herokuapp.com/g' src/config.ts
npx ng build -prod --base-href ''
cd ..
cp -r Angular-Basic-Video-Chat/dist/ out/Angular-Basic-Video-Chat/

# Build React Sample
cd React-Basic-Video-Chat/
npm install
sed -i -- 's/http:\/\/YOUR-SERVER-URL/https:\/\/opentok-web-samples-backend.herokuapp.com/g' src/config.js
npm run build
cd ..
cp -r React-Basic-Video-Chat/build/ out/React-Basic-Video-Chat/

# Build Vue Sample
cd Vue-Basic-Video-Chat/
npm install
sed -i -- 's/http:\/\/YOUR-SERVER-URL/https:\/\/opentok-web-samples-backend.herokuapp.com/g' config.js
npm run build
cd ..
mkdir -p out/Vue-Basic-Video-Chat
cp -r Vue-Basic-Video-Chat/dist out/Vue-Basic-Video-Chat/
cp -r Vue-Basic-Video-Chat/index.html out/Vue-Basic-Video-Chat/

# Run tests
if [ "$BROWSER" = "safari" ]; then
  sudo npx http-server out -p 80 &
else
  npm start &
fi
if [ "$BROWSER" = "ie" ]; then
  ./node_modules/opentok-test-scripts/plugin-installer/packageSauceLabsInstaller.sh
  mkdir -p out/plugin-installer
  mv ./node_modules/opentok-test-scripts/plugin-installer/SauceLabsInstaller.exe out/plugin-installer
fi
npm test
if [ "$BROWSER" = "ie" ]; then rm -r out/plugin-installer; fi
