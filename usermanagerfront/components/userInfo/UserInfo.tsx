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
import { Button } from "../ui/button";
import Link from "next/link";
import { ButtonGroup } from "../ui/button-group";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useAuth } from "@/lib/context/AuthContext";

export default function UserInfo({ user }: { user: User }) {
  const { isAdmin, currentUser } = useAuth();
  console.log(user);

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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="default">Edit User</Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-screen overflow-auto">
                      <form action="">
                        <DialogHeader>
                          <DialogTitle>Edit User</DialogTitle>
                          <DialogDescription>
                            Here you can edit the user information.
                          </DialogDescription>
                        </DialogHeader>
                        <Field className="my-6">
                          <FieldLabel
                            htmlFor="username"
                            className="block text-sm font-medium mb-1"
                          >
                            Username
                          </FieldLabel>
                          <Input
                            type="text"
                            id="username"
                            defaultValue={user.username}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          />
                        </Field>
                        <FieldGroup className="grid grid-cols-2 gap-4 mb-6">
                          <Field>
                            <FieldLabel
                              htmlFor="firstName"
                              className="block text-sm font-medium mb-1"
                            >
                              First Name
                            </FieldLabel>
                            <Input
                              type="text"
                              id="firstName"
                              defaultValue={user.firstName}
                              className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                          </Field>
                          <Field>
                            <FieldLabel
                              htmlFor="lastName"
                              className="block text-sm font-medium mb-1"
                            >
                              Last Name
                            </FieldLabel>
                            <Input
                              type="text"
                              id="lastName"
                              defaultValue={user.lastName}
                              className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                          </Field>
                        </FieldGroup>
                        <Field className="mb-6">
                          <FieldLabel
                            htmlFor="email"
                            className="block text-sm font-medium mb-1"
                          >
                            Email
                          </FieldLabel>
                          <Input
                            type="email"
                            id="email"
                            defaultValue={user.email}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          />
                        </Field>
                        <Field className="mb-6">
                          <FieldLabel
                            htmlFor="password"
                            className="block text-sm font-medium mb-1"
                          >
                            Password
                          </FieldLabel>
                          <Input
                            type="password"
                            id="password"
                            placeholder="Enter new password"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          />
                        </Field>
                        <Field className="mb-6">
                          <FieldLabel
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium mb-1"
                          >
                            Confirm Password
                          </FieldLabel>
                          <Input
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirm new password"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          />
                        </Field>
                        {isAdmin && (
                          <FieldGroup className="grid grid-cols-2 gap-4 mb-6">
                            <Field>
                              <FieldLabel
                                htmlFor="role"
                                className="block text-sm font-medium mb-1"
                              >
                                Role
                              </FieldLabel>
                              <select
                                id="role"
                                defaultValue={user.role}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                              </select>
                            </Field>
                            <Field>
                              <FieldLabel
                                htmlFor="status"
                                className="block text-sm font-medium mb-1"
                              >
                                Status
                              </FieldLabel>
                              <select
                                id="status"
                                defaultValue={
                                  user.isActive ? "active" : "inactive"
                                }
                                className="w-full border border-gray-300 rounded px-3 py-2"
                              >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                              </select>
                            </Field>
                          </FieldGroup>
                        )}
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                          </DialogClose>
                          <Button variant="default">Save Changes</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
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
