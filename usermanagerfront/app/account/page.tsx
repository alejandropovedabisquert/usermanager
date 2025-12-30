"use client";
import UserInfo from "@/components/userInfo/UserInfo";
import { useAuth } from "@/lib/context/AuthContext";

export default function Page() {
  const {currentUser, isLoading} = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!currentUser) {
    return <div>User not found.</div>;
  }
  return (
    <div>
      <UserInfo user={currentUser} />
    </div>
  );
}