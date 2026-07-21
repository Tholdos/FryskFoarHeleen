# Audio Files & MongoDB Setup Guide

## Overview
This guide explains how to add audio files for Frisian word pronunciations and set up MongoDB with an extensive word list for the Frysk Foar Heleen application.

---

## Part 1: Adding Audio Files

### Option A: Using Vercel Blob Storage (Recommended for Vercel deployment)

#### 1. Install Vercel Blob
```bash
npm install @vercel/blob
```

#### 2. Set up Vercel Blob in your project
- Create a Blob store in your Vercel dashboard
- Add `BLOB_READ_WRITE_TOKEN` to your environment variables

#### 3. Create an upload endpoint in `server/index.js`
```javascript
const { put } = require('@vercel/blob')

// Upload audio file
app.post('/api/audio/upload', async (req, res) => {
  try {
    const { filename, fileData } = req.body // fileData should be base64
    
    const blob = await put(`audio/${filename}`, fileData, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })
    
    res.json({ url: blob.url })
  } catch (error) {
    console.error('Error uploading audio:', error)
    res.status(500).json({ error: 'Failed to upload audio' })
  }
})
```

#### 4. Update the audio serving endpoint
```javascript
app.get('/api/audio/:filename', (req, res) => {
  const { filename } = req.params
  // With Vercel Blob, you'll redirect to the blob URL
  // Or store the full blob URL in MongoDB and serve directly
  res.redirect(`https://your-blob-store.vercel-storage.com/audio/${filename}`)
})
```

### Option B: Using Local File System (For development/small deployments)

#### 1. Create an audio directory
```bash
mkdir -p server/public/audio
```

#### 2. Record/obtain audio files
- Record yourself or a native Frisian speaker pronouncing each word
- Save as MP3 or OGG format (compressed, web-friendly)
- Name files consistently: `{frisian_word}.mp3` (e.g., `mem.mp3`, `heit.mp3`)

#### 3. Update `server/index.js` to serve static files
```javascript
const path = require('path')

// Serve static audio files
app.use('/api/audio', express.static(path.join(__dirname, 'public/audio')))

// Or with more control:
app.get('/api/audio/:filename', (req, res) => {
  const { filename } = req.params
  const audioPath = path.join(__dirname, 'public/audio', filename)
  
  if (fs.existsSync(audioPath)) {
    res.sendFile(audioPath)
  } else {
    res.status(404).json({ error: 'Audio file not found' })
  }
})
```

### Option C: Using Cloud Storage (AWS S3, Google Cloud Storage, etc.)

#### For AWS S3:
1. Create an S3 bucket for audio files
2. Upload audio files to the bucket
3. Set appropriate permissions (public read access)
4. Use the S3 URLs directly in your MongoDB documents

Example audioUrl in MongoDB: `https://your-bucket.s3.amazonaws.com/audio/mem.mp3`

---

## Part 2: Setting Up MongoDB with Extensive Word List

### Step 1: Set Up MongoDB Atlas (Free Tier)

1. **Create a MongoDB Atlas account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account

2. **Create a cluster**
   - Choose the free M0 tier
   - Select a region close to your users
   - Name your cluster (e.g., "frysk-cluster")

3. **Create a database user**
   - Go to Database Access
   - Add New Database User
   - Choose username/password authentication
   - Save the credentials securely

4. **Whitelist IP addresses**
   - Go to Network Access
   - Add IP Address
   - For development: "Allow access from anywhere" (0.0.0.0/0)
   - For production: Add specific IPs

5. **Get your connection string**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Add to your `.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/frysk_foar_heleen?retryWrites=true&w=majority
   ```

### Step 2: Prepare Your Word List

Create a JSON file `words-data.json` with your complete word list:

```json
[
  {
    "frisian": "mem",
    "dutch": "moeder",
    "pronunciation": "mem",
    "audioUrl": "mem.mp3"
  },
  {
    "frisian": "heit",
    "dutch": "vader",
    "pronunciation": "ergens tussen \"haait\" en \"hòòit\"",
    "audioUrl": "heit.mp3"
  },
  {
    "frisian": "beppe",
    "dutch": "oma",
    "pronunciation": "beppe",
    "audioUrl": "beppe.mp3"
  }
  // ... add all your words here
]
```

### Step 3: Import Data into MongoDB

#### Option A: Using MongoDB Compass (GUI)

1. Download and install MongoDB Compass
2. Connect using your connection string
3. Create database `frysk_foar_heleen` and collection `words`
4. Click "Add Data" → "Import JSON or CSV file"
5. Select your `words-data.json` file
6. Import!

#### Option B: Using a Node.js Script

Create `server/import-words.js`:

```javascript
const { MongoClient } = require('mongodb')
require('dotenv').config()

const words = require('./words-data.json')

async function importWords() {
  const client = new MongoClient(process.env.MONGODB_URI)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db('frysk_foar_heleen')
    const collection = db.collection('words')
    
    // Clear existing data (optional)
    await collection.deleteMany({})
    
    // Insert new words
    const result = await collection.insertMany(words)
    console.log(`✅ Imported ${result.insertedCount} words`)
    
  } catch (error) {
    console.error('❌ Import error:', error)
  } finally {
    await client.close()
  }
}

importWords()
```

Run the script:
```bash
cd server
node import-words.js
```

#### Option C: Using mongoimport command line tool

```bash
mongoimport --uri "your-connection-string" \
  --db frysk_foar_heleen \
  --collection words \
  --file words-data.json \
  --jsonArray
```

### Step 4: Create Database Indexes (Optional but recommended)

Create `server/setup-indexes.js`:

```javascript
const { MongoClient } = require('mongodb')
require('dotenv').config()

async function setupIndexes() {
  const client = new MongoClient(process.env.MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('frysk_foar_heleen')
    const collection = db.collection('words')
    
    // Create text search index for searching words
    await collection.createIndex({ 
      frisian: 'text', 
      dutch: 'text' 
    })
    
    // Create regular index for faster queries
    await collection.createIndex({ frisian: 1 })
    await collection.createIndex({ dutch: 1 })
    
    console.log('✅ Indexes created successfully')
    
  } catch (error) {
    console.error('❌ Index creation error:', error)
  } finally {
    await client.close()
  }
}

setupIndexes()
```

---

## Part 3: Building Your Word List

### Resources for Frisian Words

1. **Frisian dictionaries**
   - https://www.fryskeakademy.nl/fa/nl/woordenboeken/
   - Use official Frisian language resources

2. **Common categories to include**
   - Numbers (1-100)
   - Days of the week
   - Months
   - Colors
   - Family members
   - Common objects (hûs, auto, boek, etc.)
   - Actions/verbs (rinne, ite, sizze, etc.)
   - Adjectives (moai, grut, lyts, etc.)
   - Animals
   - Food and drink
   - Body parts
   - Nature/weather

3. **Suggested structure**
   - Start with 100-200 most common words
   - Organize by difficulty/frequency
   - Add pronunciation guides for tricky words
   - Consider adding example sentences later

### Example Extended Word List Template

```json
[
  {
    "frisian": "dei",
    "dutch": "dag",
    "pronunciation": "dei",
    "audioUrl": "dei.mp3",
    "notes": "Common greeting: Goeie dei (Good day)"
  },
  {
    "frisian": "nacht",
    "dutch": "nacht", 
    "pronunciation": "nacht",
    "audioUrl": "nacht.mp3",
    "notes": "Goede nacht = Goednacht"
  }
]
```

---

## Part 4: Testing Your Setup

### Test MongoDB Connection

```bash
cd server
node index.js
```

Check the console output - you should see:
```
✅ Connected to MongoDB
🚀 Server running on port 3000
📝 Database: MongoDB
```

### Test Audio Playback

1. Start your frontend: `npm run dev`
2. Navigate to the flashcards
3. Flip to the Frisian side
4. Click the 🔊 icon
5. If audio is not available, check browser console for errors

### Verify Data in App

1. Check that all words appear in the app
2. Test the random word selection
3. Verify all game modes work with new words

---

## Part 5: Production Deployment

### Environment Variables for Production

Add to Vercel (or your hosting platform):
```
MONGODB_URI=your-production-mongodb-connection-string
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token (if using Vercel Blob)
```

### Security Considerations

1. **Never commit credentials**
   - Keep `.env` in `.gitignore`
   - Use environment variables on hosting platform

2. **MongoDB security**
   - Use strong passwords
   - Limit IP whitelist in production
   - Enable MongoDB Atlas access controls

3. **Audio file access**
   - Consider CDN for better performance
   - Implement rate limiting if needed

---

## Troubleshooting

### MongoDB Connection Issues
- Check connection string format
- Verify database user credentials
- Ensure IP whitelist includes your server's IP
- Check firewall settings

### Audio Playback Issues
- Verify audio file format (MP3 recommended)
- Check CORS settings
- Ensure file paths are correct
- Test in browser console: `new Audio('url').play()`

### Performance Issues
- Add database indexes
- Use CDN for audio files
- Implement caching
- Consider pagination for large word lists

---

## Next Steps

1. Record or source audio files for all words
2. Build your comprehensive word list (suggest starting with 200-300 words)
3. Import data into MongoDB
4. Test thoroughly in development
5. Deploy to production
6. Consider adding features like:
   - User accounts to track progress
   - Spaced repetition algorithm
   - Word categories/filters
   - Difficulty levels
   - Search functionality

---

## Need Help?

- MongoDB Atlas documentation: https://docs.atlas.mongodb.com/
- Vercel Blob documentation: https://vercel.com/docs/storage/vercel-blob
- Frisian language resources: https://www.fryskeakademy.nl/
