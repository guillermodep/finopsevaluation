'use client';

interface ProgressBarProps {
  currentStep: number; // Current logical step (1-indexed)
  totalSteps: number;  // Total logical steps
  stepName?: string;   // Optional name for the current step group (e.g., "Registro")
}

export default function ProgressBar({
  currentStep,
  totalSteps,
  stepName,
}: ProgressBarProps) {
  const progressPercentage = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div className="w-full mb-8 animate-fade-in">
      {stepName && (
        <p className="text-sm text-white/80 mb-1 text-center">{stepName}</p>
      )}
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-blue-300">
          Progreso General
        </span>
        <span className="text-xs font-medium text-blue-300">
          Paso {currentStep} de {totalSteps}
        </span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-2.5">
        <div
          className="bg-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
}
