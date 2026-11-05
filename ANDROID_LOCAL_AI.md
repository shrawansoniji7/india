# Shravan AI — Android Local AI Profile (6 GB RAM)

Status: UI avatar milestone added; native model/runtime integration remains pending. The current APK workflow packages the web UI only; it does not yet contain model weights or native inference code.

## Digital human avatar

- Selected experience: professional female digital companion.
- Added an original vector avatar with a professional jacket, subtle orbital lighting, idle state, thinking state, and mouth animation while speech synthesis is active.
- Chat history is stored in browser IndexedDB on the device. No remote chat endpoint is configured or called by the current interface.
- The current avatar is a lightweight 2D/vector presentation, not a photorealistic 3D human. A rigged 3D avatar and native lip-sync are a later upgrade.
- Browser speech synthesis/recognition availability varies by Android device and may use system services; native offline Hindi STT/TTS still needs an Android implementation and offline capability checks.

## Selected baseline

- Device memory class: 6 GB RAM (reported by user); chipset/model unknown.
- Default assistant model target: **Gemma 3n E2B Instruct, LiteRT-LM format**.
- Runtime target: Google AI Edge / LiteRT-LM Android Kotlin runtime, with CPU-first fallback and GPU/NPU acceleration only after runtime capability checks.
- Model delivery: download the model on first launch over Wi-Fi, show progress and required free-storage estimate, verify the downloaded file, and keep weights in app-private storage. Do not bundle multi-GB weights inside the APK.
- Memory policy: conservative context/output limits; release image/audio tensors after each request; avoid keeping camera frames in memory; reject concurrent model generations when memory pressure is high.

## Vision

- Use the Gemma 3n multimodal image input path for an explicitly captured still frame or selected gallery image.
- Camera preview may be live, but inference should initially run only on a user-captured frame. Continuous real-time video understanding is a later optimization and must be benchmarked on the actual chipset.
- Keep image processing on-device; no image upload by default.

## Voice

- Hindi speech input: Android on-device speech recognition where the installed Android speech service supports Hindi offline; detect availability at runtime and clearly disclose if an online fallback is required.
- Spoken replies: Android TextToSpeech with Hindi locale/voice availability check. Do not assume the optional GenAI TTS service is supported on every 6 GB device.
- Push-to-talk first; streaming full-duplex voice is a later phase after latency, thermal, and battery testing.

## Compatibility gate

6 GB RAM alone does not guarantee model speed. At first launch, collect Android API level, device model, chipset, available memory, and supported acceleration backends. Run a short benchmark before enabling multimodal mode. If Gemma 3n E2B cannot run reliably, fall back to a smaller text model and disable local image/audio model input rather than crashing.

## References

- https://developers.google.com/edge/mediapipe/solutions/genai/llm_inference
- https://developers.google.com/edge/mediapipe/solutions/genai/llm_inference/android
- https://gemma.ai/models/gemma-3n/
- https://developers.google.com/ml-kit/genai/speech-recognition/android
- https://developers.google.com/ml-kit/genai/text-to-speech/android

## Honest implementation status

The repository currently contains the Capacitor web shell and an APK build workflow. The native LiteRT-LM bridge, model download/verification, local inference, on-device image prompting, and native Hindi speech adapters are not implemented yet. The current screen is a local-first avatar UI, not yet an intelligent offline assistant. Do not label the app "fully offline AI" until the model, native voice and vision components pass device testing.
