import React from 'react';
import { Modal } from 'antd';

const BaseModal = ({
  visible,
  children,
  title,
  onOk,
  onCancel,
  okText = '',
  cancelText = '',
  className,
  width = 540,
  closable,
  maskClosable,
}) => {
  return (
    <Modal
      closable={closable}
      maskClosable={maskClosable}
      width={width}
      className={className}
      getContainer={false}
      visible={visible}
      title={title}
      onOk={onOk}
      onCancel={onCancel}
      okText={okText || '确定'}
      cancelText={cancelText || '取消'}
    >
      {children}
    </Modal>
  );
};
export default BaseModal;
