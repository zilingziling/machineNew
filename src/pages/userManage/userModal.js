import React, { useEffect, useState } from 'react';
import BaseModal from '@/components/baseModal';
import { Button, Divider, Form, Input, notification, Radio, Tree, TreeSelect, Upload } from 'antd';
import { layout, roleLayout } from '@/utils/common';
import { formatOpeTree, formatTreeData } from '@/utils/func';
import { add_edit, getRoles, getSchoolOfUser } from '@/service/userManage';
import { connect } from 'dva';
const UserModal = ({ modalTitle, modalV, setModalV, getTable, editInfo, dispatch }) => {
  const [form] = Form.useForm();
  const onModalCancel = () => {
    setModalV(false);
    form.resetFields();
  };
  //  编辑回显
  useEffect(() => {
    if (Object.keys(editInfo).length && modalTitle.includes('编辑')) {
      form.setFieldsValue({
        account: editInfo.account,
        phone: editInfo.phone,
        schoolId: editInfo.schoolId,
        status: editInfo.status,
        userName: editInfo.userName,
      });
      getRoles({ userId: editInfo.id }).then((r) => {
        if (r.code === 0) {
          setRoles(r.data.roleList);
          form.setFieldsValue({
            'role[0].id': r.data.roleId || '',
          });
        }
      });
    } else {
      form.setFieldsValue({
        account: '',
        phone: '',
        schoolId: '',
        status: '',
        userName: '',
        'role[0].id': '',
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
  // 获取所属学校
  const [school, setSchool] = useState([]);
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    getSchoolOfUser().then((r) => {
      if (r.code === 0) {
        setSchool(formatTreeData(r.data));
      }
    });
    getRoles().then((r) => {
      if (r.code === 0) {
        setRoles(r.data.roleList);
      }
    });
  }, []);
  return (
    <BaseModal onOk={onModalOk} title={modalTitle} visible={modalV} onCancel={onModalCancel}>
      <Form form={form} {...roleLayout} className="mt1">
        <Form.Item
          name="account"
          label="账号"
          rules={[{ required: true, message: '请输入账号！' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="schoolId"
          label="所属学校"
          rules={[{ required: true, message: '请输入选择所属学校！' }]}
        >
          <TreeSelect treeData={school} />
        </Form.Item>
        <Form.Item name="name" label="联系人">
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="联系电话">
          <Input />
        </Form.Item>

        <Form.Item
          name="role[0].id"
          label="所属角色"
          rules={[{ required: true, message: '请选择所属角色！' }]}
        >
          <Radio.Group>
            {roles &&
              roles.map((item) => (
                <Radio key={item.id} value={item.id}>
                  {item.name}
                </Radio>
              ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态！' }]}>
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
}))(UserModal);
