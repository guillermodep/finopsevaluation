'use client';

import { useForm } from 'react-hook-form';
import { UserData } from '@/types/assessment';
import { useEffect, useState } from 'react';

interface RegistrationFormProps {
  onSubmit: (data: UserData) => void;
}

export default function RegistrationForm({ onSubmit }: RegistrationFormProps) {
  const [mounted, setMounted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserData>();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-white/10 rounded-lg"></div>
        <div className="h-10 bg-white/10 rounded-lg"></div>
        <div className="h-10 bg-white/10 rounded-lg"></div>
        <div className="h-10 bg-white/10 rounded-lg"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-1">
        <label htmlFor="fullName" className="block text-sm font-medium text-white/90">
         
        </label>
        <input
          type="text"
          id="fullName"
          placeholder="Ingresa tu nombre completo"
          {...register('fullName', { required: 'Este campo es obligatorio' })}
          className="input-modern"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-300 animate-fade-in">{errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="company" className="block text-sm font-medium text-white/90">
        </label>
        <input
          type="text"
          id="company"
          placeholder="Nombre de tu empresa"
          {...register('company', { required: 'Este campo es obligatorio' })}
          className="input-modern"
        />
        {errors.company && (
          <p className="mt-1 text-sm text-red-300 animate-fade-in">{errors.company.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-medium text-white/90">
        </label>
        <input
          type="email"
          id="email"
          placeholder="correo@empresa.com"
          {...register('email', {
            required: 'Este campo es obligatorio',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Dirección de correo inválida',
            },
          })}
          className="input-modern"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-300 animate-fade-in">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="position" className="block text-sm font-medium text-white/90">
        </label>
        <input
          type="text"
          id="position"
          placeholder="Tu cargo o rol"
          {...register('position', { required: 'Este campo es obligatorio' })}
          className="input-modern"
        />
        {errors.position && (
          <p className="mt-1 text-sm text-red-300 animate-fade-in">{errors.position.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="button-modern w-full"
      >
        {isSubmitting ? 'Procesando...' : 'Comenzar Evaluación'}
      </button>
    </form>
  );
} 