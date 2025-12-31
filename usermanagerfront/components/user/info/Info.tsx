"use client";
import { User } from "@/types/user";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ButtonGroup } from "@/components/ui/button-group";
import { useAuth } from "@/lib/context/AuthContext";
import Edit from "./edit/Edit";

export default function Info({ user }: { user: User }) {
  const { isAdmin, currentUser } = useAuth();


  return (
    <div className="max-w-2xl mx-auto">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-xl">User details</CardTitle>
          <CardDescription>
            Detailed information about the selected user
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Username</h3>
              <p className="text-sm text-gray-600">{user.username}</p>
            </div>
            <div>
              <h3 className="font-medium">Email</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
            <div>
              <h3 className="font-medium">First Name</h3>
              <p className="text-sm text-gray-600">{user.firstName}</p>
            </div>
            <div>
              <h3 className="font-medium">Last Name</h3>
              <p className="text-sm text-gray-600">{user.lastName}</p>
            </div>
            {isAdmin && (
              <>
                <div>
                  <h3 className="font-medium">Role</h3>
                  <p className="text-sm text-gray-600">{user.role}</p>
                </div>
                <div>
                  <h3 className="font-medium">Status</h3>
                  <p className="text-sm text-gray-600">
                    {user.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Created At</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Updated At</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <CardAction>
            <ButtonGroup>
              <Button variant="secondary" asChild>
                <Link href="/">Back to Users</Link>
              </Button>
              {(currentUser?.username === user.username || isAdmin) && (
                <>
                  <Edit user={user} />
                  {isAdmin && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive">Delete User</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete User</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this user? This
                            action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                          </DialogClose>
                          <Button variant="destructive">Delete</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </>
              )}
            </ButtonGroup>
          </CardAction>
        </CardFooter>
      </Card>
    </div>
  );
}
