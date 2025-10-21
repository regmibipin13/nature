"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useAlertDialog } from "./use-alert-dialog";

export function GlobalAlertDialog() {
  const { isOpen, title, description, onConfirm, closeDialog } =
    useAlertDialog();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!onConfirm) {
      closeDialog();
      return;
    }

    try {
      setLoading(true);
      await onConfirm(); // wait for async confirm
      closeDialog(); // only close after success
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading} onClick={closeDialog}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={loading}>
            {loading ? "Processing..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
