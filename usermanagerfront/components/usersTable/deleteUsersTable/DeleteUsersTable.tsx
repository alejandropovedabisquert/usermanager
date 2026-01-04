import { Button } from "@/components/ui/button";
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
import { useDelete } from "@/lib/hooks/useDelete";
import { useState } from "react";

export default function DeleteUsersTable({ usersIds, onDelete, onClick }: { usersIds: string[], onDelete?: () => void, onClick?: () => void }) {
  const { deleteUser, isLoading } = useDelete();
  const [open, setOpen] = useState<boolean>(false);
  
  const handleSubmit = async () => {
    try {
      await deleteUser(usersIds, onDelete, onClick);
      setOpen(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="cursor-pointer">Delete {usersIds.length} User{usersIds.length > 1 ? "s" : ""}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {usersIds.length} User{usersIds.length > 1 ? "s" : ""}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {usersIds.length} user{usersIds.length > 1 ? "s" : ""}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" className="cursor-pointer">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleSubmit} className="cursor-pointer" >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
