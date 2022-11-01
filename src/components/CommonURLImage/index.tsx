import React from 'react';
import { Image } from 'antd';

import styles from './styles.module.scss';

import NoneImage from '../../assets/images/no-image-content.svg';

const CommonURLImage = (props: IURLImageComponentProps) => {
  const { src, alt, className, handleOnClick } = props;

  return (
    <div className={styles.divImage}>
      <Image
        src={src || NoneImage}
        preview={false}
        alt={alt}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null;
          currentTarget.src = NoneImage;
        }}
        className={styles.URLImage + ' ' + className}
        onClick={handleOnClick}
      />
    </div>
  );
};

export default CommonURLImage;
