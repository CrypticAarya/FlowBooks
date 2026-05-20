import { MongoClient } from 'mongodb';

async function run() {
  const uri = "mongodb+srv://crypticaarya_db_user:wcKBgsMBKDK2O9HJ@cluster0.eqa3zb1.mongodb.net/?appName=Cluster0";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('test');
    await database.collection('invoices').dropIndex('invoiceId_1');
    console.log('Index dropped successfully');
  } catch(err) {
    console.log('Error dropping index:', err.message);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
