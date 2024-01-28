import { getUserByEmail, postUser } from "@/db/model/user";
import { ZodUserInput } from "@/db/types";
import { redirect } from "next/navigation";

const Page = () => {
  const register = async (formData: FormData) => {
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
    // POST
    const user = await postUser({
      email: zRes.data.email,
      password: zRes.data.password,
    });
    console.log(user);
  };
  return (
    <main>
      <form action={register}>
        <label htmlFor="email">Email</label>
        <input type="text" id="email" name="email" />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" />
        <button>Register</button>
      </form>
    </main>
  );
};

export default Page;
