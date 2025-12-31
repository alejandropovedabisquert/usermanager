import Info from "@/components/user/info/Info";
import { usersApi } from "@/lib/api/users";
import { notFound } from "next/navigation";

async function fetchUserById({ id }: { id: string }) {
  const user = usersApi.getById(id);
  return user;
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
