import { Spin } from 'antd';
import React from 'react';

import styles from './styles.module.scss';

interface ISpinLoadingProps {
  size?: 'large' | 'small' | 'default';
}

const SpinLoading = (props: ISpinLoadingProps) => {
  return (
    <div className={styles.spinLoading}>
      <Spin size={props?.size || 'large'} />
    </div>
  );
};

export default SpinLoading;
