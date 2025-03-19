'use client';

import { Assessment } from '@/types/assessment';
import { categories } from '@/data/categories';
import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

interface AssessmentSummaryProps {
  assessment: Assessment;
}

export default function AssessmentSummary({ assessment }: AssessmentSummaryProps) {
  const [mounted, setMounted] = useState(false);
  const [averageLevel, setAverageLevel] = useState(0);

  useEffect(() => {
    // Solo ejecutamos esto en el cliente
    setMounted(true);
    
    // Calculamos el nivel promedio de madurez
    if (assessment.results.length > 0) {
      const total = assessment.results.reduce((sum, result) => sum + result.selectedLevel, 0);
      setAverageLevel(Math.round((total / assessment.results.length) * 10) / 10);
    }
  }, [assessment.results]);

  const downloadCSV = () => {
    if (!mounted) return;

    // Creamos las filas para los datos
    const headers = ['Categoría', 'Nivel', 'Descripción'];
    const rows = assessment.results.map((result) => {
      const category = categories.find((c) => c.name === result.category);
      return [
        result.category,
        result.selectedLevel,
        category?.levelDescriptions[result.selectedLevel - 1] || '',
      ];
    });

    // Datos del usuario
    const userDataRows = [
      ['Nombre', assessment.userData.fullName],
      ['Empresa', assessment.userData.company],
      ['Email', assessment.userData.email],
      ['Posición', assessment.userData.position],
      ['Nivel Promedio', averageLevel.toString()],
      ['', ''],
    ];

    // Formato del CSV
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'AUTOEVALUACIÓN DE MADUREZ FINOPS',
        '',
        'DATOS DEL PARTICIPANTE:',
        ...userDataRows.map((row) => row.join(',')),
        '',
        'RESULTADOS POR CATEGORÍA:',
        headers.join(','),
        ...rows.map((row) => row.join(',')),
      ].join('\n');

    // Descarga del CSV
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `finops_assessment_${assessment.userData.fullName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    if (!mounted) return;

    try {
      // Creamos el documento PDF
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Título
      doc.setFontSize(20);
      doc.setTextColor(30, 64, 175); // Azul oscuro
      doc.text('AUTOEVALUACIÓN DE MADUREZ FINOPS', pageWidth / 2, 20, { align: 'center' });
      
      // Datos del usuario
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Datos del Participante', 14, 35);
      
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      doc.text(`Nombre: ${assessment.userData.fullName}`, 14, 45);
      doc.text(`Empresa: ${assessment.userData.company}`, 14, 52);
      doc.text(`Correo: ${assessment.userData.email}`, 14, 59);
      doc.text(`Posición: ${assessment.userData.position}`, 14, 66);
      
      // Nivel promedio
      doc.setFontSize(14);
      doc.setTextColor(30, 64, 175);
      doc.text(`Nivel Promedio de Madurez: ${averageLevel}`, pageWidth / 2, 80, { align: 'center' });
      
      // Resultados por categoría
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Resultados por Categoría', 14, 95);
      
      let yPosition = 105;
      assessment.results.forEach((result) => {
        const category = categories.find((c) => c.name === result.category);
        
        // Si llegamos al final de la página, creamos una nueva
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(12);
        doc.setTextColor(30, 64, 175);
        doc.text(`${result.category} - Nivel ${result.selectedLevel}`, 14, yPosition);
        
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        const description = category?.levelDescriptions[result.selectedLevel - 1] || '';
        
        // Dividimos la descripción en líneas para que quepa en la página
        const splitDescription = doc.splitTextToSize(description, pageWidth - 30);
        doc.text(splitDescription, 14, yPosition + 7);
        
        yPosition += 7 + (splitDescription.length * 5) + 5;
      });
      
      // Añadimos fecha y hora
      const currentDate = new Date().toLocaleDateString();
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generado el: ${currentDate}`, pageWidth - 14, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
      
      // Descargamos el PDF
      doc.save(`finops_assessment_${assessment.userData.fullName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      alert('Hubo un error al generar el PDF. Por favor, intenta de nuevo.');
    }
  };

  // Mostramos un skeleton mientras se carga el componente
  if (!mounted) {
    return (
      <div className="glass-panel animate-pulse space-y-8">
        <div className="h-8 bg-white/20 rounded w-1/2 mb-4 mx-auto"></div>
        <div className="h-32 bg-white/10 rounded mb-8"></div>
        <div className="h-8 bg-white/20 rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-white/10 rounded"></div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="h-10 bg-white/20 rounded flex-1"></div>
          <div className="h-10 bg-white/20 rounded flex-1"></div>
        </div>
      </div>
    );
  }

  // Función para asignar colores según el nivel
  const getLevelColor = (level: number) => {
    switch(level) {
      case 1: return 'bg-red-100 text-red-800';
      case 2: return 'bg-orange-100 text-orange-800';
      case 3: return 'bg-yellow-100 text-yellow-800';
      case 4: return 'bg-green-100 text-green-800';
      case 5: return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Función para obtener un emoji según el nivel
  const getLevelEmoji = (level: number) => {
    switch(level) {
      case 1: return '😟';
      case 2: return '🙂';
      case 3: return '😊';
      case 4: return '😃';
      case 5: return '🤩';
      default: return '🔍';
    }
  };

  return (
    <div className="glass-panel animate-fade-in space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2 title-gradient">
          Resultado de tu Evaluación
        </h2>
        <p className="text-white/70">
          A continuación se presenta un resumen de tu nivel de madurez FinOps
        </p>
      </div>

      {/* Nivel Promedio */}
      <div className="mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="text-center p-6 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
            <p className="text-lg font-medium text-white/80 mb-1">Nivel Promedio de Madurez</p>
            <div className="flex items-center justify-center">
              <p className="text-6xl font-bold text-white">{averageLevel}</p>
              <span className="text-4xl ml-2">{getLevelEmoji(Math.round(averageLevel))}</span>
            </div>
            <p className="text-sm text-white/60 mt-2">
              Basado en tus respuestas en las {categories.length} categorías
            </p>
          </div>
        </div>
      </div>

      {/* Datos del Participante */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <span className="mr-2">👤</span>
          Datos del Participante
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-sm font-medium text-white/70">Nombre y Apellido</p>
            <p className="text-base text-white">{assessment.userData.fullName}</p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-sm font-medium text-white/70">Empresa</p>
            <p className="text-base text-white">{assessment.userData.company}</p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-sm font-medium text-white/70">Correo Electrónico</p>
            <p className="text-base text-white">{assessment.userData.email}</p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-sm font-medium text-white/70">Posición</p>
            <p className="text-base text-white">{assessment.userData.position}</p>
          </div>
        </div>
      </div>

      {/* Resultados por Categoría */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <span className="mr-2">📊</span>
          Resultados por Categoría
        </h3>
        <div className="space-y-4">
          {assessment.results.map((result) => {
            const category = categories.find((c) => c.name === result.category);
            
            return (
              <div
                key={result.category}
                className="p-4 bg-white/5 border border-white/10 rounded-lg transition-all hover:bg-white/10 hover:shadow-lg"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <h4 className="text-lg font-medium text-white flex items-center">
                    <span className="mr-2">{getLevelEmoji(result.selectedLevel)}</span>
                    {result.category}
                  </h4>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getLevelColor(result.selectedLevel)}`}>
                    Nivel {result.selectedLevel}
                  </span>
                </div>
                <p className="mt-2 text-sm text-white/70">{category?.levelDescriptions[result.selectedLevel - 1]}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botones de Descarga */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={downloadPDF}
          className="flex-1 button-modern bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center"
        >
          <span className="mr-2">📄</span>
          Descargar PDF
        </button>
        <button
          onClick={downloadCSV}
          className="flex-1 button-modern flex items-center justify-center"
        >
          <span className="mr-2">📊</span>
          Descargar CSV
        </button>
      </div>
    </div>
  );
} 