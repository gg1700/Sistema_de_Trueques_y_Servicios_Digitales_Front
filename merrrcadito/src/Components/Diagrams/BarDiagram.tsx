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


export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'INSERTAR TITULO',
    },
  },
};

//CONSTRUIR FUNCION PARA  LLAMAR SP Y DATOS GUARDAR EN LOS LABELS
const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data={
    labels,
    datasets:[{
      label: 'Dataset 1',
      data: labels.map(() => 50),
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }],
};

export default function BarDiagram() {
  return <Bar options={options} data={data} />;
}
