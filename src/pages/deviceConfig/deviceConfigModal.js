import React, { useEffect } from 'react';
import { Form, Input, notification, Button, InputNumber } from 'antd';
import { add_edit } from '@/service/device';
import BaseModal from '@/components/baseModal';
import { layout } from '@/utils/common';

const DeviceConfigModal = ({ modalTitle, modalV, setModalV, getTable, editInfo }) => {
  const [form] = Form.useForm();
  const onModalCancel = () => {
    setModalV(false);
  };
  //  编辑回显
  useEffect(() => {
    if (Object.keys(editInfo).length && modalTitle.includes('编辑')) {
      form.setFieldsValue({
        name: editInfo.name,
        sort: editInfo.sort,
      });
    } else {
      form.setFieldsValue({
        name: '',
        sort: '',
      });
    }
  }, [editInfo]);

  const onModalOk = () => {
    form
      .validateFields()
      .then((value) => {
        if (value) {
          let params = value;
          if (modalTitle.includes('编辑')) {
            params.id = editInfo.id;
          }
          add_edit(params).then((r) => {
            if (r.code === 0) {
              notification.success({
                message: r.msg,
              });
              getTable();
              onModalCancel();
            } else {
              notification.error({
                message: r.msg,
              });
            }
          });
        }
      })
      .catch(() => {});
  };
  return (
    <BaseModal onOk={onModalOk} title={modalTitle} visible={modalV} onCancel={onModalCancel}>
      <Form form={form} {...layout} className="mt1">
        <Form.Item
          name="name"
          label="设备类型"
          rules={[{ required: true, message: '请输入品牌名称！' }]}
        >
          <Input />
          <Form.Item noStyle>
            <Button className="shadowBtn">选择设备</Button>
          </Form.Item>
        </Form.Item>
        <Form.Item name="sort" label="品牌" rules={[{ required: true, message: '请输入排序！' }]}>
          <InputNumber min={1} type="number" />
        </Form.Item>
        <Form.Item name="sort" label="型号" rules={[{ required: true, message: '请输入排序！' }]}>
          <InputNumber min={1} type="number" />
        </Form.Item>
        <Form.Item
          name="sort"
          label="设备名称"
          rules={[{ required: true, message: '请输入排序！' }]}
        >
          <InputNumber min={1} type="number" />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};
export default DeviceConfigModal;
