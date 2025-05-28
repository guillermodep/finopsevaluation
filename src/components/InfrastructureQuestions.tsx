'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { UserData } from '@/types/assessment';
import Tooltip from './Tooltip'; // Added import

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="aws"
                  {...register('cloudProviders.aws')}
                  className="w-4 h-4 mt-1 mr-3"
                />
                <label htmlFor="aws" className="text-white/90">AWS</label>
              </div>
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="azure"
                  {...register('cloudProviders.azure')}
                  className="w-4 h-4 mt-1 mr-3"
                />
                <label htmlFor="azure" className="text-white/90">Microsoft Azure</label>
              </div>
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="gcp"
                  {...register('cloudProviders.gcp')}
                  className="w-4 h-4 mt-1 mr-3"
                />
                <label htmlFor="gcp" className="text-white/90">Google Cloud Platform (GCP)</label>
              </div>
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="oracle"
                  {...register('cloudProviders.oracle')}
                  className="w-4 h-4 mt-1 mr-3"
                />
                <label htmlFor="oracle" className="text-white/90">Oracle Cloud</label>
              </div>
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="ibm"
                  {...register('cloudProviders.ibm')}
                  className="w-4 h-4 mt-1 mr-3"
                />
                <label htmlFor="ibm" className="text-white/90">IBM Cloud</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="otherCloud"
                  {...register('cloudProviders.other')}
                  className="w-4 h-4 mr-3"
                />
                <label htmlFor="otherCloud" className="text-white/90">Otro</label>
                <Tooltip text="Si tu proveedor no está en la lista, selecciónalo aquí y especifícalo." position="right" />
              </div>
            </div>
            
            {otherCloudProvider && (
              <div className="mt-4 ml-7">
                <input
                  type="text"
                  id="otherCloudSpecified"
                  placeholder="Especificar otro proveedor"
                  {...register('cloudProviders.otherSpecified')}
                  className="input-modern w-full max-w-md"
                />
              </div>
            )}
          </fieldset>
        </div>
        
        {/* Pregunta sobre la composición del equipo */}
        <div className="mb-8">
          <fieldset>
            <legend className="block text-lg font-medium text-white/90 mb-3 text-center md:text-left">
              ¿Cuál es la composición del equipo que administra los costos en cloud?
            </legend>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start">
                <input
                  type="radio"
                  id="teamComp1"
                  value="1"
                  {...register('teamComposition', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mt-1 mr-3"
                />
                <label htmlFor="teamComp1" className="text-white/90">
                  <span className="font-medium">No hay equipo</span>
                </label>
              </div>
              <div className="flex items-start">
                <input
                  type="radio"
                  id="teamComp2"
                  value="2"
                  {...register('teamComposition', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mt-1 mr-3"
                />
                <label htmlFor="teamComp2" className="text-white/90">
                  <span className="font-medium">Equipo de Infraestructura/Plataformas/Operaciones</span>
                </label>
              </div>
              <div className="flex items-start">
                <input
                  type="radio"
                  id="teamComp3"
                  value="3"
                  {...register('teamComposition', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mt-1 mr-3"
                />
                <label htmlFor="teamComp3" className="text-white/90">
                  <span className="font-medium">Equipo de Cloud</span> con capacidades de Arquitectura/Ingeniería sin especialistas en FinOps
                </label>
              </div>
              <div className="flex items-start">
                <input
                  type="radio"
                  id="teamComp4"
                  value="4"
                  {...register('teamComposition', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mt-1 mr-3"
                />
                <label htmlFor="teamComp4" className="text-white/90">
                  <span className="font-medium">Equipo de Cloud</span> con capacidades de Arquitectura/Ingeniería CON especialistas en FinOps
                </label>
              </div>
              <div className="flex items-start">
                <input
                  type="radio"
                  id="teamComp5"
                  value="5"
                  {...register('teamComposition', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mt-1 mr-3"
                />
                <label htmlFor="teamComp5" className="text-white/90 flex items-center">
                  <span className="font-medium">Centro de Excelencia Cloud (CoE)</span> con BPO y especialistas de Gobierno y práctica FinOps
                  <Tooltip text="CoE (Center of Excellence): Equipo centralizado y especializado. BPO (Business Process Outsourcing): Puede incluir servicios de terceros para la gestión financiera." position="top" />
                </label>
              </div>
              <div className="flex items-start">
                <input
                  type="radio"
                  id="teamComp6"
                  value="6"
                  {...register('teamComposition', { required: 'Debes seleccionar una opción' })}
                  className="w-4 h-4 mt-1 mr-3"
                />
                <label htmlFor="teamComp6" className="text-white/90">
                  <span className="font-medium">Otro</span>
                </label>
              </div>
              
              {otherTeamComposition && (
                <div className="mt-1 ml-7">
                  <input
                    type="text"
                    id="teamCompOther"
                    placeholder="Especificar otra composición de equipo"
                    {...register('teamCompositionOther')}
                    className="input-modern w-full max-w-md"
                  />
                </div>
              )}
            </div>
            {errors.teamComposition && (
              <p className="mt-2 text-sm text-red-300 animate-fade-in">{errors.teamComposition.message}</p>
            )}
          </fieldset>
        </div>
        
        {/* Pregunta sobre tipos de carga */}
        <div className="mb-8">
          <fieldset>
            <legend className="block text-lg font-medium text-white/90 mb-3">
              ¿Qué tipos de cargas de trabajo (workloads) utiliza principalmente en la nube?
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input type="checkbox" id="iaas" {...register('workloadTypes.iaas')} className="w-4 h-4 mr-3" />
                <label htmlFor="iaas" className="text-white/90">IaaS</label>
                <Tooltip text="Infraestructura como Servicio (ej. Máquinas Virtuales, Almacenamiento en bloque). Mayor control, mayor gestión." position="right" />
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="paas" {...register('workloadTypes.paas')} className="w-4 h-4 mr-3" />
                <label htmlFor="paas" className="text-white/90">PaaS</label>
                <Tooltip text="Plataforma como Servicio (ej. Servicios de Aplicaciones, Bases de Datos gestionadas). Menos gestión de infraestructura." position="right" />
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="saas" {...register('workloadTypes.saas')} className="w-4 h-4 mr-3" />
                <label htmlFor="saas" className="text-white/90">SaaS</label>
                <Tooltip text="Software como Servicio (ej. Microsoft 365, Salesforce). Mínima gestión, pago por uso." position="right" />
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="faas" {...register('workloadTypes.faas')} className="w-4 h-4 mr-3" />
                <label htmlFor="faas" className="text-white/90">FaaS / Serverless</label>
                <Tooltip text="Función como Servicio / Serverless (ej. AWS Lambda, Azure Functions). Ejecución de código bajo demanda." position="right" />
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="dbaas" {...register('workloadTypes.dbaas')} className="w-4 h-4 mr-3" />
                <label htmlFor="dbaas" className="text-white/90">DBaaS</label>
                <Tooltip text="Base de Datos como Servicio (ej. AWS RDS, Azure SQL Database). Bases de datos gestionadas por el proveedor." position="right" />
              </div>
            </div>
          </fieldset>
        </div>

        {/* Pregunta sobre modelos de pago */}
        <div className="mb-8">
          <fieldset>
            <legend className="block text-lg font-medium text-white/90 mb-3">
              ¿Qué modelos de pago utiliza principalmente para sus recursos en la nube?
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ... otras opciones de pago ... */}
              <div className="flex items-center">
                <input type="checkbox" id="reserved" {...register('paymentModels.reserved')} className="w-4 h-4 mr-3" />
                <label htmlFor="reserved" className="text-white/90">Instancias reservadas / Savings Plans</label>
                <Tooltip text="Compromisos de uso (1 o 3 años) a cambio de descuentos significativos sobre precios por demanda." position="right" />
              </div>
              {/* ... otras opciones de pago ... */}
              <div className="flex items-center">
                <input type="checkbox" id="byol" {...register('paymentModels.byol')} className="w-4 h-4 mr-3" />
                <label htmlFor="byol" className="text-white/90">Licencias BYOL</label>
                <Tooltip text="Bring Your Own License. Permite usar licencias de software existentes en la nube." position="right" />
              </div>
              {/* ... otras opciones de pago ... */}
            </div>
          </fieldset>
        </div>

        {/* Pregunta sobre herramientas FinOps */}
        <div className="mb-8">
          <fieldset>
            <legend className="block text-lg font-medium text-white/90 mb-3">
              ¿Qué herramientas utiliza para la gestión y optimización de costos FinOps?
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input type="checkbox" id="nativeTools" {...register('finOpsTools.nativeTools')} className="w-4 h-4 mr-3" />
                <label htmlFor="nativeTools" className="text-white/90">Herramientas nativas del CSP</label>
                <Tooltip text="Ej. AWS Cost Explorer, Azure Cost Management, Google Cloud Billing tools." position="right" />
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="thirdPartyTools" {...register('finOpsTools.thirdPartyTools')} className="w-4 h-4 mr-3" />
                <label htmlFor="thirdPartyTools" className="text-white/90">Herramientas de terceros</label>
                <Tooltip text="Ej. Cloudability, Flexera One, Apptio Cloudability, etc." position="right" />
              </div>
              {/* ... otras opciones de herramientas ... */}
            </div>
          </fieldset>
        </div>

        {/* Pregunta sobre prácticas de reducción de costos */}
        <div className="mb-8">
          <fieldset>
            <legend className="block text-lg font-medium text-white/90 mb-3">
              ¿Qué prácticas de reducción de costos ha implementado o utiliza regularmente?
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              <div className="flex items-center">
                <input type="checkbox" id="rightsizing" {...register('costReductionPractices.rightsizing')} className="w-4 h-4 mr-3" />
                <label htmlFor="rightsizing" className="text-white/90">Rightsizing</label>
                <Tooltip text="Ajustar el tamaño de las instancias y servicios para que coincidan con las necesidades reales de rendimiento y capacidad, evitando el sobreaprovisionamiento." position="right" />
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="storageReconfiguration" {...register('costReductionPractices.storageReconfiguration')} className="w-4 h-4 mr-3" />
                <label htmlFor="storageReconfiguration" className="text-white/90">Reconfiguración de Discos/Storage</label>
                <Tooltip text="Optimizar los tipos y clases de almacenamiento (ej. SSD vs HDD, tiers de acceso) y la ubicación geográfica para balancear costo y rendimiento." position="right" />
              </div>
              {/* ... otras opciones de prácticas ... */}
            </div>
          </fieldset>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="button-modern w-full mt-6"
        >
          {isSubmitting ? 'Guardando...' : 'Siguiente: Evaluar Categorías'}
        </button>
      </form>
    </div>
  );
}