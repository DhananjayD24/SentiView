// src/components/ui/sonner.jsx
import { Toaster } from "sonner";

export function SonnerToaster() {
  return (
    <Toaster
      richColors
      position="top-right"
      closeButton
      expand
    />
  );
}
