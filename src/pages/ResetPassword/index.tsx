import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Row, Col, Form, Input, FormInstance, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import _pick from 'lodash/pick';
import { useMutation } from 'react-query';
import { RuleObject } from 'antd/lib/form';
import { Helmet } from 'react-helmet-async';
import classNames from 'classnames';

import styles from './style.module.scss';
import { MAX_LENGTH_PASSWORD, MIN_LENGTH_PASSWORD, PASSWORD_REGEX } from 'constants/constants';
import { resetPassword, validateLinkResetPassword } from 'api/authentication';
import { handleErrorMessage } from 'helper';

import logo from '../../assets/images/logo.svg';

const dataFormDefault: IPasswordParams = {
  password: '',
  password_confirm: '',
};

export default function ResetPassword() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { token, emailHash } = useParams();
  const [form]: FormInstance<any>[] = Form.useForm();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(true);
  const [isLoadingBtnSubmit, setIsLoadingBtnSubmit] = useState<boolean>(false);

  const { mutate: validateLink } = useMutation(
    (params: IValidateLinkResetPasswordParams) => validateLinkResetPassword(params),
    {
      onSuccess: (response: IDataResponseResetPassword) => {
        if (response.success) {
          setIsLoadingPage(false);
        } else {
          navigate('/page-404');
        }
      },
      onError: () => {
        navigate('/page-404');
      },
    }
  );

  const { mutate: postResetPassword } = useMutation((params: IResetPasswordParams) => resetPassword(params), {
    onSuccess: (response: IDataResponseResetPassword) => {
      if (response.success) {
        setIsSuccess(true);
      }
    },
    onError: (error) => {
      handleErrorMessage(error);
      setIsLoadingBtnSubmit(false);
    },
  });

  const handleSubmit = (payload: IPasswordParams) => {
    setIsLoadingBtnSubmit(true);
    const dataPassword: IPasswordParams = _pick(payload, ['password', 'password_confirm']);
    const params: IResetPasswordParams = {
      token: token || '',
      params: dataPassword,
    };
    postResetPassword(params);
  };

  const navigateToLogIn = () => navigate('/login');

  useEffect(() => {
    const params: IValidateLinkResetPasswordParams = {
      token: token || '',
      email: emailHash || '',
    };
    validateLink(params);
  }, [emailHash, token, validateLink]);

  return (
    <div
      className={classNames({
        [styles.resetPasswordContainer]: true,
        [styles.hasBackground]: !isLoadingPage,
      })}
    >
      <Helmet>
        <title>{t('tabTitle.forgotPassword')}</title>
      </Helmet>
      {isLoadingPage && <Spin size="large" />}
      {!isLoadingPage && (
        <Card bordered={false} className={styles.resetPasswordForm}>
          <Row className={styles.logo} justify="center">
            <Link to="/login">
              <img height={106} width={72} src={logo} alt="Logo" />
            </Link>
          </Row>
          {!isSuccess && (
            <Col span={24}>
              <Row className={styles.headerTitle}>
                <h2 className={styles.title}>{t('resetPassword.titleHeader')}</h2>
              </Row>
              <Form onFinish={handleSubmit} form={form} requiredMark={false} initialValues={dataFormDefault}>
                <Form.Item
                  labelCol={{ span: 24 }}
                  className={styles.inputFormSignUp}
                  colon={false}
                  label={t('resetPassword.newPasswordLabel')}
                  name="password"
                  rules={[
                    { required: true, message: t('resetPassword.validate.passwordRequired') },
                    { max: MAX_LENGTH_PASSWORD, message: t('resetPassword.validate.passwordLen') },
                    () => ({
                      validator(_: RuleObject, value: string) {
                        if (value && value.length <= MAX_LENGTH_PASSWORD && !value.match(PASSWORD_REGEX)) {
                          return Promise.reject(new Error(t('resetPassword.validate.passwordRegex')));
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder={t('resetPassword.newPasswordLabel')} className={styles.inputPassword} />
                </Form.Item>
                <Form.Item
                  labelCol={{ span: 24 }}
                  className={styles.inputFormSignUp}
                  colon={false}
                  label={t('resetPassword.confirmNewPasswordLabel')}
                  name="password_confirm"
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    { required: true, message: t('resetPassword.validate.passwordRequired') },
                    ({ getFieldValue }) => ({
                      validator(_: RuleObject, value: string) {
                        if (
                          ((value && getFieldValue('password')) || !getFieldValue('password')) &&
                          getFieldValue('password') !== value
                        ) {
                          return Promise.reject(new Error(t('resetPassword.validate.confirmPasswordInvalid')));
                        }
                        return Promise.resolve();
                      },
                    }),
                    ({ getFieldValue }) => ({
                      validator(_: RuleObject, value: string) {
                        if (
                          value &&
                          getFieldValue('password') === value &&
                          (value.length > MAX_LENGTH_PASSWORD || value.length < MIN_LENGTH_PASSWORD)
                        ) {
                          return Promise.reject(new Error(t('resetPassword.validate.passwordLen')));
                        }
                        return Promise.resolve();
                      },
                    }),
                    ({ getFieldValue }) => ({
                      validator(_: RuleObject, value: string) {
                        if (
                          value &&
                          getFieldValue('password') === value &&
                          value.length <= MAX_LENGTH_PASSWORD &&
                          value.length >= MIN_LENGTH_PASSWORD &&
                          !value.match(PASSWORD_REGEX)
                        ) {
                          return Promise.reject(new Error(t('resetPassword.validate.passwordRegex')));
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    placeholder={t('resetPassword.confirmNewPasswordLabel')}
                    className={styles.inputPassword}
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
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  className={styles.btnSubmit}
                  loading={isLoadingBtnSubmit}
                >
                  {t('resetPassword.btnSubmit')}
                </Button>
              </Form>
            </Col>
          )}
          {isSuccess && (
            <Col span={24}>
              <Row align="middle" justify="center" className={styles.success}>
                <h2 className={styles.title}>
                  <strong>{t('resetPassword.titleSuccess')}</strong>
                </h2>
              </Row>
              <Button block type="primary" htmlType="button" className={styles.btnSubmit} onClick={navigateToLogIn}>
                {t('resetPassword.btnBack')}
              </Button>
            </Col>
          )}
        </Card>
      )}
    </div>
  );
}
