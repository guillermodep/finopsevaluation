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
      workloadTypes: {
        iaas: false,
        paas: false,
        saas: false,
        faas: false,
        dbaas: false,
      },
      serversCount: 0,
      marketplacePurchases: 0,
      paymentModels: {
        onDemand: false,
        reserved: false,
        longTermContracts: false,
        byol: false,
        freeTier: false,
      },
      finOpsTools: {
        nativeTools: false,
        thirdPartyTools: false,
        internalTools: false,
        noTools: false,
        other: false,
        otherSpecified: '',
      },
      costReductionPractices: {
        rightsizing: false,
        storageReconfiguration: false,
        scheduledShutdown: false,
        reservedInstances: false,
        licenseOptimization: false,
      },
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
              ¿Cuál es el gasto mensual promedio en servicios de nube?
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
        
        {/* NUEVAS PREGUNTAS */}
        
        {/* Pregunta sobre tipos de carga */}
        <div className="mb-8">
          <fieldset>
            <legend className="block text-lg font-medium text-white/90 mb-3">
              ¿Qué tipo(s) de carga utiliza mayoritariamente tu organización?
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="iaas"
                  {...register('workloadTypes.iaas')}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="iaas" className="text-white/90">
                  IaaS (Infrastructure as a Service) – Ej: VMs, almacenamiento, redes
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="paas"
                  {...register('workloadTypes.paas')}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="paas" className="text-white/90">
                  PaaS (Platform as a Service) – Ej: App Services, Kubernetes, Azure SQL
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="saas"
                  {...register('workloadTypes.saas')}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="saas" className="text-white/90">
                  SaaS (Software as a Service) – Ej: Microsoft 365, Salesforce
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="faas"
                  {...register('workloadTypes.faas')}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="faas" className="text-white/90">
                  FaaS (Function as a Service) – Ej: AWS Lambda, Azure Functions
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="dbaas"
                  {...register('workloadTypes.dbaas')}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="dbaas" className="text-white/90">
                  DBaaS (Database as a Service) – Ej: AWS RDS, Azure CosmosDB, GCP Cloud SQL
                </label>
              </div>
            </div>
          </fieldset>
        </div>
        
        {/* Pregunta sobre cantidad de servidores */}
        <div className="mb-8">
          <fieldset>
            <legend className="block text-lg font-medium text-white/90 mb-3">
              ¿Cuántos servidores (VMs, EC2, Compute Instances) tiene actualmente tu organización en la nube?
            </legend>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="servers1"
                  value="1"
                  {...register('serversCount', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="servers1" className="text-white/90">
                  Menos de 50
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="servers2"
                  value="2"
                  {...register('serversCount', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="servers2" className="text-white/90">
                  Entre 50 y 200
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="servers3"
                  value="3"
                  {...register('serversCount', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="servers3" className="text-white/90">
                  Entre 200 y 500
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="servers4"
                  value="4"
                  {...register('serversCount', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="servers4" className="text-white/90">
                  Entre 500 y 1000
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="servers5"
                  value="5"
                  {...register('serversCount', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="servers5" className="text-white/90">
                  Más de 1000
                </label>
              </div>
            </div>
            {errors.serversCount && (
              <p className="mt-2 text-sm text-red-300 animate-fade-in">{errors.serversCount.message}</p>
            )}
          </fieldset>
        </div>
        
        {/* Pregunta sobre compras en Marketplace */}
        <div className="mb-8">
          <fieldset>
            <legend className="block text-lg font-medium text-white/90 mb-3">
              ¿Cuántas compras por Marketplace o Private Offers realizaron en el último año?
            </legend>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="marketplace1"
                  value="1"
                  {...register('marketplacePurchases', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="marketplace1" className="text-white/90">
                  Ninguna
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="marketplace2"
                  value="2"
                  {...register('marketplacePurchases', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="marketplace2" className="text-white/90">
                  1 a 5 compras
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="marketplace3"
                  value="3"
                  {...register('marketplacePurchases', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="marketplace3" className="text-white/90">
                  6 a 15 compras
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="marketplace4"
                  value="4"
                  {...register('marketplacePurchases', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="marketplace4" className="text-white/90">
                  16 a 30 compras
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="marketplace5"
                  value="5"
                  {...register('marketplacePurchases', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="marketplace5" className="text-white/90">
                  Más de 30 compras
                </label>
              </div>
            </div>
            {errors.marketplacePurchases && (
              <p className="mt-2 text-sm text-red-300 animate-fade-in">{errors.marketplacePurchases.message}</p>
            )}
          </fieldset>
        </div>
        
        {/* Pregunta sobre modelos de pago */}
        <div className="mb-8">
          <fieldset>
            <legend className="block text-lg font-medium text-white/90 mb-3">
              ¿Qué modelo(s) de pago utilizan mayormente para sus servicios en la nube?
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="onDemand"
                  {...register('paymentModels.onDemand')}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="onDemand" className="text-white/90">
                  Pago por demanda (On-Demand)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="reserved"
                  {...register('paymentModels.reserved')}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="reserved" className="text-white/90">
                  Instancias reservadas / Savings Plans
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="contracts"
                  {...register('paymentModels.longTermContracts')}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="contracts" className="text-white/90">
                  Contratos a largo plazo con descuentos
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="byol"
                  {...register('paymentModels.byol')}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="byol" className="text-white/90">
                  Licencias Bring Your Own License (BYOL)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="freeTier"
                  {...register('paymentModels.freeTier')}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="freeTier" className="text-white/90">
                  Free tier / créditos promocionales
                </label>
              </div>
            </div>
          </fieldset>
        </div>
        
        {/* Pregunta sobre herramientas FinOps */}
        <div className="mb-8">
          <fieldset>
            <legend className="block text-lg font-medium text-white/90 mb-3">
              ¿Qué herramientas utilizan actualmente para la gestión y optimización de costos en la nube?
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="nativeTools"
                  {...register('finOpsTools.nativeTools')}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="nativeTools" className="text-white/90">
                  Herramientas nativas del CSP (Cost Explorer, Azure Cost Management, etc.)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="thirdPartyTools"
                  {...register('finOpsTools.thirdPartyTools')}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="thirdPartyTools" className="text-white/90">
                  Herramientas de terceros (CloudHealth, Apptio Cloudability, Spot.io, etc.)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="internalTools"
                  {...register('finOpsTools.internalTools')}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="internalTools" className="text-white/90">
                  Herramientas internas desarrolladas en la empresa
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="noTools"
                  {...register('finOpsTools.noTools')}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="noTools" className="text-white/90">
                  No utilizamos ninguna herramienta específica
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="otherTools"
                  {...register('finOpsTools.other')}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="otherTools" className="text-white/90">
                  Otro
                </label>
              </div>
            </div>
            
            {watch('finOpsTools.other') && (
              <div className="mt-3">
                <input
                  type="text"
                  id="otherToolsSpecified"
                  placeholder="Especificar otra herramienta"
                  {...register('finOpsTools.otherSpecified')}
                  className="input-modern"
                />
              </div>
            )}
          </fieldset>
        </div>
        
        {/* Pregunta sobre prácticas de reducción de costos */}
        <div className="mb-8">
          <fieldset>
            <legend className="block text-lg font-medium text-white/90 mb-3">
              ¿Aplica actualmente alguno de estos tipos de prácticas de reducción de costos en su organización?
            </legend>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rightsizing"
                  {...register('costReductionPractices.rightsizing')}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="rightsizing" className="text-white/90">
                  Rightsizing – Ajuste del tamaño de instancias y recursos según uso real
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="storageReconfiguration"
                  {...register('costReductionPractices.storageReconfiguration')}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="storageReconfiguration" className="text-white/90">
                  Reconfiguración de Discos/Storage según locación – Moviendo almacenamiento a regiones o tipos más económicos
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="scheduledShutdown"
                  {...register('costReductionPractices.scheduledShutdown')}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="scheduledShutdown" className="text-white/90">
                  Apagado de recursos no utilizados fuera de horario laboral – Por ejemplo, apagar ambientes de desarrollo fuera del horario de oficina
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="reservedInstances"
                  {...register('costReductionPractices.reservedInstances')}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="reservedInstances" className="text-white/90">
                  Uso de instancias reservadas / Savings Plans – Compra anticipada de capacidad con descuentos por compromiso
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="licenseOptimization"
                  {...register('costReductionPractices.licenseOptimization')}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="licenseOptimization" className="text-white/90">
                  Optimización del uso de licencias – Aplicación de BYOL (Bring Your Own License) o reducción de licencias innecesarias
                </label>
              </div>
            </div>
          </fieldset>
        </div>
        
        <div className="flex justify-end mt-8">
          <button 
            type="submit" 
            className="button-modern"
            disabled={isSubmitting}
          >
            Continuar con la evaluación
          </button>
        </div>
      </form>
    </div>
  );
} 