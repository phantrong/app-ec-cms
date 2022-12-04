import React, { useState } from 'react';
import { Card, Button, Row, Col, Form, Input, FormInstance, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import _pick from 'lodash/pick';
import { AxiosError } from 'axios';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import styles from './style.module.scss';
import { forgotPassword, resendForgotPassword } from 'api/authentication';
import { EMAIL_REGEX, TYPE_CHECK_MAIL_RESET_PASSWORD } from 'constants/constants';
import { handleErrorMessage } from 'helper';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [form]: FormInstance<any>[] = Form.useForm();
  const [email, setEmail] = useState<string>('');
  const [isVerifiedEmail, setIsVerifiedEmail] = useState<boolean>(false);
  const [isLoadingBtnNext, setIsLoadingBtnNext] = useState<boolean>(false);
  const [isLoadingBtnResend, setIsLoadingBtnResend] = useState<boolean>(false);
  const [messageError, setMessageError] = useState<string>('');

  const { mutate: postVerifyMail } = useMutation((params: ICheckMailUniqueParams) => forgotPassword(params), {
    onSuccess: () => {
      setIsVerifiedEmail(true);
      setMessageError('');
      setIsLoadingBtnNext(false);
    },
    onError: (error) => {
      const errorMessage = error as AxiosError;
      if (
        errorMessage.response?.data &&
        errorMessage.response.data.data &&
        errorMessage.response.data.data.email &&
        errorMessage.response.data.data.email.Exists
      ) {
        setMessageError(t('forgotPassword.msgErrorMailNotExist'));
      }
      setIsLoadingBtnNext(false);
    },
  });

  const { mutate: postVerifyMailAgain } = useMutation(
    (params: ICheckMailUniqueParams) => resendForgotPassword(params),
    {
      onSuccess: (response: IDataResponseResetPassword) => {
        if (response.success) {
          message.success(t('forgotPassword.msgSussessResendEmail'));
          setIsLoadingBtnResend(false);
        }
      },
      onError: (error) => {
        handleErrorMessage(error);
        setIsVerifiedEmail(false);
        setIsLoadingBtnResend(false);
      },
    }
  );

  const handleSubmit = (payload: ICheckMailUniqueParams) => {
    setIsLoadingBtnNext(true);
    const params: ICheckMailUniqueParams = _pick(payload, ['email']);
    params.type = TYPE_CHECK_MAIL_RESET_PASSWORD;
    setEmail(params.email);
    postVerifyMail(params);
  };

  const handleVerifyMailAgain = () => {
    setIsLoadingBtnResend(true);
    const params: ICheckMailUniqueParams = {
      email,
    };
    postVerifyMailAgain(params);
  };

  const handleBack = () => {
    setIsVerifiedEmail(false);
  };

  return (
    <div className={styles.forgotPasswordContainer}>
      <Helmet>
        <title>{t('tabTitle.forgotPassword')}</title>
      </Helmet>
      <Card bordered={false} className={styles.forgotPasswordForm}>
        <Row className={styles.logo} justify="center">
          <Link to="/login">
            <div className={styles.textLogo}>MY CART</div>
          </Link>
        </Row>
        {!isVerifiedEmail && (
          <Col span={24}>
            <Row className={styles.headerTitle}>
              <h2 className={styles.title}>{t('forgotPassword.titleHeader')}</h2>
            </Row>
            <Form onFinish={handleSubmit} form={form} hideRequiredMark className={styles.formEmail}>
              <Row
                className={classNames({
                  [styles.rowEmail]: true,
                  [styles.rowEmailError]: messageError,
                })}
              >
                <Form.Item
                  labelCol={{ span: 24 }}
                  className={styles.inputFormEmail}
                  colon={false}
                  label={t('forgotPassword.emailLabel')}
                  name="email"
                  rules={[
                    { required: true, message: t('forgotPassword.validateEmailRequired') },
                    { pattern: new RegExp(EMAIL_REGEX), message: t('forgotPassword.validateEmailType') },
                  ]}
                >
                  <Input
                    placeholder={t('forgotPassword.email')}
                    className={styles.inputEmail}
                    onChange={() => setMessageError('')}
                  />
                </Form.Item>
                <span className={styles.messageError}>{messageError}</span>
              </Row>
              <Button block type="primary" htmlType="submit" className={styles.btnNext} loading={isLoadingBtnNext}>
                {t('forgotPassword.btnNext')}
              </Button>
            </Form>
          </Col>
        )}
        {isVerifiedEmail && (
          <Col span={24} className={styles.rowVerifyEmail}>
            <Row className={styles.rowTitle} align="middle">
              <h2 className={styles.title}>
                <strong>{t('forgotPassword.verifyEmail.title')}</strong>
              </h2>
              <div className={styles.oneLine}>{t('forgotPassword.verifyEmail.textLine1')}</div>
              <div className={styles.oneLine}>{t('forgotPassword.verifyEmail.textLine2')}</div>
              <div className={styles.oneLine}>{t('forgotPassword.verifyEmail.textLine3')}</div>
              <div className={styles.oneLine}>{t('forgotPassword.verifyEmail.textLine4')}</div>
            </Row>
            <Row className={styles.rowButton} align="middle">
              <Col span={12}>
                <Button block type="primary" htmlType="button" className={styles.btnBack} onClick={handleBack}>
                  {t('forgotPassword.verifyEmail.btnBack')}
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  block
                  type="primary"
                  htmlType="button"
                  className={styles.btnSendAgain}
                  onClick={handleVerifyMailAgain}
                  loading={isLoadingBtnResend}
                >
                  {t('forgotPassword.verifyEmail.btnSendAgain')}
                </Button>
              </Col>
            </Row>
          </Col>
        )}
      </Card>
    </div>
  );
}
