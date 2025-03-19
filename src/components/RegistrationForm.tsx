'use client';

import { useForm } from 'react-hook-form';
import { UserData } from '@/types/assessment';
import { useEffect, useState } from 'react';

interface RegistrationFormProps {
  onSubmit: (data: UserData) => void;
}

export default function RegistrationForm({ onSubmit }: RegistrationFormProps) {
  const [mounted, setMounted] = useState(false);
  const [otherCloudProvider, setOtherCloudProvider] = useState(false);
  const [otherTeamComposition, setOtherTeamComposition] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserData>({
    defaultValues: {
      cloudProviders: {
        aws: false,
        azure: false,
        gcp: false,
        oracle: false,
        ibm: false,
        other: false,
        otherSpecified: ''
      },
      teamComposition: 0,
      teamCompositionOther: '',
      annualBudget: 0,
      monthlySpend: 0
    }
  });

  // Observar cambios en otros proveedores y composición del equipo
  const watchOtherProvider = watch('cloudProviders.other');
  const watchTeamComposition = watch('teamComposition');

  useEffect(() => {
    setMounted(true);
    setOtherCloudProvider(watchOtherProvider);
    setOtherTeamComposition(watchTeamComposition === 6);
  }, [watchOtherProvider, watchTeamComposition]);

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Sección de datos personales */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white mb-4">Datos Personales</h3>
        
        <div className="space-y-1">
          <label htmlFor="fullName" className="block text-sm font-medium text-white/90">
            Nombre Completo
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
      
      {/* Sección de infraestructura y equipos */}
      <div className="pt-4 border-t border-white/10">
        <h3 className="text-xl font-semibold text-white mb-6">Información de Infraestructura y Equipos</h3>
        
        {/* Pregunta sobre proveedores de nube */}
        <div className="mb-8">
          <fieldset>
            <legend className="block text-lg font-medium text-white/90 mb-3">
              ¿Qué proveedor(es) de nube utiliza actualmente? (CSP - Cloud Service Provider)
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="aws"
                  {...register('cloudProviders.aws')}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="aws" className="text-white/90">AWS</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="azure"
                  {...register('cloudProviders.azure')}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="azure" className="text-white/90">Microsoft Azure</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="gcp"
                  {...register('cloudProviders.gcp')}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="gcp" className="text-white/90">Google Cloud Platform (GCP)</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="oracle"
                  {...register('cloudProviders.oracle')}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="oracle" className="text-white/90">Oracle Cloud</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="ibm"
                  {...register('cloudProviders.ibm')}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="ibm" className="text-white/90">IBM Cloud</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="otherCloud"
                  {...register('cloudProviders.other')}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="otherCloud" className="text-white/90">Otro</label>
              </div>
            </div>
            
            {otherCloudProvider && (
              <div className="mt-3">
                <input
                  type="text"
                  id="otherCloudSpecified"
                  placeholder="Especificar otro proveedor"
                  {...register('cloudProviders.otherSpecified')}
                  className="input-modern"
                />
              </div>
            )}
          </fieldset>
        </div>
        
        {/* Pregunta sobre la composición del equipo */}
        <div className="mb-8">
          <fieldset>
            <legend className="block text-lg font-medium text-white/90 mb-3">
              ¿Cuál es la composición del equipo que administra los costos en cloud?
            </legend>
            <div className="space-y-3">
              <div className="flex items-start">
                <input
                  type="radio"
                  id="teamComp1"
                  value="1"
                  {...register('teamComposition', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mt-1 mr-2"
                />
                <label htmlFor="teamComp1" className="text-white/90">
                  No hay equipo
                </label>
              </div>
              <div className="flex items-start">
                <input
                  type="radio"
                  id="teamComp2"
                  value="2"
                  {...register('teamComposition', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mt-1 mr-2"
                />
                <label htmlFor="teamComp2" className="text-white/90">
                  Lo hace el equipo de Infraestructura/Plataformas/Operaciones
                </label>
              </div>
              <div className="flex items-start">
                <input
                  type="radio"
                  id="teamComp3"
                  value="3"
                  {...register('teamComposition', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mt-1 mr-2"
                />
                <label htmlFor="teamComp3" className="text-white/90">
                  Equipo de Cloud con capacidades de Arquitectura/Ingeniería sin especialistas en FinOps
                </label>
              </div>
              <div className="flex items-start">
                <input
                  type="radio"
                  id="teamComp4"
                  value="4"
                  {...register('teamComposition', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mt-1 mr-2"
                />
                <label htmlFor="teamComp4" className="text-white/90">
                  Equipo de Cloud con capacidades de Arquitectura/Ingeniería CON especialistas en FinOps
                </label>
              </div>
              <div className="flex items-start">
                <input
                  type="radio"
                  id="teamComp5"
                  value="5"
                  {...register('teamComposition', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mt-1 mr-2"
                />
                <label htmlFor="teamComp5" className="text-white/90">
                  CoE Centro de Excelencia Cloud con BPO y especialistas de Gobierno y práctica FinOps
                </label>
              </div>
              <div className="flex items-start">
                <input
                  type="radio"
                  id="teamComp6"
                  value="6"
                  {...register('teamComposition', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mt-1 mr-2"
                />
                <label htmlFor="teamComp6" className="text-white/90">
                  Otro
                </label>
              </div>
              
              {otherTeamComposition && (
                <div className="mt-3 pl-6">
                  <input
                    type="text"
                    id="teamCompOther"
                    placeholder="Especificar otra composición de equipo"
                    {...register('teamCompositionOther')}
                    className="input-modern"
                  />
                </div>
              )}
            </div>
            {errors.teamComposition && (
              <p className="mt-2 text-sm text-red-300 animate-fade-in">{errors.teamComposition.message}</p>
            )}
          </fieldset>
        </div>
        
        {/* Pregunta sobre presupuesto anual */}
        <div className="mb-8">
          <fieldset>
            <legend className="block text-lg font-medium text-white/90 mb-3">
              ¿Cuál es el presupuesto anual aproximado destinado a los servicios de nube?
            </legend>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="budget1"
                  value="1"
                  {...register('annualBudget', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="budget1" className="text-white/90">
                  Menos de USD 100,000
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="budget2"
                  value="2"
                  {...register('annualBudget', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="budget2" className="text-white/90">
                  Entre USD 100,000 y 500,000
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="budget3"
                  value="3"
                  {...register('annualBudget', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="budget3" className="text-white/90">
                  Entre USD 500,000 y 1,000,000
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="budget4"
                  value="4"
                  {...register('annualBudget', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="budget4" className="text-white/90">
                  Entre USD 1,000,000 y 5,000,000
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="budget5"
                  value="5"
                  {...register('annualBudget', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="budget5" className="text-white/90">
                  Más de USD 5,000,000
                </label>
              </div>
            </div>
            {errors.annualBudget && (
              <p className="mt-2 text-sm text-red-300 animate-fade-in">{errors.annualBudget.message}</p>
            )}
          </fieldset>
        </div>
        
        {/* Pregunta sobre gasto mensual */}
        <div className="mb-8">
          <fieldset>
            <legend className="block text-lg font-medium text-white/90 mb-3">
              ¿Cuál es el gasto mensual promedio actual en todas las nubes combinadas?
            </legend>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="spend1"
                  value="1"
                  {...register('monthlySpend', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="spend1" className="text-white/90">
                  Menos de USD 10,000
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="spend2"
                  value="2"
                  {...register('monthlySpend', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="spend2" className="text-white/90">
                  Entre USD 10,000 y 50,000
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="spend3"
                  value="3"
                  {...register('monthlySpend', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="spend3" className="text-white/90">
                  Entre USD 50,000 y 100,000
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="spend4"
                  value="4"
                  {...register('monthlySpend', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="spend4" className="text-white/90">
                  Entre USD 100,000 y 500,000
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="spend5"
                  value="5"
                  {...register('monthlySpend', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="spend5" className="text-white/90">
                  Más de USD 500,000
                </label>
              </div>
            </div>
            {errors.monthlySpend && (
              <p className="mt-2 text-sm text-red-300 animate-fade-in">{errors.monthlySpend.message}</p>
            )}
          </fieldset>
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