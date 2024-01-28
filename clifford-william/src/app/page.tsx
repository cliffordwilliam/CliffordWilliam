import { getUserByEmail, postUser } from "@/db/model/user";
import { ZodUserInput } from "@/db/types";
import Image from "next/image";
import Link from "next/link";
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
  };
  return (
    <main>
      <div className="container mx-auto my-8 p-8">
        <Image
          src="/fastgenomics.png"
          width={500}
          height={500}
          alt="Picture of the author"
        />
      </div>
    </main>
  );
};

export default Page;
