import { Category } from '@/types/assessment';
import Tooltip from './Tooltip';

interface CategoryAssessmentProps {
  category: Category;
  selectedLevel: number;
  onLevelSelect: (level: number) => void;
}

export default function CategoryAssessment({
  category,
  selectedLevel,
  onLevelSelect,
}: CategoryAssessmentProps) {
  return (
    <div className="glass-effect rounded-xl p-7 transition-all duration-300 animate-fade-in">
      <h2 className="text-2xl font-bold mb-3 flex items-center">
        {category.name}
        <Tooltip 
          text="Evalúa el nivel de madurez actual de tu organización para esta capacidad FinOps. Los niveles van desde 'Gatear' (procesos básicos o inexistentes) hasta 'Correr' (procesos altamente optimizados y automatizados)."
          position="right"
        />
      </h2>
      <p className="text-white/85 mb-6 text-md">{category.description}</p>

      <div className="space-y-5">
        {[1, 2, 3, 4, 5].map((level) => (
          <div 
            key={level} 
            className={`flex items-start p-3 rounded-lg transition-all duration-200 ${selectedLevel === level 
                ? 'bg-white/15 border border-white/25 shadow-md' 
                : 'hover:bg-white/10'
            }`}
          >
            <input
              type="radio"
              id={`level-${category.name}-${level}`} 
              name={`level-${category.name}`} 
              value={level}
              checked={selectedLevel === level}
              onChange={() => onLevelSelect(level)}
              className="mt-1 w-4 h-4 accent-blue-400"
            />
            <label
              htmlFor={`level-${category.name}-${level}`} 
              className="ml-3 text-left cursor-pointer w-full"
            >
              <div className={`font-medium text-lg ${selectedLevel === level 
                  ? 'text-white' 
                  : 'text-white/90'
              }`}>
                Nivel {level}
              </div>
              <div className={`text-sm mt-1 ${selectedLevel === level 
                  ? 'text-white/95' 
                  : 'text-white/70'
              }`}>
                {category.levelDescriptions[level - 1]}
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
} 