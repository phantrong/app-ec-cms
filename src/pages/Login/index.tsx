import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import _pick from 'lodash/pick';
import { Card, Input, Button, Form, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import { handleErrorMessage } from 'helper';
import { Helmet } from 'react-helmet-async';
import classNames from 'classnames';

import styles from './style.module.scss';
import { login } from 'api/authentication';
import { TOKEN_CMS, STATUS_CODE } from 'constants/constants';

export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [messageLogin, setMessageLogin] = useState('');
  const [errorAcountBlocked, setErrorAcountBlocked] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoadingBtnSubmit, setIsLoadingBtnSubmit] = useState<boolean>(false);

  const handleSubmit = async (payload: any) => {
    setIsLoadingBtnSubmit(true);
    const params: ILoginParams = _pick(payload, ['email', 'password']);
    try {
      const data = await login(params);
      if (data.success) {
        const { token } = data.data;
        Cookies.set('token', token, {
          expires: undefined,
        });
      }
      setIsLoadingBtnSubmit(false);
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error as AxiosError;
      if (errorMessage.response?.status === STATUS_CODE.HTTP_NOT_ACCEPTABLE) {
        setMessageLogin(t('login.messageResponse.errorEmailOrPassword'));
      } else {
        handleErrorMessage(error);
      }
      setIsLoadingBtnSubmit(false);
    }
  };

  useEffect(() => {
    setMessageLogin('');
    setErrorAcountBlocked('');
  }, [password, email]);

  const isAuthenticated: boolean = !!Cookies.get(TOKEN_CMS);
  if (isAuthenticated) return <Navigate to="/dashboard" />;

  return (
    <div className={styles.loginContainer}>
      <Helmet>
        <title>{t('tabTitle.login')}</title>
      </Helmet>
      <Card bordered={false} className={styles.loginForm}>
        <Row className={styles.logo} justify="center">
          <Link to="/">
            <div className={styles.textLogo}>MY CART</div>
          </Link>
        </Row>
        <Form onFinish={handleSubmit} hideRequiredMark>
          <Row>
            <h2 className={styles.title}>{t('login.title')}</h2>
          </Row>
          <Row
            className={classNames({
              [styles.rowEmail]: true,
              [styles.rowEmailHasError]: errorAcountBlocked,
            })}
          >
            <Form.Item
              className={styles.formEmail}
              colon={false}
              label={t('login.email')}
              name="email"
              rules={[{ required: true, message: t('login.validate.emailRequired') }]}
            >
              <Input
                placeholder={t('login.email')}
                className={styles.inputEmail}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <span className={styles.messageLogin}>{errorAcountBlocked}</span>
          </Row>
          <Row
            className={classNames({
              [styles.rowPassword]: true,
              [styles.rowPasswordHasError]: messageLogin,
            })}
          >
            <Form.Item
              className={styles.formPassword}
              colon={false}
              label={t('login.password')}
              name="password"
              rules={[{ required: true, message: t('login.validate.passwordRequired') }]}
            >
              <Input.Password
                placeholder={t('login.password')}
                className={styles.inputPassword}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <span className={styles.messageLogin}>{messageLogin}</span>
          </Row>
          <div className={styles.forgotPassword}>
            <Link to="/forgot-password">{t('login.forgotPassword')}</Link>
          </div>
          <Form.Item labelCol={{ span: 24 }}>
            <Button block type="primary" htmlType="submit" className={styles.buttonLogin} loading={isLoadingBtnSubmit}>
              {t('login.title').toUpperCase()}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
