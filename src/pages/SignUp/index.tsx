import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.scss';
import { Card, Input, Button, Form, Row } from 'antd';
import { useTranslation } from 'react-i18next';

export default function SignUp() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navigateToLogIn = () => navigate('/login');

  const handleSubmit = (payload: any) => null;

  return (
    <div className={styles.signUpContainer}>
      <Card bordered className={styles.signUpForm}>
        <Form onFinish={handleSubmit}>
          <Row justify="center">
            <h2>Đăng ký</h2>
          </Row>
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập',
              },
            ]}
            labelAlign="left"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: t('validate.passwordRequired') }]}
            labelAlign="left"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu"
            name="passwordConfirm"
            rules={[{ required: true, message: t('validate.passwordRequired') }]}
            dependencies={['password']}
            labelAlign="left"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item labelCol={{ span: 24 }}>
            <Button block type="primary" htmlType="submit">
              Đăng ký
            </Button>
          </Form.Item>
          <Form.Item labelCol={{ span: 24 }}>
            <Button block type="dashed" htmlType="button" onClick={navigateToLogIn}>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
