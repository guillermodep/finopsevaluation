'use client';

import { useState, useEffect } from 'react';
import { UserData, AssessmentResult } from '@/types/assessment';
import { categories } from '@/data/categories';
import RegistrationForm from '@/components/RegistrationForm';
import CategoryAssessment from '@/components/CategoryAssessment';
import AssessmentSummary from '@/components/AssessmentSummary';
import { storeUserData, storeResult } from '@/store/assessmentStore';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRegistrationSubmit = (data: UserData) => {
    setUserData(data);
    storeUserData(data);
    setStep(1);
  };

  const handleLevelSelect = (level: number) => {
    const result: AssessmentResult = {
      category: categories[step - 1].name,
      selectedLevel: level,
    };

    setResults(prev => {
      const newResults = [...prev];
      const existingIndex = prev.findIndex(r => r.category === result.category);
      if (existingIndex >= 0) {
        newResults[existingIndex] = result;
      } else {
        newResults.push(result);
      }
      return newResults;
    });

    storeResult(result);
    if (step < categories.length) {
      setStep(prev => prev + 1);
    }
  };

  const handleSubmitResults = () => {
    setShowResults(true);
  };

  const allCategoriesAnswered = results.length === categories.length;
  const currentCategory = step > 0 && step <= categories.length ? categories[step - 1] : null;
  const currentResult = currentCategory
    ? results.find((r) => r.category === currentCategory.name)
    : null;

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl font-bold mb-8 title-gradient">
            🔎 Autoevaluación de Madurez FinOps
          </h1>
          
          {step === 0 && (
            <div className="space-y-8 animate-fade-in">
              <div className="glass-panel">
                <p className="text-xl text-white/90 mb-4">
                  Bienvenido al Auto Assessment de FinOps
                </p>
                <p className="text-lg text-white/80">
                  FinOps (Financial Operations) es una práctica de gestión financiera
                  colaborativa para entornos en la nube. Combina sistemas, finanzas y
                  equipos de negocio para maximizar el valor de la nube.
                </p>
              </div>

              <div className="glass-panel">
                <h2 className="text-2xl font-semibold mb-6">
                  El modelo de madurez FinOps evalúa:
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <li key={category.name} className="flex items-center space-x-3 text-white/90">
                      <span className="text-blue-200">•</span>
                      <span>{category.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-panel">
                <RegistrationForm onSubmit={handleRegistrationSubmit} />
              </div>
            </div>
          )}

          {currentCategory && (
            <div className="animate-fade-in">
              <CategoryAssessment
                category={currentCategory}
                selectedLevel={currentResult?.selectedLevel || 0}
                onLevelSelect={handleLevelSelect}
              />
            </div>
          )}

          {/* Botón de enviar cuando todas las categorías están contestadas pero aún no se muestran los resultados */}
          {step > categories.length && !showResults && userData && allCategoriesAnswered && (
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

          {step > 0 && step <= categories.length && (
            <div className="mt-6 text-white/70 animate-fade-in">
              Paso {step} de {categories.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
