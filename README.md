This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Acerca de este Proyecto: Auto Assessment de Madurez FinOps

Este proyecto es una aplicación web diseñada para ayudar a las organizaciones a evaluar su nivel de madurez FinOps. Guía a los usuarios a través de una autoevaluación basada en el marco oficial de la FinOps Foundation, específicamente sus dominios y el modelo de madurez "Crawl, Walk, Run" (Gatear, Caminar, Correr).

### Funcionalidad Principal y Flujo de Trabajo

La aplicación proporciona un proceso de evaluación en múltiples pasos:

1.  **Bienvenida y Registro:**
    *   Introduce el modelo de madurez FinOps y las categorías a evaluar.
    *   Recopila información básica del usuario (nombre, empresa, correo electrónico, cargo) a través del componente `RegistrationForm.tsx`.
2.  **Información de Infraestructura y Equipo:**
    *   Reúne un contexto detallado sobre el entorno en la nube del usuario utilizando `InfrastructureQuestions.tsx`. Esto incluye proveedores de nube, composición del equipo, presupuesto, tipos de cargas de trabajo, etc.
3.  **Evaluación por Categoría:**
    *   El usuario evalúa la madurez de su organización en cinco categorías clave de FinOps (definidas en `src/data/categories.ts`):
        *   Visibilidad y Asignación de Costos
        *   Optimización y Eficiencia
        *   Gobernanza y Control
        *   Planificación y Previsión
        *   Cultura y Organización
    *   Para cada categoría, `CategoryAssessment.tsx` presenta cinco descripciones de niveles de madurez, y el usuario selecciona el que mejor se adapta a su estado actual.
4.  **Resultados y Resumen:**
    *   `AssessmentSummary.tsx` muestra los resultados, incluyendo una puntuación media de madurez, la etapa correspondiente (Gatear, Caminar o Correr) y puntuaciones detalladas por categoría.
    *   **Opciones de Exportación:** Los usuarios pueden descargar sus resultados como un archivo CSV o un informe PDF.
5.  **Funcionalidad de Reinicio:** Permite a los usuarios borrar sus datos y reiniciar la evaluación.

### Stack Tecnológico

*   **Framework Frontend:** Next.js (React)
*   **Lenguaje:** TypeScript
*   **Estilos:** Tailwind CSS
*   **Manejo de Formularios:** `react-hook-form`
*   **Gestión de Estado:** `useState` de React y `localStorage` para persistencia.

### Estructura del Proyecto

*   `src/app/page.tsx`: Orquesta el flujo de la evaluación.
*   `src/components/`: Contiene los componentes UI reutilizables.
*   `src/data/categories.ts`: Define las categorías de evaluación.
*   `src/store/assessmentStore.ts`: Maneja el almacenamiento en `localStorage`.
*   `src/types/assessment.ts`: Define las interfaces TypeScript para las estructuras de datos.

### Interfaz de Usuario

La UI presenta un diseño moderno con efectos visuales como "glass-panel" y animaciones "fade-in", buscando una experiencia de usuario fluida.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
