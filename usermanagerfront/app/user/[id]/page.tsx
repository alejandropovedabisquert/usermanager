import Info from "@/components/user/info/Info";
import { usersApi } from "@/lib/api/users";
import { notFound } from "next/navigation";

async function fetchUserById({ id }: { id: string }) {
  try {
    const user = await usersApi.getById(id);
    return user;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
}

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const user = await fetchUserById({ id });
  if (!user) {
    return notFound();
  }
  return (
    <div>
      <Info user={user} />
    </div>
  );
}
