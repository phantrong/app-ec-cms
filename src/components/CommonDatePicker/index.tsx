import { DatePicker } from 'antd';
import React from 'react';
import moment, { Moment } from 'moment';
import classNames from 'classnames';

import styles from './styles.module.scss';

import calendarIcon from '../../assets/images/icons/icon-calendar.svg';

const CommonDatePicker = (props: ICommonDatePickerProps) => {
  const { valueDate, formatDate, handleChange, className } = props;

  const handleEnterDatePicker = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      const date = new Date(e.currentTarget.value);
      if (String(date) !== 'Invalid Date') {
        handleChange(moment(date).format(formatDate));
      }
    }
  };

  return (
    <DatePicker
      className={classNames({
        [className || '']: !!className,
        [styles.datePicker]: true,
      })}
      value={valueDate ? moment(valueDate, formatDate) : null}
      format={formatDate}
      placeholder="yyyy/mm/dd"
      suffixIcon={<img src={calendarIcon} width={20} height={20} alt="Calendar Icon" />}
      onChange={(value: Moment | null, dateString: string) => handleChange(dateString)}
      onKeyDown={handleEnterDatePicker}
    />
  );
};

export default CommonDatePicker;
