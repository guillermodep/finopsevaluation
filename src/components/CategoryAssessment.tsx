import { Category } from '@/types/assessment';

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
    <div className="bg-white/5 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">{category.name}</h2>
      <p className="text-white/80 mb-6">{category.description}</p>

      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((level) => (
          <div key={level} className="flex items-start">
            <input
              type="radio"
              id={`level-${level}`}
              name="level"
              value={level}
              checked={selectedLevel === level}
              onChange={() => onLevelSelect(level)}
              className="mt-1"
            />
            <label
              htmlFor={`level-${level}`}
              className="ml-3 text-left cursor-pointer"
            >
              <div className="text-white font-medium">Nivel {level}</div>
              <div className="text-white/80 text-sm">
                {category.levelDescriptions[level - 1]}
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
} 