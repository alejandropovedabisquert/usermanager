"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import { useLogout } from "@/lib/hooks/useLogout";
import { User } from "@/types/user";

export default function UserProfile({
  currentUser,
}: {
  currentUser: User | null;
}) {
  const { logout } = useLogout();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-8 h-8 md:h-14 md:w-14 p-0 rounded-full"
        >
          <span className="sr-only">Open menu</span>
          <Avatar className="w-8 h-8 md:w-14 md:h-14">
            <AvatarImage
              src={
                currentUser ? "/logged_user_profile.svg" : "/user_profile.svg"
              }
            />
            <AvatarFallback>
              {currentUser
                ? `${currentUser.firstName.charAt(
                    0
                  )}${currentUser.lastName.charAt(0)}`
                : "CN"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currentUser ? (
          <>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href={`/account`}>Account</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="cursor-pointer">
              Log out
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href="/login">Log in</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href="/register">Register</Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
