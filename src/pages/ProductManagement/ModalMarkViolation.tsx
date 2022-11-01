import React, { useMemo } from 'react';
import { Button, Form, FormInstance, Input } from 'antd';
import { useTranslation } from 'react-i18next';

import { NORMAL_VALIDATE } from 'constants/constants';

import stylesModal from 'styles/modal.module.scss';

interface IViolationModal {
  handleFinish: (values: { violation_reason: string }) => void;
  form: FormInstance<any>;
  isLoading?: boolean;
}

const ModalMarkViolation = (props: IViolationModal) => {
  const { handleFinish, form, isLoading } = props;
  const { t } = useTranslation();

  return useMemo(
    () => (
      <div className={stylesModal.normalFormModal}>
        <Form form={form} name="mark_violation" onFinish={handleFinish}>
          {/* Title Live */}
          <div className={stylesModal.verticalInputForm}>
            <Form.Item
              label={t('listProduct.msgToSeller')}
              className={stylesModal.onlyOneInputInRow}
              colon={false}
              name="violation_reason"
              rules={[
                {
                  max: NORMAL_VALIDATE.MAX_3000,
                  message: t('validate.over3000Characters'),
                },
              ]}
            >
              <Input.TextArea
                className="normal-textarea-antd-form"
                maxLength={NORMAL_VALIDATE.MAX_3000}
                rows={7}
                showCount
                placeholder={t('listProduct.plsInsertReasons')}
              />
            </Form.Item>
          </div>

          {/* Bottom submit */}
          <div className={stylesModal.bottomSubmit}>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                {t('listProduct.doingReport')}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    ),
    [form, handleFinish, isLoading, t]
  );
};

export default ModalMarkViolation;
