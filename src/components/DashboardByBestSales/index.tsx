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
import { useRevenueByBestSales } from 'hooks/useTurnover';
import ChartBestSales from './ChartBestSales';
import { formatCurrencyNumber, handleExportExcel, handleErrorMessage } from 'helper';
import { EXPORT_BEST_SALES_API } from 'api/turnoverManagement';

import styles from 'pages/TurnOverManagement/styles.module.scss';
import stylesDatePicker from 'styles/datePicker.module.scss';
import stylesTable from 'styles/table.module.scss';
import dropdownIcon from 'assets/images/icons/icon-arrow-bottom.svg';

moment.locale(i18n.language);

const initialState: ITurnOverByAge = {
  start_date: moment().startOf('month').format('YYYY-MM-DD'),
  end_date: moment().endOf('month').format('YYYY-MM-DD'),
};

const DashBoardByBestSales = () => {
  const { t } = useTranslation();
  const [filterOrder, setFilterOrder] = useState<ITurnOverByAge>(initialState);
  const [isLoadingBtnExport, setIsLoadingBtnExport] = useState<boolean>(false);

  // Data
  const {
    data: dataRevenueByBestSales = [],
    isLoading: isLoadingDataRevenueByBestSales,
  }: IResponseTurnoverByBestSales = useRevenueByBestSales(filterOrder);

  // Columns table
  const columns = [
    {
      title: t('common.stt'),
      render: (value: IDataTurnOverByBestSales, item: IDataTurnOverByBestSales, index: number) => index + 1,
    },
    {
      title: t('C2001DashBoard.productName'),
      dataIndex: 'name',
      key: 'name',
      className: styles.nameProductBestSalesWidth,
    },
    {
      title: t('C2001DashBoard.totalOrders'),
      render: (value: IDataTurnOverByBestSales) => <div>{value.total_order ? value.total_order : 0}</div>,
      className: styles.otherBestSalesWidth,
    },
    {
      title: t('C2001DashBoard.quantityPieces'),
      render: (value: IDataTurnOverByBestSales) => <div>{value.total_product ? value.total_product : 0}</div>,
      className: styles.otherBestSalesWidth,
    },
    {
      title: t('C2001DashBoard.amountYen'),
      render: (value: IDataTurnOverByBestSales) => <div>{formatCurrencyNumber(value.revenue)}</div>,
      className: styles.otherBestSalesWidth,
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

  // Export csv
  const handleExportCSV = useCallback(async () => {
    setIsLoadingBtnExport(true);
    try {
      handleExportExcel(
        EXPORT_BEST_SALES_API,
        filterOrder,
        t('C2001DashBoard.fileNameExcelBestSales') + '_' + dayjs().format('YYYYMMDD') + '.xlsx',
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
          <div className={styles.title}>{t('C2001DashBoard.staticsByProduct')}</div>

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
        {isLoadingDataRevenueByBestSales ? (
          <Skeleton.Button active className={styles.skeleton} />
        ) : (
          <ChartBestSales data={dataRevenueByBestSales} />
        )}

        {/* Table */}
        <div className={classNames(stylesTable.commonTable, styles.tableRevenue)}>
          <Table
            columns={columns}
            dataSource={dataRevenueByBestSales}
            pagination={false}
            locale={{ emptyText: t('common.noDataSearch') }}
            rowKey="idBestSales"
            scroll={{ x: dataRevenueByBestSales && dataRevenueByBestSales.length ? true : undefined }}
          />
        </div>
      </div>
    ),
    [
      columns,
      dataRevenueByBestSales,
      handleExportCSV,
      handleFilterByDate,
      isLoadingDataRevenueByBestSales,
      t,
      filterOrder,
      handleEnterDatePicker,
      isLoadingBtnExport,
    ]
  );
};

export default DashBoardByBestSales;
