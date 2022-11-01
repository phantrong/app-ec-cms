import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form, Row, Table, Pagination, message, Col, Input, Modal, FormInstance } from 'antd';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import { Helmet } from 'react-helmet-async';
import { RuleObject } from 'antd/lib/form';
import { AxiosError } from 'axios';
import { useIsFetching, useMutation, useQueryClient } from 'react-query';
import classNames from 'classnames';

import styles from './style.module.scss';
import {
  DEFAULT_PAGE_ANTD,
  CATEGORY_CANT_DELETE_ERROR_CODE,
  LOCATION_NAME_REGEX,
  NAME_CATEGORY_MAX_LENGTH,
  PAGE_PAGINATION_10,
  BRAND_DEFAULT_STATUS,
  TOKEN_CMS,
} from '../../constants/constants';
import CommonDatePicker from 'components/CommonDatePicker';
import { useGetCategoryDetail } from 'hooks/useListCategory';
import { apiAddBrand, apiDeleteBrand, apiUpdateBrand } from 'api/listCategory';
import { handleErrorMessage } from 'helper';
import { trimSpaceInput } from 'helper/index';
import { GET_CATEGORY_DETAIL } from 'constants/keyQuery';
import SearchInput from 'components/SearchInput';

import viewIcon from '../../assets/images/icons/icon-eye.svg';
import deleteIcon from '../../assets/images/icons/icon-delete.svg';
import addIcon from '../../assets/images/icons/icon-add-square.svg';
import closeIcon from '../../assets/images/icons/plus-circle.svg';
import backLeftIcon from '../../assets/images/icons/icon-back-left.svg';

const { confirm } = Modal;

const defaultFilter: IFilterListCategory = {
  start_date: null,
  end_date: null,
  name: '',
  page: DEFAULT_PAGE_ANTD,
  per_page: PAGE_PAGINATION_10,
};

const defaultDataAddBrandForm: IBrandFormData = {
  name: '',
  status: BRAND_DEFAULT_STATUS,
};

export default function ListBrand() {
  const { t } = useTranslation();
  const { state }: any = useLocation();
  const navigate = useNavigate();
  const isAuthenticated: boolean = !!Cookies.get(TOKEN_CMS);
  const queryClient = useQueryClient();
  const isFetching = useIsFetching({
    queryKey: GET_CATEGORY_DETAIL,
  });
  const { categoryId } = useParams();
  const [addBrandForm]: FormInstance<any>[] = Form.useForm();
  const [updateBrandForm]: FormInstance<any>[] = Form.useForm();
  const [updateBrandFormData, setUpdateBrandFormData] = useState<IBrandFormData>(defaultDataAddBrandForm);
  const [filter, setFilter] = useState<IFilterListCategory>(defaultFilter);
  const [idUpdateBrand, setIdUpdateBrand] = useState<number>(0);
  const [isModalErrorDeleteVisible, setIsModalErrorDeleteVisible] = useState<boolean>(false);
  const [isModalAddBrandVisible, setIsModalAddBrandVisible] = useState<boolean>(false);
  const [isModalUpdateBrandVisible, setIsModalUpdateBrandVisible] = useState<boolean>(false);
  const [isLoadingBtnSubmitAddBrand, setIsLoadingBtnSubmitAddBrand] = useState<boolean>(false);
  const [isLoadingBtnSubmitUpdateBrand, setIsLoadingBtnSubmitUpdateBrand] = useState<boolean>(false);
  const [errorMessageNameAdd, setErrorMessageNameAdd] = useState<string>('');
  const [errorMessageNameUpdate, setErrorMessageNameUpdate] = useState<string>('');
  const { data: dataListBrand, isLoading: isLoadingDataListBrand }: IResponseDataCategoryDetail = useGetCategoryDetail(
    isAuthenticated,
    Number(categoryId),
    filter
  );

  const { mutate: addBrand } = useMutation((data: IBrandFormData) => apiAddBrand(data), {
    onSuccess: (response: IBasicSucessResponse) => {
      if (response.success) {
        message.success(t('listBrand.modalAddBrand.success'));
        queryClient.refetchQueries(GET_CATEGORY_DETAIL);
        addBrandForm.resetFields();
      }
      setIsLoadingBtnSubmitAddBrand(false);
      setIsModalAddBrandVisible(false);
    },
    onError: (error) => {
      const errorMessage = error as AxiosError;
      if (errorMessage.response?.data?.data?.name?.Unique) {
        setErrorMessageNameAdd(t('listBrand.modalAddBrand.validate.nameUnique'));
      } else {
        handleErrorMessage(error);
      }
      setIsLoadingBtnSubmitAddBrand(false);
    },
  });

  const { mutate: updateBrand } = useMutation((data: IBrandFormData) => apiUpdateBrand(idUpdateBrand, data), {
    onSuccess: (response: IBasicSucessResponse) => {
      if (response.success) {
        message.success(t('listBrand.modalUpdateBrand.success'));
        queryClient.refetchQueries(GET_CATEGORY_DETAIL);
      }
      setIsLoadingBtnSubmitUpdateBrand(false);
      setIsModalUpdateBrandVisible(false);
    },
    onError: (error) => {
      const errorMessage = error as AxiosError;
      if (errorMessage.response?.data?.data?.name?.Unique) {
        setErrorMessageNameUpdate(t('listBrand.modalAddBrand.validate.nameUnique'));
      } else {
        handleErrorMessage(error);
      }
      setIsLoadingBtnSubmitUpdateBrand(false);
    },
  });

  const { mutate: deleteBrand } = useMutation((brandId: number) => apiDeleteBrand(brandId), {
    onSuccess: (response: IBasicSucessResponse) => {
      if (response.success) {
        message.success(t('listCategory.successDelete'));
        queryClient.refetchQueries(GET_CATEGORY_DETAIL);
      }
    },
    onError: (error) => {
      const errorMessage = error as AxiosError;
      if (
        errorMessage.response?.data?.errorCode &&
        errorMessage.response.data.errorCode[0] === CATEGORY_CANT_DELETE_ERROR_CODE
      ) {
        setIsModalErrorDeleteVisible(true);
      } else {
        handleErrorMessage(error);
      }
    },
  });

  const columns: IColumnTable[] = [
    {
      title: <strong>{t('listBrand.table.id')}</strong>,
      className: styles.indexColumn,
      render: (value: IBrandDetail, item: IBrandDetail, index: number) =>
        index + 1 + (filter.page - 1) * PAGE_PAGINATION_10,
    },
    {
      title: <strong>{t('listBrand.table.name')}</strong>,
      dataIndex: 'name',
      key: 'name',
      className: styles.nameColumn,
    },
    {
      title: <strong>{t('listBrand.table.createdDate')}</strong>,
      dataIndex: 'created_at',
      key: 'created_at',
      className: styles.createdDateColumn,
      render: (date: string) => {
        return <div>{dayjs(date).format('YYYY/MM/DD')}</div>;
      },
    },
    {
      title: <strong></strong>,
      className: styles.handleColumn,
      render: (brand: IBrandDetail) => {
        return (
          <div className={styles.handleCol}>
            <img height={24} width={24} src={viewIcon} alt="View" onClick={() => handleShowUpdateModal(brand)} />
            <img height={24} width={24} src={deleteIcon} alt="Delete" onClick={() => handleDeleteBrand(brand.id)} />
          </div>
        );
      },
    },
  ];

  const handleAddBrand = useCallback(
    (payload: IBrandFormData) => {
      setIsLoadingBtnSubmitAddBrand(true);
      const data: IBrandFormData = {
        name: payload.name,
        category_id: Number(categoryId),
        status: BRAND_DEFAULT_STATUS,
      };
      addBrand(data);
    },
    [addBrand, categoryId]
  );

  const handleUpdateBrand = useCallback(
    (payload: IBrandFormData) => {
      setIsLoadingBtnSubmitUpdateBrand(true);
      const data: IBrandFormData = {
        name: payload.name,
        category_id: Number(categoryId),
        status: BRAND_DEFAULT_STATUS,
      };
      updateBrand(data);
    },
    [updateBrand, categoryId]
  );

  const handleCancelModalAddBrand = useCallback(() => {
    setIsModalAddBrandVisible(false);
  }, []);

  const handleCancelModalUpdateBrand = useCallback(() => {
    setIsModalUpdateBrandVisible(false);
  }, []);

  const handleShowUpdateModal = useCallback((brand: IBrandDetail) => {
    if (brand) {
      setIdUpdateBrand(brand.id);
      setUpdateBrandFormData({
        name: brand.name,
        status: BRAND_DEFAULT_STATUS,
      });
      setIsModalUpdateBrandVisible(true);
    }
  }, []);

  const handleDeleteBrand = useCallback(
    (brandId: number) => {
      if (brandId) {
        confirm({
          title: <div>{t('listCategory.confirmDelete')}</div>,
          okText: t('common.confirm'),
          cancelText: t('common.cancel'),
          icon: <></>,
          className: 'modal-confirm-normal',
          centered: true,
          onOk() {
            deleteBrand(brandId);
          },
        });
      }
    },
    [deleteBrand, t]
  );

  const handleTrimSpaceInputAddForm = useCallback(
    (e: React.FocusEvent<HTMLInputElement, Element>) => {
      addBrandForm.setFieldsValue({
        [e.target.name]: trimSpaceInput(e.target.value),
      });
    },
    [addBrandForm]
  );

  const handleTrimSpaceInputUpdateForm = useCallback(
    (e: React.FocusEvent<HTMLInputElement, Element>) => {
      updateBrandForm.setFieldsValue({
        [e.target.name]: trimSpaceInput(e.target.value),
      });
    },
    [updateBrandForm]
  );

  const handleChangeKeyword = useCallback(
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
          start_date: value,
          page: DEFAULT_PAGE_ANTD,
        });
      } else {
        message.error(t('listCategory.errorSelectDate'));
      }
    },
    [filter, t]
  );

  const handleChangeDateEnd = useCallback(
    (value: string) => {
      if ((filter.start_date && dayjs(value) >= dayjs(filter.start_date)) || !filter.start_date || !value) {
        setFilter({
          ...filter,
          end_date: value,
          page: DEFAULT_PAGE_ANTD,
        });
      } else {
        message.error(t('listCategory.errorSelectDate'));
      }
    },
    [filter, t]
  );

  const handleChangePage = useCallback(
    (page: number) => {
      setFilter({ ...filter, page });
    },
    [filter]
  );

  const handleBackCategory = () => navigate('/categories', { state });

  useEffect(() => {
    addBrandForm.resetFields();
  }, [addBrandForm]);

  useEffect(() => {
    updateBrandForm.resetFields();
  }, [updateBrandForm, updateBrandFormData]);

  return (
    <div className={styles.listBrand}>
      <Helmet>
        <title>{t('tabTitle.listBrand')}</title>
      </Helmet>
      <Row justify="space-between" align="bottom" className={styles.title}>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <h2>
            <img src={backLeftIcon} alt="back" width={38} height={24} onClick={handleBackCategory} />
            &nbsp;
            {state.nameCategory}
          </h2>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12} className={styles.colButton}>
          <Col xs={24} sm={24} md={8} lg={8} xl={8} className={styles.colBtn}>
            <Button type="primary" className={styles.btnAddCategory} onClick={() => setIsModalAddBrandVisible(true)}>
              <img height={24} width={24} src={addIcon} alt="add" /> {t('listBrand.btnAdd')}
            </Button>
          </Col>
        </Col>
      </Row>
      <Modal className={styles.modalOk} visible={isModalErrorDeleteVisible} footer={null} closable={false} centered>
        <strong>{t('listCategory.modalErrorDelete.content1')}</strong>
        <strong>{t('listCategory.modalErrorDelete.content2')}</strong>
        <Button block type="primary" htmlType="button" onClick={() => setIsModalErrorDeleteVisible(false)}>
          {t('common.confirm')}
        </Button>
      </Modal>
      <Modal className={styles.modalAdd} visible={isModalAddBrandVisible} footer={null} closable={false} centered>
        <div className={styles.title}>
          <strong>{t('listBrand.modalAddBrand.title')}</strong>
          <img src={closeIcon} alt="close" height={30} width={30} onClick={handleCancelModalAddBrand} />
        </div>
        <Form
          className={styles.addCategoryForm}
          form={addBrandForm}
          initialValues={defaultDataAddBrandForm}
          onFinish={handleAddBrand}
          scrollToFirstError={true}
        >
          <Col span={24} className={styles.contentForm}>
            <Col
              span={24}
              className={classNames({
                [styles.colForm]: true,
                [styles.colFormError]: errorMessageNameAdd,
              })}
            >
              <Form.Item
                labelCol={{ span: 24 }}
                className={styles.inputForm}
                colon={false}
                label={t('listBrand.modalAddBrand.name')}
                name="name"
                rules={[
                  { required: true, message: t('listBrand.modalAddBrand.validate.nameRequired') },
                  {
                    max: NAME_CATEGORY_MAX_LENGTH,
                    message: t('listBrand.modalAddBrand.validate.nameLen'),
                  },
                  () => ({
                    validator(_: RuleObject, value: string) {
                      if (value && value.length <= NAME_CATEGORY_MAX_LENGTH && !value.match(LOCATION_NAME_REGEX)) {
                        return Promise.reject(new Error(t('listBrand.modalAddBrand.validate.nameRegex')));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input
                  placeholder={t('listBrand.modalAddBrand.name')}
                  className={styles.input}
                  name="name"
                  onBlur={handleTrimSpaceInputAddForm}
                  onChange={() => setErrorMessageNameAdd('')}
                />
              </Form.Item>
              <span className={styles.messageError}>{errorMessageNameAdd}</span>
            </Col>
          </Col>
          <Row className={styles.rowButton}>
            <Col span={24}>
              <Form.Item labelCol={{ span: 24 }}>
                <Button htmlType="submit" type="primary" loading={isLoadingBtnSubmitAddBrand}>
                  {t('listBrand.modalAddBrand.btnSubmit')}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Modal className={styles.modalAdd} visible={isModalUpdateBrandVisible} footer={null} closable={false} centered>
        <div className={styles.title}>
          <strong>{t('listBrand.modalUpdateBrand.title')}</strong>
          <img src={closeIcon} alt="close" height={30} width={30} onClick={handleCancelModalUpdateBrand} />
        </div>
        <Form
          className={styles.addCategoryForm}
          form={updateBrandForm}
          initialValues={updateBrandFormData}
          onFinish={handleUpdateBrand}
          scrollToFirstError={true}
        >
          <Col span={24} className={styles.contentForm}>
            <Col
              span={24}
              className={classNames({
                [styles.colForm]: true,
                [styles.colFormError]: errorMessageNameUpdate,
              })}
            >
              <Form.Item
                labelCol={{ span: 24 }}
                className={styles.inputForm}
                colon={false}
                label={t('listBrand.modalAddBrand.name')}
                name="name"
                rules={[
                  { required: true, message: t('listBrand.modalAddBrand.validate.nameRequired') },
                  {
                    max: NAME_CATEGORY_MAX_LENGTH,
                    message: t('listBrand.modalAddBrand.validate.nameLen'),
                  },
                  () => ({
                    validator(_: RuleObject, value: string) {
                      if (value && value.length <= NAME_CATEGORY_MAX_LENGTH && !value.match(LOCATION_NAME_REGEX)) {
                        return Promise.reject(new Error(t('listBrand.modalAddBrand.validate.nameRegex')));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input
                  placeholder={t('listBrand.modalAddBrand.name')}
                  className={styles.input}
                  name="name"
                  onBlur={handleTrimSpaceInputUpdateForm}
                  onChange={() => setErrorMessageNameUpdate('')}
                />
              </Form.Item>
              <span className={styles.messageError}>{errorMessageNameUpdate}</span>
            </Col>
          </Col>
          <Row className={styles.rowButton}>
            <Col span={24}>
              <Form.Item labelCol={{ span: 24 }}>
                <Button htmlType="submit" type="primary" loading={isLoadingBtnSubmitUpdateBrand}>
                  {t('listBrand.modalUpdateBrand.btnSubmit')}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Row justify="space-between" align="bottom" className={styles.filter}>
        <Col xs={0} sm={0} md={0} lg={12} xl={12}></Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} className={styles.colFilter}>
          <div className={styles.formFillter}>
            <Col xs={24} sm={24} md={8} lg={8} xl={8} className={styles.colFilterStatus}>
              <div className={styles.titleInput}>{t('listCategory.fillter.nameSearch')}</div>
              <SearchInput
                onSearch={handleChangeKeyword}
                isShowClear
                placeholder={t('listCategory.fillter.nameSearch')}
              />
            </Col>
            <Col xs={24} sm={24} md={16} lg={16} xl={16} className={styles.colFilterDate}>
              <div className={styles.dateStart}>
                <div className={styles.titleInput}>{t('listCategory.fillter.dateStart')}</div>
                <CommonDatePicker
                  valueDate={filter.start_date}
                  formatDate="YYYY/MM/DD"
                  handleChange={handleChangeDateStart}
                  className={styles.birthDay}
                />
              </div>
              <p className={styles.middleDate}>~</p>
              <div className={styles.dateEnd}>
                <div className={styles.titleInput}>{t('listCategory.fillter.dateEnd')}</div>
                <CommonDatePicker
                  valueDate={filter.end_date}
                  formatDate="YYYY/MM/DD"
                  handleChange={handleChangeDateEnd}
                  className={styles.birthDay}
                />
              </div>
            </Col>
          </div>
        </Col>
      </Row>

      <Table
        className={styles.table}
        bordered={false}
        dataSource={dataListBrand?.brands.data}
        columns={columns}
        pagination={false}
        loading={isLoadingDataListBrand || !!isFetching}
        rowClassName={(record, index) => (index % 2 ? '' : 'hasBackground')}
        locale={{ emptyText: t('listCategory.noData') }}
      />

      {!isLoadingDataListBrand && !isFetching && (
        <Col span={24} className={styles.colPagination}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} className={styles.textPagination}>
            <strong>
              {t('listCategory.pagination', {
                total: dataListBrand?.brands.total || 0,
                page_from:
                  dataListBrand?.brands.total || 0 ? DEFAULT_PAGE_ANTD + (filter.page - 1) * PAGE_PAGINATION_10 : 0,
                page_to: Math.min(filter.page * PAGE_PAGINATION_10, dataListBrand?.brands.total || 0),
              })}
            </strong>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} className={styles.pagination}>
            <Pagination
              onChange={handleChangePage}
              total={dataListBrand?.brands.total || 0}
              current={filter.page}
              pageSize={filter.per_page}
            />
          </Col>
        </Col>
      )}
    </div>
  );
}
