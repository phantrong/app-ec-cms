import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

import DashboardByOrder from 'components/DashboardByOrder';
import DashBoardByBestSales from 'components/DashboardByBestSales';
import DashBoardByAge from 'components/DashboardByAge';

import styles from './styles.module.scss';

const DashBoardTurnOver = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <Helmet>
        <title>{t('tabTitle.turnover')}</title>
      </Helmet>
      <div className={styles.titleTurnover}>{t('C2001DashBoard.turnover')}</div>
      <DashboardByOrder />
      <DashBoardByBestSales />
      <DashBoardByAge />
    </div>
  );
};

export default DashBoardTurnOver;
