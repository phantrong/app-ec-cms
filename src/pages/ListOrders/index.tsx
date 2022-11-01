import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { Button, Col, message, Pagination, Row, Skeleton, Table } from 'antd';
import moment from 'moment';
import classNames from 'classnames';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import CommonDatePicker from 'components/CommonDatePicker';
import SearchInput from 'components/SearchInput';
import { DEFAULT_PAGE_ANTD, PAGE_PAGINATION_10, STATUS_ORDERS } from 'constants/constants';
import SelectComponent from 'components/SelectComponent';
import { useListOrders } from 'hooks/useOrders';
import { formatCurrencyNumber } from 'helper';

import styles from './styles.module.scss';
import stylesTable from 'styles/table.module.scss';
import stylesDatePicker from 'styles/datePicker.module.scss';
import iconHandleView from 'assets/images/handle-view.svg';
import iconTotalIncome from 'assets/images/money-blue.svg';
import iconCommission from 'assets/images/money-up-arrow-red.svg';

const ListOrders = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const keyWordDefault: string | null = searchParams.get('key_word');

  const initialState: IFilterOrders = {
    per_page: PAGE_PAGINATION_10,
    page: DEFAULT_PAGE_ANTD,
    start_date: null,
    end_date: null,
    key_word: keyWordDefault || '',
  };

  const [filter, setFilter] = useState<IFilterOrders>(initialState);

  // Data
  const { data: listOrders, isLoading: isLoadingLisOrders }: IListOrdersResponse = useListOrders(filter);

  const data: IListOrders[] | undefined = listOrders?.orders?.data;

  const statusLiveStream: IStatusNumberOrders[] | undefined = listOrders?.status_filter;
  const totalStatusCount: number | undefined = statusLiveStream?.reduce(
    (prev: any, next: any) => prev + next?.quantity,
    0
  );

  const STATUS_LIVE: ISelect[] = [
    {
      value: null,
      name: `${t('common.all')} (${totalStatusCount})`,
    },
    {
      value: STATUS_ORDERS.WAIT_FOR_GOOD,
      name: `${t('C2005ListOrders.status.waitForGood')} (${statusLiveStream && statusLiveStream[1].quantity})`,
    },
    {
      value: STATUS_ORDERS.SHIPPING,
      name: `${t('C2005ListOrders.status.shipping')} (${statusLiveStream && statusLiveStream[2].quantity})`,
    },
    {
      value: STATUS_ORDERS.SHIPPED,
      name: `${t('C2005ListOrders.status.shipped')} (${statusLiveStream && statusLiveStream[3].quantity})`,
    },
  ];

  const getTextStatus: (status: number) => string | undefined = useCallback(
    (status: number) => {
      switch (status) {
        case STATUS_ORDERS.SHIPPING:
          return t('C2005ListOrders.status.shipping');
        case STATUS_ORDERS.SHIPPED:
          return t('C2005ListOrders.status.shipped');
        default:
          return t('C2005ListOrders.status.waitForGood');
      }
    },
    [t]
  );

  const getStyleBtnStatus: (status: number) => string | undefined = (status: number) => {
    switch (status) {
      case STATUS_ORDERS.SHIPPING:
        return styles.shippingBtn;
      case STATUS_ORDERS.SHIPPED:
        return styles.shippedBtn;
      default:
        return styles.waitForGoodBtn;
    }
  };

  const columns = [
    {
      title: t('C2005ListOrders.orderNumber'),
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: t('C2005ListOrders.storeName'),
      render: (value: IListOrders) => <div className={styles.multiLine}>{value.store_name}</div>,
    },
    {
      title: t('C2005ListOrders.customerName'),
      render: (value: IListOrders, item: IListOrders, index: number) => (
        <div className={styles.multiLine}>
          {value.customer_surname} {value.customer_name}
        </div>
      ),
    },
    {
      title: t('C2005ListOrders.orderDate'),
      render: (value: IListOrders, item: IListOrders, index: number) => (
        <div>{moment(value.created_at).format('YYYY/MM/DD')}</div>
      ),
    },
    {
      title: t('C2005ListOrders.quantity'),
      dataIndex: 'total_product',
      key: 'total_product',
    },
    {
      title: t('C2005ListOrders.total'),
      render: (value: IListOrders, item: IListOrders, index: number) => (
        <div>¥{formatCurrencyNumber(value.total_payment)}</div>
      ),
    },
    {
      title: t('common.status'),
      render: (value: IListOrders, item: IListOrders, index: number) => (
        <Button type="primary" className={getStyleBtnStatus(value.status)}>
          {getTextStatus(value.status)}
        </Button>
      ),
    },
    {
      render: (value: IListOrders) => (
        <div onClick={() => navigate(`/order-detail/${value.id}`)} className={styles.iconTable}>
          <img src={iconHandleView} alt="eye" />
        </div>
      ),
    },
  ];

  // Filter
  const handleFilterSearch = useCallback(
    (value: string | null) => {
      setFilter({
        ...filter,
        key_word: value,
        page: DEFAULT_PAGE_ANTD,
      });
    },
    [filter]
  );

  const handleChangeDateStart = useCallback(
    (value: string) => {
      if ((filter.end_date && dayjs(filter.end_date) >= dayjs(value)) || !filter.end_date || !value) {
        setFilter({
          ...filter,
          start_date: value === '' ? null : value,
          page: DEFAULT_PAGE_ANTD,
        });
      } else {
        message.error(t('validate.startDateBeforeEndDate'));
      }
    },
    [filter, t]
  );

  const handleChangeDateEnd = useCallback(
    (value: string) => {
      if ((filter.start_date && dayjs(value) >= dayjs(filter.start_date)) || !filter.start_date || !value) {
        setFilter({
          ...filter,
          end_date: value === '' ? null : value,
          page: DEFAULT_PAGE_ANTD,
        });
      } else {
        message.error(t('validate.startDateBeforeEndDate'));
      }
    },
    [filter, t]
  );

  const handleFilterStatus = useCallback(
    (value?: string | null) => {
      setFilter({
        ...filter,
        status: value,
        page: DEFAULT_PAGE_ANTD,
      });
    },
    [filter]
  );

  // Pagination
  const handleChangePage = useCallback(
    (page: number) => {
      setFilter({ ...filter, page });
    },
    [filter]
  );

  return (
    <div className={styles.container}>
      <Helmet>
        <title>{t('tabTitle.listOrders')}</title>
      </Helmet>

      <div className={styles.topContent}>
        <div className={styles.namePage}>{t('C2005ListOrders.orderManagement')}</div>

        {/* Group btn */}
        <div className={styles.groupBtn}>
          <div className={styles.searchInputWrapper}>
            <div className={styles.nameTitle}>{t('common.search')}</div>
            <SearchInput
              isShowClear
              placeholder={t('common.search')}
              onSearch={handleFilterSearch}
              defaultValue={filter.key_word?.toString()}
            />
          </div>

          {/* Status */}
          <div className={styles.selectWrapper}>
            <div className={styles.nameTitle}>{t('common.status')}</div>

            {isLoadingLisOrders ? (
              <Skeleton.Button active className={styles.skeletonSelect} />
            ) : (
              <SelectComponent
                items={STATUS_LIVE}
                dropdownClassName="sorting-product-dropdown-select"
                handleChangeValueSelect={handleFilterStatus}
                isLoading={isLoadingLisOrders}
                defaultValue={filter.status || null}
              />
            )}
          </div>

          <div className={styles.dateWrapper}>
            <div className={styles.dateStartItem}>
              <div className={styles.nameTitle}>{t('common.dateStart')}</div>
              <div className={styles.firstDate}>
                <div className={styles.dateItem}>
                  <CommonDatePicker
                    valueDate={filter.start_date}
                    formatDate="YYYY/MM/DD"
                    handleChange={handleChangeDateStart}
                    className={stylesDatePicker.datePicker}
                  />
                </div>
                <span className={styles.icon}>~</span>
              </div>
            </div>
            <div className={styles.dateItem}>
              <div className={styles.nameTitle}>{t('common.dateEnd')}</div>
              <CommonDatePicker
                valueDate={filter.end_date}
                formatDate="YYYY/MM/DD"
                handleChange={handleChangeDateEnd}
                className={stylesDatePicker.datePicker}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={styles.boxContent}>
        {/* Box statistical */}
        <div className={styles.statistical}>
          {isLoadingLisOrders ? (
            <Skeleton.Button active className={styles.skeletonStatistical} />
          ) : (
            <Row gutter={20}>
              <Col span={12}>
                <div className={styles.part}>
                  <div className={styles.topStripe}>
                    <div className={styles.name}>{t('C2005ListOrders.totalAmount')}</div>
                    <img src={iconTotalIncome} alt="total live" />
                  </div>
                  <div className={classNames(styles.currency, styles.currencyStore)}>
                    ¥{formatCurrencyNumber(listOrders?.total_payment)}
                  </div>
                </div>
              </Col>

              <Col span={12}>
                <div className={styles.part}>
                  <div className={styles.topStripe}>
                    <div className={styles.name}>{t('C2005ListOrders.commission')}</div>
                    <img src={iconCommission} alt="total live" />
                  </div>
                  <div className={classNames(styles.currency, styles.currencyCommission)}>
                    ¥{formatCurrencyNumber(listOrders?.revenue_admin)}
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </div>

        {/* Table */}
        <div className={stylesTable.commonTable}>
          <Table
            columns={columns}
            dataSource={data}
            loading={isLoadingLisOrders}
            pagination={false}
            rowKey="id"
            locale={{ emptyText: t('common.noDataSearch') }}
            scroll={{ x: listOrders?.orders && listOrders?.orders?.total > 0 ? true : undefined }}
          />
          <div className={stylesTable.commonPagination}>
            <strong>
              {t('common.pagination', {
                total: listOrders?.orders?.total,
                page_from: listOrders?.orders?.from,
                page_to: listOrders?.orders?.to,
              })}
            </strong>

            <Pagination
              onChange={handleChangePage}
              total={listOrders?.orders?.total}
              current={filter.page}
              pageSize={filter.per_page}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListOrders;
