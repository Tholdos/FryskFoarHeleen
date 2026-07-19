const express = require('express')
const cors = require('cors')
const { MongoClient, ObjectId } = require('mongodb')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'https://frysk-foar-heleen.vercel.app',  // Add your actual Vercel URL here
  // Add your custom domain when you have one
]

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
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
    frisian: 'mem',
    dutch: 'moeder',
    pronunciation: 'mem',
    audioUrl: null
  },
  {
    _id: '2',
    frisian: 'heit',
    dutch: 'vader',
    pronunciation: 'ergens tussen "haait" en "hòòit"',
    audioUrl: null
  },
  {
    _id: '3',
    frisian: 'beppe',
    dutch: 'oma',
    pronunciation: 'beppe',
    audioUrl: null
  },
  {
    _id: '4',
    frisian: 'pake',
    dutch: 'opa',
    pronunciation: 'pake',
    audioUrl: null
  },
  {
    _id: '5',
    frisian: 'ien',
    dutch: 'een',
    pronunciation: 'zoals de Engelse naam "Ian"',
    audioUrl: null
  },
  {
    _id: '6',
    frisian: 'twa',
    dutch: 'twee',
    pronunciation: 'twa',
    audioUrl: null
  },
  {
    _id: '7',
    frisian: 'trije',
    dutch: 'drie',
    pronunciation: 'trije',
    audioUrl: null
  },
  {
    _id: '8',
    frisian: 'fjouwer',
    dutch: 'vier',
    pronunciation: 'fjouwer',
    audioUrl: null
  },
  {
    _id: '9',
    frisian: 'fiif',
    dutch: 'vijf',
    pronunciation: 'fiif met een langgerekte "i"',
    audioUrl: null
  },
  {
    _id: '10',
    frisian: 'seis',
    dutch: 'zes',
    pronunciation: 'ergens tussen "saais" en "sòòìs"',
    audioUrl: null
  },
  {
    _id: '11',
    frisian: 'sân',
    dutch: 'zeven',
    pronunciation: 'Soo-wun, rijmt ongeveer op de Engelse naam "Owen", maar dan iets sneller uitgesproken',
    audioUrl: null
  },
  {
    _id: '12',
    frisian: 'acht',
    dutch: 'acht',
    pronunciation: 'acht',
    audioUrl: null
  },
  {
    _id: '13',
    frisian: 'njoggen',
    dutch: 'negen',
    pronunciation: 'njoggen',
    audioUrl: null
  },
  {
    _id: '14',
    frisian: 'tsien',
    dutch: 'tien',
    pronunciation: 'rijmt op "Ian"',
    audioUrl: null
  },
  {
    _id: '15',
    frisian: 'dei',
    dutch: 'dag',
    pronunciation: 'ergens tussen "daai" en "dòòi"',
    audioUrl: null
  },
  {
    _id: '16',
    frisian: 'nacht',
    dutch: 'nacht',
    pronunciation: 'nacht',
    audioUrl: null
  },
  {
    _id: '17',
    frisian: 'swart',
    dutch: 'zwart',
    pronunciation: 'swat',
    audioUrl: null
  },
  {
    _id: '18',
    frisian: 'wyt',
    dutch: 'wit',
    pronunciation: 'wiet',
    audioUrl: null
  },
  {
    _id: '19',
    frisian: 'sinne',
    dutch: 'zon',
    pronunciation: 'sinne',
    audioUrl: null
  },
  {
    _id: '20',
    frisian: 'moanne',
    dutch: 'maan',
    pronunciation: 'mwanne',
    audioUrl: null
  },
  {
    _id: '21',
    frisian: 'lang',
    dutch: 'lang',
    pronunciation: 'lang',
    audioUrl: null
  },
  {
    _id: '22',
    frisian: 'koart',
    dutch: 'kort',
    pronunciation: 'kwat',
    audioUrl: null
  },
  {
    _id: '23',
    frisian: 'hûn',
    dutch: 'hond',
    pronunciation: 'hoen',
    audioUrl: null
  },
  {
    _id: '24',
    frisian: 'kat',
    dutch: 'kat',
    pronunciation: 'kot',
    audioUrl: null
  },
  {
    _id: '25',
    frisian: 'giel',
    dutch: 'geel',
    pronunciation: 'geel met een harde g-klank, zoals in het Engelse woord "go" (officieel Friese uitspraak is met een ieje-klank, maar dat doet bijna niemand)',
    audioUrl: null
  },
  {
    _id: '26',
    frisian: 'grien',
    dutch: 'groen',
    pronunciation: 'rijmt op "Ian", met een harde g-klank, zoals in het Engelse woord "go"',
    audioUrl: null
  },
  {
    _id: '27',
    frisian: 'kat',
    dutch: 'kat',
    pronunciation: 'kot',
    audioUrl: null
  },
  {
    _id: '28',
    frisian: 'kat',
    dutch: 'kat',
    pronunciation: 'kot',
    audioUrl: null
  },
  {
    _id: '29',
    frisian: 'kat',
    dutch: 'kat',
    pronunciation: 'kot',
    audioUrl: null
  },
  {
    _id: '30',
    frisian: 'kat',
    dutch: 'kat',
    pronunciation: 'kot',
    audioUrl: null
  },
  {
    _id: '31',
    frisian: 'kat',
    dutch: 'kat',
    pronunciation: 'kot',
    audioUrl: null
  },
  {
    _id: '32',
    frisian: 'kat',
    dutch: 'kat',
    pronunciation: 'kot',
    audioUrl: null
  },
  {
    _id: '33',
    frisian: 'kat',
    dutch: 'kat',
    pronunciation: 'kot',
    audioUrl: null
  },
  {
    _id: '34',
    frisian: 'kat',
    dutch: 'kat',
    pronunciation: 'kot',
    audioUrl: null
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
    const { frisian, dutch, pronunciation, audioUrl } = req.body
    
    if (!frisian || !dutch) {
      return res.status(400).json({ error: 'Frisian and Dutch translations are required' })
    }
    
    const newWord = {
      frisian,
      dutch,
      pronunciation: pronunciation || '',
      audioUrl: audioUrl || null,
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
