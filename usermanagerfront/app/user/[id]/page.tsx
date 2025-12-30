import UserInfo from "@/components/userInfo/UserInfo";
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
      <UserInfo user={user} />
    </div>
  );
}
