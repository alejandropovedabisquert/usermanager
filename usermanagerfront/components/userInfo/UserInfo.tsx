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
import { usersApi } from "@/lib/api/users";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserInfo({ user }: { user: User }) {
  const { isAdmin, currentUser } = useAuth();
  const [username, setUsername] = useState<string>(user.username);
  const [email, setEmail] = useState<string>(user.email);
  const [firstName, setFirstName] = useState<string>(user.firstName);
  const [lastName, setLastName] = useState<string>(user.lastName);
  const [role, setRole] = useState<string>(user.role);
  const [isActive, setIsActive] = useState<boolean>(user.isActive);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  // console.log(user);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await usersApi
        .update(user._id, {
          username: username,
          email: email,
          firstName: firstName,
          lastName: lastName,
          role: role,
          isActive: isActive,
          // password: password,
        })
        .then(() => {
          router.refresh();
          setOpen(false);
        });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

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
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button variant="default">Edit User</Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-screen overflow-auto">
                      <form onSubmit={handleSubmit}>
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
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
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
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            onChange={(e) => setPassword(e.target.value)}
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
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
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
                                value={isActive ? "true" : "false"}
                                onChange={(e) =>
                                  setIsActive(e.target.value === "true")
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
                          <Button variant="default" type="submit">
                            Save Changes
                          </Button>
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
