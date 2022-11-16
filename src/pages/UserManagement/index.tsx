import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, message, Pagination, Row, Table } from 'antd';
import moment from 'moment';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import { Helmet } from 'react-helmet-async';

import { DEFAULT_PAGE_ANTD, PAGE_PAGINATION_10 } from 'constants/constants';
import { useListUsers } from 'hooks/useListUsers';
import SearchInput from 'components/SearchInput';
import CommonDatePicker from 'components/CommonDatePicker';

import styles from './styles.module.scss';
import stylesTable from 'styles/table.module.scss';
import stylesDatePicker from 'styles/datePicker.module.scss';
import iconEye from 'assets/images/icons/icon-eye.svg';

const UserManagement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const initialState: IFilterListUsers = {
    per_page: PAGE_PAGINATION_10,
    page: location.state || DEFAULT_PAGE_ANTD,
    start_date: null,
    end_date: null,
  };

  const [filter, setFilter] = useState<IFilterListUsers>(initialState);

  // Data
  // List live stream
  const { data: listUsers, isLoading: isLoadingListUsers }: IListUsersResponse = useListUsers(filter);

  const data: IUserData[] | undefined = listUsers?.data;

  const columns = [
    {
      title: t('common.stt'),
      dataIndex: 'index',
      key: 'index',
      render: (value: IUserData, item: IUserData, index: number) => listUsers && listUsers.from + index,
    },
    {
      title: t('C2010UserManagement.userName'),
      render: (value: IUserData) => <div className={styles.longContent}>{value.name}</div>,
    },
    {
      title: t('C2010UserManagement.mailAddress'),
      render: (value: IUserData) => <div className={styles.longContent}>{value.email}</div>,
    },
    {
      title: t('C2010UserManagement.phone'),
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: t('C2010UserManagement.addRess'),
      render: (value: IUserData) => <div className={styles.longContent}>{value.address}</div>,
    },
    {
      title: t('C2010UserManagement.createdAt'),
      render: (value: IUserData) => moment(value.created_at).format('YYYY/MM/DD'),
    },
    {
      render: (value: IUserData) => (
        <div className={styles.iconRow}>
          <img
            src={iconEye}
            alt="eye"
            onClick={() =>
              navigate(`/user-management/${value.id}`, {
                state: filter.page,
              })
            }
          />
        </div>
      ),
      className: styles.iconGroup,
    },
  ];

  // Filter
  const handleFilterSearch = useCallback(
    (value: string | null) => {
      setFilter({
        ...filter,
        name: value,
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
        });
      } else {
        message.error(t('validate.startDateBeforeEndDate'));
      }
    },
    [filter, t]
  );

  // Pagination
  const handleChangePage = useCallback(
    (page: number) => {
      setFilter({ ...filter, page });
    },
    [filter]
  );

  // Reset page when back from detail
  useEffect(() => {
    window.history.replaceState({}, document.title);
  }, []);

  return (
    <div className={styles.container}>
      <Helmet>
        <title>{t('tabTitle.userManagement')}</title>
      </Helmet>

      <div className={styles.topContent}>
        <div className={styles.namePage}>{t('C2010UserManagement.title')}</div>

        {/* Group btn */}
        <div className={styles.groupBtn}>
          <div className={styles.searchInputWrapper}>
            <div className={styles.nameTitle}>{t('common.search')}</div>
            <SearchInput isShowClear placeholder={t('common.search')} onSearch={handleFilterSearch} />
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
              <div className={styles.nameTitle}>{t('C2010UserManagement.dateEnd')}</div>
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

      {/* Table */}
      <Row className={styles.tableLive}>
        <Col span={24}>
          <div className={stylesTable.commonTable}>
            <Table
              columns={columns}
              dataSource={data}
              loading={isLoadingListUsers}
              pagination={false}
              rowKey="id"
              locale={{ emptyText: t('common.noDataSearch') }}
              scroll={{ x: listUsers && listUsers?.total > 0 ? true : undefined }}
            />

            <div className={stylesTable.commonPagination}>
              <strong>
                {t('common.pagination', {
                  total: listUsers?.total,
                  page_from: listUsers?.from,
                  page_to: listUsers?.to,
                })}
              </strong>

              <Pagination
                onChange={handleChangePage}
                total={listUsers?.total}
                current={filter.page}
                pageSize={filter.per_page}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default UserManagement;
