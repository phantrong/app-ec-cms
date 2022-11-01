import React, { useCallback, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

import { formatCurrencyNumber } from 'helper';
import { COLOR_RANDOM_COLUMN } from 'constants/constants';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler);

interface IDashboardByBestSales {
  data?: IDataTurnOverByBestSales[];
}

export default function ChartBestSales(props: IDashboardByBestSales) {
  const { data = [] } = props;
  const { t } = useTranslation();

  const top20BestSalesProducts: IDataTurnOverByBestSales[] = data.concat(
    Array.from({ length: 20 - data.length }, () => ({
      name: '',
      revenue: '',
    }))
  );

  const dataOrder: string[] = top20BestSalesProducts.map((item: IDataTurnOverByBestSales) => item.revenue);

  const labels: string[] = top20BestSalesProducts.map((item: IDataTurnOverByBestSales) => {
    if (item.name.length > 10) return `${item.name.substring(0, 10)} ...`;
    return item.name;
  });

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
            return t('C2001DashBoard.amount');
          },
          labelColor() {
            return {
              borderRadius: 7,
              backgroundColor: '#D47845',
              borderWidth: 6,
              borderColor: '#D47845',
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
