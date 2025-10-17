import { MongoClient } from "mongodb";
const uri= process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error("mongodb url missing in env!!");
}

if (process.env.NODE_ENV === "development") {
  // In dev mode, use a global var so connection is reused
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // In prod, create new client for each
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;