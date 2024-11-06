import { mediaObjectSchema } from '@/application/entities';
import { User } from '@/application/modules/user/entities';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  name: z
    .string({
      message: 'Nome obrigatório'
    })
    .min(1, {
      message: 'Nome obrigatório'
    }),
  lastName: z.string().optional(),
  email: z.string().email(),
  phoneNumber: z.string(),
  photoProfile: mediaObjectSchema.optional()
});

export type ProfileFormData = z.infer<typeof formSchema>;

export default function useEditProfileModel(user: User) {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name,
      lastName: user?.lastName,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
      photoProfile: user?.photoProfile
    }
  });

  return {
    form
  };
}
