import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { usersApi } from "@/lib/api/users";
import { useAuth } from "@/lib/context/AuthContext";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";

export default function Edit({ user }: { user: User }) {
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!role.trim()) {
      newErrors.role = "Role is required";
    }

    if (!isActive && isActive !== false) {
      newErrors.isActive = "Status is required";
    }

    if (password && password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!password && confirmPassword) {
      newErrors.confirmPassword = "Confirm password provided without password";
    }

    if (password && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    const updateData: Partial<{
      username: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      isActive: boolean;
      password?: string;
    }> = {};

    if (username !== user.username) updateData.username = username;
    if (email !== user.email) updateData.email = email;
    if (firstName !== user.firstName) updateData.firstName = firstName;
    if (lastName !== user.lastName) updateData.lastName = lastName;

    if (isAdmin) {
      if (role !== user.role) updateData.role = role;
      if (isActive !== user.isActive) updateData.isActive = isActive;
    }

    if (password) {
      updateData.password = password;
    }

    if (Object.keys(updateData).length === 0) {
      setOpen(false);
      return;
    }

    try {
      await usersApi.update(user._id, updateData);
      router.refresh();
      setOpen(false);

      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const resetForm = () => {
    setUsername(user.username);
    setEmail(user.email);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setRole(user.role);
    setIsActive(user.isActive);
    setPassword("");
    setConfirmPassword("");
    setErrors({});
  };
  return (
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
              aria-invalid={!!errors.username}
            />
            {errors.username && <FieldError>{errors.username}</FieldError>}
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
                aria-invalid={!!errors.firstName}
              />
              {errors.firstName && <FieldError>{errors.firstName}</FieldError>}
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
                aria-invalid={!!errors.lastName}
              />
              {errors.lastName && <FieldError>{errors.lastName}</FieldError>}
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
              aria-invalid={!!errors.email}
            />
            {errors.email && <FieldError>{errors.email}</FieldError>}
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
              aria-invalid={!!errors.password}
            />
            {errors.password && <FieldError>{errors.password}</FieldError>}
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
              aria-invalid={!!errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <FieldError>{errors.confirmPassword}</FieldError>
            )}
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
                  aria-invalid={!!errors.role}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && <FieldError>{errors.role}</FieldError>}
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
                  onChange={(e) => setIsActive(e.target.value === "true")}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  aria-invalid={!!errors.isActive}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
                {errors.isActive && <FieldError>{errors.isActive}</FieldError>}
              </Field>
            </FieldGroup>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            </DialogClose>
            <Button variant="default" type="submit">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
