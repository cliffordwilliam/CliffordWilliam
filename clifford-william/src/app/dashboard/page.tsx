import { postBlog } from "@/db/model/blog";
import { ZodBlogInput } from "@/db/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Page = () => {
  const postBlogAction = async (formData: FormData) => {
    "use server";
    // get form
    const title = formData.get("title");
    // zod check
    const zRes = ZodBlogInput.safeParse({
      title,
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
    const blog = await postBlog({
      title: zRes.data.title,
    });
    redirect("/blogs");
  };
  return (
    <div className="container mx-auto my-8 p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <form
        action={async () => {
          "use server";
          cookies().get("token") && cookies().delete("token");
          redirect("/login");
        }}
        className="mb-4"
      >
        <button
          type="submit"
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:border-red-300"
        >
          Logout
        </button>
      </form>
      <form action={postBlogAction} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="title" className="text-sm font-semibold mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
        >
          Post Blog
        </button>
      </form>
    </div>
  );
};

export default Page;
