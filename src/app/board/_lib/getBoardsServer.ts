export const getBoardsServer = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/board?id=1`, {
    next: {
      tags: ['boards']
    },
    cache: 'no-store'
  });

  if (!res.ok) throw new Error('board server fail');
  return res.json();
};

// import { QueryFunction } from "@tanstack/query-core";
// import { Post } from "@/model/Post";
// import { cookies } from "next/headers";

// export const getUserPostsServer: QueryFunction<
//   Post[],
//   [_1: string, _2: string, string]
// > = async ({ queryKey }) => {
//   const [_1, _2, username] = queryKey;
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}/posts?cursor=0`,
//     {
//       next: {
//         tags: ["posts", "users", username],
//       },
//       credentials: "include",
//       headers: { Cookie: cookies().toString() },
//       cache: "no-store",
//     }
//   );
//   // The return value is *not* serialized
//   // You can return Date, Map, Set, etc.

//   if (!res.ok) {
//     // This will activate the closest `error.js` Error Boundary
//     throw new Error("Failed to fetch data");
//   }

//   return res.json();
// };
