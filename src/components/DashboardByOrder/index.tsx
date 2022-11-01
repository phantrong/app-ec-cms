import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'moment/locale/ja';
import moment from 'moment';
import i18n from 'i18next';
import locale from 'antd/es/date-picker/locale/ja_JP';
import { DatePicker, message, Table, Skeleton } from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';

import {
  DATE_FILTER_TURNOVER_OPTIONS,
  DATE_UNIT,
  OVER_10_YEARS,
  OVER_24_MONTHS,
  OVER_30_DAYS,
  TYPE_BTN,
} from 'constants/constants';
import SelectComponent from 'components/SelectComponent';
import CommonBtn from 'components/CommonBtn';
import ChartOrder from './ChartOrder';
import { useRevenueByOrder } from 'hooks/useTurnover';
import { handleExportExcel, handleErrorMessage, formatCurrencyNumber, formatCurrencyNumberToFixed } from 'helper';
import { EXPORT_ORDER_API } from 'api/turnoverManagement';

import styles from 'pages/TurnOverManagement/styles.module.scss';
import stylesDatePicker from 'styles/datePicker.module.scss';
import stylesTable from 'styles/table.module.scss';
import liveGreen from 'assets/images/line-green.svg';
import dropdownIcon from 'assets/images/icons/icon-arrow-bottom.svg';

moment.locale(i18n.language);

const initialState: ITurnOverByOrder = {
  type: DATE_FILTER_TURNOVER_OPTIONS.DAY.toString(),
  start_date: moment().startOf('month').format('YYYY-MM-DD'),
  end_date: moment().endOf('month').format('YYYY-MM-DD'),
};

const DashBoardByOrder = () => {
  const { t } = useTranslation();
  const [filterOrder, setFilterOrder] = useState<ITurnOverByOrder>(initialState);
  const [isLoadingBtnExport, setIsLoadingBtnExport] = useState<boolean>(false);
  const [valueStartDate, setValueStartDate] = useState<moment.Moment>(
    moment(moment().startOf('month').format(DATE_UNIT.YYYY_MM_DD))
  );

  const [valueEndDate, setValueEndDate] = useState<moment.Moment>(
    moment(moment().endOf('month').format(DATE_UNIT.YYYY_MM_DD))
  );

  const isOver30Days: boolean =
    filterOrder.type === DATE_FILTER_TURNOVER_OPTIONS.DAY &&
    moment(filterOrder.end_date).diff(moment(filterOrder.start_date), 'day') > OVER_30_DAYS;
  const isOver10Years: boolean =
    filterOrder.type === DATE_FILTER_TURNOVER_OPTIONS.YEAR &&
    moment(filterOrder.end_date).diff(moment(filterOrder.start_date), 'year') > OVER_10_YEARS;
  const isOver24Months: boolean =
    filterOrder.type === DATE_FILTER_TURNOVER_OPTIONS.MONTH &&
    moment(filterOrder.end_date).diff(moment(filterOrder.start_date), 'month') > OVER_24_MONTHS;
  const isDayBefore: boolean =
    filterOrder.type === DATE_FILTER_TURNOVER_OPTIONS.DAY &&
    moment(filterOrder.end_date).isBefore(moment(filterOrder.start_date));
  const isMonthBefore: boolean =
    filterOrder.type === DATE_FILTER_TURNOVER_OPTIONS.MONTH &&
    moment(filterOrder.end_date).isBefore(moment(filterOrder.start_date));

  const isYearBefore: boolean =
    filterOrder.type === DATE_FILTER_TURNOVER_OPTIONS.YEAR &&
    moment(filterOrder.end_date).isBefore(moment(filterOrder.start_date));

  // Gender Options Form
  const DATE_FILTER_OPTIONS: ISelect[] = [
    {
      value: DATE_FILTER_TURNOVER_OPTIONS.DAY,
      name: t('common.day'),
    },
    {
      value: DATE_FILTER_TURNOVER_OPTIONS.MONTH,
      name: t('common.month'),
    },
    {
      value: DATE_FILTER_TURNOVER_OPTIONS.YEAR,
      name: t('common.year'),
    },
  ];

  // Data
  const { data: dataRevenueByOrder = [], isLoading: isLoadingDataRevenueByOrder }: IResponseTurnoverByOrder =
    useRevenueByOrder(
      filterOrder,
      !isOver30Days && !isDayBefore && !isMonthBefore && !isYearBefore && !isOver10Years && !isOver24Months
    );

  // Columns table
  const columns = [
    {
      title: t('C2001DashBoard.period'),
      dataIndex: 'date',
      key: 'date',
      className: styles.equalWidthOrderTable,
    },
    {
      title: t('C2001DashBoard.numberOfPurchase'),
      render: (value: IDataTurnoverByOrder) =>
        Number(value?.customer_male) +
        Number(value?.customer_female) +
        Number(value?.customer_unknown) +
        Number(value?.customer_not_login),
      className: styles.equalWidthOrderTable,
    },
    {
      title: t('C2001DashBoard.male'),
      dataIndex: 'customer_male',
      key: 'customer_male',
      className: styles.equalWidthOrderTable,
    },
    {
      title: t('C2001DashBoard.female'),
      dataIndex: 'customer_female',
      key: 'customer_female',
      className: styles.equalWidthOrderTable,
    },
    {
      title: t('C2001DashBoard.unknown'),
      dataIndex: 'customer_unknown',
      key: 'customer_unknown',
      className: styles.equalWidthOrderTable,
    },
    {
      title: t('C2001DashBoard.unknownNonMember'),
      dataIndex: 'customer_not_login',
      key: 'customer_not_login',
      className: styles.equalWidthOrderTable,
    },
    {
      title: t('C2001DashBoard.totalPurchase'),
      render: (value: IDataTurnOverByBestSales) => <div>{formatCurrencyNumber(value.revenue)}</div>,
      className: styles.equalWidthOrderTable,
    },
    {
      title: t('C2001DashBoard.purchaseAverage'),
      render: (value: IDataTurnOverByBestSales) => (
        <div>{value.average ? formatCurrencyNumberToFixed(value.average) : 0}</div>
      ),
      className: styles.equalWidthOrderTable,
    },
  ];

  // Filter by status
  const handleFilterStatus = useCallback(
    (value?: string | null) => {
      switch (value) {
        case DATE_FILTER_TURNOVER_OPTIONS.MONTH:
          setValueStartDate(moment(moment().startOf('year').format('YYYY-MM')));
          setValueEndDate(moment(moment().endOf('month').format('YYYY-MM')));
          return setFilterOrder({
            ...filterOrder,
            type: value,
            start_date: moment().startOf('year').format('YYYY-MM'),
            end_date: moment().endOf('month').format('YYYY-MM'),
          });

        case DATE_FILTER_TURNOVER_OPTIONS.YEAR:
          setValueStartDate(moment(moment().startOf('year').format(DATE_UNIT.YYYY)));
          setValueEndDate(moment(moment().endOf('year').format(DATE_UNIT.YYYY)));
          return setFilterOrder({
            ...filterOrder,
            type: value,
            start_date: moment().startOf('year').format('YYYY'),
            end_date: moment().endOf('year').format('YYYY'),
          });

        default:
          setValueStartDate(moment(moment().startOf('month').format(DATE_UNIT.YYYY_MM_DD)));
          setValueEndDate(moment(moment().endOf('month').format(DATE_UNIT.YYYY_MM_DD)));
          return setFilterOrder({
            ...filterOrder,
            type: value,
            start_date: moment().startOf('month').format('YYYY-MM-DD'),
            end_date: moment().endOf('month').format('YYYY-MM-DD'),
          });
      }
    },
    [filterOrder]
  );

  const handleFilterByDate = useCallback(
    (time: moment.Moment, type: string) => {
      switch (filterOrder.type) {
        default:
          return setFilterOrder({
            ...filterOrder,
            [type]: time.format('YYYY-MM-DD'),
          });

        case DATE_FILTER_TURNOVER_OPTIONS.MONTH:
          return setFilterOrder({
            ...filterOrder,
            [type]: time.format('YYYY-MM'),
          });
        case DATE_FILTER_TURNOVER_OPTIONS.YEAR:
          return setFilterOrder({
            ...filterOrder,
            [type]: time.format('YYYY'),
          });
      }
    },
    [filterOrder]
  );

  const handleEnterDatePicker = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, type: string) => {
      if (e.key === 'Enter' || e.keyCode === 13) {
        const date = new Date(e.currentTarget.value);
        if (String(date) !== 'Invalid Date') {
          if (type === 'start_date') {
            setValueStartDate(moment(date));
          }
          if (type === 'end_date') {
            setValueEndDate(moment(date));
          }
          switch (filterOrder.type) {
            default:
              return setFilterOrder({
                ...filterOrder,
                [type]: moment(date).format('YYYY-MM-DD'),
              });
            case DATE_FILTER_TURNOVER_OPTIONS.MONTH:
              return setFilterOrder({
                ...filterOrder,
                [type]: moment(date).format('YYYY-MM'),
              });
            case DATE_FILTER_TURNOVER_OPTIONS.YEAR:
              return setFilterOrder({
                ...filterOrder,
                [type]: moment(date).format('YYYY'),
              });
          }
        }
      }
    },
    [filterOrder]
  );

  const handleSelectOptionDate = useCallback(() => {
    switch (filterOrder.type) {
      default:
        return 'date';

      case DATE_FILTER_TURNOVER_OPTIONS.MONTH:
        return 'month';

      case DATE_FILTER_TURNOVER_OPTIONS.YEAR:
        return 'year';
    }
  }, [filterOrder]);

  const handleFormatSelectDate = useCallback(() => {
    switch (filterOrder.type) {
      case DATE_FILTER_TURNOVER_OPTIONS.DAY:
        return DATE_UNIT.YYYY_MM_DD;

      case DATE_FILTER_TURNOVER_OPTIONS.MONTH:
        return DATE_UNIT.YYYY_MM;

      case DATE_FILTER_TURNOVER_OPTIONS.YEAR:
        return DATE_UNIT.YYYY;
    }
  }, [filterOrder.type]);

  const disabledEndDate = useCallback(
    (current: moment.Moment) => {
      const cloneDate = moment(filterOrder.start_date);
      switch (filterOrder.type) {
        default:
          return current && (current.diff(cloneDate, 'day') > OVER_30_DAYS || current.isBefore(cloneDate));
        case DATE_FILTER_TURNOVER_OPTIONS.MONTH:
          return current && (current.diff(cloneDate, 'month') > OVER_24_MONTHS || current.isBefore(cloneDate));
        case DATE_FILTER_TURNOVER_OPTIONS.YEAR:
          return current && (current.diff(cloneDate, 'year') > OVER_10_YEARS || current.isBefore(cloneDate));
      }
    },
    [filterOrder.start_date, filterOrder.type]
  );

  useEffect(() => {
    if (isOver30Days) {
      return message.error(t('C2001DashBoard.over30days'));
    }

    if (isDayBefore) {
      return message.error(t('C2001DashBoard.startTimeBiggerThanEndTime'));
    }

    if (isMonthBefore) {
      return message.error(t('C2001DashBoard.selectMonthValid'));
    }

    if (isYearBefore) {
      return message.error(t('C2001DashBoard.selectYearValid'));
    }

    if (isOver10Years) {
      return message.error(t('C2001DashBoard.selectYearValid'));
    }

    if (isOver24Months) {
      return message.error(t('C2001DashBoard.selectYearValid'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterOrder.end_date, filterOrder.start_date, filterOrder.type, t]);

  // Export csv
  const handleExportCSV = useCallback(async () => {
    setIsLoadingBtnExport(true);
    try {
      handleExportExcel(
        EXPORT_ORDER_API,
        filterOrder,
        t('C2001DashBoard.fileNameExcelOrder') + '_' + dayjs().format('YYYYMMDD') + '.xlsx',
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
          <div className={styles.title}>{t('C2001DashBoard.title')}</div>

          <div className={styles.topRightContainer}>
            <img src={liveGreen} alt="line" />
            <div className={styles.earningTitle}>{t('C2001DashBoard.earning')}</div>
            <div className={styles.optionSelectDate}>
              <SelectComponent
                defaultValue={t('common.day')}
                items={DATE_FILTER_OPTIONS}
                dropdownClassName="sorting-product-dropdown-select"
                handleChangeValueSelect={handleFilterStatus}
              />
            </div>
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
              format={handleFormatSelectDate()}
              suffixIcon={<img height={20} width={20} src={dropdownIcon} alt="Calendar Icon" />}
              allowClear={false}
              onSelect={(time) => {
                handleFilterByDate(time, 'start_date');
                setValueStartDate(time);
              }}
              picker={handleSelectOptionDate()}
              value={valueStartDate}
              onKeyDown={(e) => handleEnterDatePicker(e, 'start_date')}
            />
          </div>
          ~
          <div className={styles.datePickerItem}>
            <DatePicker
              locale={locale}
              className={stylesDatePicker.datePicker}
              format={handleFormatSelectDate()}
              suffixIcon={<img height={20} width={20} src={dropdownIcon} alt="Calendar Icon" />}
              allowClear={false}
              onSelect={(time) => {
                handleFilterByDate(time, 'end_date');
                setValueEndDate(time);
              }}
              defaultValue={moment(moment().endOf('month').format(DATE_UNIT.YYYY_MM_DD))}
              picker={handleSelectOptionDate()}
              disabledDate={disabledEndDate}
              value={valueEndDate}
              onKeyDown={(e) => handleEnterDatePicker(e, 'end_date')}
            />
          </div>
        </div>

        {/* Chart */}
        {isLoadingDataRevenueByOrder ? (
          <Skeleton.Button active className={styles.skeleton} />
        ) : (
          <ChartOrder data={dataRevenueByOrder} />
        )}

        {/* Table */}
        <div className={classNames(stylesTable.commonTable, styles.tableRevenue)}>
          <Table
            columns={columns}
            dataSource={dataRevenueByOrder}
            pagination={false}
            locale={{ emptyText: t('common.noDataSearch') }}
            rowKey="idOrder"
            scroll={{ x: dataRevenueByOrder && dataRevenueByOrder.length ? true : undefined }}
          />
        </div>
      </div>
    ),
    [
      DATE_FILTER_OPTIONS,
      columns,
      dataRevenueByOrder,
      disabledEndDate,
      handleExportCSV,
      handleFilterByDate,
      handleFilterStatus,
      handleFormatSelectDate,
      handleSelectOptionDate,
      isLoadingDataRevenueByOrder,
      t,
      valueEndDate,
      valueStartDate,
      handleEnterDatePicker,
      isLoadingBtnExport,
    ]
  );
};

export default DashBoardByOrder;
