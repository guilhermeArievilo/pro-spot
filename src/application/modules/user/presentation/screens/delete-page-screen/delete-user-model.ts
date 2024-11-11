import { Page } from '@/application/entities';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { User } from '../../../entities';

export interface DeleteUserDialogProps {
  user: User;
  open: boolean;
  onChangeOpen: (isOpen: boolean) => void;
  onSubmitConfirm: (userId: string) => Promise<void>;
}

const formSchema = z.object({
  repeatConfirmation: z
    .string()
    .min(1, 'Você precisa repetir o fragmento acima para poder continuar')
});

type deletePageForm = z.infer<typeof formSchema>;

export default function useDeletePageModel({
  user,
  onChangeOpen
}: {
  user: User;
  onChangeOpen: (isOpen: boolean) => void;
}) {
  const form = useForm<deletePageForm>({
    resolver: zodResolver(formSchema)
  });

  async function onSubmit(
    { repeatConfirmation }: deletePageForm,
    callback: (userId: string) => Promise<void>
  ): Promise<void> {
    if (repeatConfirmation === `delete::${user.email}`) {
      try {
        await callback(user.id).then(() => {
          form.reset();
          onChangeOpen(false);
          toast('Foi bom ter você com a gente, até mais!');
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
