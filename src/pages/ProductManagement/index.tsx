import React, { useState, useCallback, useEffect } from 'react';
import { Row, Col, Typography, Table, Pagination, Form, FormInstance, message, Modal, Skeleton } from 'antd';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Helmet } from 'react-helmet-async';
import { useMutation, useQueryClient } from 'react-query';

import { STATUS_PRODUCT, PAGE_PAGINATION_10, DEFAULT_PAGE_ANTD, TYPE_BTN } from 'constants/constants';
import { useListProduct } from 'hooks/useListProduct';
import InputNumber from 'components/InputNumber';
import SearchInput from 'components/SearchInput';
import SelectComponent from 'components/SelectComponent';
import { formatCurrencyNumber } from 'helper';
import CommonBtn from 'components/CommonBtn';
import CommonModalForm from 'components/CommonModalForm';
import ModalMarkViolation from './ModalMarkViolation';
import { GET_LIST_PRODUCT } from 'constants/keyQuery';
import { apiMarkViolation, apiUnMarkViolation } from 'api/listProduct';

import stylesTable from 'styles/table.module.scss';
import styles from './styles.module.scss';
import iconHandleView from 'assets/images/handle-view.svg';
import configs from 'config';

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
  const query = useQueryClient();
  const { confirm } = Modal;
  const [form]: FormInstance<any>[] = Form.useForm();
  const [filter, setFilter] = useState<IFilterListProduct>(defaultFilter);
  const [priceMinMax, setFilterMinMax] = useState<IPrice>(initialPrice);
  const [errorPrice, setErrorPrice] = useState<string | null>();
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [idRedirect, setIdRedirect] = useState<number | undefined>();

  // Data
  const { data: listProduct, isLoading: isLoadingListProduct }: IDataListProduct = useListProduct(filter);

  // Update staff
  const { mutate: markViolation, isLoading: isLoadingMarkViolation } = useMutation(
    (dataSend: IMarkViolation) => apiMarkViolation(dataSend),
    {
      onSuccess: () => {
        message.success(t('listProduct.sentMsgToSeller'));
        query.refetchQueries(GET_LIST_PRODUCT);
        handleCancel();
      },
    }
  );

  const { mutate: unMarkViolation, isLoading: isLoadingUnMarkViolation } = useMutation(
    () => apiUnMarkViolation(selectedId),
    {
      onSuccess: () => {
        message.success(t('listProduct.cancelMark'));
        query.refetchQueries(GET_LIST_PRODUCT);
      },
    }
  );

  useEffect(() => {
    if (isShowModal === false) setSelectedId(undefined);
  }, [isShowModal]);

  const totalOptions: number | undefined = listProduct?.status_filter
    ?.map((item: { status: number; quantity: number }) => item.quantity)
    ?.reduce((prev: number, next: number) => prev + next, 0);

  // Sorting status
  const SORTING_STATUS_OPTIONS: ISelect[] = [
    {
      value: null,
      name: `${t('common.all')} (${totalOptions})`,
    },
    {
      value: STATUS_PRODUCT.IN_STOCK,
      name: `${t('listProduct.status.inventory')} (${listProduct?.status_filter[0].quantity})`,
    },
    {
      value: STATUS_PRODUCT.SOLD_OUT,
      name: `${t('listProduct.status.soldOut')} (${listProduct?.status_filter[2].quantity})`,
    },
    {
      value: STATUS_PRODUCT.NO_PRODUCT,
      name: `${t('listProduct.status.noProduct')} (${listProduct?.status_filter[1].quantity})`,
    },
    {
      value: STATUS_PRODUCT.VIOLATION,
      name: `${t('listProduct.status.violation')} (${listProduct?.status_filter[3].quantity})`,
    },
  ];

  const getStyleBtnStatus = useCallback((status: number, stock: number) => {
    if (status === STATUS_PRODUCT.PUBLIC_OR_PRIVATE && stock > 0) {
      return styles.inventory;
    }
    if (status === STATUS_PRODUCT.NO_PRODUCT) {
      return styles.hiddenProduct;
    }
    if (status === STATUS_PRODUCT.PUBLIC_OR_PRIVATE && stock === 0) {
      return styles.soldOut;
    }
    if (status === STATUS_PRODUCT.VIOLATION) {
      return styles.violation;
    }
  }, []);

  const getTextBtnStatus = useCallback(
    (status: number, stock: number) => {
      if (status === STATUS_PRODUCT.PUBLIC_OR_PRIVATE && stock > 0) {
        return t('listProduct.status.inventory');
      }
      if (status === STATUS_PRODUCT.NO_PRODUCT) {
        return t('listProduct.status.noProduct');
      }
      if (status === STATUS_PRODUCT.PUBLIC_OR_PRIVATE && stock === 0) {
        return t('listProduct.status.soldOut');
      }
      if (status === STATUS_PRODUCT.VIOLATION) {
        return t('listProduct.status.violation');
      }
    },
    [t]
  );

  // Delete violation modal
  const handleOpenModalDeleteViolation = useCallback(
    (id?: number) => {
      confirm({
        title: <div>{t('listProduct.doYouWannaDeleteViolation')}</div>,
        okText: t('common.delete'),
        cancelText: t('common.cancel'),
        icon: <></>,
        className: 'modal-confirm-normal',
        okButtonProps: {
          loading: isLoadingUnMarkViolation,
        },
        centered: true,
        onOk() {
          unMarkViolation();
        },
        onCancel() {
          setSelectedId(undefined);
        },
      });
    },
    [confirm, isLoadingUnMarkViolation, t, unMarkViolation]
  );

  // Delete violation modal
  const handleOpenModalNotShowDetail = useCallback(() => {
    confirm({
      title: (
        <>
          <div>{t('listProduct.lineNotShow1')}</div>
          <div>{t('listProduct.lineNotShow2')}</div>
        </>
      ),
      okText: t('common.confirm'),
      icon: <></>,
      cancelButtonProps: { style: { display: 'none' } },
      className: 'modal-confirm-normal',
      centered: true,
    });
  }, [confirm, t]);

  const columns = [
    {
      title: t('listProduct.table.index'),
      dataIndex: 'index',
      key: 'index',
      render: (value: IBasicInformationProduct, item: IBasicInformationProduct, index: number) => (
        <div
          className={classNames({
            [styles.multiColumn]: item.product_classes.length > 1,
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
            [styles.multiColumn]: item.product_classes.length > 1,
            [styles.multiColumnPhoto]: item.product_classes.length > 1,
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
            [styles.multiColumn]: item.product_classes.length > 1,
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
          {item.product_classes.map((product_class: IProductClasses, index_product_class: number) => (
            <div key={index_product_class} className={styles.itemMultiRows}>
              {product_class?.product_type_configs?.length ? (
                <>
                  {product_class.product_type_configs.map((type_config: IProductType, index_type: number) => (
                    <span
                      className={classNames({
                        [styles.configType]: product_class.product_type_configs.length >= 2,
                      })}
                      key={index_type}
                    >
                      {type_config.type_name}
                    </span>
                  ))}
                </>
              ) : (
                <span>{t('listProduct.table.noTypeConfig')}</span>
              )}
            </div>
          ))}
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
          {item.product_classes.map((product_class: IProductClasses, index_product_class: number) => (
            <div key={index_product_class} className={styles.itemMultiRows}>
              ¥{formatCurrencyNumber(product_class.discount)}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: t('listProduct.table.quantityInventory'),
      render: (value: IBasicInformationProduct, item: IBasicInformationProduct, index: number) => (
        <div key={index} className={styles.multiRows}>
          {item.product_classes.map((product_class: IProductClasses, index_product_class: number) => (
            <div key={index_product_class} className={styles.itemMultiRows}>
              {product_class?.total_product
                ? `${product_class.total_product}/${product_class.stock}`
                : `0/${product_class.stock}`}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: t('listProduct.table.salesNoCouponApplied'),
      render: (value: IBasicInformationProduct, item: IBasicInformationProduct, index: number) => (
        <div key={index} className={styles.multiRows}>
          {item.product_classes.map((product_class: IProductClasses, index_product_class: number) => (
            <div key={index_product_class} className={styles.itemMultiRows}>
              ¥{formatCurrencyNumber(product_class.revenue)}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      render: (value: IBasicInformationProduct, item: IBasicInformationProduct, index: number) => (
        <div
          className={classNames({
            [styles.multiColumn]: item.product_classes.length > 1,
          })}
        >
          <div className={getStyleBtnStatus(item.status, item.stock)}>{getTextBtnStatus(item.status, item.stock)}</div>
        </div>
      ),
    },
    {
      render: (value: IBasicInformationProduct) => (
        <div
          className={classNames(styles.actionRow, stylesTable.icon, {
            [styles.multiColumnIcon]: value.product_classes.length > 1,
          })}
        >
          {getTextBtnStatus(value.status, value.stock) === t('listProduct.status.violation') ? (
            <div>
              <CommonBtn
                handleClick={() => {
                  setSelectedId(value.id);
                  handleOpenModalDeleteViolation(value.id);
                }}
                text={t('listProduct.removeViolation')}
                type={TYPE_BTN.TYPE_ADD_TO_CART}
              />
            </div>
          ) : (
            <div>
              <CommonBtn
                handleClick={() => {
                  setSelectedId(value.id);
                  setIsShowModal(true);
                }}
                text={t('listProduct.status.violation')}
                type={TYPE_BTN.TYPE_BUY}
              />
            </div>
          )}

          <img
            src={iconHandleView}
            alt="eye"
            onClick={() => {
              if (getTextBtnStatus(value.status, value.stock) === t('listProduct.status.violation')) {
                return handleOpenModalNotShowDetail();
              }
              setIdRedirect(value.id);
            }}
          />
        </div>
      ),
      className: styles.rowIcon,
    },
  ];

  useEffect(() => {
    if (idRedirect) window.open(`${configs.USER_DOMAIN}/products/${idRedirect}`, '_blank');
  }, [idRedirect]);

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

  const handleFinish = useCallback(
    (values: { violation_reason: string }) => {
      markViolation({
        id: selectedId,
        violation_reason: values.violation_reason,
        is_mark_violation: true,
      });
    },
    [markViolation, selectedId]
  );

  // Handle action
  const handleCancel = useCallback(() => {
    setIsShowModal(false);
    form.resetFields();
  }, [form]);

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
          <div className={styles.selectWrapper}>
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
          </div>

          {/* Price */}
          <div className={styles.price}>
            <div className={styles.priceTitle}>{t('listProduct.searchProduct.price')}</div>
            <div className={styles.priceGroup}>
              <div className={styles.priceInput}>
                <InputNumber
                  setValue={handlePriceMin}
                  textUnit={'¥'}
                  placeholder={t('listProduct.searchProduct.lowestPrice')}
                  onSearch={handleSearchByPrice}
                />
              </div>
              <div className={styles.space}>~</div>
              <div className={styles.priceInput}>
                <InputNumber
                  setValue={handlePriceMax}
                  textUnit={'¥'}
                  placeholder={t('listProduct.searchProduct.highestPrice')}
                  onSearch={handleSearchByPrice}
                />
              </div>
            </div>

            <p className={styles.errorPrice}>{errorPrice}</p>
          </div>
        </Row>

        <CommonModalForm
          isModalVisible={isShowModal}
          title={t('listProduct.report')}
          mainContent={
            <ModalMarkViolation handleFinish={handleFinish} form={form} isLoading={isLoadingMarkViolation} />
          }
          hasNoFooter
          handleCancel={handleCancel}
        />

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
