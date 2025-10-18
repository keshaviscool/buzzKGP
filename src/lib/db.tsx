import { MongoClient } from "mongodb";
const uri= "mongodb+srv://keshav:keshav@kalster69.42ysvju.mongodb.net/?retryWrites=true&w=majority&appName=kalster69";
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

// if (!uri) {
//   throw new Error(`MongoDB URL missing in env! Node ENV: ${process.env.NODE_ENV}`);
// }

if (process.env.NODE_ENV === "development") {
  // In dev mode, use a global var so connection is reused
  // @ts-ignore
  if (!(global)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    // @ts-ignore
    (global)._mongoClientPromise = client.connect();
  }
  // @ts-ignore
  clientPromise = (global)._mongoClientPromise;
} else {
  // In prod, create new client for each
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;