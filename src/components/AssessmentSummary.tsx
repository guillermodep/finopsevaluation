'use client';

import { Assessment } from '@/types/assessment';
import { categories } from '@/data/categories';
import { recommendationsData } from '@/data/recommendations'; 
import { useState, useEffect, useRef } from 'react'; 
import { jsPDF } from 'jspdf';
import Link from 'next/link';
import RadarChart, { RadarChartRef } from './RadarChart'; 
import { DocumentTextIcon, TableCellsIcon } from './iconImports';
import MarkdownLinkRenderer from './MarkdownLinkRenderer'; 
import Tooltip from './Tooltip'; 

interface AssessmentSummaryProps {
  assessment: Assessment;
}

export default function AssessmentSummary({ assessment }: AssessmentSummaryProps) {
  const [mounted, setMounted] = useState(false);
  const [averageLevel, setAverageLevel] = useState(0);
  const radarChartRef = useRef<RadarChartRef>(null); 

  useEffect(() => {
    setMounted(true);
    if (assessment.results.length > 0) {
      const total = assessment.results.reduce((sum, result) => sum + result.selectedLevel, 0);
      setAverageLevel(Math.round((total / assessment.results.length) * 10) / 10);
    }
  }, [assessment.results]);

  const downloadCSV = () => {
    if (!mounted) return;

    const userDataRows = [
      ['Nombre', assessment.userData.fullName],
      ['Empresa', assessment.userData.company],
      ['Email', assessment.userData.email],
      ['Posición', assessment.userData.position],
      ['Nivel Promedio', averageLevel.toString()],
      ['', ''],
    ];

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
    
    userDataRows.splice(5, 0, ['Escala de Madurez FinOps', escalaTextoCSV]);
    
    userDataRows.splice(6, 0, ['Características de este nivel:', '']);
    caracteristicasCSV.forEach((caracteristica: string, index: number) => {
      userDataRows.splice(7 + index, 0, ['', `• ${caracteristica}`]);
    });
    
    const infrastructureRows: string[][] = [
      ['', ''],
      ['INFORMACIÓN DE INFRAESTRUCTURA Y EQUIPOS:', ''],
      ['', ''],
      ['Proveedores de nube utilizados:', ''],
    ];
    
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

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `finops_assessment_${assessment.userData.fullName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    if (!mounted || !radarChartRef.current) return;

    const chartInstance = radarChartRef.current;
    let chartImage = '';
    if (chartInstance && chartInstance.canvas) {
      chartImage = chartInstance.canvas.toDataURL('image/png');
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 0; 

    try {
      const img = new Image();
      img.onload = function() {
        const imgWidth = 30;
        const imgHeight = (img.height * imgWidth) / img.width;
        doc.addImage(img, 'PNG', 14, 10, imgWidth, imgHeight);
        yPos = 10 + imgHeight + 10; 
        finalizePDF(doc, yPos, pageWidth, chartImage);
      };
      img.onerror = function() {
        console.error('Error al cargar el logo para PDF.');
        yPos = 30; 
        finalizePDF(doc, yPos, pageWidth, chartImage);
      };
      img.src = '/images/smart-solutions.png';
    } catch (error) {
      console.error('Error al procesar el logo:', error);
      yPos = 30; 
      finalizePDF(doc, yPos, pageWidth, chartImage);
    }
  };

  function finalizePDF(doc: jsPDF, initialYPos: number, pageWidth: number, chartImage: string) {
    let yPos = initialYPos;

    const checkAndAddPage = (requiredSpace: number = 10) => {
      if (yPos + requiredSpace > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        yPos = 20; 
        return true;
      }
      return false;
    };

    doc.setFontSize(22);
    doc.setTextColor(45, 55, 72); 
    doc.text('AUTOEVALUACIÓN DE MADUREZ FINOPS', pageWidth / 2, yPos, { align: 'center' });
    yPos += 18;

    checkAndAddPage(30);
    doc.setFontSize(16);
    doc.setTextColor(59, 130, 246); 
    doc.text('Datos del Participante', 14, yPos);
    yPos += 10;
    doc.setFontSize(11); 
    doc.setTextColor(60, 60, 60);
    doc.text(`Nombre: ${assessment.userData.fullName}`, 14, yPos); yPos += 8;
    doc.text(`Empresa: ${assessment.userData.company}`, 14, yPos); yPos += 8;
    doc.text(`Correo: ${assessment.userData.email}`, 14, yPos); yPos += 8;
    doc.text(`Posición: ${assessment.userData.position}`, 14, yPos); yPos += 12;

    if (chartImage) {
      checkAndAddPage(80); 
      doc.setFontSize(16);
      doc.setTextColor(59, 130, 246); 
      doc.text('Vista General de Madurez por Categoría', pageWidth / 2, yPos, { align: 'center' });
      yPos += 10;
      
      const chartWidth = pageWidth * 0.75; 
      const chartHeight = chartWidth * 0.65; 
      const chartX = (pageWidth - chartWidth) / 2;
      doc.addImage(chartImage, 'PNG', chartX, yPos, chartWidth, chartHeight);
      yPos += chartHeight + 12;
    }

    checkAndAddPage(15);
    doc.setFontSize(14);
    doc.setTextColor(59, 130, 246); 
    doc.text(`Nivel Promedio de Madurez: ${averageLevel.toFixed(1)}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    let pdfEscalaTexto = '';
    let pdfCaracteristicas: string[] = [];
    if (averageLevel < 2) {
      pdfEscalaTexto = 'GATEAR (0-1.9)';
      pdfCaracteristicas = [
        'Muy pocas herramientas y reportes implementados',
        'Las mediciones solo proporcionan información sobre los beneficios de madurar la capacidad',
        'KPIs básicos establecidos para medir el éxito',
        'Procesos y políticas básicas definidas en torno a la capacidad',
        'La capacidad es comprendida pero no seguida por todos los equipos principales',
        'Planes para abordar "frutos al alcance de la mano" (soluciones fáciles)',
      ];
    } else if (averageLevel < 4) {
      pdfEscalaTexto = 'CAMINAR (2-3.9)';
      pdfCaracteristicas = [
        'La capacidad es comprendida y seguida dentro de la organización',
        'Se identifican casos difíciles pero se adopta la decisión de no abordarlos',
        'La automatización y/o los procesos cubren la mayoría de los requisitos de capacidad',
        'Los casos más difíciles son identificados y se ha estimado el esfuerzo para resolverlos',
        'Objetivos/KPIs de nivel medio a alto establecidos para medir el éxito',
      ];
    } else {
      pdfEscalaTexto = 'CORRER (4-5)';
      pdfCaracteristicas = [
        'La capacidad es comprendida y seguida por todos los equipos de la organización',
        'Los casos difíciles están siendo abordados activamente',
        'Objetivos/KPIs muy altos establecidos para medir el éxito',
        'La automatización es el enfoque preferido para todas las soluciones',
      ];
    }

    doc.setFontSize(12); 
    doc.setTextColor(60, 60, 60);
    doc.text(`Escala de Madurez FinOps: ${pdfEscalaTexto}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 12;

    checkAndAddPage();
    doc.setFontSize(11); 
    doc.setTextColor(45, 55, 72); 
    doc.text('Características de este nivel:', 14, yPos);
    yPos += 8;
    doc.setFontSize(10); 
    pdfCaracteristicas.forEach((caracteristica: string) => {
      checkAndAddPage();
      const splitCaracteristica = doc.splitTextToSize(caracteristica, pageWidth - 32); 
      doc.text('•', 16, yPos, { charSpace: 1 }); 
      doc.text(splitCaracteristica, 20, yPos);
      yPos += (splitCaracteristica.length * 6) + 3; 
    });
    yPos += 10;
    
    checkAndAddPage(15);
    doc.setFontSize(16);
    doc.setTextColor(59, 130, 246); 
    doc.text('Información de Infraestructura y Equipos', 14, yPos);
    yPos += 10;
    doc.setFontSize(10); 
    doc.setTextColor(60, 60, 60);

    const addInfraDetail = (title: string, value: string | string[]) => {
      checkAndAddPage(8 + (Array.isArray(value) ? value.length * 7 : 0));
      doc.setFontSize(11); 
      doc.setTextColor(45, 55, 72); 
      doc.text(title, 14, yPos); 
      yPos += 7;
      doc.setFontSize(10); 
      doc.setTextColor(60, 60, 60);
      if (Array.isArray(value)) {
        if (value.length > 0) {
          value.forEach(item => {
            checkAndAddPage(7);
            doc.text(`• ${item}`, 16, yPos, { charSpace: 1 }); 
            yPos += 7;
          });
        } else {
          checkAndAddPage(7);
          doc.text('No se ha seleccionado', 16, yPos); 
          yPos += 7;
        }
      } else {
        const splitValue = doc.splitTextToSize(value, pageWidth - 30);
        checkAndAddPage(splitValue.length * 6);
        doc.text(splitValue, 16, yPos);
        yPos += (splitValue.length * 6) + 4;
      }
      yPos += 4; 
    };

    const pdfProviders = [];
    if (assessment.userData.cloudProviders.aws) pdfProviders.push('AWS');
    if (assessment.userData.cloudProviders.azure) pdfProviders.push('Microsoft Azure');
    if (assessment.userData.cloudProviders.gcp) pdfProviders.push('Google Cloud Platform');
    if (assessment.userData.cloudProviders.oracle) pdfProviders.push('Oracle Cloud');
    if (assessment.userData.cloudProviders.ibm) pdfProviders.push('IBM Cloud');
    if (assessment.userData.cloudProviders.other) pdfProviders.push(assessment.userData.cloudProviders.otherSpecified || 'Otro');
    addInfraDetail('Proveedores de nube utilizados:', pdfProviders);

    const pdfWorkloadTypes = [];
    if (assessment.userData.workloadTypes && assessment.userData.workloadTypes.iaas) pdfWorkloadTypes.push('IaaS');
    if (assessment.userData.workloadTypes && assessment.userData.workloadTypes.paas) pdfWorkloadTypes.push('PaaS');
    if (assessment.userData.workloadTypes && assessment.userData.workloadTypes.saas) pdfWorkloadTypes.push('SaaS');
    if (assessment.userData.workloadTypes && assessment.userData.workloadTypes.faas) pdfWorkloadTypes.push('FaaS');
    if (assessment.userData.workloadTypes && assessment.userData.workloadTypes.dbaas) pdfWorkloadTypes.push('DBaaS');
    addInfraDetail('Tipos de carga utilizados:', pdfWorkloadTypes);

    let pdfTeamCompositionText = '';
    switch(Number(assessment.userData.teamComposition)) {
      case 1: pdfTeamCompositionText = 'No hay equipo'; break;
      case 2: pdfTeamCompositionText = 'Lo hace el equipo de Infraestructura/Plataformas/Operaciones'; break;
      case 3: pdfTeamCompositionText = 'Equipo de Cloud con capacidades de Arquitectura/Ingeniería sin especialistas en FinOps'; break;
      case 4: pdfTeamCompositionText = 'Equipo de Cloud con capacidades de Arquitectura/Ingeniería CON especialistas en FinOps'; break;
      case 5: pdfTeamCompositionText = 'CoE Centro de Excelencia Cloud con BPO y especialistas de Gobierno y práctica FinOps'; break;
      case 6: pdfTeamCompositionText = assessment.userData.teamCompositionOther || 'Otro'; break;
      default: pdfTeamCompositionText = 'No se ha seleccionado';
    }
    addInfraDetail('Composición del equipo:', pdfTeamCompositionText);

    let pdfServersCountText = '';
    switch(Number(assessment.userData.serversCount)) {
      case 1: pdfServersCountText = 'Menos de 50'; break;
      case 2: pdfServersCountText = 'Entre 50 y 200'; break;
      case 3: pdfServersCountText = 'Entre 200 y 500'; break;
      case 4: pdfServersCountText = 'Entre 500 y 1000'; break;
      case 5: pdfServersCountText = 'Más de 1000'; break;
      default: pdfServersCountText = 'No se ha seleccionado';
    }
    addInfraDetail('Cantidad de servidores:', `• ${pdfServersCountText}`);

    let pdfBudgetText = '';
    switch(Number(assessment.userData.annualBudget)) {
      case 1: pdfBudgetText = 'Menos de USD 100,000'; break;
      case 2: pdfBudgetText = 'Entre USD 100,000 y 500,000'; break;
      case 3: pdfBudgetText = 'Entre USD 500,000 y 1,000,000'; break;
      case 4: pdfBudgetText = 'Entre USD 1,000,000 y 5,000,000'; break;
      case 5: pdfBudgetText = 'Más de USD 5,000,000'; break;
      default: pdfBudgetText = 'No se ha seleccionado';
    }
    addInfraDetail('Presupuesto anual:', `• ${pdfBudgetText}`);

    let pdfSpendText = '';
    switch(Number(assessment.userData.monthlySpend)) {
      case 1: pdfSpendText = 'Menos de USD 10,000'; break;
      case 2: pdfSpendText = 'Entre USD 10,000 y 50,000'; break;
      case 3: pdfSpendText = 'Entre USD 50,000 y 100,000'; break;
      case 4: pdfSpendText = 'Entre USD 100,000 y 500,000'; break;
      case 5: pdfSpendText = 'Más de USD 500,000'; break;
      default: pdfSpendText = 'No se ha seleccionado';
    }
    addInfraDetail('Gasto mensual promedio:', `• ${pdfSpendText}`);

    let pdfMarketplaceText = '';
    switch(Number(assessment.userData.marketplacePurchases)) {
      case 1: pdfMarketplaceText = 'Ninguna'; break;
      case 2: pdfMarketplaceText = '1 a 5 compras'; break;
      case 3: pdfMarketplaceText = '6 a 15 compras'; break;
      case 4: pdfMarketplaceText = '16 a 30 compras'; break;
      case 5: pdfMarketplaceText = 'Más de 30 compras'; break;
      default: pdfMarketplaceText = 'No se ha seleccionado';
    }
    addInfraDetail('Compras por Marketplace:', `• ${pdfMarketplaceText}`);

    const pdfPaymentModels = [];
    if (assessment.userData.paymentModels && assessment.userData.paymentModels.onDemand) pdfPaymentModels.push('Pago por demanda (On-Demand)');
    if (assessment.userData.paymentModels && assessment.userData.paymentModels.reserved) pdfPaymentModels.push('Instancias reservadas / Savings Plans');
    if (assessment.userData.paymentModels && assessment.userData.paymentModels.longTermContracts) pdfPaymentModels.push('Contratos a largo plazo con descuentos');
    if (assessment.userData.paymentModels && assessment.userData.paymentModels.byol) pdfPaymentModels.push('Licencias BYOL');
    if (assessment.userData.paymentModels && assessment.userData.paymentModels.freeTier) pdfPaymentModels.push('Free tier / créditos promocionales');
    addInfraDetail('Modelos de pago utilizados:', pdfPaymentModels);

    const pdfFinOpsTools = [];
    if (assessment.userData.finOpsTools && assessment.userData.finOpsTools.nativeTools) pdfFinOpsTools.push('Herramientas nativas del CSP');
    if (assessment.userData.finOpsTools && assessment.userData.finOpsTools.thirdPartyTools) pdfFinOpsTools.push('Herramientas de terceros');
    if (assessment.userData.finOpsTools && assessment.userData.finOpsTools.internalTools) pdfFinOpsTools.push('Herramientas internas');
    if (assessment.userData.finOpsTools && assessment.userData.finOpsTools.noTools) pdfFinOpsTools.push('No utilizamos herramientas específicas');
    if (assessment.userData.finOpsTools && assessment.userData.finOpsTools.other) pdfFinOpsTools.push(assessment.userData.finOpsTools.otherSpecified || 'Otra herramienta');
    addInfraDetail('Herramientas de gestión y optimización:', pdfFinOpsTools);

    const pdfCostReductionPractices = [];
    if (assessment.userData.costReductionPractices && assessment.userData.costReductionPractices.rightsizing) pdfCostReductionPractices.push('Rightsizing');
    if (assessment.userData.costReductionPractices && assessment.userData.costReductionPractices.storageReconfiguration) pdfCostReductionPractices.push('Reconfiguración de almacenamiento');
    if (assessment.userData.costReductionPractices && assessment.userData.costReductionPractices.scheduledShutdown) pdfCostReductionPractices.push('Apagado programado');
    if (assessment.userData.costReductionPractices && assessment.userData.costReductionPractices.reservedInstances) pdfCostReductionPractices.push('Instancias reservadas');
    if (assessment.userData.costReductionPractices && assessment.userData.costReductionPractices.licenseOptimization) pdfCostReductionPractices.push('Optimización de licencias');
    addInfraDetail('Prácticas de reducción de costos:', pdfCostReductionPractices);

    checkAndAddPage(15);
    doc.setFontSize(16);
    doc.setTextColor(59, 130, 246); 
    doc.text('Resultados por Categoría', 14, yPos);
    yPos += 12;

    assessment.results.forEach((result) => {
      const category = categories.find((c) => c.name === result.category);
      const categoryRecommendations = recommendationsData[result.category]?.find(
        (rec) => result.selectedLevel >= rec.levelRange[0] && result.selectedLevel <= rec.levelRange[1]
      );

      checkAndAddPage(25);
      doc.setFontSize(12); 
      doc.setTextColor(45, 55, 72); 
      doc.text(`${result.category} - Nivel ${result.selectedLevel}`, 14, yPos);
      yPos += 8;

      doc.setFontSize(10); 
      doc.setTextColor(60, 60, 60);
      const description = category?.levelDescriptions[result.selectedLevel - 1] || '';
      const splitDescription = doc.splitTextToSize(description, pageWidth - 30);
      doc.text(splitDescription, 14, yPos);
      yPos += (splitDescription.length * 6) + 5; 

      if (categoryRecommendations) {
        checkAndAddPage(10);
        doc.setFontSize(11); 
        doc.setTextColor(59, 130, 246); 
        doc.text(categoryRecommendations.title, 14, yPos);
        yPos += 8;
        doc.setFontSize(10); 
        doc.setTextColor(80, 80, 80);
        categoryRecommendations.texts.forEach(recText => {
          const plainTextRec = recText.replace(/\[(.*?)\]\((.*?)\)/g, '$1 ($2)');
          const splitRecText = doc.splitTextToSize(plainTextRec, pageWidth - 32);
          checkAndAddPage(splitRecText.length * 6 + 2);
          doc.text('•', 16, yPos, { charSpace: 1 }); 
          doc.text(splitRecText, 20, yPos);
          yPos += (splitRecText.length * 6) + 2; 
        });
      }
      yPos += 10;
    });

    const currentDate = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120); 
    doc.text(`Generado el: ${currentDate}`, pageWidth - 14, doc.internal.pageSize.getHeight() - 10, { align: 'right' });

    doc.save(`finops_assessment_${assessment.userData.fullName.replace(/\s+/g, '_')}.pdf`);
  }

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

  const categoryNamesForChart = categories.map(c => c.name);

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

        
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          
          <div className="lg:w-1/2 bg-white/5 p-4 sm:p-6 rounded-xl shadow-lg flex flex-col justify-center items-center min-h-[300px] sm:min-h-[400px]">
            <h3 className="text-xl sm:text-2xl font-semibold text-blue-300 mb-2 sm:mb-4 text-center">
              Vista General de Madurez por Categoría
            </h3>
            <div className="w-full h-[250px] sm:h-[350px] md:h-[400px]">
              {assessment.results.length > 0 && (
                <RadarChart ref={radarChartRef} results={assessment.results} categoryNames={categoryNamesForChart} />
              )}
            </div>
          </div>

          
          <div className="lg:w-1/2 bg-white/5 p-6 rounded-xl shadow-lg flex flex-col justify-center">
            <h3 className="text-2xl font-semibold text-blue-300 mb-4 text-center">
              Nivel Promedio de Madurez
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
        </div>

        
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
              const IconComponent = category?.icon; 

              return (
                <div key={result.category} className="bg-white/5 p-6 rounded-xl shadow-lg">
                  <h4 className="text-xl font-semibold text-white mb-1 flex items-center">
                    {IconComponent && (
                      <div className="relative flex items-center mr-2">
                        <IconComponent className="w-6 h-6 text-blue-300 flex-shrink-0" />
                        {category?.tooltipText && (
                          <Tooltip text={category.tooltipText} position="top" />
                        )}
                      </div>
                    )} 
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
                          <li key={idx}>
                            <MarkdownLinkRenderer textWithLinks={recText} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={downloadCSV}
            className="button-modern flex-1 bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <TableCellsIcon className="w-5 h-5" />
            Descargar Resumen (CSV)
          </button>
          <button
            onClick={downloadPDF}
            className="button-modern flex-1 flex items-center justify-center gap-2"
          >
            <DocumentTextIcon className="w-5 h-5" />
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