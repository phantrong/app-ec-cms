import { Modal } from 'antd';
import React from 'react';

import IconClose from 'assets/images/icons/icon-plus-circle.svg';
import styles from './styles.module.scss';

interface IModal {
  isModalVisible: boolean;
  handleOk?: () => void;
  title?: React.ReactNode;
  handleCancel?: () => void;
  mainContent?: React.ReactNode;
  hasNoFooter?: boolean;
  handleAfterClose?: () => void;
  addClass?: string;
}

const CloseIcon = () => <img src={IconClose} alt="close" />;

const CommonModalForm = (props: IModal) => {
  const { isModalVisible, handleOk, title, handleCancel, mainContent, hasNoFooter, handleAfterClose, addClass } = props;
  return (
    <Modal
      className={`${styles.commonModal} ${addClass}`}
      title={title}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      closeIcon={<CloseIcon />}
      footer={hasNoFooter && null}
      centered
      afterClose={handleAfterClose}
      forceRender
    >
      {mainContent}
    </Modal>
  );
};

export default CommonModalForm;
