import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Page = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <form
        action={async () => {
          "use server";
          cookies().get("token") && cookies().delete("token");
          redirect("/login");
        }}
      >
        <button>Logout</button>
      </form>
    </div>
  );
};

export default Page;
