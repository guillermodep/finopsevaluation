'use client';

import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip as ChartTooltip, 
  Legend,
} from 'chart.js';
import { AssessmentResult } from '@/types/assessment';

export type RadarChartRef = ChartJS<'radar'> | null;

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

const RadarChart = React.forwardRef<RadarChartRef, RadarChartProps>(({ results, categoryNames }, ref) => {
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
        backgroundColor: 'rgba(54, 162, 235, 0.2)', 
        borderColor: 'rgba(54, 162, 235, 1)', 
        borderWidth: 2,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)', 
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
        pointRadius: 4, 
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
          color: 'rgba(0, 0, 0, 0.2)', 
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.2)', 
        },
        pointLabels: {
          color: 'rgba(0, 0, 0, 0.9)', 
          font: {
            size: 12, 
            weight: 500 as const, 
          },
        },
        ticks: {
          color: 'rgba(0, 0, 0, 0.7)', 
          backdropColor: 'rgba(255, 255, 255, 0.75)', 
          backdropPadding: 3,
          stepSize: 1,
          font: {
            size: 10, 
          },
        },
        suggestedMin: 0,
        suggestedMax: 5,
      },
    },
    plugins: {
      legend: {
        display: true, 
        position: 'top' as const,
        labels: {
          color: 'rgba(0, 0, 0, 0.9)', 
          font: {
            size: 14, 
          },
        },
      },
      tooltip: { 
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
          color: '#fff', 
        },
        bodyFont: {
          size: 12,
          color: '#fff', 
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
  // @ts-ignore because the ref type from react-chartjs-2 is not perfectly matching ChartJS type directly for forwardRef
  return <Radar ref={ref} data={data} options={options} />;
});

RadarChart.displayName = 'RadarChart'; // Good practice for forwardRef components

export default RadarChart;
