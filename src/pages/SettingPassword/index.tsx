import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Button, Form, Input, FormInstance, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Helmet } from 'react-helmet-async';
import { AxiosError } from 'axios';
import { RuleObject } from 'antd/lib/form';
import { useMutation } from 'react-query';

import styles from './style.module.scss';
import { ERROR_CODE_PASSWORD, MAX_LENGTH_PASSWORD, MIN_LENGTH_PASSWORD, PASSWORD_REGEX } from 'constants/constants';
import { apiChangePasswordSetting } from 'api/settingPassword';
import { deleteAllCookies } from 'helper';

import SuccessImage from '../../assets/images/success.svg';

const dataDefault: IChangePasswordFormParams = {
  nowPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export default function SettingPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form]: FormInstance<any>[] = Form.useForm();
  const [messageErrorPassword, setMessageErrorPassword] = useState<string>('');
  const [isErrorPassword, setIsErrorPassword] = useState<boolean>(false);
  const [isErrorNewPassword, setIsErrorNewPassword] = useState<boolean>(false);
  const [isErrorConfirmPassword, setIsErrorConfirmPassword] = useState<boolean>(false);
  const [isLoadingBtnSubmit, setIsLoadingBtnSubmit] = useState<boolean>(false);
  const [isModalSuccessVisible, setIsModalSuccessVisible] = useState<boolean>(false);

  const { mutate: changePassword } = useMutation(
    (params: IChangePasswordPostParams) => apiChangePasswordSetting(params),
    {
      onSuccess: (response: ISettingDataResponse) => {
        if (response.success) {
          setIsModalSuccessVisible(true);
        }
        setIsLoadingBtnSubmit(false);
      },
      onError: (error) => {
        const errorMessage = error as AxiosError;
        if (
          errorMessage.response?.data?.errorCode &&
          errorMessage.response.data.errorCode[0] === ERROR_CODE_PASSWORD.NOT_VALID
        ) {
          setMessageErrorPassword(t('myPageSettingEmail.validate.nowPasswordInvalid'));
        }
        setIsLoadingBtnSubmit(false);
      },
    }
  );

  const handleBackLogin = useCallback(() => {
    deleteAllCookies();
    navigate('/login');
  }, [navigate]);

  const handleSubmitForm = useCallback(
    (data: IChangePasswordFormParams) => {
      setIsLoadingBtnSubmit(true);
      const params: IChangePasswordPostParams = {
        old_password: data.nowPassword,
        password: data.newPassword,
        password_confirm: data.confirmPassword,
      };
      changePassword(params);
    },
    [changePassword]
  );

  return (
    <div className={styles.myPageSetting}>
      <div className={styles.contentPageSetting}>
        <Helmet>
          <title>{t('tabTitle.myPageSetting')}</title>
        </Helmet>
        <Col span={24} className={styles.titlePage}>
          <h2>{t('myPageSettingPassword.title')}</h2>
        </Col>
        <Col span={24} className={styles.rowPage}>
          <Col span={24} className={styles.contentPage}>
            <Form
              className={styles.formSettingEmail}
              form={form}
              initialValues={dataDefault}
              onFinish={handleSubmitForm}
              scrollToFirstError={true}
            >
              <Row className={styles.rowForm}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} className={styles.colFormProfile}>
                  <Col
                    span={24}
                    className={classNames({
                      [styles.rowInput]: true,
                      [styles.rowError]: messageErrorPassword || isErrorPassword,
                    })}
                  >
                    <Form.Item
                      labelCol={{ span: 24 }}
                      className={styles.formInput}
                      colon={false}
                      label={t('myPageSettingPassword.nowPasswordLabel')}
                      name="nowPassword"
                      required={true}
                      rules={[
                        () => ({
                          validator(_: RuleObject, value: string) {
                            if (!value) {
                              setIsErrorPassword(true);
                              return Promise.reject(new Error(t('myPageSettingPassword.nowPasswordRequired')));
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        placeholder={t('myPageSettingPassword.nowPasswordLabel')}
                        className={styles.input}
                        onChange={() => setMessageErrorPassword('')}
                      />
                    </Form.Item>
                    <div className={classNames({ [styles.messageBehind]: messageErrorPassword })}>
                      <span className={styles.messageError}>{messageErrorPassword}</span>
                    </div>
                  </Col>
                  <Col
                    span={24}
                    className={classNames({
                      [styles.rowInput]: true,
                      [styles.rowError]: isErrorNewPassword,
                    })}
                  >
                    <Form.Item
                      labelCol={{ span: 24 }}
                      className={styles.formInput}
                      colon={false}
                      label={t('myPageSettingPassword.newPasswordLabel')}
                      name="newPassword"
                      required={true}
                      rules={[
                        () => ({
                          validator(_: RuleObject, value: string) {
                            if (!value) {
                              setIsErrorNewPassword(true);
                              return Promise.reject(new Error(t('myPageSettingPassword.passwordRequired')));
                            }
                            return Promise.resolve();
                          },
                        }),
                        { max: MAX_LENGTH_PASSWORD, message: t('myPageSettingPassword.passwordLen') },
                        () => ({
                          validator(_: RuleObject, value: string) {
                            if (value && value.length <= MAX_LENGTH_PASSWORD && !value.match(PASSWORD_REGEX)) {
                              setIsErrorNewPassword(true);
                              return Promise.reject(new Error(t('myPageSettingPassword.passwordRegex')));
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        placeholder={t('myPageSettingPassword.newPasswordLabel')}
                        className={styles.input}
                      />
                    </Form.Item>
                    <div className={styles.messageBehind}>
                      <span className={styles.note}>{t('myPageSettingPassword.noteNewPassword')}</span>
                    </div>
                  </Col>
                  <Col
                    span={24}
                    className={classNames({
                      [styles.rowInput]: true,
                      [styles.rowError]: isErrorConfirmPassword,
                    })}
                  >
                    <Form.Item
                      labelCol={{ span: 24 }}
                      className={styles.formInput}
                      colon={false}
                      label={t('myPageSettingPassword.confirmPasswordLabel')}
                      name="confirmPassword"
                      dependencies={['newPassword']}
                      required={true}
                      hasFeedback
                      rules={[
                        () => ({
                          validator(_: RuleObject, value: string) {
                            if (!value) {
                              setIsErrorConfirmPassword(true);
                              return Promise.reject(new Error(t('myPageSettingPassword.passwordRequired')));
                            }
                            return Promise.resolve();
                          },
                        }),
                        ({ getFieldValue }) => ({
                          validator(_: RuleObject, value: string) {
                            if (
                              ((value && getFieldValue('newPassword')) || !getFieldValue('newPassword')) &&
                              getFieldValue('newPassword') !== value
                            ) {
                              setIsErrorConfirmPassword(true);
                              return Promise.reject(new Error(t('myPageSettingPassword.confirmPasswordInvalid')));
                            }
                            return Promise.resolve();
                          },
                        }),
                        ({ getFieldValue }) => ({
                          validator(_: RuleObject, value: string) {
                            if (
                              value &&
                              getFieldValue('newPassword') === value &&
                              (value.length > MAX_LENGTH_PASSWORD || value.length < MIN_LENGTH_PASSWORD)
                            ) {
                              setIsErrorConfirmPassword(true);
                              return Promise.reject(new Error(t('myPageSettingPassword.passwordLen')));
                            }
                            return Promise.resolve();
                          },
                        }),
                        ({ getFieldValue }) => ({
                          validator(_: RuleObject, value: string) {
                            if (
                              value &&
                              getFieldValue('newPassword') === value &&
                              value.length <= MAX_LENGTH_PASSWORD &&
                              value.length >= MIN_LENGTH_PASSWORD &&
                              !value.match(PASSWORD_REGEX)
                            ) {
                              setIsErrorConfirmPassword(true);
                              return Promise.reject(new Error(t('myPageSettingPassword.passwordRegex')));
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        placeholder={t('myPageSettingPassword.confirmPasswordLabel')}
                        className={styles.input}
                        onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => {
                          e.preventDefault();
                          return false;
                        }}
                        onCopy={(e: React.ClipboardEvent<HTMLInputElement>) => {
                          e.preventDefault();
                          return false;
                        }}
                      />
                    </Form.Item>
                    <div className={styles.messageBehind}>
                      <span className={styles.note}>{t('myPageSettingPassword.noteConfirmPasswordLabel')}</span>
                    </div>
                  </Col>
                </Col>
              </Row>
              <Row className={styles.rowButton}>
                <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                  <Form.Item labelCol={{ span: 24 }}>
                    <Button type="primary" htmlType="submit" className={styles.btnSubmit} loading={isLoadingBtnSubmit}>
                      {t('myPageSettingPassword.title')}
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Modal className={styles.modalSuccess} visible={isModalSuccessVisible} footer={null} closable={false}>
              <img src={SuccessImage} alt="success" />
              <strong>{t('myPageSettingPassword.modalSuccess.title')}</strong>
              <div>{t('myPageSettingPassword.modalSuccess.content1')}</div>
              <div>{t('myPageSettingPassword.modalSuccess.content2')}</div>
              <div>{t('myPageSettingPassword.modalSuccess.content3')}</div>
              <Button block type="primary" htmlType="button" onClick={handleBackLogin}>
                {t('myPageSettingPassword.modalSuccess.buttonOk')}
              </Button>
            </Modal>
          </Col>
        </Col>
      </div>
    </div>
  );
}
