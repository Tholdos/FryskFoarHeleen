# Audio Files

Place your Frisian word pronunciation audio files here.

## File Naming

Name your files to match the Frisian word (lowercase, no special characters):
- `mem.mp3` - for the word "mem"
- `heit.mp3` - for the word "heit"
- `swart.mp3` - for the word "swart"
- `hun.mp3` - for the word "hûn" (remove special characters)

## Format

- **Format**: MP3 (recommended) or OGG
- **Quality**: 64-128 kbps is fine for voice
- **Length**: Keep recordings short (1-2 seconds per word)

## How to Record

You can use:
- Your phone's voice recorder app
- Online tools like https://online-voice-recorder.com/
- Audacity (free desktop software)

Export as MP3 and save to this folder.

## Update MongoDB

After adding an audio file, update the corresponding word in MongoDB Compass:

```json
{
  "frisian": "mem",
  "dutch": "moeder",
  "pronunciation": "mem",
  "audioUrl": "mem.mp3"  ← Add this
}
```

The app will automatically play the audio when users click the 🔊 icon!
