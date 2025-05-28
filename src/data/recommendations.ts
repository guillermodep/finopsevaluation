// src/data/recommendations.ts

export interface RecommendationItem {
  levelRange: [number, number]; // e.g., [1, 2] for levels 1 and 2 (Crawl)
  title: string; // e.g., "Sugerencias para avanzar a la etapa 'Caminar'"
  texts: string[];
  // Optional: linkToFinOpsOrg?: string; // For future enhancement
}

export interface CategoryRecommendations {
  [categoryName: string]: RecommendationItem[];
}

export const recommendationsData: CategoryRecommendations = {
  'Visibilidad y Asignación de Costos': [
    {
      levelRange: [1, 2],
      title: "Sugerencias para 'Visibilidad y Asignación de Costos' (Niveles 1-2)",
      texts: [
        "Comenzar a revisar las facturas de nube mensualmente para identificar los servicios de mayor costo.",
        "Explorar las herramientas de visualización de costos nativas de su proveedor de nube (ej. [AWS Cost Explorer](https://aws.amazon.com/aws-cost-management/aws-cost-explorer/), [Azure Cost Management](https://azure.microsoft.com/es-es/products/cost-management), [Google Cloud Billing](https://cloud.google.com/billing/docs)).",
        "Implementar un sistema básico de etiquetado (tagging) para los recursos y proyectos principales. [Aprende sobre etiquetado en FinOps.org](https://www.finops.org/framework/capabilities/tagging-metadata/)",
        "Identificar quiénes son los principales consumidores de nube dentro de la organización."
      ],
    },
    {
      levelRange: [3, 3],
      title: "Sugerencias para 'Visibilidad y Asignación de Costos' (Nivel 3)",
      texts: [
        "Establecer un proceso regular (ej. trimestral) para revisar y refinar la estrategia de etiquetado, asegurando consistencia y cobertura.",
        "Desarrollar dashboards de costos personalizados para diferentes equipos o unidades de negocio, mostrando los costos que les son relevantes.",
        "Implementar alertas de presupuesto y anomalías de costos más granulares y automatizadas.",
        "Comenzar a realizar análisis de 'showback' o 'chargeback' (informativo o real) a los equipos."
      ],
    },
    {
      levelRange: [4, 5],
      title: "Sugerencias para 'Visibilidad y Asignación de Costos' (Niveles 4-5)",
      texts: [
        "Integrar datos de costos con otras fuentes de datos de negocio (ej. KPIs de producto, uso de features) para entender el costo por unidad de valor.",
        "Automatizar completamente la asignación de costos compartidos y la generación de informes de chargeback.",
        "Utilizar herramientas avanzadas para la predicción de costos y la detección proactiva de anomalías con IA/ML.",
        "Fomentar una cultura donde los equipos revisen activamente sus costos y tomen decisiones basadas en ellos."
      ],
    }
  ],
  'Optimización y Eficiencia': [
    {
      levelRange: [1, 2],
      title: "Sugerencias para 'Optimización y Eficiencia' (Niveles 1-2)",
      texts: [
        "Identificar y apagar manualmente recursos inactivos o claramente subutilizados (ej. VMs detenidas por mucho tiempo, discos no adjuntos).",
        "Familiarizarse con los diferentes tipos de instancias/servicios y sus modelos de precios para elegir opciones más eficientes para nuevas cargas.",
        "Realizar ejercicios básicos de 'rightsizing' (ajuste de tamaño) para las 2-3 instancias o servicios más costosos.",
        "Aprovechar los créditos gratuitos o 'free tiers' de los proveedores para cargas de trabajo de desarrollo o prueba."
      ],
    },
    {
      levelRange: [3, 3],
      title: "Sugerencias para 'Optimización y Eficiencia' (Nivel 3)",
      texts: [
        "Establecer un calendario regular para revisar y aplicar recomendaciones de rightsizing de las herramientas nativas del proveedor.",
        "Comenzar a utilizar modelos de precios con descuento como Instancias Reservadas (RIs) o Savings Plans para cargas de trabajo estables.",
        "Implementar el apagado y encendido automático (scheduling) para entornos de no producción.",
        "Evaluar y optimizar el almacenamiento, eliminando snapshots antiguos o moviendo datos a tiers de almacenamiento más económicos."
      ],
    },
    {
      levelRange: [4, 5],
      title: "Sugerencias para 'Optimización y Eficiencia' (Niveles 4-5)",
      texts: [
        "Automatizar los procesos de rightsizing y scheduling utilizando herramientas especializadas o scripts.",
        "Implementar estrategias de optimización de licencias y BYOL (Bring Your Own License) donde sea aplicable.",
        "Adoptar arquitecturas serverless o basadas en contenedores para mejorar la elasticidad y reducir costos de recursos inactivos.",
        "Fomentar la optimización continua como parte del ciclo de vida de desarrollo de aplicaciones (DevFinOps)."
      ],
    }
  ],
  'Gobernanza y Control': [
    {
      levelRange: [1, 2],
      title: "Sugerencias para 'Gobernanza y Control' (Niveles 1-2)",
      texts: [
        "Definir y comunicar políticas básicas de uso de la nube y gestión de costos (ej. quién puede aprovisionar recursos, necesidad de etiquetado básico).",
        "Establecer presupuestos generales para la nube y realizar un seguimiento manual mensual.",
        "Identificar roles y responsabilidades básicas para la gestión de costos en la nube, aunque sea informalmente."
      ],
    },
    {
      levelRange: [3, 3],
      title: "Sugerencias para 'Gobernanza y Control' (Nivel 3)",
      texts: [
        "Documentar formalmente las políticas de gobernanza de costos y los procesos de aprobación de gastos.",
        "Implementar controles preventivos básicos utilizando las herramientas del proveedor (ej. límites de servicio, políticas de IAM para restringir creación de recursos costosos).",
        "Realizar auditorías periódicas de cumplimiento de políticas de etiquetado y configuración de recursos."
      ],
    },
    {
      levelRange: [4, 5],
      title: "Sugerencias para 'Gobernanza y Control' (Niveles 4-5)",
      texts: [
        "Automatizar la aplicación de políticas de gobernanza (ej. 'policy as code' con herramientas como AWS Config Rules, Azure Policy).",
        "Implementar flujos de trabajo automatizados para la aprobación de presupuestos y el aprovisionamiento de recursos.",
        "Integrar la gobernanza FinOps con los marcos de gobernanza de TI y seguridad existentes en la organización."
      ],
    }
  ],
  'Planificación y Previsión': [
    {
      levelRange: [1, 2],
      title: "Sugerencias para 'Planificación y Previsión' (Niveles 1-2)",
      texts: [
        "Comenzar a realizar previsiones de gasto básicas para los próximos 1-3 meses basadas en el consumo histórico.",
        "Involucrar a los equipos técnicos en la estimación de costos para nuevos proyectos o migraciones a la nube.",
        "Comparar regularmente el gasto real con las previsiones para identificar desviaciones."
      ],
    },
    {
      levelRange: [3, 3],
      title: "Sugerencias para 'Planificación y Previsión' (Nivel 3)",
      texts: [
        "Desarrollar modelos de previsión más detallados, considerando factores como la estacionalidad y el crecimiento de servicios.",
        "Establecer presupuestos por unidad de negocio, proyecto o aplicación y realizar un seguimiento regular.",
        "Utilizar herramientas de previsión de costos de los proveedores de nube o de terceros."
      ],
    },
    {
      levelRange: [4, 5],
      title: "Sugerencias para 'Planificación y Previsión' (Niveles 4-5)",
      texts: [
        "Integrar la planificación de capacidad y la previsión de costos en los ciclos de planificación financiera de la empresa.",
        "Utilizar modelos predictivos avanzados y análisis de escenarios ('what-if') para la planificación a largo plazo.",
        "Automatizar la generación de previsiones y la creación de informes de varianza presupuestaria."
      ],
    }
  ],
  'Cultura y Organización': [
    {
      levelRange: [1, 2],
      title: "Sugerencias para 'Cultura y Organización' (Niveles 1-2)",
      texts: [
        "Comenzar a hablar sobre la importancia de la gestión de costos en la nube con los equipos técnicos y financieros.",
        "Identificar a un 'campeón' o punto focal para FinOps, incluso si no es un rol dedicado.",
        "Compartir información básica sobre los costos de la nube con los equipos relevantes."
      ],
    },
    {
      levelRange: [3, 3],
      title: "Sugerencias para 'Cultura y Organización' (Nivel 3)",
      texts: [
        "Establecer un equipo o función FinOps centralizada, aunque sea pequeña, con responsabilidades claras.",
        "Proporcionar capacitación básica sobre FinOps y gestión de costos en la nube a los ingenieros y arquitectos.",
        "Fomentar la colaboración entre los equipos de finanzas, tecnología y negocio en decisiones relacionadas con costos de la nube."
      ],
    },
    {
      levelRange: [4, 5],
      title: "Sugerencias para 'Cultura y Organización' (Niveles 4-5)",
      texts: [
        "Integrar los principios FinOps en los procesos de desarrollo, operaciones y toma de decisiones de negocio.",
        "Establecer métricas y KPIs relacionados con FinOps que se revisen a nivel ejecutivo.",
        "Fomentar una cultura de mejora continua e innovación en las prácticas FinOps, compartiendo éxitos y lecciones aprendidas."
      ],
    }
  ]
};
