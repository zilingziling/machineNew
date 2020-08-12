import React, { useEffect, useState } from 'react';
import styles from '../../assets.less';
import {
  Form,
  Input,
  notification,
  Radio,
  Table,
  Select,
  Upload,
  Button,
  Checkbox,
  TreeSelect,
} from 'antd';
import BaseModal from '@/components/baseModal';
import { layout } from '@/utils/common';
import { handleRepair } from '@/service/assetsManage';
const { Option } = Select;
const HandleModal = ({ handleV, setHandleV, process, maintainer, handleId, getTable }) => {
  const onModalCancel = () => {
    setHandleV(false);
    form.resetFields();
  };
  const onModalOk = () => {
    form.validateFields().then(value => {
      if (value) {
        let p = value;
        value.id = handleId;
        handleRepair(p).then(r => {
          if (r.code === 0) {
            notification.success({
              message: r.msg,
            });
            getTable();
            onModalCancel();
          }
        });
      }
    });
  };
  const [form] = Form.useForm();
  return (
    <BaseModal onOk={onModalOk} title="报修处理" visible={handleV} onCancel={onModalCancel}>
      <Form form={form} {...layout}>
        <Form.Item
          rules={[{ required: true, message: '请选择维修人！' }]}
          name="maintainerId"
          label="维修人"
        >
          <Select>
            {maintainer.map(item => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="maintainerPhone"
          rules={[{ required: true, message: '请填写维修人电话！' }]}
          label="电话"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="progress.id"
          rules={[{ required: true, message: '请选择维修进度！' }]}
          label="维修进度"
        >
          <Select>
            {process.map(item => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item rules={[{ required: true, message: '请填写费用！' }]} name="cost" label="费用">
          <Input />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: '请选择维修方式！' }]}
          name="repairWay"
          label="维修方式"
        >
          <Input />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};
export default HandleModal;
