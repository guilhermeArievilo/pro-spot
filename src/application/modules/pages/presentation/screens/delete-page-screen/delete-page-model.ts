import { Page } from '@/application/entities';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export interface DeletePageDialogProps {
  page: Page;
  open: boolean;
  onChangeOpen: (isOpen: boolean) => void;
  onSubmitConfirm: (pageId: string) => Promise<void>;
}

const formSchema = z.object({
  repeatConfirmation: z
    .string()
    .min(1, 'Você precisa repetir o fragmento acima para poder continuar')
});

type deletePageForm = z.infer<typeof formSchema>;

export default function useDeletePageModel({
  page,
  onChangeOpen
}: {
  page: Page;
  onChangeOpen: (isOpen: boolean) => void;
}) {
  const form = useForm<deletePageForm>({
    resolver: zodResolver(formSchema)
  });

  async function onSubmit(
    { repeatConfirmation }: deletePageForm,
    callback: (pageId: string) => Promise<void>
  ): Promise<void> {
    if (repeatConfirmation === `delete::${page.slug}`) {
      try {
        await callback(page.id).then(() => {
          form.reset();
          onChangeOpen(false);
          toast('Sua página foi excluída.');
        });
      } catch (e) {
        toast('Algo deu errado, tente novamente.');
      }
    } else {
      toast('Verifique se o que você escreveu está igual ao fragmento.');
    }
  }

  return {
    form,
    onSubmit
  };
}
