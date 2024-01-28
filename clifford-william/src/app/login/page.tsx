import { compare, sign } from "@/db/helper";
import { getUserByEmail } from "@/db/model/user";
import { Payload, ZodUserInput } from "@/db/types";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = () => {
  const login = async (formData: FormData) => {
    "use server";
    // get form
    const email = formData.get("email");
    const password = formData.get("password");
    // zod check
    const zRes = ZodUserInput.safeParse({
      email,
      password,
    });
    // zod invalid? throw
    if (!zRes.success) {
      // throw errFinalMessage
      const errPath = zRes.error.issues[0].path[0];
      const errMessage = zRes.error.issues[0].message;
      const errFinalMessage = `${errPath} - ${errMessage}`;
      throw new Error(errFinalMessage);
    }
    // no user? wrong password? throw
    const user = await getUserByEmail(zRes.data.email);
    if (!user || !compare(zRes.data.password, user.password)) {
      throw new Error("Invalid credentials");
    }
    // payload -> token
    const payload: Payload = {
      email: zRes.data.email,
    };
    const token = sign(payload);
    // save token to cookie
    cookies().set("token", token, {
      httpOnly: true,
      secure: false,
      // expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
      sameSite: "strict",
    });
    // kick dashboard
    return redirect(`/dashboard`);
  };
  return (
    <main className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="container mx-auto p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
        <form action={login} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-semibold mb-1">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
};

export default Page;
