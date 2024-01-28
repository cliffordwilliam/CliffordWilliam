import { compare, sign } from "@/db/helper";
import { getUserByEmail } from "@/db/model/user";
import { Payload, ZodUserInput } from "@/db/types";
import { cookies } from "next/headers";
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
    <main>
      <form action={login}>
        <label htmlFor="email">Email</label>
        <input type="text" id="email" name="email" />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" />
        <button>Login</button>
      </form>
    </main>
  );
};

export default Page;
