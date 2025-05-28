'use client';

import { useState, useEffect } from 'react';
import { UserData, AssessmentResult } from '@/types/assessment';
import { categories } from '@/data/categories';
import RegistrationForm from '@/components/RegistrationForm';
import CategoryAssessment from '@/components/CategoryAssessment';
import AssessmentSummary from '@/components/AssessmentSummary';
import { storeUserData, storeResult } from '@/store/assessmentStore';
import InfrastructureQuestions from '@/components/InfrastructureQuestions';
import ProgressBar from '@/components/ProgressBar';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
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
    localStorage.removeItem('userData');
    localStorage.removeItem('assessmentResults');
    setUserData(null);
    setResults([]);
    setCurrentCategoryIndex(-1);
    setStep(0);
    setShowResults(false);
    setShowInfrastructureQuestions(false);
    window.scrollTo(0, 0);
  };

  const currentCategory = currentCategoryIndex >= 0 ? categories[currentCategoryIndex] : null;
  const currentResult = currentCategory
    ? results.find(r => r.category === currentCategory.name)
    : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRegistrationSubmit = (data: UserData) => {
    setUserData(data);
    storeUserData(data);
    setShowInfrastructureQuestions(true);
    setStep(1); 
  };

  const handleInfrastructureSubmit = (updatedUserData: UserData) => {
    setUserData(updatedUserData);
    storeUserData(updatedUserData);
    setShowInfrastructureQuestions(false);
    setCurrentCategoryIndex(0);
    setStep(2); 
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
    if (currentCategory) {
      const resultToStore = {
        category: currentCategory.name,
        selectedLevel: level,
      };
      storeResult(resultToStore);
    }
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

  const handleSubmitResults = () => {
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
              <p className="text-lg text-white/80">
                FinOps es una práctica de gestión financiera
                colaborativa para entornos en la nube. Combina sistemas, finanzas y
                equipos de negocio para maximizar el valor de la nube.
              </p>
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
                      <IconComponent className="w-6 h-6 text-blue-300 flex-shrink-0" />
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
