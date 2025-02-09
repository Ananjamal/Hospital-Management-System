import React, { useState } from 'react';
import { Modal, Button } from 'antd';

export default function ModalComponent({ visible, onOk, onCancel, ModalText, confirmLoading }) {
  return (
    <div>
      <Modal
        title="Modal Title"
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
      >
        <p>{ModalText}</p>
      </Modal>
    </div>
  );
}
