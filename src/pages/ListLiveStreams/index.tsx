import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { Col, message, Pagination, Row, Skeleton } from 'antd';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';

import CommonDatePicker from 'components/CommonDatePicker';
import SearchInput from 'components/SearchInput';
import { DEFAULT_PAGE_ANTD, PAGE_PAGINATION_12, STATUS_LIST_LIVE } from 'constants/constants';
import { useListLive } from 'hooks/useListLiveStream';
import SelectComponent from 'components/SelectComponent';
import CommonLiveStreamBox from 'components/CommonLiveStreamBox';

import styles from './styles.module.scss';
import stylesTable from 'styles/table.module.scss';
import stylesDatePicker from 'styles/datePicker.module.scss';

const ListLiveStreams = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const keyWordDefault: string | null = searchParams.get('key_word');

  const initialState: IListLiveFilter = {
    per_page: PAGE_PAGINATION_12,
    page: DEFAULT_PAGE_ANTD,
    start_date: null,
    end_date: null,
    status: null,
    key_word: keyWordDefault || '',
  };

  const [filter, setFilter] = useState<IListLiveFilter>(initialState);

  // Data
  // List live stream
  const { data: listLive, isLoading: isLoadingListLive }: IListLiveResponse = useListLive(filter);
  const data: IListLive[] | undefined = listLive?.schedules?.data;

  const statusLiveStream: IStatusNumberLive[] | undefined = listLive?.status;

  const STATUS_LIVE: ISelect[] = [
    {
      value: null,
      name: `${t('common.all')} (${
        statusLiveStream && statusLiveStream[1].total_schedule + statusLiveStream[2].total_schedule
      })`,
    },
    {
      value: STATUS_LIST_LIVE.LIVE_NOW,
      name: `${t('C2002ListLiveStream.liveNow')} (${statusLiveStream && statusLiveStream[1].total_schedule})`,
    },
    {
      value: STATUS_LIST_LIVE.LIVE_END,
      name: `${t('C2002ListLiveStream.liveEnd')} (${statusLiveStream && statusLiveStream[2].total_schedule})`,
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
        <title>{t('tabTitle.ListLiveStream')}</title>
      </Helmet>

      <div className={styles.topContent}>
        <div className={styles.namePage}>{t('C2002ListLiveStream.title')}</div>

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

            {isLoadingListLive && <Skeleton.Button active className={styles.skeletonSelect} />}
            {!isLoadingListLive && (
              <SelectComponent
                items={STATUS_LIVE}
                dropdownClassName="sorting-product-dropdown-select"
                handleChangeValueSelect={handleFilterStatus}
                isLoading={isLoadingListLive}
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
        {isLoadingListLive ? (
          <Skeleton.Button active className={styles.skeletonLive} />
        ) : (
          <>
            {data?.length ? (
              <>
                <Row gutter={[30, 30]}>
                  {data?.map((item: IListLive) => (
                    <Col xs={12} lg={8} key={item.id}>
                      <CommonLiveStreamBox item={item} />
                    </Col>
                  ))}
                </Row>
                <div className={stylesTable.commonPagination}>
                  <strong>
                    {t('common.pagination', {
                      total: listLive?.schedules?.total,
                      page_from: listLive?.schedules?.from,
                      page_to: listLive?.schedules?.to,
                    })}
                  </strong>

                  <Pagination
                    onChange={handleChangePage}
                    total={listLive?.schedules?.total}
                    current={filter.page}
                    pageSize={filter.per_page}
                  />
                </div>
              </>
            ) : (
              <div className={styles.noData}>{t('common.noDataSearch')}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ListLiveStreams;
