import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form, Row, Table, Pagination, message, Col, Input, Modal, FormInstance, Upload } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import { Helmet } from 'react-helmet-async';
import { UploadChangeParam } from 'antd/lib/upload';
import { RuleObject } from 'antd/lib/form';
import { AxiosError } from 'axios';
import { useIsFetching, useMutation, useQueryClient } from 'react-query';
import classNames from 'classnames';

import styles from './style.module.scss';
import {
  ACCEPT_UPLOAD_CATEGORY_IMAGE_TYPE,
  DEFAULT_PAGE_ANTD,
  CATEGORY_CANT_DELETE_ERROR_CODE,
  LOCATION_NAME_REGEX,
  NAME_CATEGORY_MAX_LENGTH,
  IMAGE_CATEGORY_MAX_SIZE_MB,
  PAGE_PAGINATION_10,
  CATEGORY_DEFAULT_STATUS,
  TOKEN_CMS,
  CATEGORY_IMAGE_TYPE,
} from '../../constants/constants';
import CommonDatePicker from 'components/CommonDatePicker';
import { useGetListCategory } from 'hooks/useListCategory';
import CommonURLImage from 'components/CommonURLImage';
import { apiAddCategory, apiDeleteCategory, apiUpdateCategory } from 'api/listCategory';
import { compressionHeicImageFile, handleErrorMessage } from 'helper';
import { trimSpaceInput, validateSizeImg, validateTypeImg } from 'helper/index';
import { GET_LIST_CATEGORY } from 'constants/keyQuery';

import viewIcon from '../../assets/images/icons/icon-eye.svg';
import deleteIcon from '../../assets/images/icons/icon-delete.svg';
import addIcon from '../../assets/images/icons/icon-add-square.svg';
import fileIcon from '../../assets/images/icons/icon-file-text.svg';
import closeIcon from '../../assets/images/icons/plus-circle.svg';
import SearchInput from 'components/SearchInput';
import SpinLoading from 'components/SpinLoading';

const { confirm } = Modal;

const defaultFilter: IFilterListCategory = {
  start_date: null,
  end_date: null,
  name: '',
  page: DEFAULT_PAGE_ANTD,
  per_page: PAGE_PAGINATION_10,
};

const defaultDataAddCategoryForm: IDataCategoryForm = {
  name: '',
  image: '',
  status: CATEGORY_DEFAULT_STATUS,
};

export default function ListCategory() {
  const { t } = useTranslation();
  const { state }: any = useLocation();
  const isAuthenticated: boolean = !!Cookies.get(TOKEN_CMS);
  const queryClient = useQueryClient();
  const isFetching = useIsFetching({
    queryKey: GET_LIST_CATEGORY,
  });
  const [addCategoryForm]: FormInstance<any>[] = Form.useForm();
  const [updateCategoryForm]: FormInstance<any>[] = Form.useForm();
  const [updateCategoryFormData, setUpdateCategoryFormData] = useState<IDataCategoryForm>(defaultDataAddCategoryForm);
  const [filter, setFilter] = useState<IFilterListCategory>((state && state.filter) || defaultFilter);
  const [idUpdateCategory, setIdUpdateCategory] = useState<number>(0);
  const [isModalErrorDeleteVisible, setIsModalErrorDeleteVisible] = useState<boolean>(false);
  const [isModalAddCategoryVisible, setIsModalAddCategoryVisible] = useState<boolean>(false);
  const [isModalUpdateCategoryVisible, setIsModalUpdateCategoryVisible] = useState<boolean>(false);
  const [isLoadingBtnSubmitAddCategory, setIsLoadingBtnSubmitAddCategory] = useState<boolean>(false);
  const [isLoadingBtnSubmitUpdateCategory, setIsLoadingBtnSubmitUpdateCategory] = useState<boolean>(false);
  const [addCategoryImageURL, setAddCategoryImageURL] = useState<string>('');
  const [addCategoryImageFile, setAddCategoryImageFile] = useState<string | Blob>();
  const [isLoadingAddCategoryImage, setIsLoadingAddCategoryImage] = useState<boolean>(false);
  const [updateCategoryImageURL, setUpdateCategoryImageURL] = useState<string>('');
  const [updateCategoryImageFile, setUpdateCategoryImageFile] = useState<string | Blob>();
  const [isLoadingUpdateCategoryImage, setIsLoadingUpdateCategoryImage] = useState<boolean>(false);
  const [errorMessageNameAdd, setErrorMessageNameAdd] = useState<string>('');
  const [errorMessageNameUpdate, setErrorMessageNameUpdate] = useState<string>('');
  const { data: dataListCategory, isLoading: isLoadingDataListCategory }: IResponseDataListCategory =
    useGetListCategory(isAuthenticated, filter);

  const { mutate: addCategory } = useMutation((params: FormData) => apiAddCategory(params), {
    onSuccess: (response: IBasicSucessResponse) => {
      if (response.success) {
        message.success(t('listCategory.modalAddCategory.success'));
        queryClient.refetchQueries(GET_LIST_CATEGORY);
        setAddCategoryImageURL('');
        setAddCategoryImageFile('');
        addCategoryForm.resetFields();
      }
      setIsLoadingBtnSubmitAddCategory(false);
      setIsModalAddCategoryVisible(false);
    },
    onError: (error) => {
      const errorMessage = error as AxiosError;
      if (errorMessage.response?.data?.data?.name?.Unique) {
        setErrorMessageNameAdd(t('listCategory.modalAddCategory.validate.nameUnique'));
      } else {
        handleErrorMessage(error);
      }
      setIsLoadingBtnSubmitAddCategory(false);
    },
  });

  const { mutate: updateCategory } = useMutation((params: FormData) => apiUpdateCategory(idUpdateCategory, params), {
    onSuccess: (response: IBasicSucessResponse) => {
      if (response.success) {
        message.success(t('listCategory.modalUpdateCategory.success'));
        queryClient.refetchQueries(GET_LIST_CATEGORY);
        setUpdateCategoryImageURL('');
        setUpdateCategoryImageFile('');
      }
      setIsLoadingBtnSubmitUpdateCategory(false);
      setIsModalUpdateCategoryVisible(false);
    },
    onError: (error) => {
      const errorMessage = error as AxiosError;
      if (errorMessage.response?.data?.data?.name?.Unique) {
        setErrorMessageNameUpdate(t('listCategory.modalAddCategory.validate.nameUnique'));
      } else {
        handleErrorMessage(error);
      }
      setIsLoadingBtnSubmitUpdateCategory(false);
    },
  });

  const { mutate: deleteCategory } = useMutation((categoryId: number) => apiDeleteCategory(categoryId), {
    onSuccess: (response: IBasicSucessResponse) => {
      if (response.success) {
        message.success(t('listCategory.successDelete'));
        queryClient.refetchQueries(GET_LIST_CATEGORY);
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
      title: <strong>{t('listCategory.table.id')}</strong>,
      className: styles.indexColumn,
      render: (value: ICategoryDetail, item: ICategoryDetail, index: number) =>
        index + 1 + (filter.page - 1) * PAGE_PAGINATION_10,
    },
    {
      title: <strong>{t('listCategory.table.image')}</strong>,
      dataIndex: 'image_path',
      key: 'image_path',
      className: styles.imageColumn,
      render: (image: string) => {
        return <CommonURLImage src={image} alt="category" />;
      },
    },
    {
      title: <strong>{t('listCategory.table.name')}</strong>,
      className: styles.nameColumn,
      render: (category: ICategoryDetail) => {
        return (
          <div className={styles.nameCategory} onClick={() => handleShowUpdateModal(category)}>
            {category.name}
          </div>
        );
      },
    },
    {
      title: <strong>{t('listCategory.table.createdDate')}</strong>,
      dataIndex: 'created_at',
      key: 'created_at',
      className: styles.createdDateColumn,
      render: (date: string) => {
        return <div>{dayjs(date).format('YYYY/MM/DD')}</div>;
      },
    },
    {
      title: <strong>{t('listCategory.table.totalBrand')}</strong>,
      dataIndex: 'brands_count',
      key: 'brands_count',
      className: styles.totalBrandColumn,
    },
    {
      title: <strong></strong>,
      className: styles.handleColumn,
      render: (category: ICategoryDetail) => {
        return (
          <div className={styles.handleCol}>
            <Link to={'/categories/' + category.id} state={{ filter, nameCategory: category.name }}>
              <img height={24} width={24} src={viewIcon} alt="View" />
            </Link>
            <img
              height={24}
              width={24}
              src={deleteIcon}
              alt="Delete"
              onClick={() => handleDeleteCategory(category.id)}
            />
          </div>
        );
      },
    },
  ];

  const handleAddCategory = useCallback(
    (payload: IDataCategoryForm) => {
      setIsLoadingBtnSubmitAddCategory(true);
      const formData: FormData = new FormData();
      formData.append('name', payload.name);
      formData.append('image', addCategoryImageFile || '');
      formData.append('status', String(CATEGORY_DEFAULT_STATUS));
      addCategory(formData);
    },
    [addCategoryImageFile, addCategory]
  );

  const handleUpdateCategory = useCallback(
    (payload: IDataCategoryForm) => {
      setIsLoadingBtnSubmitUpdateCategory(true);
      const formData: FormData = new FormData();
      formData.append('name', payload.name);
      formData.append('image', updateCategoryImageFile || '');
      formData.append('status', String(CATEGORY_DEFAULT_STATUS));
      updateCategory(formData);
    },
    [updateCategoryImageFile, updateCategory]
  );

  const handleCancelModalAddCategory = useCallback(() => {
    setIsModalAddCategoryVisible(false);
  }, []);

  const handleCancelModalUpdateCategory = useCallback(() => {
    setIsModalUpdateCategoryVisible(false);
  }, []);

  const handleShowUpdateModal = useCallback((category: ICategoryDetail) => {
    if (category) {
      setIdUpdateCategory(category.id);
      setUpdateCategoryFormData({
        name: category.name,
        image: category.image_path,
        status: CATEGORY_DEFAULT_STATUS,
      });
      setUpdateCategoryImageURL(category.image_path);
      setIsModalUpdateCategoryVisible(true);
    }
  }, []);

  const handleDeleteCategory = useCallback(
    (categoryId: number) => {
      if (categoryId) {
        confirm({
          title: <div>{t('listCategory.confirmDelete')}</div>,
          okText: t('common.confirm'),
          cancelText: t('common.cancel'),
          icon: <></>,
          className: 'modal-confirm-normal',
          centered: true,
          onOk() {
            deleteCategory(categoryId);
          },
        });
      }
    },
    [deleteCategory, t]
  );

  const handleTrimSpaceInputAddForm = useCallback(
    (e: React.FocusEvent<HTMLInputElement, Element>) => {
      addCategoryForm.setFieldsValue({
        [e.target.name]: trimSpaceInput(e.target.value),
      });
    },
    [addCategoryForm]
  );

  const handleTrimSpaceInputUpdateForm = useCallback(
    (e: React.FocusEvent<HTMLInputElement, Element>) => {
      updateCategoryForm.setFieldsValue({
        [e.target.name]: trimSpaceInput(e.target.value),
      });
    },
    [updateCategoryForm]
  );

  const handleChangeImageAddCategory = useCallback(
    (info: UploadChangeParam<any>) => {
      setIsLoadingAddCategoryImage(true);
      if (!validateTypeImg(info.file.type, CATEGORY_IMAGE_TYPE)) {
        message.error(t('listCategory.modalAddCategory.validate.imageType'));
        addCategoryForm.setFieldsValue({
          image: '',
        });
      } else if (!validateSizeImg(info.file.size, IMAGE_CATEGORY_MAX_SIZE_MB)) {
        message.error(t('listCategory.modalAddCategory.validate.imageSize'));
        addCategoryForm.setFieldsValue({
          image: '',
        });
      } else {
        compressionHeicImageFile(
          info,
          setAddCategoryImageURL,
          setAddCategoryImageFile,
          setIsLoadingAddCategoryImage,
          IMAGE_CATEGORY_MAX_SIZE_MB
        );
      }
    },
    [t, addCategoryForm]
  );

  const handleChangeImageUpdateCategory = useCallback(
    (info: UploadChangeParam<any>) => {
      setIsLoadingUpdateCategoryImage(true);
      if (!validateTypeImg(info.file.type, CATEGORY_IMAGE_TYPE)) {
        message.error(t('listCategory.modalAddCategory.validate.imageType'));
        updateCategoryForm.setFieldsValue({
          image: '',
        });
      } else if (!validateSizeImg(info.file.size, IMAGE_CATEGORY_MAX_SIZE_MB)) {
        message.error(t('listCategory.modalAddCategory.validate.imageSize'));
        updateCategoryForm.setFieldsValue({
          image: '',
        });
      } else {
        compressionHeicImageFile(
          info,
          setUpdateCategoryImageURL,
          setUpdateCategoryImageFile,
          setIsLoadingUpdateCategoryImage,
          IMAGE_CATEGORY_MAX_SIZE_MB
        );
      }
    },
    [t, updateCategoryForm]
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

  useEffect(() => {
    addCategoryForm.resetFields();
  }, [addCategoryForm]);

  useEffect(() => {
    updateCategoryForm.resetFields();
  }, [updateCategoryForm, updateCategoryFormData]);

  // Close modal
  const handleAfterClose = useCallback(() => {
    addCategoryForm.resetFields();
    setAddCategoryImageFile('');
    setAddCategoryImageURL('');
  }, [addCategoryForm]);

  return (
    <div className={styles.listCategory}>
      <Helmet>
        <title>{t('tabTitle.listCategory')}</title>
      </Helmet>
      <Row justify="space-between" align="bottom" className={styles.title}>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <h2>{t('listCategory.title')}</h2>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12} className={styles.colButton}>
          <Col xs={24} sm={24} md={8} lg={8} xl={8} className={styles.colBtn}>
            <Button type="primary" className={styles.btnAddCategory} onClick={() => setIsModalAddCategoryVisible(true)}>
              <img height={24} width={24} src={addIcon} alt="add" /> {t('listCategory.btnAddCategory')}
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
      <Modal
        className={styles.modalAdd}
        visible={isModalAddCategoryVisible}
        footer={null}
        closable={false}
        centered
        afterClose={handleAfterClose}
      >
        <div className={styles.title}>
          <strong>{t('listCategory.modalAddCategory.title')}</strong>
          <img src={closeIcon} alt="close" height={30} width={30} onClick={handleCancelModalAddCategory} />
        </div>
        <Form
          className={styles.addCategoryForm}
          form={addCategoryForm}
          initialValues={defaultDataAddCategoryForm}
          onFinish={handleAddCategory}
          scrollToFirstError={true}
        >
          <Col span={24} className={styles.contentForm}>
            <Col span={24} className={styles.colForm}>
              <Form.Item
                className={styles.formUpload}
                name="image"
                colon={false}
                label={t('listCategory.modalAddCategory.image')}
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: t('listCategory.modalAddCategory.validate.imageRequired'),
                  },
                ]}
              >
                <Upload
                  listType="picture"
                  showUploadList={false}
                  onChange={handleChangeImageAddCategory}
                  beforeUpload={() => {
                    return false;
                  }}
                  multiple={false}
                  maxCount={1}
                  accept={ACCEPT_UPLOAD_CATEGORY_IMAGE_TYPE}
                  className={styles.uploadAvatar}
                >
                  {!isLoadingAddCategoryImage && !!addCategoryImageURL && (
                    <CommonURLImage src={addCategoryImageURL} className={styles.imageCard} alt="category image" />
                  )}
                  {!isLoadingAddCategoryImage && !addCategoryImageURL && (
                    <div className={styles.boxUpload}>
                      <img src={fileIcon} className={styles.imgUpload} alt="file text" />
                      <div className={styles.selectFile}>{t('listCategory.modalAddCategory.selectFile')}</div>
                      <div className={styles.clickToSelect}>{t('listCategory.modalAddCategory.clickToSelect')}</div>
                    </div>
                  )}
                  {isLoadingAddCategoryImage && (
                    <div className={styles.boxUpload}>
                      <SpinLoading />
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </Col>
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
                label={t('listCategory.modalAddCategory.name')}
                name="name"
                rules={[
                  { required: true, message: t('listCategory.modalAddCategory.validate.nameRequired') },
                  {
                    max: NAME_CATEGORY_MAX_LENGTH,
                    message: t('listCategory.modalAddCategory.validate.nameLen'),
                  },
                  () => ({
                    validator(_: RuleObject, value: string) {
                      if (value && value.length <= NAME_CATEGORY_MAX_LENGTH && !value.match(LOCATION_NAME_REGEX)) {
                        return Promise.reject(new Error(t('listCategory.modalAddCategory.validate.nameRegex')));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input
                  placeholder={t('listCategory.modalAddCategory.name')}
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
                <Button htmlType="submit" type="primary" loading={isLoadingBtnSubmitAddCategory}>
                  {t('listCategory.modalAddCategory.btnSubmit')}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Modal className={styles.modalAdd} visible={isModalUpdateCategoryVisible} footer={null} closable={false} centered>
        <div className={styles.title}>
          <strong>{t('listCategory.modalUpdateCategory.title')}</strong>
          <img src={closeIcon} alt="close" height={30} width={30} onClick={handleCancelModalUpdateCategory} />
        </div>
        <Form
          className={styles.addCategoryForm}
          form={updateCategoryForm}
          initialValues={updateCategoryFormData}
          onFinish={handleUpdateCategory}
          scrollToFirstError={true}
        >
          <Col span={24} className={styles.contentForm}>
            <Col span={24} className={styles.colForm}>
              <Form.Item
                className={styles.formUpload}
                name="image"
                colon={false}
                label={t('listCategory.modalAddCategory.image')}
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: t('listCategory.modalAddCategory.validate.imageRequired'),
                  },
                ]}
              >
                <Upload
                  listType="picture"
                  showUploadList={false}
                  onChange={handleChangeImageUpdateCategory}
                  beforeUpload={() => {
                    return false;
                  }}
                  multiple={false}
                  maxCount={1}
                  accept={ACCEPT_UPLOAD_CATEGORY_IMAGE_TYPE}
                  className={styles.uploadAvatar}
                >
                  {!isLoadingUpdateCategoryImage && !!updateCategoryImageURL && (
                    <CommonURLImage src={updateCategoryImageURL} className={styles.imageCard} alt="category image" />
                  )}
                  {!isLoadingUpdateCategoryImage && !updateCategoryImageURL && (
                    <div className={styles.boxUpload}>
                      <img src={fileIcon} className={styles.imgUpload} alt="file text" />
                      <div className={styles.selectFile}>{t('listCategory.modalAddCategory.selectFile')}</div>
                      <div className={styles.clickToSelect}>{t('listCategory.modalAddCategory.clickToSelect')}</div>
                    </div>
                  )}
                  {isLoadingUpdateCategoryImage && (
                    <div className={styles.boxUpload}>
                      <SpinLoading />
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </Col>
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
                label={t('listCategory.modalAddCategory.name')}
                name="name"
                rules={[
                  { required: true, message: t('listCategory.modalAddCategory.validate.nameRequired') },
                  {
                    max: NAME_CATEGORY_MAX_LENGTH,
                    message: t('listCategory.modalAddCategory.validate.nameLen'),
                  },
                  () => ({
                    validator(_: RuleObject, value: string) {
                      if (value && value.length <= NAME_CATEGORY_MAX_LENGTH && !value.match(LOCATION_NAME_REGEX)) {
                        return Promise.reject(new Error(t('listCategory.modalAddCategory.validate.nameRegex')));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input
                  placeholder={t('listCategory.modalAddCategory.name')}
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
                <Button htmlType="submit" type="primary" loading={isLoadingBtnSubmitUpdateCategory}>
                  {t('listCategory.modalUpdateCategory.btnSubmit')}
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
        dataSource={dataListCategory?.categories.data}
        columns={columns}
        pagination={false}
        loading={isLoadingDataListCategory || !!isFetching}
        rowClassName={(record, index) => (index % 2 ? '' : 'hasBackground')}
        locale={{ emptyText: t('listCategory.noData') }}
      />

      {!isLoadingDataListCategory && !isFetching && (
        <Col span={24} className={styles.colPagination}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} className={styles.textPagination}>
            <strong>
              {t('listCategory.pagination', {
                total: dataListCategory?.categories.total || 0,
                page_from:
                  dataListCategory?.categories.total || 0
                    ? DEFAULT_PAGE_ANTD + (filter.page - 1) * PAGE_PAGINATION_10
                    : 0,
                page_to: Math.min(filter.page * PAGE_PAGINATION_10, dataListCategory?.categories.total || 0),
              })}
            </strong>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} className={styles.pagination}>
            <Pagination
              onChange={handleChangePage}
              total={dataListCategory?.categories.total || 0}
              current={filter.page}
              pageSize={filter.per_page}
            />
          </Col>
        </Col>
      )}
    </div>
  );
}
