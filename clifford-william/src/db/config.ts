import { MongoClient } from "mongodb";

const connectionString = process.env.MONGODB_CONNECTION_STRING;
if (!connectionString) {
  throw new Error("MONGODB_CONNECTION_STRING is not defined");
}
let client: MongoClient;

export const getClient = async () => {
  if (!client) {
    client = await MongoClient.connect(connectionString);
    await client.connect();
  }
  return client;
};
