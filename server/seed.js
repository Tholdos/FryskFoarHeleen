const { MongoClient } = require('mongodb')
require('dotenv').config()

const wordsData = require('./words-data.json')
const sentencesData = require('./sentences-data.json')
const soundsData = require('./sounds-data.json')
const verbsData = require('./verbs-data.json')

const MONGODB_URI = process.env.MONGODB_URI

async function seedDatabase() {
  if (!MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI not found in .env file')
    console.log('Please add your MongoDB connection string to server/.env')
    console.log('Example: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/frysk_foar_heleen')
    process.exit(1)
  }

  console.log('🌱 Starting database seed...')
  
  let client
  try {
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log('✅ Connected to MongoDB')
    
    const db = client.db('frysk_foar_heleen')
    
    // Seed Words
    const wordsCollection = db.collection('words')
    const existingWordsCount = await wordsCollection.countDocuments()
    
    if (existingWordsCount > 0) {
      console.log(`⚠️  Words collection already has ${existingWordsCount} documents`)
      console.log('Do you want to:')
      console.log('  1. Skip words import')
      console.log('  2. Clear and reimport all words')
      console.log('')
      console.log('To clear and reimport: npm run seed:clear')
      console.log('Skipping words import for now...')
    } else {
      await wordsCollection.insertMany(wordsData)
      console.log(`✅ Inserted ${wordsData.length} words`)
    }
    
    // Seed Sentences
    const sentencesCollection = db.collection('sentences')
    const existingSentencesCount = await sentencesCollection.countDocuments()
    
    if (existingSentencesCount > 0) {
      console.log(`⚠️  Sentences collection already has ${existingSentencesCount} documents`)
      console.log('Skipping sentences import...')
      console.log('To clear and reimport: npm run seed:clear')
    } else {
      await sentencesCollection.insertMany(sentencesData)
      console.log(`✅ Inserted ${sentencesData.length} sentences`)
    }
    
    // Seed Sounds
    const soundsCollection = db.collection('sounds')
    const existingSoundsCount = await soundsCollection.countDocuments()
    
    if (existingSoundsCount > 0) {
      console.log(`⚠️  Sounds collection already has ${existingSoundsCount} documents`)
      console.log('Skipping sounds import...')
      console.log('To clear and reimport: npm run seed:clear')
    } else {
      await soundsCollection.insertMany(soundsData)
      console.log(`✅ Inserted ${soundsData.length} sounds`)
    }
    
    // Seed Verbs
    const verbsCollection = db.collection('verbs')
    const existingVerbsCount = await verbsCollection.countDocuments()
    
    if (existingVerbsCount > 0) {
      console.log(`⚠️  Verbs collection already has ${existingVerbsCount} documents`)
      console.log('Skipping verbs import...')
      console.log('To clear and reimport: npm run seed:clear')
    } else {
      await verbsCollection.insertMany(verbsData)
      console.log(`✅ Inserted ${verbsData.length} verbs`)
    }
    
    console.log('')
    console.log('🎉 Database seeding completed!')
    console.log(`📊 Total: ${wordsData.length} words, ${sentencesData.length} sentences, ${soundsData.length} sounds, ${verbsData.length} verbs`)
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  } finally {
    if (client) {
      await client.close()
      console.log('👋 Disconnected from MongoDB')
    }
  }
}

async function clearAndSeed() {
  if (!MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI not found in .env file')
    process.exit(1)
  }

  console.log('🧹 Clearing existing data and reseeding...')
  
  let client
  try {
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log('✅ Connected to MongoDB')
    
    const db = client.db('frysk_foar_heleen')
    
    // Clear and seed words
    const wordsCollection = db.collection('words')
    await wordsCollection.deleteMany({})
    await wordsCollection.insertMany(wordsData)
    console.log(`✅ Cleared and inserted ${wordsData.length} words`)
    
    // Clear and seed sentences
    const sentencesCollection = db.collection('sentences')
    await sentencesCollection.deleteMany({})
    await sentencesCollection.insertMany(sentencesData)
    console.log(`✅ Cleared and inserted ${sentencesData.length} sentences`)
    
    // Clear and seed sounds
    const soundsCollection = db.collection('sounds')
    await soundsCollection.deleteMany({})
    await soundsCollection.insertMany(soundsData)
    console.log(`✅ Cleared and inserted ${soundsData.length} sounds`)
    
    // Clear and seed verbs
    const verbsCollection = db.collection('verbs')
    await verbsCollection.deleteMany({})
    await verbsCollection.insertMany(verbsData)
    console.log(`✅ Cleared and inserted ${verbsData.length} verbs`)
    
    console.log('')
    console.log('🎉 Database cleared and reseeded successfully!')
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    if (client) {
      await client.close()
      console.log('👋 Disconnected from MongoDB')
    }
  }
}

// Run appropriate function based on command line argument
const args = process.argv.slice(2)
if (args.includes('--clear')) {
  clearAndSeed()
} else {
  seedDatabase()
}
