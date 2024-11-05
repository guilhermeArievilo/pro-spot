import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '../ui/alert-dialog';

interface ConfirmAction {
  title: string;
  description: string;
  open: boolean;
  onChangeOpen: (open: boolean) => void;
  onConfirm: () => void;
}

export default function ConfirmAction({
  title,
  description,
  open,
  onChangeOpen,
  onConfirm
}: ConfirmAction) {
  return (
    <AlertDialog open={open} onOpenChange={onChangeOpen}>
      <AlertDialogContent className="bg-background/60 backdrop-blur-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Continuar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
