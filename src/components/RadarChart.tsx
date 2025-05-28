'use client';

import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip as ChartTooltip, // Renamed to avoid conflict with our Tooltip component
  Legend,
} from 'chart.js';
import { AssessmentResult } from '@/types/assessment';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ChartTooltip,
  Legend
);

interface RadarChartProps {
  results: AssessmentResult[];
  categoryNames: string[];
}

const RadarChart: React.FC<RadarChartProps> = ({ results, categoryNames }) => {
  const scores = categoryNames.map(name => {
    const result = results.find(r => r.category === name);
    return result ? result.selectedLevel : 0;
  });

  const data = {
    labels: categoryNames,
    datasets: [
      {
        label: 'Nivel de Madurez',
        data: scores,
        backgroundColor: 'rgba(54, 162, 235, 0.3)', // Light blue with more opacity
        borderColor: 'rgba(54, 162, 235, 1)', // Solid blue
        borderWidth: 2,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)', // Solid blue points
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
        pointRadius: 4, // Slightly larger points
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.3)', // Lighter grid lines
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.3)', // Lighter grid lines
        },
        pointLabels: {
          color: 'rgba(255, 255, 255, 0.85)', // Lighter point labels (category names)
          font: {
            size: 13, // Slightly larger font for category names
            weight: 500 as const, // Medium weight
          },
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)', // Lighter tick labels (0-5)
          backdropColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent backdrop for ticks
          backdropPadding: 3,
          stepSize: 1,
          font: {
            size: 11, // Smaller font for tick labels
          },
        },
        suggestedMin: 0,
        suggestedMax: 5,
      },
    },
    plugins: {
      legend: {
        display: true, // Display legend
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.85)', // Lighter legend text
          font: {
            size: 14, // Legend font size
          },
        },
      },
      tooltip: { // Chart.js tooltip, not our custom one
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.r !== null) {
              label += context.parsed.r;
            }
            return label;
          }
        }
      }
    },
  };

  return <Radar data={data} options={options} />;
};

export default RadarChart;
