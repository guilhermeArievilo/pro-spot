import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '../../../../../../components/ui/alert-dialog';
import useDeletePageModel, { DeletePageDialogProps } from './delete-page-model';
import { Input } from '@/components/ui/input';

export default function DeletePageDialog({
  open,
  onChangeOpen,
  onSubmitConfirm,
  page
}: DeletePageDialogProps) {
  const { form, onSubmit } = useDeletePageModel({ page, onChangeOpen });
  return (
    <AlertDialog open={open} onOpenChange={onChangeOpen}>
      <AlertDialogContent className="bg-background/60 backdrop-blur-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">{`Você está excluindo a página "${page.name}", tem certeza disso ?`}</AlertDialogTitle>
          <AlertDialogDescription>
            <span>{`Para continuar a exclusão, repita no campo abaixo o seguinte fragmento: `}</span>
            <span className="text-destructive px-2">{`delete::${page.slug}`}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form>
            <FormField
              control={form.control}
              name="repeatConfirmation"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormControl>
                    <Input
                      placeholder="Digite aqui o fragmento acima"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={form.handleSubmit((data) =>
              onSubmit(data, onSubmitConfirm)
            )}
          >
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
