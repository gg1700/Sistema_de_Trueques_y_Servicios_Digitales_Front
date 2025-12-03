import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarDiagramProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string;
    }[];
  };
  title?: string;
  height?: number;
}

const defaultOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Gráfico de Barras',
    },
  },
};

export default function BarDiagram({ data, title, height = 400 }: BarDiagramProps) {
  // Generar una clave única basada en los datos para forzar re-render
  const dataKey = useMemo(() => {
    return JSON.stringify({
      labels: data.labels,
      dataValues: data.datasets.map(d => d.data),
      title
    });
  }, [data.labels, data.datasets, title]);

  const options = useMemo(() => ({
    ...defaultOptions,
    maintainAspectRatio: false,
    plugins: {
      ...defaultOptions.plugins,
      title: {
        ...defaultOptions.plugins.title,
        text: title || defaultOptions.plugins.title.text,
      },
    },
  }), [title]);

  return (
    <div style={{ height: `${height}px`, width: '100%', position: 'relative' }}>
      <Bar key={dataKey} options={options} data={data} />
    </div>
  );
}