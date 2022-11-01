import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Row, Table, Pagination, Col, Select, Skeleton } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Helmet } from 'react-helmet-async';

import styles from './style.module.scss';
import {
  DEFAULT_PAGE_ANTD,
  PAGE_PAGINATION_10,
  TOKEN_CMS,
  UPGRADE_SHOP_REQUEST_STATUS_TEXT,
  UPGRADE_SHOP_REQUEST_STATUS_VALUE,
} from '../../constants/constants';
import SpinLoading from 'components/SpinLoading';
import { useCountStatusUpgradeShopRequest, useGetListUpgradeShopRequest } from 'hooks/useListUpgradeShopRequest';
import { GetUpgradeShopRequestStatusText } from 'helper';

import handleView from '../../assets/images/icons/icon-eye.svg';

const { Option } = Select;

const defaultFilter: IFilterListUpgradeShopRequest = {
  status: UPGRADE_SHOP_REQUEST_STATUS_VALUE.ALL,
  page: DEFAULT_PAGE_ANTD,
  per_page: PAGE_PAGINATION_10,
};

export default function ListUpgradeShopRequest() {
  const { t } = useTranslation();
  const { state }: any = useLocation();
  const isAuthenticated: boolean = !!Cookies.get(TOKEN_CMS);
  const [filter, setFilter] = useState<IFilterListUpgradeShopRequest>(state || defaultFilter);

  const {
    data: dataListUpgradeShopRequest,
    isLoading: isLoadingDataListUpgradeShopRequest,
  }: IListUpgradeShopRequestResponseData = useGetListUpgradeShopRequest(isAuthenticated, filter);

  const { data: upgradeCountStatus = [], isLoading: isLoadingUpgradeCountStatus }: IUpgradeShopRequestCountResponse =
    useCountStatusUpgradeShopRequest(filter);

  const UPGRADE_SHOP_REQUEST_OPTIONS: ISelect[] = [
    {
      value: UPGRADE_SHOP_REQUEST_STATUS_VALUE.ALL,
      name: `${UPGRADE_SHOP_REQUEST_STATUS_TEXT.ALL}(
          ${
            upgradeCountStatus && upgradeCountStatus.reduce((previousScore, item) => previousScore + item.quantity, 0)
          })`,
    },
    {
      value: UPGRADE_SHOP_REQUEST_STATUS_VALUE.WAIT_STRIPE,
      name: `${UPGRADE_SHOP_REQUEST_STATUS_TEXT.WAIT_STRIPE} (${
        upgradeCountStatus[3] ? upgradeCountStatus[3].quantity : 0
      })`,
    },
    {
      value: UPGRADE_SHOP_REQUEST_STATUS_VALUE.FAIL_STRIPE,
      name: `${UPGRADE_SHOP_REQUEST_STATUS_TEXT.FAIL_STRIPE}(${
        upgradeCountStatus[4] ? upgradeCountStatus[4].quantity : 0
      })`,
    },
    {
      value: UPGRADE_SHOP_REQUEST_STATUS_VALUE.WAIT_APPROVE,
      name: `${UPGRADE_SHOP_REQUEST_STATUS_TEXT.WAIT_APPROVE}(${
        upgradeCountStatus[0] ? upgradeCountStatus[0].quantity : 0
      })`,
    },
    {
      value: UPGRADE_SHOP_REQUEST_STATUS_VALUE.DENIED,
      name: `${UPGRADE_SHOP_REQUEST_STATUS_TEXT.DENIED}(${upgradeCountStatus[1] ? upgradeCountStatus[1].quantity : 0})`,
    },
    {
      value: UPGRADE_SHOP_REQUEST_STATUS_VALUE.APPROVED,
      name: `${UPGRADE_SHOP_REQUEST_STATUS_TEXT.APPROVED}(${
        upgradeCountStatus[2] ? upgradeCountStatus[2].quantity : 0
      })`,
    },
  ];

  const GetStyleBtnStatus: (status: number) => string = (status: number) => {
    switch (status) {
      case UPGRADE_SHOP_REQUEST_STATUS_VALUE.APPROVED:
        return styles.approvedBtn;
      case UPGRADE_SHOP_REQUEST_STATUS_VALUE.WAIT_APPROVE:
        return styles.waitApproveBtn;
      case UPGRADE_SHOP_REQUEST_STATUS_VALUE.DENIED:
        return styles.deniedBtn;
      case UPGRADE_SHOP_REQUEST_STATUS_VALUE.WAIT_STRIPE:
        return styles.waitStripeBtn;
      case UPGRADE_SHOP_REQUEST_STATUS_VALUE.FAIL_STRIPE:
        return styles.deniedBtn;
      default:
        return '';
    }
  };

  const dataSource: IDataColumnTableUpgradeShopRequest[] | undefined = useMemo(() => {
    return dataListUpgradeShopRequest?.data?.map((request: IUpgradeShopRequestBasicDetail, index: number) => ({
      key: index + 1 + (filter.page - 1) * PAGE_PAGINATION_10,
      id: index + 1 + (filter.page - 1) * PAGE_PAGINATION_10,
      name: request.first_name + ' ' + request.last_name,
      email: request.email,
      phone: request.phone,
      statusBtn: (
        <Button type="primary" className={GetStyleBtnStatus(request.status)}>
          {GetUpgradeShopRequestStatusText(request.status)}
        </Button>
      ),
      handle: (
        <Link to={'/upgrade-shop-requests/detail/' + request.id} state={filter}>
          <img height={24} width={24} src={handleView} alt="View" />
        </Link>
      ),
    }));
  }, [dataListUpgradeShopRequest, filter]);

  const columns: IColumnTable[] = [
    {
      title: <strong>{t('listUpgradeShopRequest.table.id')}</strong>,
      dataIndex: 'id',
      key: 'id',
      className: styles.indexColumn,
    },
    {
      title: <strong>{t('listUpgradeShopRequest.table.name')}</strong>,
      dataIndex: 'name',
      key: 'name',
      className: styles.nameColumn,
    },
    {
      title: <strong>{t('listUpgradeShopRequest.table.email')}</strong>,
      dataIndex: 'email',
      key: 'email',
      className: styles.emailColumn,
    },
    {
      title: <strong>{t('listUpgradeShopRequest.table.phone')}</strong>,
      dataIndex: 'phone',
      key: 'phone',
      className: styles.phoneColumn,
    },
    {
      title: <strong>{t('listUpgradeShopRequest.table.status')}</strong>,
      dataIndex: 'statusBtn',
      key: 'statusBtn',
      className: styles.statusColumn,
    },
    {
      dataIndex: 'handle',
      key: 'handle',
      className: styles.handleColumn,
    },
  ];

  const handleChangeStatus = useCallback(
    (selectedValue: number) => {
      setFilter({ ...filter, status: selectedValue, page: DEFAULT_PAGE_ANTD });
    },
    [filter]
  );

  const handleChangePage = useCallback(
    (page: number) => {
      setFilter({ ...filter, page });
    },
    [filter]
  );

  return (
    <div className={styles.listUpgradeShopRequest}>
      <Helmet>
        <title>{t('tabTitle.listUpgradeShopRequest')}</title>
      </Helmet>
      <Row justify="space-between" align="bottom" className={styles.title}>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <h2>{t('listUpgradeShopRequest.title')}</h2>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12} className={styles.colFilter}>
          <Col xs={24} sm={24} md={8} lg={6} xl={6} className={styles.filter}>
            <span className={styles.titleFilter}>{t('listUpgradeShopRequest.filterStatus')}</span>
          </Col>
          <Col xs={24} sm={24} md={8} lg={6} xl={6} className={styles.filter}>
            {isLoadingUpgradeCountStatus ? (
              <Skeleton.Button active className={styles.skeletonCountStatus} />
            ) : (
              <Select
                value={filter.status}
                className={styles.selectFilter}
                bordered={false}
                onChange={handleChangeStatus}
                loading={isLoadingDataListUpgradeShopRequest}
                dropdownClassName="sorting-product-dropdown-select"
              >
                {UPGRADE_SHOP_REQUEST_OPTIONS.map((item: ISelect, index: number) => (
                  <Option value={item.value} key={index}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            )}
          </Col>
        </Col>
      </Row>
      {isLoadingDataListUpgradeShopRequest && <SpinLoading />}
      {!isLoadingDataListUpgradeShopRequest && (
        <Table
          className={styles.table}
          bordered={false}
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          scroll={{ x: !!dataSource?.length ? true : undefined }}
          rowClassName={(record, index) => (index % 2 ? '' : 'hasBackground')}
          locale={{ emptyText: t('listCategory.noData') }}
        />
      )}
      {!isLoadingDataListUpgradeShopRequest && (
        <Col span={24} className={styles.colPagination}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} className={styles.textPagination}>
            <strong>
              {t('listCategory.pagination', {
                total: dataListUpgradeShopRequest?.total,
                page_from: dataListUpgradeShopRequest?.from,
                page_to: dataListUpgradeShopRequest?.to,
              })}
            </strong>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} className={styles.pagination}>
            <Pagination
              onChange={handleChangePage}
              total={dataListUpgradeShopRequest?.total || 0}
              current={filter.page}
              pageSize={filter.per_page}
            />
          </Col>
        </Col>
      )}
    </div>
  );
}
