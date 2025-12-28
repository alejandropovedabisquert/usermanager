import UserInfo from "@/components/userInfo/UserInfo";
import { usersApi } from "@/lib/api/users";

async function fetchUserByUsername({ username }: { username: string }) {
  const user = usersApi.getByUsername(username);
  return user;
}

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const { username } = await params;
  const user = await fetchUserByUsername({ username });
  if (!user) {
    return <div>User not found</div>;
  }
  return (
    <div>
      <UserInfo user={user} />
    </div>
  );
}
