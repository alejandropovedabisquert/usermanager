import UserInfo from "@/components/userInfo/UserInfo";
import { usersApi } from "@/lib/api/users";
import { redirect } from "next/navigation";

async function fetchCurrentUser() {
  const user = await usersApi.getCurrentUser();
  return user;
}

export default async function Page() {
  const currentUser = await fetchCurrentUser();
  console.log(currentUser);
  if (!currentUser) {
    redirect("/login");
  }
  return (
    <div>
      <UserInfo user={currentUser} />
    </div>
  );
}