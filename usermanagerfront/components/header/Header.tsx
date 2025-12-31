import Link from "next/link";
import Profile from "../user/profile/profile";

export default async function Header() {
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
                <Profile />
              </div>
            </div>
          </nav>
        </header>
    );
}