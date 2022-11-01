import React, { useCallback, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

import { COLOR_RANDOM_COLUMN, LIST_AGE } from 'constants/constants';
import { formatCurrencyNumber } from 'helper';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler);

interface IDashboardByAge {
  data?: IDataTurnOverByAge[];
}

export default function ChartAge(props: IDashboardByAge) {
  const { data = [] } = props;
  const { t } = useTranslation();
  const labels = LIST_AGE.map((item: string) => item);
  const dataOrder = data.map((item: IDataTurnOverByAge) => item.revenue);

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
        padding: {
          top: 10,
          left: 14,
          right: 14,
          bottom: 10,
        },
        callbacks: {
          title() {
            return t('C2001DashBoard.totalPurchaseTooltip');
          },
          labelColor() {
            return {
              borderRadius: 7,
              backgroundColor: '#EF5946',
              borderWidth: 6,
              borderColor: '#EF5946',
            };
          },
          labelTextColor() {
            return '#3B3B3B';
          },
          label(context: any) {
            return '  ¥' + context.formattedValue;
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
            return '¥' + formatCurrencyNumber(value);
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
          backgroundColor: COLOR_RANDOM_COLUMN,
          fill: 'start',
          borderColor: '#528F75',
        },
      ],
    };
  }, [dataOrder, labels]);

  return useMemo(() => <Bar options={options} data={dataRender()} />, [dataRender, options]);
}
