import React, { useEffect, useState } from 'react';
import { Form, Input, Radio, Upload, notification, Button, InputNumber } from 'antd';
import { operate } from '@/service/device';
import { layout } from '@/utils/common';
import BaseModal from '@/components/baseModal';
import { UploadOutlined } from '@ant-design/icons';

const A_e_modal = ({ modalTitle, modalV, setModalV, getTable, editInfo, tempImg, setTempImg }) => {
  const [form] = Form.useForm();
  const onModalCancel = () => {
    setModalV(false);
  };
  //  编辑回显
  useEffect(() => {
    if (Object.keys(editInfo).length && modalTitle.includes('编辑')) {
      form.setFieldsValue({
        name: editInfo.name,
        code: editInfo.code,
        sort: editInfo.sort,
        imageUrl: editInfo.imageUrl,
        isShow: editInfo.isShow,
      });
    } else {
      form.resetFields();
    }
  }, [editInfo]);

  const onModalOk = () => {
    form
      .validateFields()
      .then(value => {
        if (value) {
          let params = value;
          if (modalTitle.includes('编辑')) {
            params.id = editInfo.id;
          }
          operate(params).then(r => {
            if (r.code === 0) {
              notification.success({
                message: r.msg,
              });
              getTable();
              onModalCancel();
            }
          });
        }
      })
      .catch(() => {});
  };
  // 图片上传
  const onUpload = e => {
    if (e.file.status === 'done') {
      if (e.file.response.code === 0) {
        form.setFieldsValue({
          imageUrl: e.file.response.data,
        });
        setTempImg(e.file.response.data);
        notification.success({
          message: e.file.response.msg,
        });
      } else {
        notification.error({
          message: e.file.response.msg,
        });
      }
    }
  };
  return (
    <BaseModal onOk={onModalOk} title={modalTitle} visible={modalV} onCancel={onModalCancel}>
      <Form form={form} {...layout} className="mt1">
        <Form.Item
          name="name"
          label="设备类型名称"
          rules={[{ required: true, message: '请输入设备类型名称！' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="code"
          label="设备类型编码"
          rules={[{ required: true, message: '请输入设备类型编码！' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="isShow"
          label="控制页显示"
          rules={[{ required: true, message: '请选择是否在控制页显示！' }]}
        >
          <Radio.Group>
            <Radio value={1}>显示</Radio>
            <Radio value={0}>不显示</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="sort" label="排序" rules={[{ required: true, message: '请输入排序！' }]}>
          <InputNumber min={1} type="number" />
        </Form.Item>
        <Form.Item label="图标">
          {tempImg || editInfo.imageUrl ? (
            <Form.Item noStyle name="imageUrl">
              <img className="iconStyle" src={tempImg || editInfo.imageUrl || ''} />
            </Form.Item>
          ) : null}
          <Upload
            name="file"
            onChange={onUpload}
            action="/integrated/file/upload"
            showUploadList={false}
            accept="image/png,image/jpg,image/jpeg"
          >
            <Button className={tempImg || editInfo.imageUrl ? 'mt1' : ''}>
              <UploadOutlined /> 上传图标
            </Button>
          </Upload>
        </Form.Item>
      </Form>
    </BaseModal>
  );
};
export default A_e_modal;
