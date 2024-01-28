import { Db, ObjectId } from "mongodb";
import { getClient } from "../config";
import { Blog, UserInput, UserOutput } from "../types";
import { hash } from "../helper";

const COLLECTION_BLOG = "blogs";

export const getCliffordWilliamDb = async () => {
  const client = await getClient();
  const db: Db = client.db(process.env.MONGODB_DB_NAME);
  return db;
};

export const getBlogs = async () => {
  const db: Db = await getCliffordWilliamDb();
  const blogs = (await db
    .collection(COLLECTION_BLOG)
    .find()
    .toArray()) as Blog[];
  return blogs;
};
