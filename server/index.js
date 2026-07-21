const express = require('express')
const cors = require('cors')
const path = require('path')
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

// Serve static audio files
app.use('/api/audio', express.static(path.join(__dirname, 'public/audio')))

// MongoDB setup
const MONGODB_URI = process.env.MONGODB_URI
let db = null
let wordsCollection = null
let sentencesCollection = null
let soundsCollection = null
let verbsCollection = null

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
    sentencesCollection = db.collection('sentences')
    soundsCollection = db.collection('sounds')
    verbsCollection = db.collection('verbs')
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
    audioUrl: 'mem.mp3'
  },
  {
    _id: '2',
    frisian: 'heit',
    dutch: 'vader',
    pronunciation: 'ergens tussen "haait" en "hòòit"',
    audioUrl: 'heit.mp3'
  },
  {
    _id: '3',
    frisian: 'beppe',
    dutch: 'oma',
    pronunciation: 'beppe',
    audioUrl: 'beppe.mp3'
  },
  {
    _id: '4',
    frisian: 'pake',
    dutch: 'opa',
    pronunciation: 'pake',
    audioUrl: 'pake.mp3'
  },
  {
    _id: '5',
    frisian: 'ien',
    dutch: 'een',
    pronunciation: 'zoals de Engelse naam "Ian"',
    audioUrl: 'ien.mp3'
  },
  {
    _id: '6',
    frisian: 'twa',
    dutch: 'twee',
    pronunciation: 'twa',
    audioUrl: 'twa.mp3'
  },
  {
    _id: '7',
    frisian: 'trije',
    dutch: 'drie',
    pronunciation: 'trije',
    audioUrl: 'trije.mp3'
  },
  {
    _id: '8',
    frisian: 'fjouwer',
    dutch: 'vier',
    pronunciation: 'fjouwer',
    audioUrl: 'fjouwer.mp3'
  },
  {
    _id: '9',
    frisian: 'fiif',
    dutch: 'vijf',
    pronunciation: 'fiif met een lange "i" zoals in het Engelse "see"',
    audioUrl: 'fiif.mp3'
  },
  {
    _id: '10',
    frisian: 'seis',
    dutch: 'zes',
    pronunciation: 'ergens tussen "saais" en "sòòìs"',
    audioUrl: 'seis.mp3'
  },
  {
    _id: '11',
    frisian: 'sân',
    dutch: 'zeven',
    pronunciation: 'Soo-wun, rijmt ongeveer op de Engelse naam "Owen", maar dan iets sneller uitgesproken',
    audioUrl: 'sân.mp3'
  },
  {
    _id: '12',
    frisian: 'acht',
    dutch: 'acht',
    pronunciation: 'acht',
    audioUrl: 'acht.mp3'
  },
  {
    _id: '13',
    frisian: 'njoggen',
    dutch: 'negen',
    pronunciation: 'njoggen',
    audioUrl: 'njoggen.mp3'
  },
  {
    _id: '14',
    frisian: 'tsien',
    dutch: 'tien',
    pronunciation: 'rijmt op "Ian"',
    audioUrl: 'tsien.mp3'
  },
  {
    _id: '15',
    frisian: 'dei',
    dutch: 'dag',
    pronunciation: 'ergens tussen "daai" en "dòòi"',
    audioUrl: 'dei.mp3'
  },
  {
    _id: '16',
    frisian: 'nacht',
    dutch: 'nacht',
    pronunciation: 'nacht',
    audioUrl: 'nacht.mp3'
  },
  {
    _id: '17',
    frisian: 'swart',
    dutch: 'zwart',
    pronunciation: 'swat',
    audioUrl: 'swart.mp3'
  },
  {
    _id: '18',
    frisian: 'wyt',
    dutch: 'wit',
    pronunciation: 'wiet',
    audioUrl: 'wyt.mp3'
  },
  {
    _id: '19',
    frisian: 'sinne',
    dutch: 'zon',
    pronunciation: 'sinne',
    audioUrl: 'sinne.mp3'
  },
  {
    _id: '20',
    frisian: 'moanne',
    dutch: 'maan',
    pronunciation: 'mwanne',
    audioUrl: 'moanne.mp3'
  },
  {
    _id: '21',
    frisian: 'lang',
    dutch: 'lang',
    pronunciation: 'lang',
    audioUrl: 'lang.mp3'
  },
  {
    _id: '22',
    frisian: 'koart',
    dutch: 'kort',
    pronunciation: 'kwat',
    audioUrl: 'koart.mp3'
  },
  {
    _id: '23',
    frisian: 'hûn',
    dutch: 'hond',
    pronunciation: 'hoen',
    audioUrl: 'hûn.mp3'
  },
  {
    _id: '24',
    frisian: 'kat',
    dutch: 'kat',
    pronunciation: 'kot',
    audioUrl: 'kat.mp3'
  },
  {
    _id: '25',
    frisian: 'giel',
    dutch: 'geel',
    pronunciation: 'geel met een harde g-klank, zoals in het Engelse "go" (officieel met een ieje-klank, maar dat doet bijna niemand)',
    audioUrl: 'giel.mp3'
  },
  {
    _id: '26',
    frisian: 'grien',
    dutch: 'groen',
    pronunciation: 'rijmt op "Ian", met een harde g-klank, zoals in het Engelse "go"',
    audioUrl: 'grien.mp3'
  },
  {
    _id: '27',
    frisian: 'read',
    dutch: 'rood',
    pronunciation: 'ree-ut (een e-klank die overgaat in een uh-klank)',
    audioUrl: 'read.mp3'
  },
  {
    _id: '28',
    frisian: 'blau',
    dutch: 'blauw',
    pronunciation: 'blauw',
    audioUrl: 'blau.mp3'
  },
  {
    _id: '29',
    frisian: 'bôle',
    dutch: 'brood',
    pronunciation: 'bòòle (met een lange òòh-klank)',
    audioUrl: 'bôle.mp3'
  },
  {
    _id: '30',
    frisian: 'bûter',
    dutch: 'boter',
    pronunciation: 'boeter',
    audioUrl: 'bûter.mp3'
  },
  {
    _id: '31',
    frisian: 'tsiis',
    dutch: 'kaas',
    pronunciation: 'tsiis met een lange "i" zoals in het Engelse "see"',
    audioUrl: 'tsiis.mp3'
  },
  {
    _id: '32',
    frisian: 'iis',
    dutch: 'ijs',
    pronunciation: 'iis met een lange "i" zoals in het Engelse "see"',
    audioUrl: 'iis.mp3'
  },
  {
    _id: '33',
    frisian: 'wetter',
    dutch: 'water',
    pronunciation: 'wetter',
    audioUrl: 'wetter.mp3'
  },
  {
    _id: '34',
    frisian: 'ik',
    dutch: 'ik',
    pronunciation: 'ik',
    audioUrl: 'ik.mp3'
  },
  {
    _id: '35',
    frisian: 'do',
    dutch: 'jij',
    pronunciation: 'do',
    audioUrl: 'do.mp3'
  },
  {
    _id: '36',
    frisian: 'hy',
    dutch: 'hij',
    pronunciation: 'hij',
    audioUrl: 'hy.mp3'
  },
  {
    _id: '37',
    frisian: 'sy',
    dutch: 'zij',
    pronunciation: 'sij',
    audioUrl: 'sy.mp3'
  },
  {
    _id: '38',
    frisian: 'wy',
    dutch: 'wij',
    pronunciation: 'wij',
    audioUrl: 'wy.mp3'
  },
  {
    _id: '39',
    frisian: 'jim',
    dutch: 'jullie',
    pronunciation: 'jim',
    audioUrl: 'jim.mp3'
  },
  {
    _id: '40',
    frisian: 'it',
    dutch: 'het',
    pronunciation: 'ut (zeg maar zoals het Nederlandse \'t)',
    audioUrl: 'it.mp3'
  },
  {
    _id: '41',
    frisian: 'tút',
    dutch: 'kus',
    pronunciation: 'tuut (rijmt op NL \'buut\')',
    audioUrl: 'tút.mp3'
  },
]

// Fallback sentences for development/testing
const fallbackSentences = [
  {
    _id: 's1',
    frisian: 'Hoe giet it mei dy?',
    dutch: 'Hoe gaat het met jou?',
    pronunciation: 'Hoe gjit \'t maai dij?',
    audioUrl: 'hoe-giet-it-mei-dy.mp3'
  },
  {
    _id: 's2',
    frisian: 'Goeiemoarn',
    dutch: 'Goedemorgen!',
    pronunciation: 'Goeiemowen (rijmt ongeveer op Engelse \'Owen\' en begint met een harde \'g\')',
    audioUrl: 'goeiemoarn.mp3'
  },
  {
    _id: 's3',
    frisian: 'Oant sjen!',
    dutch: 'Tot ziens!',
    pronunciation: 'Owent sjen',
    audioUrl: 'oant-sjen.mp3'
  },
  {
    _id: 's4',
    frisian: 'Ik fyn dy leuk.',
    dutch: 'Ik vind je leuk.',
    pronunciation: 'ik fien die leuk',
    audioUrl: 'ik-fyn-dy-leuk.mp3'
  },
  {
    _id: 's5',
    frisian: 'Danke wol!',
    dutch: 'Dank je wel!',
    pronunciation: 'Danke wol',
    audioUrl: 'danke-wol.mp3'
  },
  {
    _id: 's6',
    frisian: 'Wolkom yn Fryslân!',
    dutch: 'Welkom in Friesland!',
    pronunciation: 'Wolkom yn Frieslowen (rijmt ongeveer op Engelse \'Owen\')',
    audioUrl: 'wolkom-yn-fryslân.mp3'
  },
  {
    _id: 's7',
    frisian: 'Hoe hiesto?',
    dutch: 'Hoe heet jij?',
    pronunciation: 'Hoe hiesto?',
    audioUrl: 'hoe-hiesto.mp3'
  },
  {
    _id: 's8',
    frisian: 'Ik bin Heleen.',
    dutch: 'Ik ben Heleen.',
    pronunciation: 'ik bin Heleen',
    audioUrl: 'ik-bin-heleen.mp3'
  },
  {
    _id: 's9',
    frisian: 'Wêr wennesto?',
    dutch: 'Waar woon je?',
    pronunciation: 'Wèèr wennesto?',
    audioUrl: 'wêr-wennesto.mp3'
  },
  {
    _id: 's10',
    frisian: 'Moai waar hjoed!',
    dutch: 'Mooi weer vandaag!',
    pronunciation: 'Mooi waar jóé-\'t',
    audioUrl: 'moai-waar-hjoed.mp3'
  }
]

// Fallback verbs for development/testing
const fallbackVerbs = [
  {
    _id: 'v1',
    infinitive: 'wêze',
    translation: 'zijn',
    present: {
      ik: 'bin',
      do: 'bist',
      hy_sy: 'is',
      wy: 'binne',
      jim: 'binne',
      sy: 'binne'
    },
    past: {
      ik: 'wie',
      do: 'wiest',
      hy_sy: 'wie',
      wy: 'wiene',
      jim: 'wiene',
      sy: 'wiene'
    },
    perfect: 'haw west'
  },
  {
    _id: 'v2',
    infinitive: 'hawwe',
    translation: 'hebben',
    present: {
      ik: 'haw',
      do: 'hast',
      hy_sy: 'hat',
      wy: 'hawwe',
      jim: 'hawwe',
      sy: 'hawwe'
    },
    past: {
      ik: 'hie',
      do: 'hiest',
      hy_sy: 'hie',
      wy: 'hienen',
      jim: 'hienen',
      sy: 'hienen'
    },
    perfect: 'haw hân'
  },
  {
    _id: 'v3',
    infinitive: 'kinne',
    translation: 'kunnen',
    present: {
      ik: 'kin',
      do: 'kinst',
      hy_sy: 'kin',
      wy: 'kinne',
      jim: 'kinne',
      sy: 'kinne'
    },
    past: {
      ik: 'koe',
      do: 'koest',
      hy_sy: 'koe',
      wy: 'koenen',
      jim: 'koenen',
      sy: 'koenen'
    },
    perfect: 'haw kind'
  },
  {
    _id: 'v4',
    infinitive: 'dwaan',
    translation: 'doen',
    present: {
      ik: 'doch',
      do: 'dochst',
      hy_sy: 'docht',
      wy: 'dogge',
      jim: 'dogge',
      sy: 'dogge'
    },
    past: {
      ik: 'die',
      do: 'diest',
      hy_sy: 'die',
      wy: 'dienen',
      jim: 'dienen',
      sy: 'dienen'
    },
    perfect: 'haw dien'
  },
  {
    _id: 'v5',
    infinitive: 'gean',
    translation: 'gaan',
    present: {
      ik: 'gean',
      do: 'geist',
      hy_sy: 'giet',
      wy: 'geane',
      jim: 'geane',
      sy: 'geane'
    },
    past: {
      ik: 'gie',
      do: 'giest',
      hy_sy: 'gie',
      wy: 'gienen',
      jim: 'gienen',
      sy: 'gienen'
    },
    perfect: 'bin gien'
  }
]

// Fallback sounds for development/testing
const fallbackSounds = [
  {
    _id: 'snd1',
    combination: 'aai',
    pronunciation: 'Tussen "aai" en "òòi"',
    example: 'kaai (sleutel)',
    audioUrl: 'aai.mp3'
  },
  {
    _id: 'snd2',
    combination: 'ie',
    pronunciation: 'ieje (zoals het begin van de naam "Ian")',
    example: 'wiet (nat)',
    audioUrl: 'ie.mp3'
  },
  {
    _id: 'snd3',
    combination: 'ea',
    pronunciation: 'eejuh (zoals in Engels "player")',
    example: 'read (rood)',
    audioUrl: 'ea.mp3'
  },
  {
    _id: 'snd4',
    combination: 'oa',
    pronunciation: 'óówùh (zoals in Engels "Owen", zie ook "â"), of wha (zoals in Engels "what")',
    example: 'boat (boot) of foar (voor)',
    audioUrl: 'oa.mp3'
  },
  {
    _id: 'snd5',
    combination: 'oe',
    pronunciation: 'oewuh (zoals in Nederlands "boer")',
    example: 'goed (goed)',
    audioUrl: 'oe.mp3'
  },
  {
    _id: 'snd6',
    combination: 'ei',
    pronunciation: 'Tussen "aai" en "òòi" (zie ook "aai") of ei (zoals in NL "ei")',
    example: 'heit (vader) of rein (regen)',
    audioUrl: 'ei.mp3'
  },
  {
    _id: 'snd7',
    combination: 'ô',
    pronunciation: 'òòh (zoals in NL "òòh!", zie ook "â")',
    example: 'bôle (brood)',
    audioUrl: 'ô.mp3'
  },
  {
    _id: 'snd8',
    combination: 'û',
    pronunciation: 'oeh (langgerekt, zoals in "boeeeh!" of kort zoals in "boek"',
    example: 'hûs (huis) of bûten (buiten)',
    audioUrl: 'û.mp3'
  },
  {
    _id: 'snd9',
    combination: 'â',
    pronunciation: 'òòh (zoals in NL "òòh!", zie ook "ô") of óówùh (zoals in Engels "Owen", zie ook "oa")',
    example: 'wâl (wal) of lân (land)',
    audioUrl: 'â.mp3'
  },
  {
    _id: 'snd10',
    combination: 'ô',
    pronunciation: 'òò (zoals in NL "òòh!")',
    example: 'bôle (brood)',
    audioUrl: 'ô.mp3'
  },
  {
    _id: 'snd11',
    combination: 'ê',
    pronunciation: 'èè (zoals in "bèèh", van een schaap)',
    example: 'bêd (bed)',
    audioUrl: 'ê.mp3'
  },
  {
    _id: 'snd12',
    combination: 'y',
    pronunciation: 'ie (zoals in NL "zien")',
    example: 'wyn (wind)',
    audioUrl: 'y.mp3'
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
      // If MongoDB is empty, use fallback data
      if (words.length === 0) {
        res.json(fallbackWords)
      } else {
        res.json(words)
      }
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
      // If MongoDB is empty, use fallback data
      if (words.length === 0) {
        const shuffled = [...fallbackWords].sort(() => Math.random() - 0.5)
        res.json(shuffled.slice(0, count))
      } else {
        res.json(words)
      }
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

// ===== SENTENCES ENDPOINTS =====

// Get all sentences
app.get('/api/sentences', async (req, res) => {
  try {
    if (dbConnected && sentencesCollection) {
      const sentences = await sentencesCollection.find({}).toArray()
      // If MongoDB is empty, use fallback data
      if (sentences.length === 0) {
        res.json(fallbackSentences)
      } else {
        res.json(sentences)
      }
    } else {
      // Use fallback data
      res.json(fallbackSentences)
    }
  } catch (error) {
    console.error('Error fetching sentences:', error)
    res.status(500).json({ error: 'Failed to fetch sentences' })
  }
})

// Get random sentences
app.get('/api/sentences/random/:count', async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 5
    
    if (dbConnected && sentencesCollection) {
      const sentences = await sentencesCollection.aggregate([
        { $sample: { size: count } }
      ]).toArray()
      // If MongoDB is empty, use fallback data
      if (sentences.length === 0) {
        const shuffled = [...fallbackSentences].sort(() => Math.random() - 0.5)
        res.json(shuffled.slice(0, count))
      } else {
        res.json(sentences)
      }
    } else {
      // Use fallback data
      const shuffled = [...fallbackSentences].sort(() => Math.random() - 0.5)
      res.json(shuffled.slice(0, count))
    }
  } catch (error) {
    console.error('Error fetching random sentences:', error)
    res.status(500).json({ error: 'Failed to fetch random sentences' })
  }
})

// Get sentence by ID
app.get('/api/sentences/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    if (dbConnected && sentencesCollection) {
      const sentence = await sentencesCollection.findOne({ _id: new ObjectId(id) })
      if (!sentence) {
        return res.status(404).json({ error: 'Sentence not found' })
      }
      res.json(sentence)
    } else {
      const sentence = fallbackSentences.find(s => s._id === id)
      if (!sentence) {
        return res.status(404).json({ error: 'Sentence not found' })
      }
      res.json(sentence)
    }
  } catch (error) {
    console.error('Error fetching sentence:', error)
    res.status(500).json({ error: 'Failed to fetch sentence' })
  }
})

// Add new sentence (for future admin functionality)
app.post('/api/sentences', async (req, res) => {
  try {
    const { frisian, dutch, pronunciation, audioUrl } = req.body
    
    if (!frisian || !dutch) {
      return res.status(400).json({ error: 'Frisian and Dutch translations are required' })
    }
    
    const newSentence = {
      frisian,
      dutch,
      pronunciation: pronunciation || '',
      audioUrl: audioUrl || null,
      createdAt: new Date()
    }
    
    if (dbConnected && sentencesCollection) {
      const result = await sentencesCollection.insertOne(newSentence)
      res.status(201).json({ _id: result.insertedId, ...newSentence })
    } else {
      res.status(503).json({ error: 'Database not available' })
    }
  } catch (error) {
    console.error('Error adding sentence:', error)
    res.status(500).json({ error: 'Failed to add sentence' })
  }
})

// ===== SOUNDS ENDPOINTS =====

// Get all sounds
app.get('/api/sounds', async (req, res) => {
  try {
    if (dbConnected && soundsCollection) {
      const sounds = await soundsCollection.find({}).toArray()
      // If MongoDB is empty, use fallback data
      if (sounds.length === 0) {
        res.json(fallbackSounds)
      } else {
        res.json(sounds)
      }
    } else {
      // Use fallback data
      res.json(fallbackSounds)
    }
  } catch (error) {
    console.error('Error fetching sounds:', error)
    res.status(500).json({ error: 'Failed to fetch sounds' })
  }
})

// Get all verbs
app.get('/api/verbs', async (req, res) => {
  try {
    if (dbConnected && verbsCollection) {
      const verbs = await verbsCollection.find({}).toArray()
      // If MongoDB is empty, use fallback data
      if (verbs.length === 0) {
        res.json(fallbackVerbs)
      } else {
        res.json(verbs)
      }
    } else {
      // Use fallback data
      res.json(fallbackVerbs)
    }
  } catch (error) {
    console.error('Error fetching verbs:', error)
    res.status(500).json({ error: 'Failed to fetch verbs' })
  }
})

// Audio files are served via static middleware above
// Place MP3 files in server/public/audio/ and they'll be available at /api/audio/filename.mp3

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📝 Database: ${dbConnected ? 'MongoDB' : 'Fallback mode'}`)
})
