import React, { useState, useCallback } from 'react';
import { Row, Col, Typography, Table, Pagination, Skeleton } from 'antd';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Helmet } from 'react-helmet-async';

import { PAGE_PAGINATION_10, DEFAULT_PAGE_ANTD } from 'constants/constants';
import { useListProduct } from 'hooks/useListProduct';
import InputNumber from 'components/InputNumber';
import SearchInput from 'components/SearchInput';
import SelectComponent from 'components/SelectComponent';

import stylesTable from 'styles/table.module.scss';
import styles from './styles.module.scss';
import { formatCurrencyNumberToFixed } from 'helper';

const { Text } = Typography;

const defaultFilter: IFilterListProduct = {
  name: null,
  price_max: null,
  price_min: null,
  page: DEFAULT_PAGE_ANTD,
  per_page: PAGE_PAGINATION_10,
};

const initialPrice: IPrice = {
  price_max: null,
  price_min: null,
  page: DEFAULT_PAGE_ANTD,
};

const ProductManagement = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<IFilterListProduct>(defaultFilter);
  const [priceMinMax, setFilterMinMax] = useState<IPrice>(initialPrice);
  const [errorPrice, setErrorPrice] = useState<string | null>();

  // Data
  const { data: listProduct, isLoading: isLoadingListProduct }: IDataListProduct = useListProduct(filter);

  const totalOptions: number | undefined = listProduct?.status_filter
    ?.map((item: { status: number; quantity: number }) => item.quantity)
    ?.reduce((prev: number, next: number) => prev + next, 0);

  // Sorting status
  const SORTING_STATUS_OPTIONS: ISelect[] = [
    {
      value: null,
      name: `${t('common.all')} (${totalOptions})`,
    },
  ];

  const columns = [
    {
      title: t('listProduct.table.index'),
      dataIndex: 'index',
      key: 'index',
      render: (value: IBasicInformationProduct, item: IBasicInformationProduct, index: number) => (
        <div
          className={classNames({
            [styles.multiColumn]: false,
          })}
        >
          {listProduct && listProduct.products.from + index}
        </div>
      ),
    },
    {
      title: t('listProduct.table.photo'),
      render: (value: IBasicInformationProduct, item: IBasicInformationProduct, index: number) => (
        <div
          className={classNames({
            [styles.multiColumn]: false,
            [styles.multiColumnPhoto]: false,
          })}
        >
          <img className={styles.photoProduct} src={item.product_medias[0].media_path} alt="product" />
        </div>
      ),
    },
    {
      title: t('listProduct.table.productName'),
      dataIndex: 'name',
      key: 'name',
      render: (value: IBasicInformationProduct, item: IBasicInformationProduct, index: number) => (
        <div
          className={classNames({
            [styles.multiColumn]: false,
            [styles.longContent]: true,
          })}
        >
          {item.name}
        </div>
      ),
    },
    {
      title: t('listProduct.table.productDetail'),
      render: (value: IBasicInformationProduct, item: IBasicInformationProduct, index: number) => (
        <div key={index} className={styles.multiRows}>
          {item?.description}
        </div>
      ),
    },
    {
      title: t('listProduct.table.storeName'),
      render: (value: IBasicInformationProduct, item: IBasicInformationProduct, index: number) => (
        <div className={styles.longContent}>{value?.store?.name}</div>
      ),
    },
    {
      title: t('listProduct.table.unitPrice'),
      render: (value: IBasicInformationProduct, item: IBasicInformationProduct, index: number) => (
        <div key={index} className={styles.multiRows}>
          {formatCurrencyNumberToFixed(item?.price)} VNĐ
        </div>
      ),
    },
  ];

  // Pagination
  const handleChangePage = useCallback(
    (page: number) => {
      setFilter({ ...filter, page });
    },
    [filter]
  );

  // Filter
  // Filter by keyword
  const handleSearchByPrice = useCallback(() => {
    // Exist both price min and max
    if (priceMinMax?.price_min && priceMinMax?.price_max) {
      if (priceMinMax.price_min > priceMinMax.price_max) {
        setErrorPrice(t('validate.enterValidPrice'));
      } else {
        setErrorPrice(null);
        setFilter({
          ...filter,
          price_min: priceMinMax?.price_min,
          price_max: priceMinMax?.price_max,
          page: DEFAULT_PAGE_ANTD,
        });
      }
    }

    // Exist only price min
    if (priceMinMax.price_min && !priceMinMax.price_max) {
      setFilter({
        ...filter,
        price_min: priceMinMax?.price_min,
        price_max: null,
        page: DEFAULT_PAGE_ANTD,
      });
    }
    // Exist only price max
    if (priceMinMax.price_max && !priceMinMax.price_min) {
      setFilter({
        ...filter,
        price_max: priceMinMax?.price_max,
        price_min: null,
        page: DEFAULT_PAGE_ANTD,
      });
    }
  }, [filter, priceMinMax, t]);

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

  // Filter by status
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

  // Filter by price_min
  const handlePriceMin = useCallback(
    (value: number) => {
      setFilterMinMax({
        ...priceMinMax,
        price_min: value,
        page: DEFAULT_PAGE_ANTD,
      });
    },
    [priceMinMax]
  );

  // Filter by price_max
  const handlePriceMax = useCallback(
    (value: number) => {
      setFilterMinMax({
        ...priceMinMax,
        price_max: value,
        page: DEFAULT_PAGE_ANTD,
      });
    },
    [priceMinMax]
  );

  return (
    <Row className={styles.row}>
      <Helmet>
        <title>{t('tabTitle.listProduct')}</title>
      </Helmet>

      <Col span={24}>
        <Row className={styles.rowHeader}>
          <Col className={styles.title}>
            <Text strong>{t('listProduct.title')}</Text>
          </Col>
        </Row>
      </Col>

      <Col span={24}>
        {/* Filter */}
        <Row className={styles.rowBody}>
          {/* Search key_word */}
          <div className={styles.searchInputWrapper}>
            <div className={styles.nameTitle}>{t('common.search')}</div>
            <SearchInput isShowClear placeholder={t('common.search')} onSearch={handleFilterSearch} />
          </div>

          {/* Status */}
          {/* <div className={styles.selectWrapper}>
            <div className={styles.selectTitle}>{t('common.status')}</div>

            {isLoadingListProduct ? (
              <Skeleton.Button active className={styles.skeletonSelect} />
            ) : (
              <SelectComponent
                items={SORTING_STATUS_OPTIONS}
                dropdownClassName="sorting-product-dropdown-select"
                handleChangeValueSelect={handleFilterStatus}
                defaultValue={filter.status || null}
              />
            )}
          </div> */}

          {/* Price */}
          <div className={styles.price}>
            <div className={styles.priceTitle}>{t('listProduct.searchProduct.price')}</div>
            <div className={styles.priceGroup}>
              <div className={styles.priceInput}>
                <InputNumber
                  setValue={handlePriceMin}
                  textUnit={'VNĐ'}
                  placeholder={t('listProduct.searchProduct.lowestPrice')}
                  onSearch={handleSearchByPrice}
                />
              </div>
              <div className={styles.space}>~</div>
              <div className={styles.priceInput}>
                <InputNumber
                  setValue={handlePriceMax}
                  textUnit={'VNĐ'}
                  placeholder={t('listProduct.searchProduct.highestPrice')}
                  onSearch={handleSearchByPrice}
                />
              </div>
            </div>

            <p className={styles.errorPrice}>{errorPrice}</p>
          </div>
        </Row>

        {/* Row table */}
        <div className={styles.table}>
          <div className={stylesTable.commonTable}>
            <Table
              columns={columns}
              dataSource={listProduct?.products?.data}
              loading={isLoadingListProduct}
              pagination={false}
              rowKey="id"
              locale={{ emptyText: t('common.noDataSearch') }}
              scroll={{ x: listProduct && listProduct?.products?.total > 0 ? true : undefined }}
            />

            <div className={stylesTable.commonPagination}>
              <strong>
                {t('common.pagination', {
                  total: listProduct?.products?.total,
                  page_from: listProduct?.products?.from,
                  page_to: listProduct?.products?.to,
                })}
              </strong>

              <Pagination
                onChange={handleChangePage}
                total={listProduct?.products?.total}
                current={filter.page}
                pageSize={filter.per_page}
              />
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default ProductManagement;
