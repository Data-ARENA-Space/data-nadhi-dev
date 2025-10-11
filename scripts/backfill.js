const { MongoClient } = require('mongodb');
const fs = require('fs').promises;
const path = require('path');

const config = {
  url: 'mongodb://mongo:27017',
  dbName: 'datanadhi_dev'
};

async function connectToMongo() {
  const client = new MongoClient(config.url);
  await client.connect();
  console.log('✅ Connected to MongoDB');
  return client.db(config.dbName);
}

async function loadBackfillData() {
  const dataPath = path.join(__dirname, '..', 'backfill_data', 'mongo.json');
  const rawData = await fs.readFile(dataPath, 'utf8');
  return JSON.parse(rawData);
}

async function insertDataToCollection(db, collectionName, data) {
  if (!data || data.length === 0) {
    console.log(`⏭️  No data to insert for ${collectionName}`);
    return;
  }

  const collection = db.collection(collectionName);
  
  try {
    // Clear existing data (optional - remove if you want to preserve existing data)
    await collection.deleteMany({});
    console.log(`🧹 Cleared existing data from ${collectionName}`);

    // Insert new data
    const result = await collection.insertMany(data);
    console.log(`✅ Inserted ${result.insertedCount} documents into ${collectionName}`);
  } catch (error) {
    console.error(`❌ Error inserting data into ${collectionName}:`, error.message);
    throw error;
  }
}

async function runBackfill() {
  let client;
  
  try {
    // Load data from JSON file
    console.log('📄 Loading backfill data...');
    const backfillData = await loadBackfillData();
    
    // Connect to MongoDB
    client = new MongoClient(config.url);
    await client.connect();
    const db = client.db(config.dbName);
    console.log('✅ Connected to MongoDB');

    // Insert data for each collection
    const collections = Object.keys(backfillData);
    console.log(`📚 Found ${collections.length} collections to backfill: ${collections.join(', ')}`);

    for (const collectionName of collections) {
      console.log(`\n🔄 Processing ${collectionName}...`);
      await insertDataToCollection(db, collectionName, backfillData[collectionName]);
    }

    console.log('\n✨ Backfill completed successfully!');
    
    // Show summary
    console.log('\n📊 Summary:');
    for (const collectionName of collections) {
      const count = await db.collection(collectionName).countDocuments();
      console.log(`   ${collectionName}: ${count} documents`);
    }

  } catch (error) {
    console.error('❌ Backfill failed:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 MongoDB connection closed');
    }
  }
}

// Allow running with command line options
const args = process.argv.slice(2);
const preserveData = args.includes('--preserve');

if (preserveData) {
  console.log('⚠️  Running in preserve mode - existing data will NOT be cleared');
}

runBackfill().catch(console.error);
