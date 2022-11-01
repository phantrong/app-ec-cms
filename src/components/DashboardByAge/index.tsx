import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'moment/locale/ja';
import moment from 'moment';
import i18n from 'i18next';
import locale from 'antd/es/date-picker/locale/ja_JP';
import { DatePicker, message, Skeleton, Table } from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';

import { DATE_UNIT, TYPE_BTN } from 'constants/constants';
import CommonBtn from 'components/CommonBtn';
import { formatCurrencyNumber, formatCurrencyNumberToFixed, handleErrorMessage, handleExportExcel } from 'helper';
import { useRevenueByAge } from 'hooks/useTurnover';
import ChartAge from './ChartAge';
import { EXPORT_AGE_API } from 'api/turnoverManagement';

import styles from 'pages/TurnOverManagement/styles.module.scss';
import stylesDatePicker from 'styles/datePicker.module.scss';
import stylesTable from 'styles/table.module.scss';
import dropdownIcon from 'assets/images/icons/icon-arrow-bottom.svg';

moment.locale(i18n.language);

const initialState: ITurnOverByAge = {
  start_date: moment().startOf('month').format('YYYY-MM-DD'),
  end_date: moment().endOf('month').format('YYYY-MM-DD'),
};

const DashBoardByAge = () => {
  const { t } = useTranslation();
  const [filterOrder, setFilterOrder] = useState<ITurnOverByAge>(initialState);
  const [isLoadingBtnExport, setIsLoadingBtnExport] = useState<boolean>(false);

  // Data
  const { data: dataRevenueByAge = [], isLoading: isLoadingDataRevenueByAge }: IResponseTurnoverByAge =
    useRevenueByAge(filterOrder);

  // Columns table
  const columns = [
    {
      title: t('C2001DashBoard.age'),
      render: (value: IDataTurnOverByAge, item: IDataTurnOverByAge, index: number) => {
        return (
          <div>
            {index < 10 ? (
              <>
                {index * 10}
                {t('common.age')}
              </>
            ) : (
              <>{t('common.others')}</>
            )}
          </div>
        );
      },
    },
    {
      title: t('C2001DashBoard.numberOfPurchase'),
      render: (value: IDataTurnOverByBestSales) => <div>{value.total_order ? value.total_order : 0}</div>,
    },
    {
      title: t('C2001DashBoard.totalPurchase'),
      render: (value: IDataTurnOverByBestSales) => <div>{formatCurrencyNumber(value.revenue)}</div>,
    },
    {
      title: t('C2001DashBoard.purchaseAverage'),
      render: (value: IDataTurnOverByBestSales) => (
        <div>{value.average ? formatCurrencyNumberToFixed(value.average) : 0}</div>
      ),
    },
  ];

  const handleFilterByDate = useCallback(
    (time: moment.Moment, type: string) => {
      setFilterOrder({
        ...filterOrder,
        [type]: time.format('YYYY-MM-DD'),
      });
    },
    [filterOrder]
  );

  const handleEnterDatePicker = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, type: string) => {
      if (e.key === 'Enter' || e.keyCode === 13) {
        const date = new Date(e.currentTarget.value);
        if (String(date) !== 'Invalid Date') {
          setFilterOrder({
            ...filterOrder,
            [type]: moment(date).format('YYYY-MM-DD'),
          });
        }
      }
    },
    [filterOrder]
  );

  useEffect(() => {
    if (moment(filterOrder.end_date).isBefore(moment(filterOrder.start_date))) {
      return message.error(t('C2001DashBoard.startTimeBiggerThanEndTime'));
    }
  }, [filterOrder.end_date, filterOrder.start_date, t]);

  const handleExportCSV = useCallback(async () => {
    setIsLoadingBtnExport(true);
    try {
      handleExportExcel(
        EXPORT_AGE_API,
        filterOrder,
        t('C2001DashBoard.fileNameExcelAge') + '_' + dayjs().format('YYYYMMDD') + '.xlsx',
        () => setIsLoadingBtnExport(false)
      );
    } catch (error) {
      handleErrorMessage(error);
      setIsLoadingBtnExport(false);
    }
  }, [filterOrder, t]);

  return useMemo(
    () => (
      <div className={styles.container}>
        <div className={styles.topContainer}>
          <div className={styles.title}>{t('C2001DashBoard.staticsByAge')}</div>

          <div className={styles.topRightContainer}>
            <div className={styles.btnExportCsv}>
              <CommonBtn
                handleClick={() => handleExportCSV()}
                text={t('common.fileExport')}
                type={TYPE_BTN.TYPE_EXPORT_CSV}
                isLoading={isLoadingBtnExport}
              />
            </div>
          </div>
        </div>
        <div className={styles.datePicker}>
          <div className={styles.datePickerItem}>
            <DatePicker
              locale={locale}
              className={stylesDatePicker.datePicker}
              format={DATE_UNIT.YYYY_MM_DD}
              suffixIcon={<img height={20} width={20} src={dropdownIcon} alt="Calendar Icon" />}
              allowClear={false}
              onSelect={(time) => handleFilterByDate(time, 'start_date')}
              defaultValue={moment(moment().startOf('month').format(DATE_UNIT.YYYY_MM_DD))}
              picker="date"
              value={moment(filterOrder.start_date)}
              onKeyDown={(e) => handleEnterDatePicker(e, 'start_date')}
            />
          </div>
          ~
          <div className={styles.datePickerItem}>
            <DatePicker
              locale={locale}
              className={stylesDatePicker.datePicker}
              format={DATE_UNIT.YYYY_MM_DD}
              suffixIcon={<img height={20} width={20} src={dropdownIcon} alt="Calendar Icon" />}
              allowClear={false}
              onSelect={(time) => handleFilterByDate(time, 'end_date')}
              defaultValue={moment(moment().endOf('month').format(DATE_UNIT.YYYY_MM_DD))}
              picker="date"
              value={moment(filterOrder.end_date)}
              onKeyDown={(e) => handleEnterDatePicker(e, 'end_date')}
            />
          </div>
        </div>

        {/* Chart */}
        {isLoadingDataRevenueByAge ? (
          <Skeleton.Button active className={styles.skeleton} />
        ) : (
          <ChartAge data={dataRevenueByAge} />
        )}

        {/* Table */}
        <div className={classNames(stylesTable.commonTable, styles.tableRevenue)}>
          <Table
            columns={columns}
            dataSource={dataRevenueByAge}
            pagination={false}
            locale={{ emptyText: t('common.noDataSearch') }}
            rowKey="idAge"
            scroll={{ x: dataRevenueByAge && dataRevenueByAge.length ? true : undefined }}
          />
        </div>
      </div>
    ),
    [
      columns,
      dataRevenueByAge,
      handleExportCSV,
      handleFilterByDate,
      isLoadingDataRevenueByAge,
      t,
      filterOrder,
      handleEnterDatePicker,
      isLoadingBtnExport,
    ]
  );
};

export default DashBoardByAge;
