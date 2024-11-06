import { mediaObjectSchema } from '@/application/entities';
import { User } from '@/application/modules/user/entities';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  subject: z.string().min(1, 'Por favor, insira o assunto da mensagem'),
  message: z
    .string()
    .min(1, 'Faça uma mensagem no campo acima explicando seu problema')
});

export type ProfileFormData = z.infer<typeof formSchema>;

export default function useSupportLeadAccount(user: User) {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: '',
      message: ''
    }
  });

  return {
    form
  };
}
