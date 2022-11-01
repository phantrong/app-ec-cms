import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import styles from './style.module.scss';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className={styles.page404}>
      <h1 className={styles.title}>{t('page404.title')}</h1>
      <Link to="/" className={styles.backToHome}>
        {t('page404.backToHome')}
      </Link>
    </div>
  );
}
