import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Empty, Pagination } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import iconEye from 'assets/images/icons/icon-eye.svg';

import styles from './styles.module.scss';
import stylesTable from 'styles/table.module.scss';
import SpinLoading from 'components/SpinLoading';
import { formatCurrencyNumber } from 'helper';
import { STATUS_WITHDRAW } from 'constants/constants';
import { usePaymentHistory } from 'hooks/usePayoutHistory';

interface IListPayoutHistory {
  id: number;
  date: string;
  money: number;
  status: number;
  store_id: number;
  store_name: number;
  bank_id: string;
}

const TableWithdraw = ({ filter, onHandleChangePage }: { filter: IParamPaymentHistory; onHandleChangePage: any }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [listPayoutHistory, setListPayoutHistory] = useState<IListPayoutHistory[] | undefined>([]);

  const { data: payoutHistory, isLoading: isLoadingPayoutHistory }: IResponsePayoutHistory = usePaymentHistory(filter);

  useEffect(() => {
    if (payoutHistory?.data) {
      const data = payoutHistory?.data.map((dataHistory: IDataPayoutHistory) => {
        return {
          id: dataHistory.id,
          store_id: dataHistory.store_id,
          store_name: dataHistory.store_name,
          date: moment.unix(dataHistory.arrival_date).format('YYYY/MM/DD'),
          money: dataHistory.amount,
          status: dataHistory.status,
          bank_id: dataHistory.bank_id,
        };
      });
      setListPayoutHistory(data);
    } else {
      setListPayoutHistory([]);
    }
  }, [payoutHistory]);

  const getTextStatus = (status: number) =>
    STATUS_WITHDRAW.filter((item) => item.value === status).map((item: any, index: number) => (
      <div className={styles?.[item.class]} key={index}>
        {item.label}
      </div>
    ));

  return (
    <div className={styles.tableWithList}>
      <div className={styles.table}>
        <div className={styles.tableMain}>
          <div className={styles.tableHeading}>
            <div className={styles.tableRow}>
              <div className={`${styles.tableCell} ${styles.tableCellId}`}>{t('payouts.tableHistory.stt')}</div>
              <div className={styles.tableCell}>{t('payouts.tableHistory.nameStore')}</div>
              <div className={styles.tableCell}>{t('payouts.tableHistory.quantity')}</div>
              <div className={styles.tableCell}>{t('payouts.tableHistory.arrivalDate')}</div>
              <div className={styles.tableCell}>{t('payouts.tableHistory.status')}</div>
              <div className={`${styles.tableCell} ${styles.tableCellDetail}`}></div>
            </div>
          </div>
          <div className={styles.tableBody}>
            {isLoadingPayoutHistory && (
              <div className={styles.tableRow}>
                <div className={styles.tableCellFull}>
                  <SpinLoading />
                </div>
              </div>
            )}

            {!isLoadingPayoutHistory &&
              !!listPayoutHistory?.length &&
              listPayoutHistory.map((data: IListPayoutHistory, index: number) => (
                <div className={styles.tableRow} key={data.id}>
                  <div className={`${styles.tableCell} ${styles.tableCellId}`}>{++index}</div>
                  <div className={styles.tableCell}>{data.store_name}</div>
                  <div className={styles.tableCell}>
                    <div className={styles.money}>{formatCurrencyNumber(data.money)} VNĐ</div>
                  </div>
                  <div className={styles.tableCell}>{data.date}</div>
                  <div className={styles.tableCell}>
                    <div className={styles.status}>{getTextStatus(data.status)}</div>
                  </div>
                  <div className={`${styles.tableCell} ${styles.tableCellDetail}`}>
                    <img src={iconEye} alt="eye" onClick={() => navigate(`/payment/${data.id}`)} />
                  </div>
                </div>
              ))}

            {!isLoadingPayoutHistory && !listPayoutHistory?.length && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
          </div>
        </div>
      </div>

      <div className={stylesTable.commonPagination}>
        <strong>
          {t('common.pagination', {
            total: payoutHistory?.total,
            page_from: payoutHistory?.from,
            page_to: payoutHistory?.to,
          })}
        </strong>

        <Pagination
          onChange={onHandleChangePage}
          total={payoutHistory?.total}
          current={filter.page}
          pageSize={filter.per_page}
        />
      </div>
    </div>
  );
};

export default TableWithdraw;
