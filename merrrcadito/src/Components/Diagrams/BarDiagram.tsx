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
  const options = {
    ...defaultOptions,
    plugins: {
      ...defaultOptions.plugins,
      title: {
        ...defaultOptions.plugins.title,
        text: title || defaultOptions.plugins.title.text,
      },
    },
  };

  return <Bar options={options} data={data} height={height} />;
}