'use client';

import { Assessment } from '@/types/assessment';
import { categories } from '@/data/categories';
import { recommendationsData } from '@/data/recommendations';
import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import Link from 'next/link';

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
    
    // Tipos de carga
    infrastructureRows.push(['', '']);
    infrastructureRows.push(['Tipos de carga utilizados:', '']);
    
    const workloadTypes = [];
    if (assessment.userData.workloadTypes && assessment.userData.workloadTypes.iaas) workloadTypes.push('IaaS (Infrastructure as a Service)');
    if (assessment.userData.workloadTypes && assessment.userData.workloadTypes.paas) workloadTypes.push('PaaS (Platform as a Service)');
    if (assessment.userData.workloadTypes && assessment.userData.workloadTypes.saas) workloadTypes.push('SaaS (Software as a Service)');
    if (assessment.userData.workloadTypes && assessment.userData.workloadTypes.faas) workloadTypes.push('FaaS (Function as a Service)');
    if (assessment.userData.workloadTypes && assessment.userData.workloadTypes.dbaas) workloadTypes.push('DBaaS (Database as a Service)');
    
    if (workloadTypes.length > 0) {
      workloadTypes.forEach(type => {
        infrastructureRows.push(['', `• ${type}`]);
      });
    } else {
      infrastructureRows.push(['', 'No se ha seleccionado ningún tipo de carga']);
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
    
    // Cantidad de servidores
    infrastructureRows.push(['', '']);
    infrastructureRows.push(['Cantidad de servidores:', '']);
    
    let serversCountText = '';
    switch(Number(assessment.userData.serversCount)) {
      case 1:
        serversCountText = 'Menos de 50';
        break;
      case 2:
        serversCountText = 'Entre 50 y 200';
        break;
      case 3:
        serversCountText = 'Entre 200 y 500';
        break;
      case 4:
        serversCountText = 'Entre 500 y 1000';
        break;
      case 5:
        serversCountText = 'Más de 1000';
        break;
      default:
        serversCountText = 'No se ha seleccionado';
    }
    
    infrastructureRows.push(['', `• ${serversCountText}`]);
    
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
    
    // Compras Marketplace
    infrastructureRows.push(['', '']);
    infrastructureRows.push(['Compras por Marketplace:', '']);
    
    let marketplaceText = '';
    switch(Number(assessment.userData.marketplacePurchases)) {
      case 1:
        marketplaceText = 'Ninguna';
        break;
      case 2:
        marketplaceText = '1 a 5 compras';
        break;
      case 3:
        marketplaceText = '6 a 15 compras';
        break;
      case 4:
        marketplaceText = '16 a 30 compras';
        break;
      case 5:
        marketplaceText = 'Más de 30 compras';
        break;
      default:
        marketplaceText = 'No se ha seleccionado';
    }
    
    infrastructureRows.push(['', `• ${marketplaceText}`]);
    
    // Modelos de pago
    infrastructureRows.push(['', '']);
    infrastructureRows.push(['Modelos de pago utilizados:', '']);
    
    const paymentModels = [];
    if (assessment.userData.paymentModels && assessment.userData.paymentModels.onDemand) paymentModels.push('Pago por demanda (On-Demand)');
    if (assessment.userData.paymentModels && assessment.userData.paymentModels.reserved) paymentModels.push('Instancias reservadas / Savings Plans');
    if (assessment.userData.paymentModels && assessment.userData.paymentModels.longTermContracts) paymentModels.push('Contratos a largo plazo con descuentos');
    if (assessment.userData.paymentModels && assessment.userData.paymentModels.byol) paymentModels.push('Licencias Bring Your Own License (BYOL)');
    if (assessment.userData.paymentModels && assessment.userData.paymentModels.freeTier) paymentModels.push('Free tier / créditos promocionales');
    
    if (paymentModels.length > 0) {
      paymentModels.forEach(model => {
        infrastructureRows.push(['', `• ${model}`]);
      });
    } else {
      infrastructureRows.push(['', 'No se ha seleccionado ningún modelo de pago']);
    }
    
    // Herramientas FinOps
    infrastructureRows.push(['', '']);
    infrastructureRows.push(['Herramientas de gestión y optimización:', '']);
    
    const finOpsTools = [];
    if (assessment.userData.finOpsTools && assessment.userData.finOpsTools.nativeTools) finOpsTools.push('Herramientas nativas del CSP');
    if (assessment.userData.finOpsTools && assessment.userData.finOpsTools.thirdPartyTools) finOpsTools.push('Herramientas de terceros');
    if (assessment.userData.finOpsTools && assessment.userData.finOpsTools.internalTools) finOpsTools.push('Herramientas internas desarrolladas en la empresa');
    if (assessment.userData.finOpsTools && assessment.userData.finOpsTools.noTools) finOpsTools.push('No utilizamos ninguna herramienta específica');
    if (assessment.userData.finOpsTools && assessment.userData.finOpsTools.other) finOpsTools.push(assessment.userData.finOpsTools.otherSpecified || 'Otra herramienta');
    
    if (finOpsTools.length > 0) {
      finOpsTools.forEach(tool => {
        infrastructureRows.push(['', `• ${tool}`]);
      });
    } else {
      infrastructureRows.push(['', 'No se ha seleccionado ninguna herramienta']);
    }
    
    // Prácticas de reducción de costos
    infrastructureRows.push(['', '']);
    infrastructureRows.push(['Prácticas de reducción de costos:', '']);
    
    const costReductionPractices = [];
    if (assessment.userData.costReductionPractices && assessment.userData.costReductionPractices.rightsizing) costReductionPractices.push('Rightsizing - Ajuste del tamaño de instancias y recursos');
    if (assessment.userData.costReductionPractices && assessment.userData.costReductionPractices.storageReconfiguration) costReductionPractices.push('Reconfiguración de Discos/Storage según locación');
    if (assessment.userData.costReductionPractices && assessment.userData.costReductionPractices.scheduledShutdown) costReductionPractices.push('Apagado de recursos no utilizados fuera de horario laboral');
    if (assessment.userData.costReductionPractices && assessment.userData.costReductionPractices.reservedInstances) costReductionPractices.push('Uso de instancias reservadas / Savings Plans');
    if (assessment.userData.costReductionPractices && assessment.userData.costReductionPractices.licenseOptimization) costReductionPractices.push('Optimización del uso de licencias');
    
    if (costReductionPractices.length > 0) {
      costReductionPractices.forEach(practice => {
        infrastructureRows.push(['', `• ${practice}`]);
      });
    } else {
      infrastructureRows.push(['', 'No se ha seleccionado ninguna práctica de reducción de costos']);
    }
    
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
      let yPos = 0; // Initialize yPos for PDF

      // Añadimos el logo de Smart Solutions
      try {
        const img = new Image();
        img.onload = function() {
          const imgWidth = 30;
          const imgHeight = (img.height * imgWidth) / img.width;
          doc.addImage(img, 'PNG', 14, 10, imgWidth, imgHeight);
          yPos = 10 + imgHeight + 10; // Initial yPos after logo
          finalizePDF(doc, yPos, pageWidth);
        };
        img.onerror = function() {
          console.error('Error al cargar el logo');
          yPos = 30; // Initial yPos without logo
          finalizePDF(doc, yPos, pageWidth);
        };
        img.src = '/images/smart-solutions.png';
      } catch (error) {
        console.error('Error al procesar el logo:', error);
        yPos = 30; // Initial yPos on error
        finalizePDF(doc, yPos, pageWidth);
      }

    } catch (error) {
      console.error('Error al generar el PDF:', error);
      alert('Hubo un error al generar el PDF. Por favor, intenta de nuevo.');
    }
  };

  function finalizePDF(doc: jsPDF, initialYPos: number, pageWidth: number) {
    let yPos = initialYPos;

    // Función para verificar y cambiar de página si es necesario
    const checkAndAddPage = (requiredSpace: number = 10) => {
      if (yPos + requiredSpace > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        yPos = 20; // Reiniciamos en la nueva página
        return true;
      }
      return false;
    };

    // Título
    doc.setFontSize(20);
    doc.setTextColor(30, 64, 175); // Azul oscuro
    doc.text('AUTOEVALUACIÓN DE MADUREZ FINOPS', pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Datos del usuario
    checkAndAddPage(30);
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Datos del Participante', 14, yPos);
    yPos += 10;
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Nombre: ${assessment.userData.fullName}`, 14, yPos); yPos += 10;
    doc.text(`Empresa: ${assessment.userData.company}`, 14, yPos); yPos += 10;
    doc.text(`Correo: ${assessment.userData.email}`, 14, yPos); yPos += 10;
    doc.text(`Posición: ${assessment.userData.position}`, 14, yPos); yPos += 15;

    // Información de infraestructura y equipos
    checkAndAddPage(15);
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Información de Infraestructura y Equipos', 14, yPos);
    yPos += 10;
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);

    // Helper function to add infrastructure details to PDF
    const addInfraDetail = (title: string, value: string | string[]) => {
      checkAndAddPage(10 + (Array.isArray(value) ? value.length * 8 : 0));
      doc.text(title, 14, yPos); 
      yPos += 8;
      if (Array.isArray(value)) {
        if (value.length > 0) {
          value.forEach(item => {
            checkAndAddPage(8);
            doc.text(`• ${item}`, 16, yPos); 
            yPos += 8;
          });
        } else {
          checkAndAddPage(8);
          doc.text('No se ha seleccionado', 16, yPos); 
          yPos += 8;
        }
      } else {
        const splitValue = doc.splitTextToSize(value, pageWidth - 30);
        checkAndAddPage(splitValue.length * 7);
        doc.text(splitValue, 16, yPos);
        yPos += (splitValue.length * 7) + 2;
      }
      yPos += 5; // Extra space after section
    };

    // Proveedores de nube
    const providers = [];
    if (assessment.userData.cloudProviders.aws) providers.push('AWS');
    if (assessment.userData.cloudProviders.azure) providers.push('Microsoft Azure');
    if (assessment.userData.cloudProviders.gcp) providers.push('Google Cloud Platform');
    if (assessment.userData.cloudProviders.oracle) providers.push('Oracle Cloud');
    if (assessment.userData.cloudProviders.ibm) providers.push('IBM Cloud');
    if (assessment.userData.cloudProviders.other) providers.push(assessment.userData.cloudProviders.otherSpecified || 'Otro');
    addInfraDetail('Proveedores de nube utilizados:', providers);

    // Tipos de carga
    const workloadTypes = [];
    if (assessment.userData.workloadTypes && assessment.userData.workloadTypes.iaas) workloadTypes.push('IaaS');
    if (assessment.userData.workloadTypes && assessment.userData.workloadTypes.paas) workloadTypes.push('PaaS');
    if (assessment.userData.workloadTypes && assessment.userData.workloadTypes.saas) workloadTypes.push('SaaS');
    if (assessment.userData.workloadTypes && assessment.userData.workloadTypes.faas) workloadTypes.push('FaaS');
    if (assessment.userData.workloadTypes && assessment.userData.workloadTypes.dbaas) workloadTypes.push('DBaaS');
    addInfraDetail('Tipos de carga utilizados:', workloadTypes);

    // Composición del equipo
    let teamCompositionText = '';
    switch(Number(assessment.userData.teamComposition)) {
      case 1: teamCompositionText = 'No hay equipo'; break;
      case 2: teamCompositionText = 'Lo hace el equipo de Infraestructura/Plataformas/Operaciones'; break;
      case 3: teamCompositionText = 'Equipo de Cloud con capacidades de Arquitectura/Ingeniería sin especialistas en FinOps'; break;
      case 4: teamCompositionText = 'Equipo de Cloud con capacidades de Arquitectura/Ingeniería CON especialistas en FinOps'; break;
      case 5: teamCompositionText = 'CoE Centro de Excelencia Cloud con BPO y especialistas de Gobierno y práctica FinOps'; break;
      case 6: teamCompositionText = assessment.userData.teamCompositionOther || 'Otro'; break;
      default: teamCompositionText = 'No se ha seleccionado';
    }
    addInfraDetail('Composición del equipo:', teamCompositionText);

    // Cantidad de servidores
    let serversCountText = '';
    switch(Number(assessment.userData.serversCount)) {
      case 1: serversCountText = 'Menos de 50'; break;
      case 2: serversCountText = 'Entre 50 y 200'; break;
      case 3: serversCountText = 'Entre 200 y 500'; break;
      case 4: serversCountText = 'Entre 500 y 1000'; break;
      case 5: serversCountText = 'Más de 1000'; break;
      default: serversCountText = 'No se ha seleccionado';
    }
    addInfraDetail('Cantidad de servidores:', `• ${serversCountText}`);

    // Presupuesto anual
    let budgetText = '';
    switch(Number(assessment.userData.annualBudget)) {
      case 1: budgetText = 'Menos de USD 100,000'; break;
      case 2: budgetText = 'Entre USD 100,000 y 500,000'; break;
      case 3: budgetText = 'Entre USD 500,000 y 1,000,000'; break;
      case 4: budgetText = 'Entre USD 1,000,000 y 5,000,000'; break;
      case 5: budgetText = 'Más de USD 5,000,000'; break;
      default: budgetText = 'No se ha seleccionado';
    }
    addInfraDetail('Presupuesto anual:', `• ${budgetText}`);

    // Gasto mensual
    let spendText = '';
    switch(Number(assessment.userData.monthlySpend)) {
      case 1: spendText = 'Menos de USD 10,000'; break;
      case 2: spendText = 'Entre USD 10,000 y 50,000'; break;
      case 3: spendText = 'Entre USD 50,000 y 100,000'; break;
      case 4: spendText = 'Entre USD 100,000 y 500,000'; break;
      case 5: spendText = 'Más de USD 500,000'; break;
      default: spendText = 'No se ha seleccionado';
    }
    addInfraDetail('Gasto mensual promedio:', `• ${spendText}`);

    // Compras Marketplace
    let marketplaceText = '';
    switch(Number(assessment.userData.marketplacePurchases)) {
      case 1: marketplaceText = 'Ninguna'; break;
      case 2: marketplaceText = '1 a 5 compras'; break;
      case 3: marketplaceText = '6 a 15 compras'; break;
      case 4: marketplaceText = '16 a 30 compras'; break;
      case 5: marketplaceText = 'Más de 30 compras'; break;
      default: marketplaceText = 'No se ha seleccionado';
    }
    addInfraDetail('Compras por Marketplace:', `• ${marketplaceText}`);
    
    // Modelos de pago
    const paymentModels = [];
    if (assessment.userData.paymentModels && assessment.userData.paymentModels.onDemand) paymentModels.push('Pago por demanda (On-Demand)');
    if (assessment.userData.paymentModels && assessment.userData.paymentModels.reserved) paymentModels.push('Instancias reservadas / Savings Plans');
    if (assessment.userData.paymentModels && assessment.userData.paymentModels.longTermContracts) paymentModels.push('Contratos a largo plazo con descuentos');
    if (assessment.userData.paymentModels && assessment.userData.paymentModels.byol) paymentModels.push('Licencias BYOL');
    if (assessment.userData.paymentModels && assessment.userData.paymentModels.freeTier) paymentModels.push('Free tier / créditos promocionales');
    addInfraDetail('Modelos de pago utilizados:', paymentModels);

    // Herramientas FinOps
    const finOpsTools = [];
    if (assessment.userData.finOpsTools && assessment.userData.finOpsTools.nativeTools) finOpsTools.push('Herramientas nativas del CSP');
    if (assessment.userData.finOpsTools && assessment.userData.finOpsTools.thirdPartyTools) finOpsTools.push('Herramientas de terceros');
    if (assessment.userData.finOpsTools && assessment.userData.finOpsTools.internalTools) finOpsTools.push('Herramientas internas');
    if (assessment.userData.finOpsTools && assessment.userData.finOpsTools.noTools) finOpsTools.push('No utilizamos herramientas específicas');
    if (assessment.userData.finOpsTools && assessment.userData.finOpsTools.other) finOpsTools.push(assessment.userData.finOpsTools.otherSpecified || 'Otra herramienta');
    addInfraDetail('Herramientas de gestión y optimización:', finOpsTools);

    // Prácticas de reducción de costos
    const costReductionPractices = [];
    if (assessment.userData.costReductionPractices && assessment.userData.costReductionPractices.rightsizing) costReductionPractices.push('Rightsizing');
    if (assessment.userData.costReductionPractices && assessment.userData.costReductionPractices.storageReconfiguration) costReductionPractices.push('Reconfiguración de almacenamiento');
    if (assessment.userData.costReductionPractices && assessment.userData.costReductionPractices.scheduledShutdown) costReductionPractices.push('Apagado programado');
    if (assessment.userData.costReductionPractices && assessment.userData.costReductionPractices.reservedInstances) costReductionPractices.push('Instancias reservadas');
    if (assessment.userData.costReductionPractices && assessment.userData.costReductionPractices.licenseOptimization) costReductionPractices.push('Optimización de licencias');
    addInfraDetail('Prácticas de reducción de costos:', costReductionPractices);

    // Nivel promedio
    checkAndAddPage(15);
    doc.setFontSize(14);
    doc.setTextColor(30, 64, 175);
    doc.text(`Nivel Promedio de Madurez: ${averageLevel}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Escala de Madurez FinOps
    checkAndAddPage();
    doc.setFontSize(14);
    doc.setTextColor(30, 64, 175);

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

    checkAndAddPage();
    doc.text(`Escala de Madurez FinOps: ${escalaTexto}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Características del nivel de madurez
    checkAndAddPage();
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text('Características de este nivel:', 14, yPos);
    yPos += 10;

    caracteristicas.forEach((caracteristica: string) => {
      checkAndAddPage();
      const splitCaracteristica = doc.splitTextToSize(caracteristica, pageWidth - 32); // 16 (left margin) + 16 (right margin for bullet)
      doc.text('•', 16, yPos); 
      doc.text(splitCaracteristica, 20, yPos);
      yPos += (splitCaracteristica.length * 7) + 3; // Adjust spacing for bullet points
    });
    yPos += 10;

    // Resultados por categoría
    checkAndAddPage(15);
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Resultados por Categoría', 14, yPos);
    yPos += 15;

    assessment.results.forEach((result) => {
      const category = categories.find((c) => c.name === result.category);
      const categoryRecommendations = recommendationsData[result.category]?.find(
        (rec) => result.selectedLevel >= rec.levelRange[0] && result.selectedLevel <= rec.levelRange[1]
      );

      checkAndAddPage(25);
      doc.setFontSize(12);
      doc.setTextColor(30, 64, 175);
      doc.text(`${result.category} - Nivel ${result.selectedLevel}`, 14, yPos);
      yPos += 8;

      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      const description = category?.levelDescriptions[result.selectedLevel - 1] || '';
      const splitDescription = doc.splitTextToSize(description, pageWidth - 30);
      doc.text(splitDescription, 14, yPos);
      yPos += (splitDescription.length * 7) + 5;

      if (categoryRecommendations) {
        checkAndAddPage(10);
        doc.setFontSize(11);
        doc.setTextColor(0,0,0);
        doc.text(categoryRecommendations.title, 14, yPos);
        yPos += 8;
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        categoryRecommendations.texts.forEach(recText => {
          const splitRecText = doc.splitTextToSize(recText, pageWidth - 32);
          checkAndAddPage(splitRecText.length * 7 + 2);
          doc.text('•', 16, yPos); 
          doc.text(splitRecText, 20, yPos);
          yPos += (splitRecText.length * 7) + 2;
        });
      }
      yPos += 10;
    });

    // Añadimos fecha y hora
    const currentDate = new Date().toLocaleDateString();
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generado el: ${currentDate}`, pageWidth - 14, doc.internal.pageSize.getHeight() - 10, { align: 'right' });

    doc.save(`finops_assessment_${assessment.userData.fullName.replace(/\s+/g, '_')}.pdf`);
  }

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

  return (
    <div className="animate-fade-in">
      <div className="glass-panel p-6 md:p-10 space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-2">
            Resultados de tu Autoevaluación FinOps
          </h2>
          <p className="text-lg text-white/80">
            ¡Gracias por completar la evaluación, {assessment.userData.fullName}!
          </p>
        </div>

        {/* Resumen General */}
        <div className="bg-white/5 p-6 rounded-xl shadow-lg">
          <h3 className="text-2xl font-semibold text-blue-300 mb-4 text-center">
            Resumen General de Madurez
          </h3>
          <div className="text-center mb-6">
            <p className="text-5xl font-bold text-white">{averageLevel.toFixed(1)}</p>
            <p className="text-xl text-blue-300">
              {averageLevel < 2 ? 'GATEAR (0-1.9)' : averageLevel < 4 ? 'CAMINAR (2-3.9)' : 'CORRER (4-5)'}
            </p>
          </div>
          <div className="text-sm text-white/80 space-y-1">
            {(averageLevel < 2 ? [
              'Muy pocas herramientas y reportes implementados',
              'Las mediciones solo proporcionan información sobre los beneficios de madurar la capacidad',
              'KPIs básicos establecidos para medir el éxito',
              'Procesos y políticas básicas definidas en torno a la capacidad',
              'La capacidad es comprendida pero no seguida por todos los equipos principales',
              'Planes para abordar "frutos al alcance de la mano" (soluciones fáciles)',
            ] : averageLevel < 4 ? [
              'La capacidad es comprendida y seguida dentro de la organización',
              'Se identifican casos difíciles pero se adopta la decisión de no abordarlos',
              'La automatización y/o los procesos cubren la mayoría de los requisitos de capacidad',
              'Los casos más difíciles son identificados y se ha estimado el esfuerzo para resolverlos',
              'Objetivos/KPIs de nivel medio a alto establecidos para medir el éxito',
            ] : [
              'La capacidad es comprendida y seguida por todos los equipos de la organización',
              'Los casos difíciles están siendo abordados activamente',
              'Objetivos/KPIs muy altos establecidos para medir el éxito',
              'La automatización es el enfoque preferido para todas las soluciones',
            ]).map((char, idx) => (
              <p key={idx} className="flex items-start"><span className="text-blue-400 mr-2">•</span>{char}</p>
            ))}
          </div>
        </div>

        {/* Resultados por Categoría con Recomendaciones */}
        <div>
          <h3 className="text-2xl font-semibold text-blue-300 mb-6 text-center">
            Detalle por Categoría y Sugerencias
          </h3>
          <div className="space-y-8">
            {assessment.results.map((result) => {
              const category = categories.find((c) => c.name === result.category);
              const categoryRecommendations = recommendationsData[result.category]?.find(
                (rec) => result.selectedLevel >= rec.levelRange[0] && result.selectedLevel <= rec.levelRange[1]
              );

              return (
                <div key={result.category} className="bg-white/5 p-6 rounded-xl shadow-lg">
                  <h4 className="text-xl font-semibold text-white mb-1">
                    {result.category} - <span className="text-blue-300">Nivel {result.selectedLevel}</span>
                  </h4>
                  <p className="text-sm text-white/70 mb-3">
                    {category?.levelDescriptions[result.selectedLevel - 1]}
                  </p>
                  
                  {categoryRecommendations && (
                    <div className="mt-4 pt-3 border-t border-white/10">
                      <h5 className="text-md font-semibold text-blue-200 mb-2">
                        {categoryRecommendations.title}
                      </h5>
                      <ul className="list-disc list-inside space-y-1 text-sm text-white/80 pl-1">
                        {categoryRecommendations.texts.map((recText, idx) => (
                          <li key={idx}>{recText}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Botones de descarga */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={downloadCSV}
            className="button-modern flex-1 bg-green-600 hover:bg-green-700"
          >
            Descargar Resumen (CSV)
          </button>
          <button
            onClick={downloadPDF}
            className="button-modern flex-1"
          >
            Descargar Reporte Detallado (PDF)
          </button>
        </div>

        <div className="text-center mt-8">
          <Link href="/" legacyBehavior>
            <a 
              onClick={(e) => {
                e.preventDefault();
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('userData');
                  localStorage.removeItem('assessmentResults');
                  window.location.href = '/';
                }
              }}
              className="text-blue-300 hover:text-blue-200 transition-colors text-sm"
            >
              Realizar una nueva evaluación
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}