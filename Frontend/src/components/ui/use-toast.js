import { toast as sonnerToast } from "sonner";

export const toast = ({ title, description, variant }) => {
  if (variant === "destructive") {
    sonnerToast.error(title, {
      description,
    });
  } else {
    sonnerToast(title, {
      description,
    });
  }
};
