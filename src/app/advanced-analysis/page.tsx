'use client';

import { useState, useEffect } from 'react';
import { Assessment } from '@/types/assessment';
import { categories } from '@/data/categories';
import Link from 'next/link';

export default function AdvancedAnalysis() {
  const [mounted, setMounted] = useState(false);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [averageLevel, setAverageLevel] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [savings, setSavings] = useState<number | null>(null);
  
  useEffect(() => {
    // Solo ejecutamos esto en el cliente
    setMounted(true);
    
    // Cargamos la evaluación desde localStorage
    const storedUserData = localStorage.getItem('userData');
    const storedResults = localStorage.getItem('assessmentResults');
    
    if (storedUserData && storedResults) {
      try {
        const userData = JSON.parse(storedUserData);
        const results = JSON.parse(storedResults);
        
        setAssessment({
          userData,
          results
        });
        
        // Calculamos el nivel promedio de madurez
        if (results.length > 0) {
          const total = results.reduce((sum: number, result: any) => sum + result.selectedLevel, 0);
          setAverageLevel(Math.round((total / results.length) * 10) / 10);
        }
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('No se pudo cargar la evaluación. Por favor, vuelve a realizar la evaluación.');
      }
    } else {
      setError('No se encontró ninguna evaluación. Por favor, realiza la evaluación primero.');
    }
  }, []);
  
  const generateAnalysis = async () => {
    if (!assessment) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Crear un objeto con la información importante para la IA
      const analysisData = {
        averageLevel,
        categories: assessment.results.map(result => {
          const category = categories.find(c => c.name === result.category);
          return {
            name: result.category,
            level: result.selectedLevel,
            description: category?.levelDescriptions[result.selectedLevel - 1] || ''
          };
        }),
        infrastructure: {
          cloudProviders: assessment.userData.cloudProviders,
          teamComposition: assessment.userData.teamComposition,
          annualBudget: assessment.userData.annualBudget,
          monthlySpend: assessment.userData.monthlySpend,
          workloadTypes: assessment.userData.workloadTypes,
          serversCount: assessment.userData.serversCount,
          marketplacePurchases: assessment.userData.marketplacePurchases,
          paymentModels: assessment.userData.paymentModels,
          finOpsTools: assessment.userData.finOpsTools,
          costReductionPractices: assessment.userData.costReductionPractices
        }
      };
      
      // Simular una solicitud a una API de análisis (ya que no hay backend real)
      // En un escenario real, aquí se enviaría la información a un backend que procesaría
      // los datos usando un modelo de IA
      
      // Simulamos un tiempo de espera para procesar el análisis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulamos el resultado del análisis basado en el nivel de madurez
      let analysisResult = '';
      let savingsPercentage = 0;
      
      if (averageLevel < 2) {
        // Nivel principiante
        analysisResult = `
          <h2 class="text-xl font-semibold mb-3 text-blue-300">Análisis de Madurez FinOps</h2>
          <p class="mb-4">Tu organización se encuentra en una <span class="font-medium text-blue-300">fase inicial</span> de madurez FinOps con un nivel promedio de ${averageLevel}/5.</p>
          
          <h3 class="text-lg font-medium mb-2 text-white">Hallazgos clave:</h3>
          <ul class="list-disc pl-5 mb-4 space-y-2 text-white/80">
            <li>Hay una falta de procesos formales para la gestión de costos en la nube</li>
            <li>La visibilidad de costos es limitada y reactiva</li>
            <li>Las decisiones de optimización son ad-hoc sin una estrategia clara</li>
            <li>Existe una brecha importante en la asignación de responsabilidades</li>
          </ul>
          
          <h3 class="text-lg font-medium mb-2 text-white">Recomendaciones prioritarias:</h3>
          <ol class="list-decimal pl-5 mb-6 space-y-2 text-white/80">
            <li>Implementar etiquetado (tagging) consistente para todos los recursos en la nube</li>
            <li>Establecer informes básicos de visibilidad de costos y compartirlos con stakeholders clave</li>
            <li>Definir roles y responsabilidades básicas de FinOps</li>
            <li>Comenzar con optimizaciones simples como apagado de recursos no utilizados y rightsizing básico</li>
            <li>Considerar la implementación de herramientas nativas de análisis de costos</li>
          </ol>
        `;
        savingsPercentage = Math.floor(Math.random() * 15) + 15; // Entre 15-30%
      } else if (averageLevel < 4) {
        // Nivel intermedio
        analysisResult = `
          <h2 class="text-xl font-semibold mb-3 text-blue-300">Análisis de Madurez FinOps</h2>
          <p class="mb-4">Tu organización ha alcanzado un <span class="font-medium text-blue-300">nivel intermedio</span> de madurez FinOps con un promedio de ${averageLevel}/5.</p>
          
          <h3 class="text-lg font-medium mb-2 text-white">Hallazgos clave:</h3>
          <ul class="list-disc pl-5 mb-4 space-y-2 text-white/80">
            <li>Existen procesos establecidos para control y visibilidad de costos</li>
            <li>La mayoría de los equipos están comprometidos con las prácticas FinOps</li>
            <li>Hay oportunidades para automatizar y mejorar la toma de decisiones</li>
            <li>La asignación de costos está funcionando pero puede refinarse</li>
          </ul>
          
          <h3 class="text-lg font-medium mb-2 text-white">Recomendaciones prioritarias:</h3>
          <ol class="list-decimal pl-5 mb-6 space-y-2 text-white/80">
            <li>Implementar automatización para optimizaciones recurrentes (scaling, rightsizing)</li>
            <li>Mejorar la integración de datos financieros y técnicos</li>
            <li>Desarrollar KPIs más sofisticados para medir eficiencia</li>
            <li>Refinar la asignación de costos para mejorar la precisión</li>
            <li>Invertir en capacitación FinOps para más equipos</li>
          </ol>
        `;
        savingsPercentage = Math.floor(Math.random() * 10) + 8; // Entre 8-18%
      } else {
        // Nivel avanzado
        analysisResult = `
          <h2 class="text-xl font-semibold mb-3 text-blue-300">Análisis de Madurez FinOps</h2>
          <p class="mb-4">Tu organización ha alcanzado un <span class="font-medium text-blue-300">nivel avanzado</span> de madurez FinOps con un promedio de ${averageLevel}/5.</p>
          
          <h3 class="text-lg font-medium mb-2 text-white">Hallazgos clave:</h3>
          <ul class="list-disc pl-5 mb-4 space-y-2 text-white/80">
            <li>La cultura FinOps está bien establecida en toda la organización</li>
            <li>Existen procesos sofisticados para optimización continua</li>
            <li>La automatización es ampliamente utilizada para control de costos</li>
            <li>La toma de decisiones basada en valor es la norma</li>
          </ul>
          
          <h3 class="text-lg font-medium mb-2 text-white">Recomendaciones para seguir mejorando:</h3>
          <ol class="list-decimal pl-5 mb-6 space-y-2 text-white/80">
            <li>Implementar análisis predictivo para anticipar patrones de gasto</li>
            <li>Desarrollar modelos de optimización multi-nube avanzados</li>
            <li>Establecer programas de innovación para nuevas prácticas FinOps</li>
            <li>Compartir mejores prácticas con la comunidad FinOps</li>
            <li>Implementar frameworks avanzados de Unit Economics</li>
          </ol>
        `;
        savingsPercentage = Math.floor(Math.random() * 7) + 3; // Entre 3-10%
      }
      
      // Calculamos un estimado de ahorro mensual
      let monthlySpend = 0;
      switch(Number(assessment.userData.monthlySpend)) {
        case 1: monthlySpend = 5000; break; // Promedio para "Menos de USD 10,000"
        case 2: monthlySpend = 30000; break; // Promedio para "Entre USD 10,000 y 50,000"
        case 3: monthlySpend = 75000; break; // Promedio para "Entre USD 50,000 y 100,000"
        case 4: monthlySpend = 300000; break; // Promedio para "Entre USD 100,000 y 500,000"
        case 5: monthlySpend = 750000; break; // Promedio para "Más de USD 500,000"
        default: monthlySpend = 50000; // Valor predeterminado
      }
      
      const potentialSavings = monthlySpend * (savingsPercentage / 100);
      
      setAnalysis(analysisResult);
      setSavings(potentialSavings);
    } catch (err) {
      console.error('Error al generar análisis:', err);
      setError('Ocurrió un error al generar el análisis. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  // Mostramos un skeleton mientras se carga el componente
  if (!mounted) {
    return (
      <div className="bg-gradient-radial min-h-screen flex flex-col justify-center items-center p-4">
        <div className="glass-panel animate-pulse w-full max-w-4xl space-y-8">
          <div className="h-8 bg-white/20 rounded w-1/2 mb-4 mx-auto"></div>
          <div className="h-32 bg-white/10 rounded mb-8"></div>
          <div className="h-8 bg-white/20 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-white/10 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-radial min-h-screen flex flex-col justify-center items-center p-4">
      {/* Logo en la parte superior */}
      <div className="fixed top-4 left-0 right-0 flex justify-center z-50">
        <img 
          src="/images/smart-solutions.png" 
          alt="Smart Solutions" 
          width={250}
          height={60}
          className="h-auto cursor-pointer hover:opacity-80 transition-opacity shadow-lg"
        />
      </div>
      
      <div className="max-w-4xl w-full pt-16 md:pt-24">
        <div className="glass-panel animate-fade-in">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-4 text-white">
              Análisis Avanzado con IA
            </h1>
            <p className="text-white/80 text-lg">
              Análisis detallado de tu nivel de madurez FinOps con recomendaciones personalizadas
            </p>
          </div>
          
          {error ? (
            <div className="bg-red-500/20 border border-red-600/30 rounded-lg p-4 mb-6">
              <p className="text-white text-center">{error}</p>
              <div className="flex justify-center mt-4">
                <Link href="/" className="button-modern bg-blue-600 hover:bg-blue-700">
                  Volver al inicio
                </Link>
              </div>
            </div>
          ) : assessment ? (
            <>
              <div className="mb-6 p-4 bg-white/5 rounded-lg">
                <h2 className="text-lg font-medium text-white/90 mb-3">Información del Assessment</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-white/70">Empresa:</p>
                    <p className="text-white">{assessment.userData.company}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Nivel promedio:</p>
                    <p className="text-white font-medium">{averageLevel}/5</p>
                  </div>
                </div>
              </div>
              
              {analysis ? (
                <div className="space-y-6">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div dangerouslySetInnerHTML={{ __html: analysis }} />
                  </div>
                  
                  {savings !== null && (
                    <div className="p-4 bg-white/5 rounded-lg">
                      <h2 className="text-xl font-semibold mb-3 text-blue-300">Proyección de Ahorro Mensual</h2>
                      <div className="flex items-center justify-center">
                        <div className="text-center p-8 rounded-xl shadow-lg bg-white/5">
                          <p className="text-white/80 mb-2">Ahorro mensual potencial</p>
                          <p className="text-4xl font-bold text-white">${savings.toLocaleString('es-ES')}</p>
                          <p className="text-sm text-white/60 mt-2">
                            Basado en las mejoras recomendadas
                          </p>
                        </div>
                      </div>
                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-2 text-white">Proyección a 12 meses</h3>
                        <div className="w-full bg-white/5 h-10 rounded-lg overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center"
                            style={{ width: '100%' }}
                          >
                            <span className="text-white font-medium">${(savings * 12).toLocaleString('es-ES')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-6">
                  <p className="text-white/80 mb-6">
                    Genera un análisis personalizado basado en tus resultados de evaluación de madurez FinOps.
                    Obtén recomendaciones específicas y estimaciones de ahorro potencial.
                  </p>
                  <button
                    onClick={generateAnalysis}
                    disabled={loading}
                    className="button-modern bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Generando análisis...' : 'Generar análisis'}
                  </button>
                </div>
              )}
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                {analysis && (
                  <button
                    onClick={generateAnalysis}
                    disabled={loading}
                    className="button-modern bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Generando...' : 'Regenerar análisis'}
                  </button>
                )}
                <Link href="/" className="button-modern">
                  Volver a los resultados
                </Link>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 