import { Button } from 'antd';
import classNames from 'classnames';
import React from 'react';

import { TYPE_BTN } from 'constants/constants';

import styles from './styles.module.scss';
import IconAdd from 'assets/images/icons/icon-add-square.svg';
import IconAddSchedule from 'assets/images/icons/icon-calendar-white.svg';
import IconLive from 'assets/images/icons/icon-video-white.svg';
import IconCSV from 'assets/images/icon-csv.svg';

interface ICommonBtn {
  handleClick: () => void;
  text: string;
  type?: string | null;
  disabled?: boolean;
  isLoading?: boolean;
}

const CommonBtn = (props: ICommonBtn) => {
  const { text, type, handleClick, disabled, isLoading } = props;
  return (
    <div className={styles.commonBtnAntd}>
      <Button
        className={classNames({
          [styles.typeAddStaffBtn]: type === TYPE_BTN.TYPE_ADD_STAFF || type === TYPE_BTN.TYPE_ADD_IMAGE,
          [styles.typeBtnNormalEarthBtn]:
            type === TYPE_BTN.TYPE_BTN_NORMAL_EARTH_BG ||
            type === TYPE_BTN.TYPE_ADD_SCHEDULE_LIVE ||
            type === TYPE_BTN.TYPE_ADD_LIVE ||
            type === TYPE_BTN.TYPE_EXPORT_CSV,
          [styles.typeTransparentBg]: type === TYPE_BTN.TYPE_TRANSPARENT_BG,
          [styles.typeAddToCartBtn]: type === TYPE_BTN.TYPE_ADD_TO_CART,
          [styles.typeBuyBtn]: type === TYPE_BTN.TYPE_BUY,
          [styles.disabled]: !!disabled,
        })}
        onClick={handleClick}
        disabled={!!disabled}
        loading={!!isLoading}
      >
        {/* Icon add */}
        {(type === TYPE_BTN.TYPE_ADD_STAFF || type === TYPE_BTN.TYPE_ADD_IMAGE) && (
          <img src={IconAdd} alt="add" className={styles.iconLeft} />
        )}

        {/* Another icon */}
        {type === TYPE_BTN.TYPE_ADD_SCHEDULE_LIVE && (
          <img src={IconAddSchedule} alt="add" className={styles.iconLeft} />
        )}

        {type === TYPE_BTN.TYPE_EXPORT_CSV && <img src={IconCSV} alt="export csv" className={styles.iconLeft} />}

        {type === TYPE_BTN.TYPE_ADD_LIVE && <img src={IconLive} alt="add" className={styles.iconLeft} />}
        {text}
      </Button>
    </div>
  );
};

export default CommonBtn;
