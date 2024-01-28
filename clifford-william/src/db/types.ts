// TYPES DUMP

import { ObjectId } from "mongodb";
import { z } from "zod";

// REST STYLE
export type Response<T> = {
  status: number; // always
  message?: string; // on ok
  data?: T; // on ok
  error?: string; // on bad
};

// PAYLOAD
export type Payload = {
  email: string;
};

// USER
export type User = {
  _id: ObjectId;
  email: string;
  password: string;
};
export const ZodUserInput = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});
export type UserOutput = Omit<User, "password">;
export type UserInput = Omit<User, "_id">;

// BLOG
export type Blog = {
  _id: ObjectId;
  title: string;
};
