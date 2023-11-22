const { MongoClient } = require('mongodb');
require('dotenv').config();
const uri = "mongodb://admin:off@localhost:27017";
const client = new MongoClient(uri);

async function openConnect() {
  try {
    await client.connect();
    _db = client.db('off');
    return _db;
  } catch (e) {
    console.error(e);
  }
}

async function closeConnection() {
  await client.close();
  console.log("Connection was closed.");
}

module.exports = { openConnect, closeConnection }