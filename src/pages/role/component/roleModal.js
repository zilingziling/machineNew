import React from 'react';
import BaseModal from '@/components/baseModal';
import styles from '../role.less';
import { Button, Divider, Form, Input, Tree, TreeSelect, Upload } from 'antd';
import { layout, roleLayout } from '@/utils/common';
import { UploadOutlined } from '@ant-design/icons';
const RoleModal = ({ roleTitle, roleV, setRoleV }) => {
  const [form] = Form.useForm();
  const roleCancel = () => {
    setRoleV(false);
  };
  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  const onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
  };
  return (
    <BaseModal title={roleTitle} visible={roleV} onCancel={roleCancel} className={styles.modal}>
      <div className={styles.roleModal}>
        <div className={styles.auth}>
          <h2>角色授权</h2>
          <Tree
            checkable
            onSelect={onSelect}
            onCheck={onCheck}
            treeData={treeData}
            className="mt1"
          />
        </div>
        <Divider type="vertical" dashed className={styles.divider} />
        <div>
          <h2>角色信息</h2>
          <Form form={form} {...roleLayout} className="mt1">
            <Form.Item
              name="name"
              label="角色名称"
              rules={[{ required: true, message: '请输入角色名称！' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="sort"
              label="角色代码"
              rules={[{ required: true, message: '请输入角色代码！' }]}
            >
              <Input type="number" />
            </Form.Item>
          </Form>
        </div>
      </div>
    </BaseModal>
  );
};
export default RoleModal;
const treeData = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',

        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
          },
          {
            title: 'leaf',
            key: '0-0-0-1',
          },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [{ title: <span style={{ color: '#1890ff' }}>sss</span>, key: '0-0-1-0' }],
      },
    ],
  },
];
