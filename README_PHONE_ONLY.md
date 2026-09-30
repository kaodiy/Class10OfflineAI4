# Class 10 Offline AI — phone-only APK route

This project is configured for Expo EAS cloud builds.

## First APK
The `preview` profile is configured to create an installable Android APK.

Typical EAS commands:
- `npm install`
- `npx eas-cli login`
- `npx eas build -p android --profile preview`

You do not need Android Studio on the phone because EAS performs the Android build remotely.

## Current version
- Offline local knowledge pack
- Maths, Science, Social Science and English starter topics
- Common spelling-error handling
- No cloud AI API calls from the app
- Conversation visible while the app is open

## Next upgrade
This first APK is a lightweight offline tutor, not yet a full local generative LLM. A later version can add a GGUF/llama.cpp-based model with native Android integration.
