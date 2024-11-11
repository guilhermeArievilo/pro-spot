'use client';

import { mediaObjectSchema } from '@/application/entities';
import Loading from '@/components/loading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { ImageInput } from '@/components/ui/image-input';
import { Input } from '@/components/ui/input';
import useProfileModel, { ProfileTabs } from './profile-viewmodel';
import { RadioGroup, RadioGroupBlockItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

import AppLogo from '@/assets/svg/icons/footer-logo.svg';
import useEditProfileModel from './edit-profile-model';
import useSupportLeadAccount from './support-lead-account';
import { Textarea } from '@/components/ui/textarea';
import DeleteUserDialog from '@/application/modules/user/presentation/screens/delete-page-screen/delete-user-dialog';

export default function ProfilePage() {
  const {
    profileOptionsTabs,
    uploadProfilePhoto,
    user,
    currentTab,
    setCurrentTab,
    handlerEditProfileSubmit,
    deleteUserDialogOpen,
    setDeleteUserDialogOpen,
    handlerDeleteProfile
  } = useProfileModel();

  if (!user) return <Loading />;

  const { form: editProfileForm } = useEditProfileModel(user);
  const { form: supportForm } = useSupportLeadAccount(user);

  return (
    <main className="container grid grid-cols-12 gap-6 py-36">
      <div className="col-span-4 p-6 h-full flex flex-col gap-6 border-r border-r-dark-outlineVariant">
        <RadioGroup
          defaultValue="profile"
          onValueChange={(value: ProfileTabs) => setCurrentTab(value)}
        >
          {profileOptionsTabs.map(({ label, tab }) => (
            <RadioGroupBlockItem
              value={tab}
              className="w-full"
              key={tab + '-tab'}
            >
              {label}
            </RadioGroupBlockItem>
          ))}
        </RadioGroup>
        <Separator />
        <Button
          variant={'destructive'}
          onClick={() => setDeleteUserDialogOpen(true)}
          type="button"
        >
          Excluir conta
        </Button>
      </div>
      <div className="col-span-8 ">
        {currentTab === 'profile' && (
          <Form {...editProfileForm} key="profile">
            <form
              className="flex flex-col gap-6"
              onSubmit={editProfileForm.handleSubmit(handlerEditProfileSubmit)}
            >
              <div className="flex items-center justify-start gap-6">
                <div className="relative">
                  <Avatar className="w-40 h-40">
                    <AvatarImage src={user.photoProfile?.src} />
                    <AvatarFallback>{user.name}</AvatarFallback>
                  </Avatar>
                  <FormField
                    control={editProfileForm.control}
                    name="photoProfile"
                    render={({ field }) => (
                      <FormItem className="absolute top-0 -right-4">
                        <FormControl>
                          <ImageInput
                            {...field}
                            value={field.value?.src}
                            onChange={(e) => {
                              uploadProfilePhoto(
                                e.target.files?.[0]!,
                                (photo) => {
                                  editProfileForm.setValue(
                                    'photoProfile',
                                    photo
                                  );
                                }
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-3xl">
                    {user.lastName
                      ? `${user.name} ${user.lastName}`
                      : user.name}
                  </span>
                  <span className="text-sm text-dark-outline">Plano FREE</span>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-6">
                <FormField
                  control={editProfileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-6">
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editProfileForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="col-span-6">
                      <FormLabel>Sobrenome</FormLabel>
                      <FormControl>
                        <Input placeholder="Sobrenome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editProfileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="col-span-6">
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input placeholder="E-mail" {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editProfileForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="col-span-6">
                      <FormLabel>Número de celular</FormLabel>
                      <FormControl>
                        <Input placeholder="Número" {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="col-span-12 flex justify-center">
                  <Button type="submit" className="w-60">
                    Salvar
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        )}
        {currentTab === 'plan' && (
          <div className="h-full flex flex-col justify-center items-center gap-6">
            <div className="flex items-center gap-6">
              <AppLogo className="w-44 h-44 fill-foreground" />
              <span>FREE</span>
            </div>
            <Button disabled className="w-36">
              Trocar plano
            </Button>
          </div>
        )}
        {currentTab === 'account-support' && (
          <Form {...supportForm}>
            <form
              className="flex flex-col gap-6"
              onSubmit={supportForm.handleSubmit((values) =>
                console.log(values)
              )}
            >
              <div className="flex flex-col gap-1">
                <span className="text-2xl">Suporte a sua conta</span>
                <p className="text-sm text-light-onSurfaceVariant dark:text-dark-onSurfaceVariant">
                  Deixe uma mensagem sobre o seu problema, que iremos entrar em
                  contato assim que possível.
                </p>
              </div>
              <FormField
                control={supportForm.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assunto</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira um assunto aqui" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={supportForm.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensagem</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Insira uma mensagem explicando seu problema aqui"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
                <Button type="submit" className="w-60">
                  Enviar
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
      <DeleteUserDialog
        user={user}
        open={deleteUserDialogOpen}
        onChangeOpen={setDeleteUserDialogOpen}
        onSubmitConfirm={handlerDeleteProfile}
      />
    </main>
  );
}
