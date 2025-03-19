'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { UserData } from '@/types/assessment';

interface InfrastructureQuestionsProps {
  userData: UserData;
  onSubmit: (updatedUserData: UserData) => void;
}

export default function InfrastructureQuestions({ userData, onSubmit }: InfrastructureQuestionsProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserData>({
    defaultValues: userData || {
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
    const updatedUserData = {
      ...userData,
      ...data
    };
    onSubmit(updatedUserData);
  };

  return (
    <div className="glass-panel animate-fade-in">
      <h2 className="text-2xl font-semibold mb-6 text-white">
        Información de Infraestructura y Equipos
      </h2>
      <p className="text-lg text-white/80 mb-6">
        Antes de evaluar las categorías de FinOps, necesitamos conocer algunos detalles sobre tu infraestructura cloud.
      </p>
      
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
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

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="button-modern"
          >
            {isSubmitting ? 'Procesando...' : 'Continuar con la Evaluación'}
          </button>
        </div>
      </form>
    </div>
  );
} 