import React, { useEffect, useState } from 'react';
import { Radio, Form, Input, TreeSelect, Button, notification } from 'antd';
import BaseModal from '@/components/baseModal';
import { layout } from '@/utils/common';
import { UploadOutlined } from '@ant-design/icons';
import { getMenuCode, saveOperation } from '@/service/menu';
import { formatTreeData } from '@/utils/func';
import OpeModal from '@/pages/menu/components/opeModal';
import { connect } from 'dva';
const OperationModal = ({
  opeTitle,
  opeV,
  setOpeV,
  selectMenuInfo,
  getOperationList,
  editInfo,
  setEditInfo,
  dispatch,
}) => {
  const [form] = Form.useForm();
  const [menuCode, setMenuCode] = useState([]);

  const opeCancel = () => {
    setOpeV(false);
    setEditInfo({});
  };
  useEffect(() => {
    getMenuCode().then(r => {
      if (r.code === 0) {
        setMenuCode(formatTreeData(r.data));
      }
    });
  }, []);
  useEffect(() => {
    if (Object.keys(editInfo).length) {
      form.setFieldsValue({
        name: editInfo.name,
        'dict.id': editInfo.operationCodeId,
        url: editInfo.url,
        isshow: editInfo.is_show,
      });
    } else {
      form.resetFields();
    }
  }, [editInfo]);
  const opeOk = () => {
    form
      .validateFields()
      .then(value => {
        if (value) {
          const params = opeTitle.includes('编辑')
            ? { ...value, 'menu.id': selectMenuInfo.id, id: editInfo.id }
            : { ...value, 'menu.id': selectMenuInfo.id };
          saveOperation(params).then(r => {
            if (r.code === 0) {
              notification.success({
                message: r.msg,
              });
              getOperationList();
              opeCancel();
              //  操作菜单后
              dispatch({
                type: 'global/getAuth',
              });
            }
          });
        }
      })
      .catch(() => {});
  };
  return (
    <BaseModal title={opeTitle} onCancel={opeCancel} onOk={opeOk} visible={opeV}>
      <Form form={form} {...layout}>
        <Form.Item
          name="name"
          label="操作名称"
          rules={[{ required: true, message: '请输入操作名称！' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="dict.id"
          label="操作代码"
          rules={[{ required: true, message: '请选择操作代码！' }]}
        >
          <TreeSelect treeData={menuCode} />
        </Form.Item>
        <Form.Item name="url" label="操作URL">
          <Input />
        </Form.Item>
        <Form.Item
          name="isshow"
          label="是否启用"
          rules={[{ required: true, message: '请选择是否启用！' }]}
        >
          <Radio.Group>
            <Radio value={1}>启动</Radio>
            <Radio value={0}>禁用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </BaseModal>
  );
};
export default connect(({ global }) => ({
  moreMenu: global.moreMenu,
}))(OperationModal);
