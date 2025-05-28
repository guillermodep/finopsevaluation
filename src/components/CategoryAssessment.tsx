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
  const IconComponent = category.icon;

  return (
    <div className="glass-effect rounded-xl p-7 transition-all duration-300 animate-fade-in">
      <h2 className="text-2xl font-bold mb-3 flex items-center">
        {IconComponent && <IconComponent className="w-7 h-7 mr-3 text-blue-300 flex-shrink-0" />}
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
            onClick={() => onLevelSelect(level)} // Allow clicking the whole div
            className={`flex items-start p-4 rounded-lg transition-all duration-300 ease-in-out cursor-pointer transform hover:scale-[1.02] hover:shadow-xl ${selectedLevel === level 
                ? 'bg-blue-500/30 border-2 border-blue-400 shadow-2xl scale-[1.03]' 
                : 'bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10'
            }`}
          >
            <input
              type="radio"
              id={`level-${category.name}-${level}`} 
              name={`level-${category.name}`} 
              value={level}
              checked={selectedLevel === level}
              onChange={() => onLevelSelect(level)} // Keep onChange for accessibility
              className="mt-1 w-4 h-4 accent-blue-400 flex-shrink-0"
            />
            <label
              htmlFor={`level-${category.name}-${level}`} 
              className="ml-3 text-left cursor-pointer w-full"
            >
              <div className={`font-semibold text-lg ${selectedLevel === level 
                  ? 'text-white' 
                  : 'text-white/90'
              }`}>
                Nivel {level}
              </div>
              <div className={`text-sm mt-1 ${selectedLevel === level 
                  ? 'text-blue-100' // Lighter text for selected description for contrast
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