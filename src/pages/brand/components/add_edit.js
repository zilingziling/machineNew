import React, { useEffect } from 'react';
import { Form, Input, notification, Radio, InputNumber } from 'antd';
import { layout, roleLayout } from '../../../utils/common';
import { add_edit } from '@/service/device';
import BaseModal from '@/components/baseModal';

const Add_edit = ({ modalTitle, modalV, setModalV, getTable, editInfo }) => {
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
      form.resetFields();
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
          label="品牌名称"
          rules={[{ required: true, message: '请输入品牌名称！' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="sort" label="排序" rules={[{ required: true, message: '请输入排序！' }]}>
          <InputNumber min={1} type="number" />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};
export default Add_edit;
