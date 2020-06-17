import React, { useEffect, useState } from 'react';
import { TreeSelect, Form, Input, Upload, Button, notification } from 'antd';
import BaseModal from '@/components/baseModal';
import { layout } from '@/utils/common';
import { UploadOutlined } from '@ant-design/icons';
import { saveTree } from '@/service/menu';
import { connect } from 'dva';
const OpeModal = ({ menuTitle, menuV, setMV, getMenu, selectMenuInfo, treeData, dispatch }) => {
  const [form] = Form.useForm();
  const onClose = () => {
    setMV(false);
  };
  useEffect(() => {
    if (Object.keys(selectMenuInfo).length && menuTitle.includes('编辑')) {
      form.setFieldsValue({
        name: selectMenuInfo.title,
        url: selectMenuInfo.url,
        icon: selectMenuInfo.icon,
        sort: selectMenuInfo.sort,
      });
    } else {
      form.resetFields();
    }
  }, [selectMenuInfo, menuTitle]);
  const onUpload = (e) => {
    if (e.file.status === 'done') {
      if (e.file.response.code === 0) {
        form.setFieldsValue({
          icon: e.file.response.data,
        });
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
  const onOk = () => {
    form
      .validateFields()
      .then((value) => {
        if (value) {
          const params = menuTitle.includes('编辑') ? { ...value, id: selectMenuInfo.id } : value;
          saveTree(params).then((r) => {
            if (r.code === 0) {
              notification.success({
                message: r.msg,
              });
              getMenu();
              onClose();
              //  操作菜单后
              dispatch({
                type: 'global/getAuth',
              });
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
    <BaseModal title={menuTitle} onCancel={onClose} onOk={onOk} visible={menuV}>
      <Form form={form} {...layout}>
        <Form.Item name="parent.id" label="上级菜单">
          <TreeSelect treeData={treeData} />
        </Form.Item>
        <Form.Item
          name="name"
          label="菜单名称"
          rules={[{ required: true, message: '请输入菜单名称！' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="sort"
          label="菜单排序"
          rules={[{ required: true, message: '请输入菜单排序！' }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="url"
          label="操作URL"
          rules={[{ required: true, message: '请输入操作URL！' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="图标">
          <Form.Item noStyle name="icon">
            <Input disabled />
          </Form.Item>

          <Upload
            name="file"
            onChange={onUpload}
            action="/integrated/file/upload"
            showUploadList={false}
            accept="image/png,image/jpg,image/jpeg"
          >
            <Button className="mt1">
              <UploadOutlined /> 上传图标
            </Button>
          </Upload>
        </Form.Item>
      </Form>
    </BaseModal>
  );
};
export default connect(({ global }) => ({
  moreMenu: global.moreMenu,
}))(OpeModal);
