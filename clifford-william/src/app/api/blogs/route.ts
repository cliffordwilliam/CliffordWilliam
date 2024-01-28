import { getBlogs } from "@/db/model/blog";
import { Response, Blog } from "@/db/types";
import { NextResponse } from "next/server";

export const GET = async () => {
  // GET
  const blogs = await getBlogs();
  // res
  return NextResponse.json<Response<Blog[]>>(
    {
      status: 200,
      message: "Success get Blogs!",
      data: blogs,
    },
    {
      status: 200,
    }
  );
};
