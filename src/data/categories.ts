import { Category } from '@/types/assessment';
import {
  EyeIcon,
  CogIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  UsersIcon,
} from '@/components/iconImports'; 

export const categories: Category[] = [
  {
    name: 'Visibilidad y Asignación de Costos',
    icon: EyeIcon, 
    description: 'Evalúa la capacidad de la organización para ver, entender y asignar costos de la nube.',
    tooltipText: 'Visibilidad: Ver, entender y asignar costos de nube.',
    levelDescriptions: [
      'Sin visibilidad de costos. Los gastos de la nube no se monitorean ni se asignan. Ej: Las facturas llegan como una sorpresa y no hay desglose interno.',
      'Visibilidad básica. Se revisan los costos mensualmente sin desglose detallado. Ej: El equipo de finanzas recibe la factura total del CSP y la revisa, pero no puede asignar fácilmente costos a proyectos o equipos específicos.',
      'Visibilidad estructurada. Costos etiquetados y asignados a unidades de negocio o proyectos. Ej: Se utilizan etiquetas (tags) de forma consistente y se generan informes de showback/chargeback básicos.',
      'Visibilidad avanzada. Seguimiento en tiempo real con dashboards interactivos, alertas de presupuesto y predicciones de costos básicas. Ej: Los equipos pueden consultar sus costos casi en tiempo real y reciben alertas si se acercan a sus límites presupuestarios.',
      'Visibilidad optimizada. Sistema automatizado de asignación y predicción de costos, integrado con herramientas de BI y análisis predictivo. Ej: Los costos se asignan automáticamente hasta el nivel de recurso individual y se utilizan modelos de ML para predecir gastos con alta precisión.'
    ]
  },
  {
    name: 'Optimización y Eficiencia',
    icon: CogIcon, 
    description: 'Mide la capacidad para optimizar recursos y maximizar el valor de la inversión en la nube.',
    tooltipText: 'Optimización: Maximizar valor y eficiencia de recursos.',
    levelDescriptions: [
      'Sin optimización. Los recursos se aprovisionan sin considerar la eficiencia, a menudo sobredimensionados. Ej: Se lanzan VMs grandes por defecto, sin análisis previo de necesidades.',
      'Optimización reactiva. Se ajustan recursos solo cuando hay problemas evidentes de costo o rendimiento. Ej: Se reduce el tamaño de una instancia solo después de que el gasto mensual se dispara inesperadamente.',
      'Optimización proactiva. Revisiones regulares de utilización y costos, con ajustes planificados (rightsizing, scheduling). Ej: Se realizan revisiones trimestrales de rightsizing y se apagan entornos de desarrollo por la noche.',
      'Optimización sistemática. Procesos automatizados de rightsizing, scheduling, y adopción de modelos de precios con descuento (RIs, Savings Plans). Ej: Herramientas automáticas sugieren o aplican cambios de tamaño y se gestiona activamente un portafolio de RIs/SPs.',
      'Optimización continua. Mejora constante con ML, análisis predictivo de cargas, y adopción de arquitecturas serverless o nativas de nube para eficiencia. Ej: Las cargas de trabajo se ajustan dinámicamente a la demanda y se prioriza el uso de servicios gestionados y serverless.'
    ]
  },
  {
    name: 'Gobernanza y Control',
    icon: ShieldCheckIcon, 
    description: 'Evalúa las políticas y controles para gestionar el gasto en la nube.',
    tooltipText: 'Gobernanza: Políticas y control del gasto en nube.',
    levelDescriptions: [
      'Sin gobernanza. No existen políticas ni controles de gasto; los desarrolladores pueden aprovisionar libremente. Ej: Cualquier empleado con acceso puede crear cualquier recurso en la nube sin aprobación.',
      'Gobernanza básica. Políticas informales y controles mínimos, a menudo reactivos. Ej: Se pide verbalmente no gastar demasiado, pero no hay límites técnicos ni procesos de aprobación formales.',
      'Gobernanza establecida. Políticas documentadas (etiquetado, aprobación de nuevos servicios), roles y responsabilidades definidos, y controles implementados. Ej: Existe una política de etiquetado obligatoria y se requiere aprobación para usar servicios nuevos o costosos.',
      'Gobernanza avanzada. Automatización de políticas (ej. mediante AWS Config, Azure Policy), controles preventivos y detectivos, y presupuestos por equipo/proyecto. Ej: Las políticas de etiquetado se fuerzan automáticamente y se bloquea el aprovisionamiento de recursos no conformes.',
      'Gobernanza integral. Marco completo de políticas con mejora continua, auditorías regulares, y cultura de responsabilidad compartida sobre los costos. Ej: Se realizan auditorías periódicas de cumplimiento de políticas y los equipos son directamente responsables de sus presupuestos.'
    ]
  },
  {
    name: 'Planificación y Previsión',
    icon: ChartBarIcon, 
    description: 'Analiza la capacidad de planificar y prever gastos futuros en la nube.',
    tooltipText: 'Planificación: Prever y planificar gastos futuros.',
    levelDescriptions: [
      'Sin planificación. Gastos no previstos ni planificados; se opera de forma completamente reactiva. Ej: No existen presupuestos para la nube; el gasto es una sorpresa cada mes.',
      'Planificación básica. Presupuestos anuales o generales sin seguimiento detallado ni desglose por servicio/proyecto. Ej: Se asigna una cantidad X para la nube al año, pero no se monitorea activamente el progreso hacia ese límite.',
      'Planificación estructurada. Presupuestos detallados por unidades de negocio o proyectos, con revisiones trimestrales y análisis de variaciones. Ej: Cada departamento tiene un presupuesto de nube y se revisan las desviaciones cada tres meses.',
      'Planificación avanzada. Modelos predictivos de costos basados en el uso histórico y planes de negocio, escenarios de gasto (what-if). Ej: Se utilizan herramientas para prever el gasto de los próximos 6-12 meses y se simula el impacto de nuevos proyectos.',
      'Planificación optimizada. Previsión precisa y continua con ajuste dinámico basado en datos en tiempo real y cambios en el negocio, integrada con la estrategia financiera global. Ej: Los modelos de previsión se actualizan semanalmente y se integran con la planificación financiera corporativa.'
    ]
  },
  {
    name: 'Cultura y Organización',
    icon: UsersIcon, 
    description: 'Evalúa la madurez organizacional en prácticas FinOps y la colaboración entre equipos.',
    tooltipText: 'Cultura: Prácticas FinOps y colaboración organizacional.',
    levelDescriptions: [
      'Sin cultura FinOps. No hay conciencia sobre la gestión de costos en la nube; silos entre equipos. Ej: Los desarrolladores no conocen el costo de los servicios que usan y Finanzas no entiende la factura de la nube.',
      'Cultura emergente. Algunos equipos o individuos muestran interés y conciencia de costos; colaboración esporádica. Ej: Un par de ingenieros intentan optimizar sus recursos, pero no es una práctica extendida.',
      'Cultura establecida. Equipos técnicos y financieros colaboran regularmente; hay capacitación en FinOps y roles definidos (ej. FinOps Practitioner). Ej: Existen reuniones periódicas entre Ingeniería, Operaciones y Finanzas para discutir costos y optimizaciones.',
      'Cultura madura. FinOps integrado en procesos de negocio y decisiones tecnológicas; responsabilidad compartida y KPIs de FinOps establecidos. Ej: Las decisiones de arquitectura consideran el impacto en costos y los equipos son evaluados por su eficiencia en la nube.',
      'Cultura líder. Innovación continua en prácticas FinOps, la optimización de costos es un valor central y se comparten las mejores prácticas interna y externamente. Ej: La organización es reconocida como un referente en FinOps y contribuye activamente a la comunidad.'
    ]
  }
]; 