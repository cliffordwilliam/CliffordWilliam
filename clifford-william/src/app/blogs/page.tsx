import { getBlogs } from "@/db/model/blog";

const Page = async () => {
  const blogs = await getBlogs();

  return (
    <div className="container mx-auto my-8 p-8">
      <h1 className="text-3xl font-bold mb-4">Blogs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {blogs.map((blog) => (
          <div
            key={blog._id.toString()}
            className="bg-white p-4 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold mb-2">Title: {blog.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
