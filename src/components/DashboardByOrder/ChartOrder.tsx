import React, { useCallback, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ScriptableContext,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

import { formatCurrencyNumber } from 'helper';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface IDashboardByOrder {
  data?: IDataTurnoverByOrder[];
}

export default function ChartOrder(props: IDashboardByOrder) {
  const { data = [] } = props;
  const { t } = useTranslation();

  const labels = data.map((item: IDataTurnoverByOrder) => item.date);
  const dataOrder = data.map((item: IDataTurnoverByOrder) => item.revenue);

  const options: any = {
    responsive: true,
    plugins: {
      tooltip: {
        backgroundColor: 'white',
        borderColor: 'rgba(0, 0, 0, 0.25)',
        borderWidth: 1,
        titleColor: '#888888',
        titleFont: {
          size: 12,
        },
        bodyFont: {
          size: 16,
        },
        titleFontStyle: 'bold',

        padding: {
          top: 10,
          left: 14,
          right: 14,
          bottom: 10,
        },
        callbacks: {
          title() {
            return t('C2001DashBoard.earning');
          },
          labelColor() {
            return {
              borderRadius: 7,
              backgroundColor: '#528F75',
              borderWidth: 6,
              borderColor: '#528F75',
            };
          },
          labelTextColor() {
            return '#3B3B3B';
          },
          label(context: any) {
            return context.formattedValue + ' VNĐ';
          },
        },
      },
      legend: {
        display: false,
      },
    },
    elements: {
      line: {
        tension: 0.35,
      },
    },
    scales: {
      y: {
        ticks: {
          callback(value: string) {
            return formatCurrencyNumber(value) + ' VNĐ';
          },
        },
        beginAtZero: true,
      },
    },
  };
  const dataRender = useCallback(() => {
    return {
      labels,
      datasets: [
        {
          data: dataOrder,
          backgroundColor: (context: ScriptableContext<'line'>) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 1000);
            gradient.addColorStop(0, 'rgba(82, 143, 117, 0.6)');
            gradient.addColorStop(1, 'rgba(82, 143, 117, 0.1)');
            return gradient;
          },
          fill: 'start',
          borderColor: '#528F75',
          tension: 0,
        },
      ],
    };
  }, [dataOrder, labels]);

  return useMemo(() => <Line options={options} data={dataRender()} />, [dataRender, options]);
}
