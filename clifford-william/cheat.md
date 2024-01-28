# src sibling, .env.local

```
MONGODB_CONNECTION_STRING=mongodb+srv://ccliffordwilliam:dteERBvwdULG2ICC@cluster0.54ebinm.mongodb.net/
MONGODB_DB_NAME=tokped
JWT_SECRET=secret
```

# dependencies

```json
{
  "name": "tokped",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "jose": "^5.2.0",
    "jsonwebtoken": "^9.0.2",
    "mongodb": "^6.3.0",
    "next": "14.0.4",
    "react": "^18",
    "react-dom": "^18",
    "react-infinite-scroll-component": "^6.1.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.0.4",
    "typescript": "^5"
  },
  "trustedDependencies": ["bcryptjs"]
}
```

```
npm i
```

# src child, db dir, db child, config.ts

```ts
// RETURNS DB
import { MongoClient } from "mongodb";

const connectionString = process.env.MONGODB_CONNECTION_STRING;

let client: MongoClient;

export const getDb = async (dbName: string) => {
  // stop undefined type
  if (connectionString === undefined) {
    throw new Error(
      "MONGODB_CONNECTION_STRING is undefined. Provide a valid connection string."
    );
  }
  // connect 1 time
  if (!client) {
    client = await MongoClient.connect(connectionString);
    await client.connect();
  }
  // return db
  return client.db(dbName);
};
```

# db child, model dir

used by route.ts or page.ts

# db child, helper.ts

```ts
import bcryptjs from "bcryptjs";
import { Response } from "./types";
import { z } from "zod";
import jwt from "jsonwebtoken";
import * as jose from "jose";

export function handleError(err: unknown): Response<never> {
  console.log(err);
  // 400 zod's
  if (err instanceof z.ZodError) {
    const zodErr = err as z.ZodError;
    const errPath = zodErr.issues[0].path[0];
    const errMessage = zodErr.issues[0].message;
    return {
      status: 400,
      error: `${errPath} - ${errMessage}`,
    };
  }
  // 500
  return {
    status: 500,
    message: "Internal server error",
  };
}

export function hash(text: string): string {
  return bcryptjs.hashSync(text);
}

export function compare(text: string, hash: string): boolean {
  return bcryptjs.compareSync(text, hash);
}

export function sign(payload: object) {
  return jwt.sign(payload, process.env.JWT_SECRET || "secret");
}

export function verify(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET || "secret");
}

export const verifyJose = async <T>(token: string) => {
  const secretKey = new TextEncoder().encode(
    process.env.JWT_SECRET || "secret"
  );
  const payloadJose = await jose.jwtVerify<T>(token, secretKey);
  return payloadJose.payload;
};
```

# db child, types.ts

dump all possible types here, see more in tokped repo...

```ts
import { ObjectId } from "mongodb";
import { z } from "zod";

// PAYLOAD
export type Payload = { id: string };

// REST style
export type Response<T> = {
  status: number;
  message?: string;
  data?: T;
  error?: string;
};

// USER
export type User = {
  _id: ObjectId;
  name?: string;
  username: string; // val: req, unique
  email: string; // val: req, unique, email
  password: string; // val: req, len min 5
};
export const ZodUserInput = z.object({
  name: z.string().optional(),
  username: z.string(), // val: req, unique
  email: z.string().email(), // val: req, unique, email
  password: z.string().min(5), // val: req, len min 5
});
export type UserInput = Omit<User, "_id">;
export type UserOutput = Omit<User, "password">;
```
