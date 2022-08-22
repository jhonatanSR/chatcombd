const {MongoClient,ObjectId} = require('mongodb');
async function connect(){
    if(global.db) return global.db;
    const conn = await MongoClient.connect("mongodb://localhost:27017/");
    if(!conn) return new Error("Can't connect");
    global.db = await conn.db("chat");
    return global.db;
  }

  async function insert(msg){
    const db = await connect();
    return db.collection("message").insertOne(msg);
  }

  async function findOne(id){
    const db = await connect();
    const objId = new ObjectId(id);
    return db.collection("message").findOne(objId);
  }

  async function find(msg){
    const db = await connect();
    return db.collection("message").findOne(msg);
  }
  module.exports={insert,findOne,find}