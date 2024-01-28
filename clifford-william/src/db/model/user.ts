import { Db, ObjectId } from "mongodb";
import { getClient } from "../config";
import { UserInput, UserOutput } from "../types";
import { hash } from "../helper";

const COLLECTION_USER = "users";

export const getCliffordWilliamDb = async () => {
  const client = await getClient();
  const db: Db = client.db(process.env.MONGODB_DB_NAME);
  return db;
};

export const getUserByEmail = async (email: string) => {
  const db: Db = await getCliffordWilliamDb();
  const user = await db.collection(COLLECTION_USER).findOne({ email: email });
  return user;
};

export const postUser = async (input: UserInput) => {
  // user -> userHashed
  const userHashed: UserInput = {
    ...input,
    password: hash(input.password),
  };
  // POST
  const db: Db = await getCliffordWilliamDb();
  const response = await db.collection(COLLECTION_USER).insertOne(userHashed);
  // return -> response + userHashed -> UserOutput
  const { password, ...addedUser } = {
    ...userHashed,
    _id: response.insertedId as ObjectId,
  };
  return addedUser as UserOutput;
};
