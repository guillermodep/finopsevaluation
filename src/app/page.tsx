'use client';

import { useState, useEffect } from 'react';
import { UserData, AssessmentResult } from '@/types/assessment';
import { categories } from '@/data/categories';
import RegistrationForm from '@/components/RegistrationForm';
import CategoryAssessment from '@/components/CategoryAssessment';
import AssessmentSummary from '@/components/AssessmentSummary';
import { storeUserData, storeResult } from '@/store/assessmentStore';
import InfrastructureQuestions from '@/components/InfrastructureQuestions';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(-1);
  const [step, setStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showInfrastructureQuestions, setShowInfrastructureQuestions] = useState(false);
  
  const currentCategory = currentCategoryIndex >= 0 ? categories[currentCategoryIndex] : null;
  const currentResult = currentCategory 
    ? results.find(r => r.category === currentCategory.name) 
    : null;
  
  const allCompleted = results.length === categories.length;

  // Establecer el componente como montado
  useEffect(() => {
    setMounted(true);
  }, []);

  // Manejar el envío del formulario de registro
  const handleRegistrationSubmit = (data: UserData) => {
    setUserData(data);
    storeUserData(data);
    setShowInfrastructureQuestions(true);
    setStep(1);
  };
  
  // Manejar el envío del formulario de infraestructura
  const handleInfrastructureSubmit = (updatedUserData: UserData) => {
    setUserData(updatedUserData);
    storeUserData(updatedUserData);
    setShowInfrastructureQuestions(false);
    setCurrentCategoryIndex(0);
    setStep(2);
  };

  // Manejar la selección de nivel para una categoría
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

  // Navegar a la siguiente categoría o mostrar los resultados
  const handleNextCategory = () => {
    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setStep(step + 1);
    } else {
      // Todas las categorías completadas
      setStep(categories.length + 2);
    }
  };

  // Manejar el envío de la evaluación completa
  const handleSubmitResults = () => {
    setShowResults(true);
  };

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
      <div className="max-w-4xl w-full">
        {/* Logo centrado en la parte superior */}
        <div className="absolute top-4 left-0 right-0 flex justify-center">
          <img 
            src="/images/smart-solutions.png" 
            alt="Smart Solutions" 
            width={250}
            height={60}
            className="h-auto cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => {
              setUserData(null);
              setResults([]);
              setCurrentCategoryIndex(-1);
              setStep(0);
              setShowResults(false);
              setShowInfrastructureQuestions(false);
            }}
          />
        </div>
        
        <div className="text-center animate-fade-in pt-16 md:pt-24">
          <h1 className="text-5xl font-bold mb-10 flex items-center justify-center flex-wrap">
            <span className="text-white mr-3">Autoevaluación de Madurez FinOps</span>
            <img 
              src="https://www.finops.org/wp-content/uploads/2024/03/Maturity-Model-hero.svg" 
              alt="Modelo de Madurez FinOps" 
              className="h-12 w-auto mt-2 md:mt-0"
            />
          </h1>
          
          {/* Paso 0: Formulario de registro inicial */}
          {step === 0 && (
            <div className="space-y-8 animate-fade-in">
              <div className="glass-panel">
                <p className="text-xl text-white/90 mb-4 font-medium">
                  Bienvenido al Auto Assessment de FinOps
                </p>
                <p className="text-lg text-white/80">
                  FinOps (Financial Operations) es una práctica de gestión financiera
                  colaborativa para entornos en la nube. Combina sistemas, finanzas y
                  equipos de negocio para maximizar el valor de la nube.
                </p>
              </div>

              <div className="glass-panel">
                <h2 className="text-2xl font-semibold mb-6 text-white inline-block">
                  El modelo de madurez FinOps evalúa:
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <li key={category.name} className="flex items-center space-x-3 text-white/90 p-2 rounded-lg hover:bg-white/5 transition-all duration-200">
                      <span className="text-blue-300 text-xl">•</span>
                      <span>{category.name}</span>
                    </li>
                  ))}
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
          
          {/* Paso 1: Formulario de infraestructura y equipos */}
          {step === 1 && showInfrastructureQuestions && userData && (
            <InfrastructureQuestions 
              userData={userData} 
              onSubmit={handleInfrastructureSubmit} 
            />
          )}

          {/* Evaluación de categorías */}
          {currentCategory && step >= 2 && step < categories.length + 2 && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70">
                  Categoría {currentCategoryIndex + 1} de {categories.length}
                </span>
                {currentResult && (
                  <button
                    onClick={handleNextCategory}
                    className="text-blue-300 hover:text-blue-200 transition-colors"
                  >
                    {currentCategoryIndex < categories.length - 1 
                      ? 'Siguiente categoría →' 
                      : 'Finalizar →'}
                  </button>
                )}
              </div>
              
              <CategoryAssessment
                category={currentCategory}
                selectedLevel={currentResult?.selectedLevel || 0}
                onLevelSelect={handleLevelSelect}
              />
              
              {currentResult && (
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleNextCategory}
                    className="button-modern"
                  >
                    {currentCategoryIndex < categories.length - 1 
                      ? 'Siguiente categoría' 
                      : 'Finalizar evaluación'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Botón de enviar cuando todas las categorías están contestadas pero aún no se muestran los resultados */}
          {allCompleted && !showResults && userData && step === categories.length + 2 && (
            <div className="glass-panel animate-fade-in space-y-6">
              <h2 className="text-2xl font-bold text-white">
                ¡Has completado todas las preguntas!
              </h2>
              <p className="text-lg text-white/80">
                Has evaluado todas las categorías. Haz clic en el botón "Enviar" para ver tu resultado.
              </p>
              <div className="flex justify-center mt-6">
                <button 
                  onClick={handleSubmitResults}
                  className="button-modern bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 text-lg flex items-center shadow-lg"
                >
                  <span className="mr-2">✓</span>
                  Enviar Evaluación
                </button>
              </div>
            </div>
          )}

          {/* Mostrar los resultados solo después de hacer clic en "Enviar" */}
          {showResults && userData && (
            <div className="animate-fade-in">
              <AssessmentSummary
                assessment={{
                  userData,
                  results,
                }}
              />
            </div>
          )}

          {step > 0 && step <= categories.length + 1 && (
            <div className="mt-6 text-white/70 animate-fade-in">
              {step === 1 
                ? 'Paso preliminar: Detalles de infraestructura' 
                : `Paso ${step - 1} de ${categories.length + 1}`}
            </div>
          )}
        </div>
      </div>
      
      {/* Firma en el footer */}
      <div className="text-center text-white/40 text-xs mt-8">
        Desarrollado por Smart Solutions
      </div>
    </div>
  );
}
