import Link from "next/link";
import UserProfile from "../userProfile/UserProfile";
import { usersApi } from "@/lib/api/users";

async function fetchCurrentUser() {
  const user = await usersApi.getCurrentUser();
  return user;
}

export default async function Header() {
    const currentUser = await fetchCurrentUser();
    return (
        <header>
          <nav className="w-full p-4 border-b">
            <div className="px-2 md:px-24 flex w-full flex-row justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">
                  <Link href="/">Node.js User Manager App</Link>
                </h1>
              </div>
              <div className="h-fit">
                <UserProfile currentUser={currentUser} />
              </div>
            </div>
          </nav>
        </header>
    );
}