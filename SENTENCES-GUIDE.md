# Quick Guide: Adding Sentences to MongoDB

## 🚀 Quick Start (Recommended)

### 1. Make sure your MongoDB connection is set up
Check that `server/.env` contains your MongoDB URI:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/frysk_app
```

### 2. Run the seed script
```bash
cd server
npm run seed
```

This automatically imports:
- ✅ All words from `words-data.json`
- ✅ All sentences from `sentences-data.json`

### 3. Verify in MongoDB Compass
1. Connect to your database
2. Check `frysk_app` database
3. You should see two collections:
   - `words` (with ~33 documents)
   - `sentences` (with ~10 documents)

## 🔄 Update Existing Data

If you've edited `sentences-data.json` and want to reimport:

```bash
cd server
npm run seed:clear
```

⚠️ **Warning**: This deletes ALL existing data and reimports from the JSON files!

## ➕ Adding New Sentences

### Option 1: Via JSON file (recommended for bulk)
1. Edit `server/sentences-data.json`
2. Add your new sentence(s):
   ```json
   {
     "frisian": "Ik yt in appel",
     "dutch": "Ik eet een appel",
     "pronunciation": "ik eet in appel",
     "audioUrl": null
   }
   ```
3. Run `npm run seed:clear` to reimport

### Option 2: Via MongoDB Compass (for single additions)
1. Open MongoDB Compass
2. Navigate to `frysk_app` → `sentences`
3. Click "ADD DATA" → "Insert Document"
4. Paste your sentence:
   ```json
   {
     "frisian": "Ik yt in appel",
     "dutch": "Ik eet een appel",
     "pronunciation": "ik eet in appel",
     "audioUrl": null
   }
   ```

### Option 3: Via MongoDB Shell
```javascript
use frysk_app

db.sentences.insertOne({
  frisian: "Ik yt in appel",
  dutch: "Ik eet een appel",
  pronunciation: "ik eet in appel",
  audioUrl: null,
  createdAt: new Date()
})
```

### Option 4: Via API (when server is running)
```bash
curl -X POST http://localhost:3000/api/sentences \
  -H "Content-Type: application/json" \
  -d '{
    "frisian": "Ik yt in appel",
    "dutch": "Ik eet een appel",
    "pronunciation": "ik eet in appel",
    "audioUrl": null
  }'
```

## 📝 Sentence Format

Each sentence should have:
- **frisian** (required): The Frisian sentence
- **dutch** (required): Dutch translation
- **pronunciation** (optional): Pronunciation guide
- **audioUrl** (optional): Filename of audio file (place in `server/public/audio/`)

Example:
```json
{
  "frisian": "Hoe giet it mei dy?",
  "dutch": "Hoe gaat het met jou?",
  "pronunciation": "Hoe gjit ut maai dij?",
  "audioUrl": "hoe-giet-it.mp3"
}
```

## 🔊 Adding Audio

1. Record your sentence pronunciation
2. Save as MP3: `hoe-giet-it.mp3`
3. Place in `server/public/audio/`
4. Update sentence in MongoDB:
   ```javascript
   db.sentences.updateOne(
     { frisian: "Hoe giet it mei dy?" },
     { $set: { audioUrl: "hoe-giet-it.mp3" } }
   )
   ```

## ✅ Verify Sentences Are Working

### Test the API
```bash
# Get all sentences
curl http://localhost:3000/api/sentences

# Get 5 random sentences
curl http://localhost:3000/api/sentences/random/5
```

### Test in the app
1. Start the server: `cd server && npm run dev`
2. Start the frontend: `npm run dev`
3. Open http://localhost:5173
4. Click on "Zinnen" tab
5. You should see your sentences!

## 🐛 Troubleshooting

### "No sentences available"
- Check that server is running
- Verify MongoDB connection in server console
- Check that sentences collection has documents:
  ```javascript
  db.sentences.countDocuments()
  ```

### Sentences not updating
- Clear browser cache
- Restart the server
- Check server console for errors

### Seed script fails
- Verify MONGODB_URI in `.env`
- Test connection with MongoDB Compass
- Check that you have write permissions on the database
