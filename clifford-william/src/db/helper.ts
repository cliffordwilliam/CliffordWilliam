import bcryptjs from "bcryptjs";
import { Payload, Response } from "./types";
import { z } from "zod";
import jwt from "jsonwebtoken";
import * as jose from "jose";

export const handleError = (err: unknown): Response<never> => {
  // 400 zod
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
};

export const hash = (value: string) => {
  return bcryptjs.hashSync(value);
};

export const compare = (value: string, hash: string) => {
  return bcryptjs.compareSync(value, hash);
};

export const sign = (payload: Payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || "secret");
};

export const verifyJose = async <T>(token: string) => {
  const secretKey = new TextEncoder().encode(
    process.env.JWT_SECRET || "secret"
  );
  const payloadJose = await jose.jwtVerify<T>(token, secretKey);
  return payloadJose.payload;
};
