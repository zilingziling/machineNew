import React, { useEffect, useState } from 'react';
import BaseModal from '@/components/baseModal';
import { Button, Divider, Form, Input, notification, Radio, Tree, TreeSelect, Upload } from 'antd';
import { layout, roleLayout } from '@/utils/common';
import { formatOpeTree, formatTreeData } from '@/utils/func';
import { add_edit, changePwd, getRoles, getSchoolOfUser } from '@/service/userManage';
import SparkMd5 from 'spark-md5';
const ChangePwd = ({ pwdV, setPwdV, getTable, userId }) => {
  const [form] = Form.useForm();
  const onModalCancel = () => {
    setPwdV(false);
  };

  const onModalOk = () => {
    form
      .validateFields()
      .then((value) => {
        if (value) {
          if (value.password !== value.confirmPwd) {
            notification.error({
              message: '新密码两次输入不一致！',
            });
          } else {
            let params = value;
            delete params.confirmPwd;
            params.password = SparkMd5.hash(params.password);
            params.oldPassword = SparkMd5.hash(params.oldPassword);
            params.id = userId;
            changePwd(params).then((r) => {
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
        }
      })
      .catch(() => {});
  };

  return (
    <BaseModal onOk={onModalOk} title="修改密码" visible={pwdV} onCancel={onModalCancel}>
      <Form form={form} {...roleLayout} className="mt1">
        <Form.Item
          name="oldPassword"
          label="原密码"
          rules={[{ required: true, message: '请输入原密码！' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="password"
          label="新密码"
          rules={[{ required: true, message: '请输入新密码！' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirmPwd"
          label="确认密码"
          rules={[{ required: true, message: '请确认密码！' }]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};
export default ChangePwd;
