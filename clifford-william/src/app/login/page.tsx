import { getUserByEmail } from "@/db/model/user";
import { ZodUserInput } from "@/db/types";
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
    // no user? wrong password?
    const user = await getUserByEmail(zRes.data.email);
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
