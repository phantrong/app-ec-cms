import React, { useState, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { Spin, message, DatePicker } from 'antd';
import { useSearchParams } from 'react-router-dom';

import SearchInput from 'components/SearchInput';
import SelectComponent from 'components/SelectComponent';
import TableWithdraw from './TableWithdraw';
import {
  DEFAULT_PAGE_ANTD,
  PAGE_PAGINATION_10,
  STATUS_WITHDRAW_FAILED,
  STATUS_WITHDRAW_SUCCESS,
} from 'constants/constants';

import IconCalendar from 'assets/images/icons/icon-calendar.svg';
import styles from './styles.module.scss';
import stylesInput from './../../../styles/input.module.scss';
import { useBankCountStatus } from 'hooks/usePayoutHistory';

const History = () => {
  const { t } = useTranslation();

  const [searchParams] = useSearchParams();
  const storeNameDefault: string | number | null = searchParams.get('store_name');

  const STATUS_WITHDRAW = [
    {
      value: null,
      label: t('common.statusAll'),
      name: t('common.statusAll'),
      class: '',
    },
    {
      value: STATUS_WITHDRAW_SUCCESS,
      label: t('payouts.statusWithDrawalSuccess'),
      name: t('payouts.statusWithDrawalSuccess'),
      class: 'success',
    },
    {
      value: STATUS_WITHDRAW_FAILED,
      label: t('payouts.statusWithDrawalFailed'),
      name: t('payouts.statusWithDrawalFailed'),
      class: 'failed',
    },
  ];

  const dateFormat = 'YYYY-MM-DD';
  const [payoutHistoryStatus, setPayoutHistoryStatus] = useState<IPayoutHistoryStatus[]>(STATUS_WITHDRAW);
  const [filter, setFilter] = useState<IParamPaymentHistory>({
    per_page: PAGE_PAGINATION_10,
    page: DEFAULT_PAGE_ANTD,
    store_name: storeNameDefault || '',
  });

  // useBankCountStatus
  const { data: bankCountStatus }: IWithdrawCountStatusResponse = useBankCountStatus(filter);

  useEffect(() => {
    if (bankCountStatus) {
      const data = STATUS_WITHDRAW.map((item: any) => ({
        ...item,
        name: `${item.name} (${bankCountStatus
          .filter((withdrawStatus: any) => withdrawStatus.status === item.value)
          .map((booking: any) => booking.quantity)})`,
      }));
      const total = bankCountStatus
        .map((withdrawStatus: any) => withdrawStatus.quantity)
        .reduce((prev: number, current: number) => prev + current);
      data[0] = {
        ...data[0],
        name: `${t('common.statusAll')} (${total})`,
      };
      setPayoutHistoryStatus(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bankCountStatus, t]);

  const handleSearchPayoutHistory = (value: string | number | null) => {
    setFilter({ ...filter, store_name: value, page: DEFAULT_PAGE_ANTD });
  };

  const handleChangeSelectStatus = (value: string | null) => {
    setFilter({ ...filter, status: value, page: DEFAULT_PAGE_ANTD });
  };

  const handleChangeDate = (date: moment.Moment | null, dateString: string, key: string) => {
    if (!dateString) {
      setFilter({ ...filter, [key]: null, page: DEFAULT_PAGE_ANTD });
    } else {
      if (
        (filter?.start_date && key === 'end_date' && filter?.start_date > dateString.replace(/\//g, '-')) ||
        (filter?.end_date && key === 'start_date' && filter?.end_date < dateString.replace(/\//g, '-'))
      ) {
        message.error(t('payouts.messages.msgStartDateLessEndDate'));
      } else {
        setFilter({ ...filter, [key]: dateString.replace(/\//g, '-'), page: DEFAULT_PAGE_ANTD });
      }
    }
  };

  const handleEnterDatePicker = (e: React.KeyboardEvent<HTMLInputElement>, keyName: string) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      const date = new Date(e.currentTarget.value);
      if (String(date) !== 'Invalid Date') {
        handleChangeDate(moment(date), moment(date).format('YYYY/MM/DD'), keyName);
      }
    }
  };

  // Pagination
  const handleChangePage = useCallback(
    (page: number) => {
      setFilter({ ...filter, page });
    },
    [filter]
  );

  return (
    <div className={styles.wrapper}>
      <Helmet>
        <title>{t('tabTitle.payoutHistory')}</title>
      </Helmet>

      <div className={styles.head}>
        <h2 className={styles.title}>{t('payouts.titlePayoutHistory')}</h2>
        <div className={styles.groupSearch}>
          <div className={styles.formInput}>
            <p className={styles.label}>{t('payouts.labelSearch')}</p>
            <SearchInput
              placeholder={t('payouts.textSearch')}
              isShowClear
              onSearch={handleSearchPayoutHistory}
              defaultValue={filter?.store_name?.toString()}
            />
          </div>
          <div className={styles.formInput}>
            <div className={styles.label}>
              {t('payouts.labelStatus')} {false && <Spin size="small" />}
            </div>
            <SelectComponent
              defaultValue={null}
              items={payoutHistoryStatus}
              handleChangeValueSelect={(value) => handleChangeSelectStatus(value)}
              dropdownClassName="sorting-product-dropdown-select"
            />
          </div>
          <div className={`${styles.formInput} ${styles.datePickerStart}`}>
            <p className={styles.label}>{t('payouts.labelDateStart')}</p>
            <DatePicker
              className={stylesInput.datePicker}
              format="YYYY/MM/DD"
              placeholder="yyyy/mm/dd"
              value={filter?.start_date ? moment(filter.start_date, dateFormat) : null}
              suffixIcon={<img src={IconCalendar} alt="Calendar Icon" />}
              onChange={(date, dateString) => handleChangeDate(date, dateString, 'start_date')}
              onKeyDown={(e) => handleEnterDatePicker(e, 'start_date')}
            />
          </div>
          <p className={styles.strDate}>~</p>

          <div className={styles.formInput}>
            <p className={styles.label}>{t('payouts.labelDateEnd')}</p>
            <DatePicker
              className={stylesInput.datePicker}
              format="YYYY/MM/DD"
              placeholder="yyyy/mm/dd"
              value={filter?.end_date ? moment(filter.end_date, dateFormat) : null}
              suffixIcon={<img src={IconCalendar} alt="Calendar Icon" />}
              onChange={(date, dateString) => handleChangeDate(date, dateString, 'end_date')}
              onKeyDown={(e) => handleEnterDatePicker(e, 'end_date')}
            />
          </div>
        </div>
      </div>

      <TableWithdraw filter={filter} onHandleChangePage={handleChangePage} />
    </div>
  );
};

export default History;
