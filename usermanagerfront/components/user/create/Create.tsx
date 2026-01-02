"use client";
import { useState } from "react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { UserFormErrors, validateUserForm } from "@/lib/validation";
import { useCreate } from "@/lib/hooks/useCreate";

export default function Create() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [role, setRole] = useState<string>("user");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [errors, setErrors] = useState<UserFormErrors>({});
  const { create, isLoading } = useCreate();

  const validateForm = () => {
    const newErrors = validateUserForm({
      username,
      email,
      firstName,
      lastName,
      password,
      confirmPassword,
      role,
      isActive,
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const cleanupFields = () => {
    setUsername("");
    setEmail("");
    setFirstName("");
    setLastName("");
    setPassword("");
    setConfirmPassword("");
    setRole("user");
    setIsActive(true);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    await create(
      username,
      password,
      email,
      firstName,
      lastName,
      role,
      isActive
    );
    cleanupFields();
  };

  return (
    <div className="max-w-2xl mx-auto mt-20">
      <div className={cn("flex flex-col gap-6")}>
        <Card>
          <CardHeader>
            <CardTitle>Create an Account</CardTitle>
            <CardDescription>
              Enter the details to create a new account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup className="grid grid-cols-2 gap-4 mb-6">
                <Field>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    aria-invalid={!!errors.username}
                  />
                  {errors.username && (
                    <FieldError>{errors.username}</FieldError>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <FieldError>{errors.email}</FieldError>}
                </Field>
              </FieldGroup>
              <FieldGroup className="grid grid-cols-2 gap-4 mb-6">
                <Field>
                  <FieldLabel htmlFor="firtsName">First Name</FieldLabel>
                  <Input
                    id="firtstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    aria-invalid={!!errors.firstName}
                  />
                  {errors.firstName && (
                    <FieldError>{errors.firstName}</FieldError>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    aria-invalid={!!errors.lastName}
                  />
                  {errors.lastName && (
                    <FieldError>{errors.lastName}</FieldError>
                  )}
                </Field>
              </FieldGroup>
              <FieldGroup className="grid grid-cols-2 gap-4 mb-6">
                <Field>
                  <FieldLabel htmlFor="role">Role</FieldLabel>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    aria-invalid={!!errors.role}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  {errors.role && <FieldError>{errors.role}</FieldError>}
                </Field>
                <Field>
                  <FieldLabel htmlFor="status">Status</FieldLabel>
                  <select
                    id="status"
                    value={isActive ? "true" : "false"}
                    onChange={(e) => setIsActive(e.target.value === "true")}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    aria-invalid={!!errors.isActive}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                  {errors.isActive && (
                    <FieldError>{errors.isActive}</FieldError>
                  )}
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!errors.password}
                  />
                  {errors.password && (
                    <FieldError>{errors.password}</FieldError>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    aria-invalid={!!errors.confirmPassword}
                  />
                  {errors.confirmPassword && (
                    <FieldError>{errors.confirmPassword}</FieldError>
                  )}
                </Field>
                <Field>
                  <Button type="submit" disabled={isLoading} className="cursor-pointer">
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
