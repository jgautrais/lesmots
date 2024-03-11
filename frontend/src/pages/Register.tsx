import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import BaseTemplate from '@/components/template/PageTemplate';
import {
  RegisterForm,
  RegisterFormSchema,
  RegisterPayload,
} from '@/types/auth';
import { Button, Input } from '@/components/atoms';
import { register as registerFn } from '@/utils/auth';
import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ApiError } from '@/types/common';

function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterForm>({
    resolver: zodResolver(RegisterFormSchema),
    mode: 'onBlur',
  });

  const { mutate, error, isPending, isError, isSuccess } = useMutation<
    RegisterForm,
    ApiError<RegisterForm>,
    RegisterPayload
  >({
    mutationKey: ['register'],
    mutationFn: registerFn,
  });

  useEffect(() => {
    if (isSuccess) {
      navigate('/login');
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isError) {
      setError('name', {
        message: error.errors?.name ? 'Identifiant invalide' : '',
      });
      setError('email', {
        message: error.errors?.email ? 'Email invalide' : '',
      });
      setError('password', {
        message: error.errors?.password
          ? `Mot de passe invalide: ${error.errors.password}`
          : '',
      });
    }
  }, [error, isError, setError]);

  const onSubmit = (payload: RegisterForm) => {
    mutate({
      ...payload,
      password_confirmation: payload.password,
    });
  };

  return (
    <BaseTemplate>
      <div className="mx-auto max-w-64 mt-8">
        <h1 className="text-2xl font-bold text-teal-400 dark:text-teal-300">
          Créer un compte
        </h1>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 text-left">
          <Input
            {...register('name')}
            id="name"
            type="text"
            label="Pseudo"
            placeholder="Pseudo"
            errorMessage={errors.name?.message}
          />

          <Input
            {...register('email')}
            id="email"
            type="text"
            label="Email"
            placeholder="Email"
            errorMessage={errors.email?.message}
          />

          <Input
            {...register('password')}
            id="password"
            type="password"
            label="Mot de passe"
            placeholder="••••••••"
            errorMessage={errors.password?.message}
          />

          <div className="flex justify-end mt-4">
            <Button isLoading={isPending}>S&apos;enregistrer</Button>
          </div>
        </form>
        <NavLink
          to="/login"
          className="block text-lg text-center mt-6 py-3 px-6 rounded border border-gray-50 dark:bg-gray-700 dark:border-gray-600 w-fit mx-auto mb-5"
        >
          Se connecter
        </NavLink>
      </div>
    </BaseTemplate>
  );
}

export default Register;
