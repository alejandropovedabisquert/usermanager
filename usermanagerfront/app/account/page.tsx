import Account from "@/components/user/account/Account";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Account',
}

export default function Page() {
  return <Account/>;
}
