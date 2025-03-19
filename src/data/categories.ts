import { Category } from '@/types/assessment';

export const categories: Category[] = [
  {
    name: 'Visibilidad y Asignación de Costos',
    description: 'Evalúa la capacidad de la organización para ver, entender y asignar costos de la nube.',
    levelDescriptions: [
      'Sin visibilidad de costos. Los gastos de la nube no se monitorean ni se asignan.',
      'Visibilidad básica. Se revisan los costos mensualmente sin desglose detallado.',
      'Visibilidad estructurada. Costos etiquetados y asignados a unidades de negocio.',
      'Visibilidad avanzada. Seguimiento en tiempo real con alertas y predicciones.',
      'Visibilidad optimizada. Sistema automatizado de asignación y predicción de costos.'
    ]
  },
  {
    name: 'Optimización y Eficiencia',
    description: 'Mide la capacidad para optimizar recursos y maximizar el valor de la inversión en la nube.',
    levelDescriptions: [
      'Sin optimización. Los recursos se aprovisionan sin considerar la eficiencia.',
      'Optimización reactiva. Se ajustan recursos solo cuando hay problemas evidentes.',
      'Optimización proactiva. Revisiones regulares y ajustes planificados.',
      'Optimización sistemática. Procesos automatizados de rightsizing y scheduling.',
      'Optimización continua. Mejora constante con ML y automatización avanzada.'
    ]
  },
  {
    name: 'Gobernanza y Control',
    description: 'Evalúa las políticas y controles para gestionar el gasto en la nube.',
    levelDescriptions: [
      'Sin gobernanza. No existen políticas ni controles de gasto.',
      'Gobernanza básica. Políticas informales y controles mínimos.',
      'Gobernanza establecida. Políticas documentadas y controles implementados.',
      'Gobernanza avanzada. Automatización de políticas y controles preventivos.',
      'Gobernanza integral. Marco completo de políticas con mejora continua.'
    ]
  },
  {
    name: 'Planificación y Previsión',
    description: 'Analiza la capacidad de planificar y prever gastos futuros en la nube.',
    levelDescriptions: [
      'Sin planificación. Gastos no previstos ni planificados.',
      'Planificación básica. Presupuestos anuales sin seguimiento detallado.',
      'Planificación estructurada. Presupuestos detallados con revisiones trimestrales.',
      'Planificación avanzada. Modelos predictivos y escenarios de gasto.',
      'Planificación optimizada. Previsión precisa con ajuste continuo.'
    ]
  },
  {
    name: 'Cultura y Organización',
    description: 'Evalúa la madurez organizacional en prácticas FinOps.',
    levelDescriptions: [
      'Sin cultura FinOps. No hay conciencia sobre la gestión de costos.',
      'Cultura emergente. Algunos equipos conscientes de costos.',
      'Cultura establecida. Equipos capacitados y comprometidos.',
      'Cultura madura. FinOps integrado en procesos y decisiones.',
      'Cultura líder. Innovación continua y mejores prácticas FinOps.'
    ]
  }
]; 