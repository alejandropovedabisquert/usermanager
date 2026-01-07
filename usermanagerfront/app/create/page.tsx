import Create from "@/components/user/create/Create";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: 'Create User',
}

export default function Page() {
    return (
        <div>
            <Create />
        </div>
    );
}