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

    // Datos del usuario
    const userDataRows = [
      ['Nombre', assessment.userData.fullName],
      ['Empresa', assessment.userData.company],
      ['Email', assessment.userData.email],
      ['Posición', assessment.userData.position],
      ['Nivel Promedio', averageLevel.toString()],
      ['', ''],
    ];

    // Determinar escala de madurez y características para CSV
    let escalaTextoCSV = '';
    let caracteristicasCSV: string[] = [];
    
    if (averageLevel < 2) {
      escalaTextoCSV = 'GATEAR (0-2)';
      caracteristicasCSV = [
        'Muy pocas herramientas y reportes implementados',
        'Las mediciones solo proporcionan información sobre los beneficios de madurar la capacidad',
        'KPIs básicos establecidos para medir el éxito',
        'Procesos y políticas básicas definidas en torno a la capacidad',
        'La capacidad es comprendida pero no seguida por todos los equipos principales',
        'Planes para abordar "frutos al alcance de la mano" (soluciones fáciles)',
      ];
    } else if (averageLevel < 4) {
      escalaTextoCSV = 'CAMINAR (2-4)';
      caracteristicasCSV = [
        'La capacidad es comprendida y seguida dentro de la organización',
        'Se identifican casos difíciles pero se adopta la decisión de no abordarlos',
        'La automatización y/o los procesos cubren la mayoría de los requisitos de capacidad',
        'Los casos más difíciles son identificados y se ha estimado el esfuerzo para resolverlos',
        'Objetivos/KPIs de nivel medio a alto establecidos para medir el éxito',
      ];
    } else {
      escalaTextoCSV = 'CORRER (+4)';
      caracteristicasCSV = [
        'La capacidad es comprendida y seguida por todos los equipos de la organización',
        'Los casos difíciles están siendo abordados activamente',
        'Objetivos/KPIs muy altos establecidos para medir el éxito',
        'La automatización es el enfoque preferido para todas las soluciones',
      ];
    }
    
    // Agregamos la escala de madurez
    userDataRows.splice(5, 0, ['Escala de Madurez FinOps', escalaTextoCSV]);
    
    // Agregamos las características
    userDataRows.splice(6, 0, ['Características de este nivel:', '']);
    caracteristicasCSV.forEach((caracteristica: string, index: number) => {
      userDataRows.splice(7 + index, 0, ['', `• ${caracteristica}`]);
    });
    
    // Información de infraestructura y equipos
    const infrastructureRows: string[][] = [
      ['', ''],
      ['INFORMACIÓN DE INFRAESTRUCTURA Y EQUIPOS:', ''],
      ['', ''],
      ['Proveedores de nube utilizados:', ''],
    ];
    
    // Proveedores de nube
    const providers = [];
    if (assessment.userData.cloudProviders.aws) providers.push('AWS');
    if (assessment.userData.cloudProviders.azure) providers.push('Microsoft Azure');
    if (assessment.userData.cloudProviders.gcp) providers.push('Google Cloud Platform');
    if (assessment.userData.cloudProviders.oracle) providers.push('Oracle Cloud');
    if (assessment.userData.cloudProviders.ibm) providers.push('IBM Cloud');
    if (assessment.userData.cloudProviders.other) providers.push(assessment.userData.cloudProviders.otherSpecified || 'Otro');
    
    if (providers.length > 0) {
      providers.forEach(provider => {
        infrastructureRows.push(['', `• ${provider}`]);
      });
    } else {
      infrastructureRows.push(['', 'No se ha seleccionado ningún proveedor']);
    }
    
    // Composición del equipo
    infrastructureRows.push(['', '']);
    infrastructureRows.push(['Composición del equipo:', '']);
    
    let teamCompositionText = '';
    switch(Number(assessment.userData.teamComposition)) {
      case 1:
        teamCompositionText = 'No hay equipo';
        break;
      case 2:
        teamCompositionText = 'Lo hace el equipo de Infraestructura/Plataformas/Operaciones';
        break;
      case 3:
        teamCompositionText = 'Equipo de Cloud con capacidades de Arquitectura/Ingeniería sin especialistas en FinOps';
        break;
      case 4:
        teamCompositionText = 'Equipo de Cloud con capacidades de Arquitectura/Ingeniería CON especialistas en FinOps';
        break;
      case 5:
        teamCompositionText = 'CoE Centro de Excelencia Cloud con BPO y especialistas de Gobierno y práctica FinOps';
        break;
      case 6:
        teamCompositionText = assessment.userData.teamCompositionOther || 'Otro';
        break;
      default:
        teamCompositionText = 'No se ha seleccionado';
    }
    
    infrastructureRows.push(['', teamCompositionText]);
    
    // Presupuesto anual
    infrastructureRows.push(['', '']);
    infrastructureRows.push(['Presupuesto anual:', '']);
    
    let budgetText = '';
    switch(Number(assessment.userData.annualBudget)) {
      case 1:
        budgetText = 'Menos de USD 100,000';
        break;
      case 2:
        budgetText = 'Entre USD 100,000 y 500,000';
        break;
      case 3:
        budgetText = 'Entre USD 500,000 y 1,000,000';
        break;
      case 4:
        budgetText = 'Entre USD 1,000,000 y 5,000,000';
        break;
      case 5:
        budgetText = 'Más de USD 5,000,000';
        break;
      default:
        budgetText = 'No se ha seleccionado';
    }
    
    infrastructureRows.push(['', `• ${budgetText}`]);
    
    // Gasto mensual
    infrastructureRows.push(['', '']);
    infrastructureRows.push(['Gasto mensual promedio:', '']);
    
    let spendText = '';
    switch(Number(assessment.userData.monthlySpend)) {
      case 1:
        spendText = 'Menos de USD 10,000';
        break;
      case 2:
        spendText = 'Entre USD 10,000 y 50,000';
        break;
      case 3:
        spendText = 'Entre USD 50,000 y 100,000';
        break;
      case 4:
        spendText = 'Entre USD 100,000 y 500,000';
        break;
      case 5:
        spendText = 'Más de USD 500,000';
        break;
      default:
        spendText = 'No se ha seleccionado';
    }
    
    infrastructureRows.push(['', `• ${spendText}`]);
    infrastructureRows.push(['', '']);

    // Formato del CSV
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'AUTOEVALUACIÓN DE MADUREZ FINOPS',
        '',
        'DATOS DEL PARTICIPANTE:',
        ...userDataRows.map((row) => row.join(',')),
        ...infrastructureRows.map((row) => row.join(',')),
        '',
        'RESULTADOS POR CATEGORÍA:',
        'Categoría,Nivel,Descripción',
        ...assessment.results.map((result) => {
          const category = categories.find((c) => c.name === result.category);
          return [
            result.category,
            result.selectedLevel,
            category?.levelDescriptions[result.selectedLevel - 1] || '',
          ].join(',');
        }),
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
      
      // Añadimos el logo de Smart Solutions
      try {
        // Creamos una imagen temporal para cargar el logo
        const img = new Image();
        img.onload = function() {
          // Calculamos las dimensiones para mantener la proporción
          const imgWidth = 30; // Reducir el tamaño
          const imgHeight = (img.height * imgWidth) / img.width;
          
          // Añadimos el logo en la esquina superior izquierda con márgenes
          doc.addImage(img, 'PNG', 14, 10, imgWidth, imgHeight);
          
          // Continuamos con el resto del PDF
          finalizePDF();
        };
        img.onerror = function() {
          console.error('Error al cargar el logo');
          // Si hay error, continuamos sin el logo
          finalizePDF();
        };
        // Cargamos la imagen
        img.src = '/images/smart-solutions.png';
      } catch (error) {
        console.error('Error al procesar el logo:', error);
        // Si hay error, continuamos sin el logo
        finalizePDF();
      }
      
      function finalizePDF() {
        // Título - bajamos la posición de 20 a 30 para evitar el solapamiento con el logo
        doc.setFontSize(20);
        doc.setTextColor(30, 64, 175); // Azul oscuro
        doc.text('AUTOEVALUACIÓN DE MADUREZ FINOPS', pageWidth / 2, 30, { align: 'center' });
        
        // Ejemplo 1: Salto de línea usando \n dentro del mismo texto
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Documento generado por:\nSmart Solutions', 14, 40);
        
        // Ejemplo 2: Salto de línea con múltiples llamadas a doc.text
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text('Para más información:', pageWidth - 15, 35, { align: 'right' });
        doc.text('www.smartsolutions.com', pageWidth - 15, 40, { align: 'right' });
        
        // Ejemplo 3: Dividir textos largos automáticamente con splitTextToSize
        doc.setFontSize(9);
        doc.setTextColor(90, 90, 90);
        const textoLargo = "Este texto largo se dividirá automáticamente en múltiples líneas según el ancho máximo establecido, sin necesidad de agregar manualmente los saltos de línea.";
        const lineasTexto = doc.splitTextToSize(textoLargo, 100); // 100 es el ancho máximo en puntos
        doc.text(lineasTexto, 15, 48);
        
        // Datos del usuario - actualizamos las posiciones para mantener el espacio correcto
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Datos del Participante', 14, 55);
        
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        doc.text(`Nombre: ${assessment.userData.fullName}`, 14, 62);
        doc.text(`Empresa: ${assessment.userData.company}`, 14, 69);
        doc.text(`Correo: ${assessment.userData.email}`, 14, 76);
        doc.text(`Posición: ${assessment.userData.position}`, 14, 83);
        
        // Información de infraestructura y equipos
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Información de Infraestructura y Equipos', 14, 90);
        
        // Proveedores de nube
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        doc.text('Proveedores de nube utilizados:', 14, 100);
        
        let yPos = 107;
        const providers = [];
        if (assessment.userData.cloudProviders.aws) providers.push('AWS');
        if (assessment.userData.cloudProviders.azure) providers.push('Microsoft Azure');
        if (assessment.userData.cloudProviders.gcp) providers.push('Google Cloud Platform');
        if (assessment.userData.cloudProviders.oracle) providers.push('Oracle Cloud');
        if (assessment.userData.cloudProviders.ibm) providers.push('IBM Cloud');
        if (assessment.userData.cloudProviders.other) providers.push(assessment.userData.cloudProviders.otherSpecified || 'Otro');
        
        if (providers.length > 0) {
          providers.forEach(provider => {
            doc.text(`• ${provider}`, 16, yPos);
            yPos += 6;
          });
        } else {
          doc.text('No se ha seleccionado ningún proveedor', 16, yPos);
          yPos += 6;
        }
        
        // Composición del equipo
        yPos += 4;
        doc.text('Composición del equipo:', 14, yPos);
        yPos += 7;
        
        let teamCompositionText = '';
        switch(Number(assessment.userData.teamComposition)) {
          case 1:
            teamCompositionText = 'No hay equipo';
            break;
          case 2:
            teamCompositionText = 'Lo hace el equipo de Infraestructura/Plataformas/Operaciones';
            break;
          case 3:
            teamCompositionText = 'Equipo de Cloud con capacidades de Arquitectura/Ingeniería sin especialistas en FinOps';
            break;
          case 4:
            teamCompositionText = 'Equipo de Cloud con capacidades de Arquitectura/Ingeniería CON especialistas en FinOps';
            break;
          case 5:
            teamCompositionText = 'CoE Centro de Excelencia Cloud con BPO y especialistas de Gobierno y práctica FinOps';
            break;
          case 6:
            teamCompositionText = assessment.userData.teamCompositionOther || 'Otro';
            break;
          default:
            teamCompositionText = 'No se ha seleccionado';
        }
        
        const splitTeamComposition = doc.splitTextToSize(teamCompositionText, pageWidth - 30);
        doc.text(splitTeamComposition, 16, yPos);
        yPos += (splitTeamComposition.length * 6) + 4;
        
        // Presupuesto anual
        doc.text('Presupuesto anual:', 14, yPos);
        yPos += 7;
        
        let budgetText = '';
        switch(Number(assessment.userData.annualBudget)) {
          case 1:
            budgetText = 'Menos de USD 100,000';
            break;
          case 2:
            budgetText = 'Entre USD 100,000 y 500,000';
            break;
          case 3:
            budgetText = 'Entre USD 500,000 y 1,000,000';
            break;
          case 4:
            budgetText = 'Entre USD 1,000,000 y 5,000,000';
            break;
          case 5:
            budgetText = 'Más de USD 5,000,000';
            break;
          default:
            budgetText = 'No se ha seleccionado';
        }
        
        doc.text(`• ${budgetText}`, 16, yPos);
        yPos += 7;
        
        // Gasto mensual
        doc.text('Gasto mensual:', 14, yPos);
        yPos += 7;
        
        let spendText = '';
        switch(Number(assessment.userData.monthlySpend)) {
          case 1:
            spendText = 'Menos de USD 10,000';
            break;
          case 2:
            spendText = 'Entre USD 10,000 y 50,000';
            break;
          case 3:
            spendText = 'Entre USD 50,000 y 100,000';
            break;
          case 4:
            spendText = 'Entre USD 100,000 y 500,000';
            break;
          case 5:
            spendText = 'Más de USD 500,000';
            break;
          default:
            spendText = 'No se ha seleccionado';
        }
        
        doc.text(`• ${spendText}`, 16, yPos);
        yPos += 12;
        
        // Nivel promedio
        doc.setFontSize(14);
        doc.setTextColor(30, 64, 175);
        doc.text(`Nivel Promedio de Madurez: ${averageLevel}`, pageWidth / 2, yPos, { align: 'center' });
        yPos += 10;
        
        // Escala de Madurez FinOps
        doc.setFontSize(14);
        doc.setTextColor(30, 64, 175);
        
        // Determinamos la escala de madurez y características
        let escalaTexto = '';
        let caracteristicas: string[] = [];
        
        if (averageLevel < 2) {
          escalaTexto = 'GATEAR (0-2)';
          caracteristicas = [
            'Muy pocas herramientas y reportes implementados',
            'Las mediciones solo proporcionan información sobre los beneficios de madurar la capacidad',
            'KPIs básicos establecidos para medir el éxito',
            'Procesos y políticas básicas definidas en torno a la capacidad',
            'La capacidad es comprendida pero no seguida por todos los equipos principales',
            'Planes para abordar "frutos al alcance de la mano" (soluciones fáciles)',
          ];
        } else if (averageLevel < 4) {
          escalaTexto = 'CAMINAR (2-4)';
          caracteristicas = [
            'La capacidad es comprendida y seguida dentro de la organización',
            'Se identifican casos difíciles pero se adopta la decisión de no abordarlos',
            'La automatización y/o los procesos cubren la mayoría de los requisitos de capacidad',
            'Los casos más difíciles son identificados y se ha estimado el esfuerzo para resolverlos',
            'Objetivos/KPIs de nivel medio a alto establecidos para medir el éxito',
          ];
        } else {
          escalaTexto = 'CORRER (+4)';
          caracteristicas = [
            'La capacidad es comprendida y seguida por todos los equipos de la organización',
            'Los casos difíciles están siendo abordados activamente',
            'Objetivos/KPIs muy altos establecidos para medir el éxito',
            'La automatización es el enfoque preferido para todas las soluciones',
          ];
        }
        
        doc.text(`Escala de Madurez FinOps: ${escalaTexto}`, pageWidth / 2, yPos, { align: 'center' });
        yPos += 10;
        
        // Características del nivel de madurez
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        doc.text('Características de este nivel:', 14, yPos);
        yPos += 10;
        
        caracteristicas.forEach((caracteristica: string) => {
          doc.text(`• ${caracteristica}`, 16, yPos);
          yPos += 6;
        });
        yPos += 4;
        
        // Resultados por categoría
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Resultados por Categoría', 14, yPos);
        yPos += 10;
        
        let yPosition = yPos;
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
        
        // Al final de todo el proceso, guardamos el PDF
        doc.save(`finops_assessment_${assessment.userData.fullName.replace(/\s+/g, '_')}.pdf`);
      }
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
        <h2 className="text-4xl font-bold mb-4 text-white">
          Resultado de tu Evaluación
        </h2>
        <p className="text-white/80 text-lg">
          A continuación se presenta un resumen de tu nivel de madurez FinOps
        </p>
      </div>

      {/* Nivel Promedio */}
      <div className="mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="text-center p-8 glass-effect rounded-xl shadow-lg">
            <p className="text-xl font-medium text-white/90 mb-2">Nivel Promedio de Madurez</p>
            <div className="flex items-center justify-center">
              <p className="text-7xl font-bold text-white">{averageLevel}</p>
              <span className="text-5xl ml-3">{getLevelEmoji(Math.round(averageLevel))}</span>
            </div>
            <p className="text-base text-white/70 mt-3">
              Basado en tus respuestas en las {categories.length} categorías
            </p>
          </div>
        </div>
      </div>

      {/* Escala del Modelo de Madurez FinOps */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <span className="mr-2">🚀</span>
          Escala de Madurez FinOps
        </h3>
        <div className="text-center mb-4">
          {averageLevel < 2 ? (
            <div className="bg-white/5 p-4 rounded-xl flex flex-col items-center space-y-3">
              <h4 className="text-xl font-bold text-white">GATEAR</h4>
              <img 
                src="https://www.finops.org/wp-content/uploads/2024/03/Crawl@2x.svg" 
                alt="Etapa Gatear" 
                className="h-24 w-auto" 
              />
              <p className="text-white/80">
                Estás en la fase inicial del modelo de madurez FinOps. 
                Tu promedio de {averageLevel} indica que estás comenzando 
                a implementar prácticas FinOps en tu organización.
              </p>
              <div className="mt-2 text-left bg-white/5 p-3 rounded-lg text-sm text-white/70">
                <p className="font-semibold mb-1">Características de este nivel:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Muy pocas herramientas y reportes implementados</li>
                  <li>Las mediciones solo proporcionan información sobre los beneficios de madurar la capacidad</li>
                  <li>KPIs básicos establecidos para medir el éxito</li>
                  <li>Procesos y políticas básicas definidas en torno a la capacidad</li>
                  <li>La capacidad es comprendida pero no seguida por todos los equipos principales de la organización</li>
                  <li>Planes para abordar "frutos al alcance de la mano" (soluciones fáciles)</li>
                </ul>
              </div>
            </div>
          ) : averageLevel < 4 ? (
            <div className="bg-white/5 p-4 rounded-xl flex flex-col items-center space-y-3">
              <h4 className="text-xl font-bold text-white">CAMINAR</h4>
              <img 
                src="https://www.finops.org/wp-content/uploads/2024/03/Walk@2x.svg" 
                alt="Etapa Caminar" 
                className="h-24 w-auto" 
              />
              <p className="text-white/80">
                ¡Bien hecho! Estás en la fase intermedia del modelo de madurez FinOps. 
                Tu promedio de {averageLevel} indica que ya tienes establecidas 
                prácticas FinOps y estás trabajando en su mejora continua.
              </p>
              <div className="mt-2 text-left bg-white/5 p-3 rounded-lg text-sm text-white/70">
                <p className="font-semibold mb-1">Características de este nivel:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>La capacidad es comprendida y seguida dentro de la organización</li>
                  <li>Se identifican casos difíciles pero se adopta la decisión de no abordarlos</li>
                  <li>La automatización y/o los procesos cubren la mayoría de los requisitos de capacidad</li>
                  <li>Los casos más difíciles (aquellos que amenazan el bienestar financiero de la organización) son identificados y se ha estimado el esfuerzo para resolverlos</li>
                  <li>Objetivos/KPIs de nivel medio a alto establecidos para medir el éxito</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 p-4 rounded-xl flex flex-col items-center space-y-3">
              <h4 className="text-xl font-bold text-white">CORRER</h4>
              <img 
                src="https://www.finops.org/wp-content/uploads/2024/03/Run@2x.svg" 
                alt="Etapa Correr" 
                className="h-24 w-auto" 
              />
              <p className="text-white/80">
                ¡Excelente! Has alcanzado la fase avanzada del modelo de madurez FinOps. 
                Tu promedio de {averageLevel} demuestra que tu organización tiene un 
                alto nivel de implementación y optimización de prácticas FinOps.
              </p>
              <div className="mt-2 text-left bg-white/5 p-3 rounded-lg text-sm text-white/70">
                <p className="font-semibold mb-1">Características de este nivel:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>La capacidad es comprendida y seguida por todos los equipos de la organización</li>
                  <li>Los casos difíciles están siendo abordados activamente</li>
                  <li>Objetivos/KPIs muy altos establecidos para medir el éxito</li>
                  <li>La automatización es el enfoque preferido para todas las soluciones</li>
                </ul>
              </div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="text-center p-2 rounded-lg border border-white/10">
            <p className="text-sm font-medium">Gatear</p>
            <p className="text-xs text-white/60">0-2</p>
          </div>
          <div className="text-center p-2 rounded-lg border border-white/10">
            <p className="text-sm font-medium">Caminar</p>
            <p className="text-xs text-white/60">2-4</p>
          </div>
          <div className="text-center p-2 rounded-lg border border-white/10">
            <p className="text-sm font-medium">Correr</p>
            <p className="text-xs text-white/60">+4</p>
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

      {/* Información de Infraestructura y Equipos */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <span className="mr-2">🖥️</span>
          Información de Infraestructura y Equipos
        </h3>
        
        {/* Proveedores de nube */}
        <div className="mb-6">
          <h4 className="text-lg font-medium text-white/90 mb-2">Proveedores de nube utilizados</h4>
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="flex flex-wrap gap-2">
              {assessment.userData.cloudProviders.aws && (
                <span className="px-3 py-1 bg-blue-500/20 text-white rounded-full text-sm">AWS</span>
              )}
              {assessment.userData.cloudProviders.azure && (
                <span className="px-3 py-1 bg-blue-600/20 text-white rounded-full text-sm">Microsoft Azure</span>
              )}
              {assessment.userData.cloudProviders.gcp && (
                <span className="px-3 py-1 bg-green-500/20 text-white rounded-full text-sm">Google Cloud Platform</span>
              )}
              {assessment.userData.cloudProviders.oracle && (
                <span className="px-3 py-1 bg-red-500/20 text-white rounded-full text-sm">Oracle Cloud</span>
              )}
              {assessment.userData.cloudProviders.ibm && (
                <span className="px-3 py-1 bg-blue-800/20 text-white rounded-full text-sm">IBM Cloud</span>
              )}
              {assessment.userData.cloudProviders.other && (
                <span className="px-3 py-1 bg-purple-500/20 text-white rounded-full text-sm">
                  {assessment.userData.cloudProviders.otherSpecified || "Otro"}
                </span>
              )}
              {!assessment.userData.cloudProviders.aws && 
                !assessment.userData.cloudProviders.azure && 
                !assessment.userData.cloudProviders.gcp && 
                !assessment.userData.cloudProviders.oracle && 
                !assessment.userData.cloudProviders.ibm && 
                !assessment.userData.cloudProviders.other && (
                <span className="text-white/70 text-sm">No se ha seleccionado ningún proveedor</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Composición del equipo */}
        <div className="mb-6">
          <h4 className="text-lg font-medium text-white/90 mb-2">Composición del equipo</h4>
          <div className="p-3 bg-white/5 rounded-lg">
            {(() => {
              switch(Number(assessment.userData.teamComposition)) {
                case 1:
                  return <p className="text-white">No hay equipo</p>;
                case 2:
                  return <p className="text-white">Lo hace el equipo de Infraestructura/Plataformas/Operaciones</p>;
                case 3:
                  return <p className="text-white">Equipo de Cloud con capacidades de Arquitectura/Ingeniería sin especialistas en FinOps</p>;
                case 4:
                  return <p className="text-white">Equipo de Cloud con capacidades de Arquitectura/Ingeniería CON especialistas en FinOps</p>;
                case 5:
                  return <p className="text-white">CoE Centro de Excelencia Cloud con BPO y especialistas de Gobierno y práctica FinOps</p>;
                case 6:
                  return <p className="text-white">{assessment.userData.teamCompositionOther || "Otro"}</p>;
                default:
                  return <p className="text-white/70 text-sm">No se ha seleccionado</p>;
              }
            })()}
          </div>
        </div>
        
        {/* Presupuesto anual y gasto mensual */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-lg font-medium text-white/90 mb-2">Presupuesto anual</h4>
            <div className="p-3 bg-white/5 rounded-lg">
              {(() => {
                switch(Number(assessment.userData.annualBudget)) {
                  case 1:
                    return <p className="text-white">Menos de USD 100,000</p>;
                  case 2:
                    return <p className="text-white">Entre USD 100,000 y 500,000</p>;
                  case 3:
                    return <p className="text-white">Entre USD 500,000 y 1,000,000</p>;
                  case 4:
                    return <p className="text-white">Entre USD 1,000,000 y 5,000,000</p>;
                  case 5:
                    return <p className="text-white">Más de USD 5,000,000</p>;
                  default:
                    return <p className="text-white/70 text-sm">No se ha seleccionado</p>;
                }
              })()}
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-white/90 mb-2">Gasto mensual</h4>
            <div className="p-3 bg-white/5 rounded-lg">
              {(() => {
                switch(Number(assessment.userData.monthlySpend)) {
                  case 1:
                    return <p className="text-white">Menos de USD 10,000</p>;
                  case 2:
                    return <p className="text-white">Entre USD 10,000 y 50,000</p>;
                  case 3:
                    return <p className="text-white">Entre USD 50,000 y 100,000</p>;
                  case 4:
                    return <p className="text-white">Entre USD 100,000 y 500,000</p>;
                  case 5:
                    return <p className="text-white">Más de USD 500,000</p>;
                  default:
                    return <p className="text-white/70 text-sm">No se ha seleccionado</p>;
                }
              })()}
            </div>
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