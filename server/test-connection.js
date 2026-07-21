const { MongoClient } = require('mongodb')
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('Testing MongoDB connection...')
console.log('URI:', MONGODB_URI ? MONGODB_URI.replace(/:[^:@]+@/, ':****@') : 'NOT SET')

async function testConnection() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env file')
    process.exit(1)
  }

  console.log('\n⏳ Attempting to connect...')
  
  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // 5 second timeout
    connectTimeoutMS: 5000
  })

  try {
    await client.connect()
    console.log('✅ Successfully connected to MongoDB!')
    
    const db = client.db('frysk_foar_heleen')
    
    // List collections
    const collections = await db.listCollections().toArray()
    console.log('\n📚 Collections found:', collections.map(c => c.name).join(', ') || 'none')
    
    // Count documents
    const wordsCount = await db.collection('words').countDocuments()
    const sentencesCount = await db.collection('sentences').countDocuments()
    
    console.log('📊 Words:', wordsCount)
    console.log('📊 Sentences:', sentencesCount)
    
    await client.close()
    console.log('\n✅ Test completed successfully!')
    process.exit(0)
    
  } catch (error) {
    console.error('\n❌ Connection failed!')
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    
    if (error.message.includes('ENOTFOUND')) {
      console.error('\n💡 DNS lookup failed - the cluster hostname cannot be resolved')
      console.error('   Possible causes:')
      console.error('   - Internet connection issue')
      console.error('   - Firewall blocking DNS queries')
      console.error('   - VPN interference')
    } else if (error.message.includes('ETIMEDOUT') || error.message.includes('timeout')) {
      console.error('\n💡 Connection timeout')
      console.error('   Possible causes:')
      console.error('   - Cluster is paused (check MongoDB Atlas)')
      console.error('   - IP not whitelisted (check Network Access in Atlas)')
      console.error('   - Firewall blocking outbound connections')
    } else if (error.message.includes('Authentication failed')) {
      console.error('\n💡 Wrong username or password')
      console.error('   - Check Database Access in MongoDB Atlas')
      console.error('   - Verify credentials in .env file')
    }
    
    process.exit(1)
  }
}

testConnection()
