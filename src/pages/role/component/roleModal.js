import React, { useEffect, useState } from 'react';
import BaseModal from '@/components/baseModal';
import styles from '../role.less';
import { Button, Divider, Form, Input, notification, Tree, TreeSelect, Upload } from 'antd';
import { layout, roleLayout } from '@/utils/common';
import { addRole, getRoleTree } from '@/service/role';
import { formatOpeTree } from '@/utils/func';
const RoleModal = ({ roleTitle, roleV, setRoleV, getTable, editInfo }) => {
  const [form] = Form.useForm();
  const [roleTree, setRoleTree] = useState([]);
  const [selectRole, setSelectRole] = useState([]);
  const [opeIds, setOpeIds] = useState([]);
  useEffect(() => {
    getRoleTree().then(r => {
      if (r.code === 0) {
        setRoleTree(formatOpeTree(r.data));
      }
    });
  }, []);
  const roleCancel = () => {
    setRoleV(false);
  };
  const onCheck = (checkedKeys, info) => {
    console.log(checkedKeys);
    setSelectRole(checkedKeys);
    const ids = info.checkedNodes.filter(node => !node.route).map(item => item.id);
    setOpeIds(ids);
  };
  useEffect(() => {
    if (Object.keys(editInfo).length) {
      form.setFieldsValue({
        name: editInfo.name,
        code: editInfo.code,
      });
      setSelectRole(
        editInfo.operationId ? editInfo.operationId.split(',').map(num => parseInt(num)) : [],
      );
    } else {
      form.setFieldsValue({
        name: '',
        code: '',
      });
      setSelectRole([]);
    }
  }, [editInfo]);
  const onAdd = () => {
    form
      .validateFields()
      .then(value => {
        if (value) {
          let params = value;
          opeIds.forEach((v, index) => {
            params[`operation[${index}].id`] = v;
          });
          if (roleTitle.includes('编辑')) {
            params.id = editInfo.id;
          }
          addRole(params).then(r => {
            if (r.code === 0) {
              notification.success({
                message: r.msg,
              });
              getTable();
              roleCancel();
            }
          });
        }
      })
      .catch(() => {});
  };
  return (
    <BaseModal
      onOk={onAdd}
      title={roleTitle}
      visible={roleV}
      onCancel={roleCancel}
      className={styles.modal}
    >
      <div className={styles.roleModal}>
        <div className={styles.auth}>
          <h2>角色授权</h2>
          <Tree
            checkedKeys={selectRole}
            checkable
            onCheck={onCheck}
            treeData={roleTree}
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
              name="code"
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
