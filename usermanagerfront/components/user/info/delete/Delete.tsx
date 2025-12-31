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
import { User } from "@/types/user";
import { usePathname } from "next/navigation";

export default function Delete({ user, onDelete }: { user: User, onDelete?: () => void }) {
  const { deleteUser, isLoading } = useDelete();
  const pathname = usePathname();
  
  const handleSubmit = async () => {
    try {
      await deleteUser(user._id, onDelete);
      
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        {
          pathname == "/" ? (
            <div>Delete User</div>
          ) : (
            <Button variant="destructive">Delete User</Button>
          )
        }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleSubmit}>
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
