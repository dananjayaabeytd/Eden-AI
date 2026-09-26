"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { deleteSubmission } from "../actions";

/** Destructive action behind an explicit confirmation dialog. */
export function DeleteSubmission({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const confirm = () => {
    setError(null);
    startTransition(async () => {
      // On success the action redirects back to the list.
      const result = await deleteSubmission(id);
      if (!result.ok) setError(result.message);
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={(next) => !pending && setOpen(next)}>
      <AlertDialogTrigger render={<Button variant="destructive" size="lg" className="h-10 w-full rounded-full" />}>
        <Trash2 /> Delete submission
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this submission?</AlertDialogTitle>
          <AlertDialogDescription>
            The message from {name} will be permanently deleted. This can&apos;t be undone — use it for spam or data-deletion
            requests.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={confirm} disabled={pending}>
            {pending ? <Loader2 className="animate-spin" /> : <Trash2 />}
            {pending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
