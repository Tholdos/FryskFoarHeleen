const express = require('express')
const cors = require('cors')
const { MongoClient, ObjectId } = require('mongodb')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB setup
const MONGODB_URI = process.env.MONGODB_URI
let db = null
let wordsCollection = null

// Connect to MongoDB
async function connectDB() {
  if (!MONGODB_URI) {
    console.log('⚠️  No MONGODB_URI found, using fallback data')
    return false
  }
  
  try {
    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    db = client.db('frysk_app')
    wordsCollection = db.collection('words')
    console.log('✅ Connected to MongoDB')
    return true
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message)
    return false
  }
}

// Initialize DB connection
let dbConnected = false
connectDB().then(connected => {
  dbConnected = connected
})

// Fallback data for development/testing
const fallbackWords = [
  {
    _id: '1',
    frisian: 'hûs',
    dutch: 'huis',
    pronunciation: 'hoos',
    audioUrl: null,
    category: 'zelfstandig naamwoord',
    difficulty: 1
  },
  {
    _id: '2',
    frisian: 'heit',
    dutch: 'vader',
    pronunciation: 'hait',
    audioUrl: null,
    category: 'familie',
    difficulty: 1
  },
  {
    _id: '3',
    frisian: 'mem',
    dutch: 'moeder',
    pronunciation: 'mem',
    audioUrl: null,
    category: 'familie',
    difficulty: 1
  },
  {
    _id: '4',
    frisian: 'wetter',
    dutch: 'water',
    pronunciation: 'vetter',
    audioUrl: null,
    category: 'zelfstandig naamwoord',
    difficulty: 1
  },
  {
    _id: '5',
    frisian: 'wyn',
    dutch: 'wind',
    pronunciation: 'win',
    audioUrl: null,
    category: 'zelfstandig naamwoord',
    difficulty: 1
  },
  {
    _id: '6',
    frisian: 'leafde',
    dutch: 'liefde',
    pronunciation: 'leevde',
    audioUrl: null,
    category: 'zelfstandig naamwoord',
    difficulty: 2
  },
  {
    _id: '7',
    frisian: 'boek',
    dutch: 'boek',
    pronunciation: 'book',
    audioUrl: null,
    category: 'zelfstandig naamwoord',
    difficulty: 1
  },
  {
    _id: '8',
    frisian: 'berntsje',
    dutch: 'kind',
    pronunciation: 'berntsjuh',
    audioUrl: null,
    category: 'familie',
    difficulty: 2
  },
  {
    _id: '9',
    frisian: 'dei',
    dutch: 'dag',
    pronunciation: 'dai',
    audioUrl: null,
    category: 'tijd',
    difficulty: 1
  },
  {
    _id: '10',
    frisian: 'nacht',
    dutch: 'nacht',
    pronunciation: 'nacht',
    audioUrl: null,
    category: 'tijd',
    difficulty: 1
  }
]

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Frysk Foar Heleen API',
    status: 'running',
    database: dbConnected ? 'connected' : 'fallback mode'
  })
})

// Get all words
app.get('/api/words', async (req, res) => {
  try {
    if (dbConnected && wordsCollection) {
      const words = await wordsCollection.find({}).toArray()
      res.json(words)
    } else {
      // Use fallback data
      res.json(fallbackWords)
    }
  } catch (error) {
    console.error('Error fetching words:', error)
    res.status(500).json({ error: 'Failed to fetch words' })
  }
})

// Get random words
app.get('/api/words/random/:count', async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 5
    
    if (dbConnected && wordsCollection) {
      const words = await wordsCollection.aggregate([
        { $sample: { size: count } }
      ]).toArray()
      res.json(words)
    } else {
      // Use fallback data
      const shuffled = [...fallbackWords].sort(() => Math.random() - 0.5)
      res.json(shuffled.slice(0, count))
    }
  } catch (error) {
    console.error('Error fetching random words:', error)
    res.status(500).json({ error: 'Failed to fetch random words' })
  }
})

// Get word by ID
app.get('/api/words/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    if (dbConnected && wordsCollection) {
      const word = await wordsCollection.findOne({ _id: new ObjectId(id) })
      if (!word) {
        return res.status(404).json({ error: 'Word not found' })
      }
      res.json(word)
    } else {
      const word = fallbackWords.find(w => w._id === id)
      if (!word) {
        return res.status(404).json({ error: 'Word not found' })
      }
      res.json(word)
    }
  } catch (error) {
    console.error('Error fetching word:', error)
    res.status(500).json({ error: 'Failed to fetch word' })
  }
})

// Add new word (for future admin functionality)
app.post('/api/words', async (req, res) => {
  try {
    const { frisian, dutch, pronunciation, audioUrl, category, difficulty } = req.body
    
    if (!frisian || !dutch) {
      return res.status(400).json({ error: 'Frisian and Dutch translations are required' })
    }
    
    const newWord = {
      frisian,
      dutch,
      pronunciation: pronunciation || '',
      audioUrl: audioUrl || null,
      category: category || 'general',
      difficulty: difficulty || 1,
      createdAt: new Date()
    }
    
    if (dbConnected && wordsCollection) {
      const result = await wordsCollection.insertOne(newWord)
      res.status(201).json({ _id: result.insertedId, ...newWord })
    } else {
      res.status(503).json({ error: 'Database not available' })
    }
  } catch (error) {
    console.error('Error adding word:', error)
    res.status(500).json({ error: 'Failed to add word' })
  }
})

// Serve audio files (placeholder for now)
app.get('/api/audio/:filename', (req, res) => {
  // TODO: Implement audio file serving
  // This will serve audio files from storage (GridFS, Vercel Blob, or file system)
  res.status(404).json({ error: 'Audio not implemented yet' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📝 Database: ${dbConnected ? 'MongoDB' : 'Fallback mode'}`)
})
