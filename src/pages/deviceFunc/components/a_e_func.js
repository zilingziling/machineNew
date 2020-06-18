import React, { useEffect, useState } from 'react';
import { Form, Input, Radio, Upload, Button, Icon, message, notification } from 'antd';
import { operateFunc } from '@/service/device';
import BaseModal from '@/components/baseModal';
import { layout } from '@/utils/common';
import { UploadOutlined } from '@ant-design/icons';

const A_e_func = ({
  modalTitle,
  modalV,
  setModalV,
  getTable,
  editInfo,
  typeId,
  tempImg,
  setTempImg,
}) => {
  const [form] = Form.useForm();
  const onModalCancel = () => {
    setModalV(false);
  };
  //  编辑回显
  useEffect(() => {
    if (Object.keys(editInfo).length && modalTitle.includes('编辑')) {
      form.setFieldsValue({
        name: editInfo.name,
        command: editInfo.command,
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
      .then((value) => {
        if (value) {
          let params = value;
          params['aioEquipmentType.id'] = typeId;
          if (modalTitle.includes('编辑')) {
            params.id = editInfo.id;
            params['aioEquipmentType.id'] = editInfo.typeId;
          }
          operateFunc(params).then((r) => {
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
  // 图片上传
  const onUpload = (e) => {
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
          label="控制按键名称"
          rules={[{ required: true, message: '请输入控制按键名称！' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="command"
          label="控制命令"
          rules={[{ required: true, message: '请输入控制命令！' }]}
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
          <Input />
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
export default A_e_func;
