import UsersTable from "@/components/usersTable/UsersTable";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'User Management',
}

export default function Home() {
  return <UsersTable />;
}
