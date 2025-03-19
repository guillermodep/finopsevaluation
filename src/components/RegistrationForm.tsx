'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { UserData } from '@/types/assessment';

interface RegistrationFormProps {
  onSubmit: (data: UserData) => void;
}

export default function RegistrationForm({ onSubmit }: RegistrationFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserData>({
    defaultValues: {
      fullName: '',
      company: '',
      email: '',
      position: '',
      cloudProviders: {
        aws: false,
        azure: false,
        gcp: false,
        oracle: false,
        ibm: false,
        other: false,
        otherSpecified: '',
      },
      teamComposition: 0,
      teamCompositionOther: '',
      annualBudget: 0,
      monthlySpend: 0,
    },
  });

  // Observamos si se ha seleccionado "Otro" para proveedores de nube
  const watchOtherCloudProvider = watch('cloudProviders.other');
  const otherCloudProvider = watchOtherCloudProvider;

  // Observamos si se ha seleccionado "Otro" para composición del equipo
  const watchTeamComposition = watch('teamComposition');
  const otherTeamComposition = watchTeamComposition === 6;

  const onFormSubmit = (data: UserData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="fullName" className="block text-sm font-medium text-white/90">
            Nombre Completo
          </label>
          <input
            type="text"
            id="fullName"
            placeholder="Tu nombre completo"
            {...register('fullName', { required: 'Este campo es obligatorio' })}
            className="input-modern"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-300 animate-fade-in">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="company" className="block text-sm font-medium text-white/90">
            Empresa
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
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            placeholder="tu@email.com"
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
            Cargo o Rol
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
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="button-modern w-full mt-8"
      >
        {isSubmitting ? 'Procesando...' : 'Comenzar Evaluación'}
      </button>
    </form>
  );
} 