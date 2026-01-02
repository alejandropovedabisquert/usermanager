"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, CheckCircle2, XCircle } from "lucide-react";
import { useEffect } from "react";

type AlertVariant = "default" | "destructive" | "success";

interface AlertMessageProps {
  variant?: AlertVariant;
  title?: string;
  message: string;
  autoHideDuration?: number;
  onClose?: () => void;
  show?: boolean;
}

export function AlertMessage({
  variant = "default",
  title,
  message,
  autoHideDuration = 5000,
  onClose,
  show = false,
}: AlertMessageProps) {

  useEffect(() => {
    if (show && autoHideDuration > 0 && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [show, autoHideDuration, onClose]);

  const getIcon = () => {
    switch (variant) {
      case "destructive":
        return <XCircle className="h-4 w-4" />;
      case "success":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <Terminal className="h-4 w-4" />;
    }
  };

  const getDefaultTitle = () => {
    switch (variant) {
      case "destructive":
        return "Error!";
      case "success":
        return "Success!";
      default:
        return "Info";
    }
  };

  if (!show || !message) return null;

  return (
    <div className="fixed right-4 bottom-4 max-w-sm w-full z-50">
      <Alert variant={variant}>
        {getIcon()}
        <AlertTitle>{title || getDefaultTitle()}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
}