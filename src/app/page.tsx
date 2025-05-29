'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserData, AssessmentResult } from '@/types/assessment';
import { categories } from '@/data/categories';
import RegistrationForm from '@/components/RegistrationForm';
import CategoryAssessment from '@/components/CategoryAssessment';
import AssessmentSummary from '@/components/AssessmentSummary';
import { storeUserData, storeResult } from '@/store/assessmentStore';
import InfrastructureQuestions from '@/components/InfrastructureQuestions';
import ProgressBar from '@/components/ProgressBar';
import Tooltip from '@/components/Tooltip';
import { supabase } from '@/lib/supabaseClient'; // Added Supabase client

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [assessmentId, setAssessmentId] = useState<string | null>(null); // Added for Supabase assessment ID
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(-1);
  const [step, setStep] = useState(0); 
  const [showResults, setShowResults] = useState(false);
  const [showInfrastructureQuestions, setShowInfrastructureQuestions] = useState(false);
  const [showLogo, setShowLogo] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowLogo(false);
      } else {
        setShowLogo(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const handleReset = () => {
    // localStorage.removeItem('userData'); // Supabase is the source of truth now
    // localStorage.removeItem('assessmentResults'); // Supabase is the source of truth now
    setUserData(null);
    setAssessmentId(null); // Reset assessmentId
    setResults([]);
    setCurrentCategoryIndex(-1);
    setStep(0);
    setShowResults(false);
    setShowInfrastructureQuestions(false);
    window.scrollTo(0, 0);
  };

  const currentCategory = currentCategoryIndex >= 0 ? categories[currentCategoryIndex] : null;
  const currentResult = currentCategory
    ? results.find((r: AssessmentResult) => r.category === currentCategory.name)
    : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRegistrationSubmit = async (data: UserData) => { // Made async
    setUserData(data); // Keep local state for UI updates

    // Map UserData from registration form to Supabase 'assessments' table structure
    const assessmentDataToInsert = {
      full_name: data.fullName,
      company: data.company,
      email: data.email,
      position: data.position,
      cloud_provider_aws: data.cloudProviders?.aws ?? false,
      cloud_provider_azure: data.cloudProviders?.azure ?? false,
      cloud_provider_gcp: data.cloudProviders?.gcp ?? false,
      cloud_provider_oracle: data.cloudProviders?.oracle ?? false,
      cloud_provider_ibm: data.cloudProviders?.ibm ?? false,
      cloud_provider_other: data.cloudProviders?.other ?? false,
      cloud_provider_other_specified: data.cloudProviders?.otherSpecified ?? null,
      // Initialize other fields that will be updated in the infrastructure step
      team_composition: null,
      team_composition_other: null,
      annual_budget: null,
      monthly_spend: null,
      workload_type_iaas: false,
      workload_type_paas: false,
      workload_type_saas: false,
      workload_type_faas: false,
      workload_type_dbaas: false,
      servers_count: null,
      marketplace_purchases: null,
      payment_model_on_demand: false,
      payment_model_reserved: false,
      payment_model_long_term_contracts: false,
      payment_model_byol: false,
      payment_model_free_tier: false,
      finops_tool_native: false,
      finops_tool_third_party: false,
      finops_tool_internal: false,
      finops_tool_no_tools: false,
      finops_tool_other: false,
      finops_tool_other_specified: null,
      cost_reduction_rightsizing: false,
      cost_reduction_storage_reconfiguration: false,
      cost_reduction_scheduled_shutdown: false,
      cost_reduction_reserved_instances: false,
      cost_reduction_license_optimization: false,
    };

    try {
      const { data: insertedData, error } = await supabase
        .from('assessments')
        .insert([assessmentDataToInsert])
        .select('id')
        .single();

      if (error) {
        console.error('Error inserting registration data:', error.message);
        // TODO: Show user-friendly error
        return;
      }

      if (insertedData && insertedData.id) {
        setAssessmentId(insertedData.id);
        setShowInfrastructureQuestions(true);
        setStep(1);
      } else {
        console.error('No ID returned after inserting registration data, or insertedData is null.');
        // TODO: Show user-friendly error
        return;
      }
    } catch (e: any) {
      console.error('Supabase call failed (registration):', e.message);
      // TODO: Show user-friendly error
    }
    // storeUserData(data); // Removed: Supabase is the store
  };

  const handleInfrastructureSubmit = async (updatedUserData: UserData) => { // Made async
    setUserData(updatedUserData); // Keep local state for UI updates

    if (!assessmentId) {
      console.error("Cannot submit infrastructure data: assessmentId is missing.");
      // TODO: Show user-friendly error, perhaps redirect to registration
      return;
    }

    // Map UserData from infrastructure form to Supabase 'assessments' table structure
    const assessmentDataToUpdate = {
      cloud_provider_aws: updatedUserData.cloudProviders?.aws ?? false,
      cloud_provider_azure: updatedUserData.cloudProviders?.azure ?? false,
      cloud_provider_gcp: updatedUserData.cloudProviders?.gcp ?? false,
      cloud_provider_oracle: updatedUserData.cloudProviders?.oracle ?? false,
      cloud_provider_ibm: updatedUserData.cloudProviders?.ibm ?? false,
      cloud_provider_other: updatedUserData.cloudProviders?.other ?? false,
      cloud_provider_other_specified: updatedUserData.cloudProviders?.otherSpecified ?? null,
      
      team_composition: updatedUserData.teamComposition,
      team_composition_other: updatedUserData.teamCompositionOther ?? null,
      annual_budget: updatedUserData.annualBudget,
      monthly_spend: updatedUserData.monthlySpend,

      workload_type_iaas: updatedUserData.workloadTypes?.iaas ?? false,
      workload_type_paas: updatedUserData.workloadTypes?.paas ?? false,
      workload_type_saas: updatedUserData.workloadTypes?.saas ?? false,
      workload_type_faas: updatedUserData.workloadTypes?.faas ?? false,
      workload_type_dbaas: updatedUserData.workloadTypes?.dbaas ?? false,
      
      servers_count: updatedUserData.serversCount,
      marketplace_purchases: updatedUserData.marketplacePurchases,

      payment_model_on_demand: updatedUserData.paymentModels?.onDemand ?? false,
      payment_model_reserved: updatedUserData.paymentModels?.reserved ?? false,
      payment_model_long_term_contracts: updatedUserData.paymentModels?.longTermContracts ?? false,
      payment_model_byol: updatedUserData.paymentModels?.byol ?? false,
      payment_model_free_tier: updatedUserData.paymentModels?.freeTier ?? false,

      finops_tool_native: updatedUserData.finOpsTools?.nativeTools ?? false,
      finops_tool_third_party: updatedUserData.finOpsTools?.thirdPartyTools ?? false,
      finops_tool_internal: updatedUserData.finOpsTools?.internalTools ?? false,
      finops_tool_no_tools: updatedUserData.finOpsTools?.noTools ?? false,
      finops_tool_other: updatedUserData.finOpsTools?.other ?? false,
      finops_tool_other_specified: updatedUserData.finOpsTools?.otherSpecified ?? null,

      cost_reduction_rightsizing: updatedUserData.costReductionPractices?.rightsizing ?? false,
      cost_reduction_storage_reconfiguration: updatedUserData.costReductionPractices?.storageReconfiguration ?? false,
      cost_reduction_scheduled_shutdown: updatedUserData.costReductionPractices?.scheduledShutdown ?? false,
      cost_reduction_reserved_instances: updatedUserData.costReductionPractices?.reservedInstances ?? false,
      cost_reduction_license_optimization: updatedUserData.costReductionPractices?.licenseOptimization ?? false,
    };

    try {
      const { error } = await supabase
        .from('assessments')
        .update(assessmentDataToUpdate)
        .eq('id', assessmentId);

      if (error) {
        console.error('Error updating infrastructure data:', error.message);
        // TODO: Show user-friendly error
        return;
      }

      setShowInfrastructureQuestions(false);
      setCurrentCategoryIndex(0);
      setStep(2);
    } catch (e: any) {
      console.error('Supabase call failed (infrastructure):', e.message);
      // TODO: Show user-friendly error
    }
    // storeUserData(updatedUserData); // Removed: Supabase is the store
  };

  const handleLevelSelect = (level: number) => {
    const newResults = [...results];
    const existingResultIndex = newResults.findIndex(
      r => r.category === currentCategory?.name
    );
    if (existingResultIndex >= 0) {
      newResults[existingResultIndex].selectedLevel = level;
    } else if (currentCategory) {
      newResults.push({
        category: currentCategory.name,
        selectedLevel: level,
      });
    }
    setResults(newResults);
    // if (currentCategory) { // Logic to store individual results to localStorage removed
    //   const resultToStore = {
    //     category: currentCategory.name,
    //     selectedLevel: level,
    //   };
    //   // storeResult(resultToStore); // Will be handled by handleSubmitResults with Supabase
    // }
  };

  const handleNextCategory = () => {
    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setStep(step + 1); 
    } else {
      setStep(categories.length + 2);
      setShowResults(true); 
    }
  };

  const handleSubmitResults = async () => { // Made async
    if (!assessmentId) {
      console.error("Cannot submit results: assessmentId is missing.");
      // TODO: Show user-friendly error or redirect
      return;
    }
    if (results.length === 0) {
      console.warn("No results to submit.");
      setShowResults(true); // Still show results page, even if empty
      setStep(categories.length + 2);
      return;
    }

    const resultsToInsert = results.map(result => ({
      assessment_id: assessmentId,
      category_name: result.category,
      selected_level: result.selectedLevel,
    }));

    try {
      const { error } = await supabase
        .from('assessment_results')
        .insert(resultsToInsert);

      if (error) {
        console.error('Error inserting assessment results:', error.message);
        // TODO: Show user-friendly error
      } else {
        // console.log('Assessment results saved successfully.');
        // localStorage.removeItem('assessmentResults'); // Clear local storage if successfully saved to DB
      }
    } catch (e: any) {
      console.error('Supabase call failed (assessment_results):', e.message);
      // TODO: Show user-friendly error
    }
    
    setShowResults(true);
    setStep(categories.length + 2);
  };

  const totalLogicalSteps = categories.length + 3; 
  let currentLogicalStep = 0;
  let currentStepName = '';

  if (showResults) {
    currentLogicalStep = totalLogicalSteps;
    currentStepName = 'Resultados Finales';
  } else if (currentCategoryIndex !== -1) {
    currentLogicalStep = 3 + currentCategoryIndex; 
    currentStepName = 'Evaluación de Categorías';
  } else if (showInfrastructureQuestions) {
    currentLogicalStep = 2;
    currentStepName = 'Información de Infraestructura';
  } else if (userData) { // After registration, before infra questions fully shown
    currentLogicalStep = 1; 
    currentStepName = 'Registro Completado';
  } else {
    currentLogicalStep = 0; // Welcome screen
    currentStepName = 'Bienvenida';
  }

  if (!mounted) {
    return (
      <div className="bg-gradient-radial min-h-screen flex flex-col justify-center items-center p-4">
        <div className="max-w-4xl w-full animate-pulse">
          <div className="h-8 bg-white/10 rounded-lg mb-8"></div>
          <div className="h-64 bg-white/5 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-radial min-h-screen flex flex-col justify-center items-center p-4">
      <div className={`fixed top-4 left-0 right-0 flex justify-center z-50 transition-transform duration-300 ${showLogo ? 'translate-y-0' : '-translate-y-20'}`}>
        <img
          src="/images/smart-solutions.png"
          alt="Smart Solutions"
          width={250}
          height={60}
          className="h-auto cursor-pointer hover:opacity-80 transition-opacity shadow-lg"
          onClick={handleReset}
          title="Volver al inicio"
        />
      </div>

      <div className="max-w-4xl w-full pt-16 md:pt-24">
        <div className="text-center animate-fade-in">
          <h1 className="text-5xl font-bold mb-6 flex items-center justify-center flex-wrap">
            <span className="text-white mr-3">Autoevaluación de Madurez FinOps</span>
            <img
              src="https://www.finops.org/wp-content/uploads/2024/03/Maturity-Model-hero.svg"
              alt="Modelo de Madurez FinOps"
              className="h-12 w-auto mt-2 md:mt-0"
            />
          </h1>

          {currentLogicalStep > 0 && currentLogicalStep < totalLogicalSteps && (
            <ProgressBar
              currentStep={currentLogicalStep}
              totalSteps={totalLogicalSteps -1} 
              stepName={currentStepName}
            />
          )}
        </div>

        {step === 0 && !userData && !showInfrastructureQuestions && !showResults && (
          <div className="space-y-8 animate-fade-in">
            <div className="glass-panel">
              <p className="text-xl text-white/90 mb-4 font-medium">
                Bienvenido al Auto Assessment de FinOps
              </p>
              <p className="text-lg text-white/80 mb-6">
                FinOps es una práctica de gestión financiera
                colaborativa para entornos en la nube. Combina sistemas, finanzas y
                equipos de negocio para maximizar el valor de la nube.
              </p>
              <Link href="/entendiendo-finops/entendiendo.html" className="inline-block bg-sky-900 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 text-lg shadow-md hover:shadow-lg">
                Entendiendo FinOps
              </Link>
            </div>

            <div className="glass-panel">
              <h2 className="text-2xl font-semibold mb-6 text-white inline-block">
                El modelo de madurez FinOps evalúa
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <li key={category.name} className="flex items-center space-x-3 text-white/90 p-3 rounded-lg hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-white/10">
                      <div className="relative flex items-center">
                        <IconComponent className="w-6 h-6 text-blue-300 flex-shrink-0" />
                        {category.tooltipText && (
                          <Tooltip text={category.tooltipText} position="top" />
                        )}
                      </div>
                      <span>{category.name}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="glass-panel">
              <h3 className="text-2xl font-semibold mb-6 text-white inline-block">
                Completa tus datos para comenzar
              </h3>
              <RegistrationForm onSubmit={handleRegistrationSubmit} />
            </div>
          </div>
        )}

        {showInfrastructureQuestions && userData && !currentCategory && !showResults && (
          <InfrastructureQuestions
            userData={userData}
            onSubmit={handleInfrastructureSubmit}
          />
        )}

        {currentCategory && !showResults && (
          <div className="animate-fade-in">
            <div className="text-center mb-4">
              <p className="text-lg font-semibold text-white">
                Evaluando Categoría {currentCategoryIndex + 1} de {categories.length}: <span className="text-blue-300">{currentCategory.name}</span>
              </p>
            </div>
            <CategoryAssessment
              category={currentCategory}
              selectedLevel={currentResult?.selectedLevel || 0}
              onLevelSelect={handleLevelSelect}
            />
            <div className="mt-8 flex justify-between">
              <button
                onClick={handleReset} 
                className="button-secondary"
              >
                Reiniciar Evaluación
              </button>
              <button
                onClick={handleNextCategory}
                disabled={!currentResult} 
                className="button-modern"
              >
                {currentCategoryIndex < categories.length - 1 ? 'Siguiente Categoría' : 'Ver Resultados'}
              </button>
            </div>
          </div>
        )}

        {showResults && userData && (
          <AssessmentSummary
            assessment={{ userData, results }}
          />
        )}
      </div>
    </div>
  );
}
