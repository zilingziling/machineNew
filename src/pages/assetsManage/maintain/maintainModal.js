import React, { useEffect, useState } from 'react';
import { Form, Input, notification, Radio, Select } from 'antd';
import { layout, roleLayout } from '../../../utils/common';
import { add_edit, getDeviceConfigTree } from '@/service/device';
import BaseModal from '@/components/baseModal';
import { getMaintainType } from '@/service/assetsManage';
import { formatTreeData } from '@/utils/func';
const { Option } = Select;
const MaintainModal = ({ modalTitle, modalV, setModalV, getTable, editInfo }) => {
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
  // 获取维修人员列表
  const [account, setAccount] = useState([]);
  const [maintainType, setType] = useState([]);
  const [dict, setDict] = useState([]);
  const [show, setShow] = useState(false);
  useEffect(() => {
    getMaintainType().then((r) => {
      if (r.code === 0) {
        setType(r.data);
      }
    });
    //  选择区域
    getDeviceConfigTree().then((r) => {
      if (r.code === 0) {
        setDict(r.data);
      }
    });
  }, []);
  const formValueChange = (changedValues, allValues) => {
    if (allValues['dict.id']) {
      console.log(allValues);
      if (maintainType.find((item) => item.id === allValues['dict.id']).name.includes('区域')) {
        setShow(true);
      } else setShow(false);
    }
  };
  return (
    <BaseModal onOk={onModalOk} title={modalTitle} visible={modalV} onCancel={onModalCancel}>
      <Form onValuesChange={formValueChange} form={form} {...roleLayout} className="mt1">
        <Form.Item name="user.id" label="人员账号">
          <Select showSearch placeholder="选择账号">
            {/*{account.map((item) => (*/}
            {/*  <Option value={item.id} key={item.id}>*/}
            {/*    {item.name}*/}
            {/*  </Option>*/}
            {/*))}*/}
          </Select>
        </Form.Item>
        <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名！' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="电话">
          <Input />
        </Form.Item>
        <Form.Item name="dict.id" label="负责设备">
          <Radio.Group>
            {maintainType.map((item) => (
              <Radio key={item.id} value={item.id}>
                {item.name}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        {show ? (
          <>
            <Form.Item name="" label="选择区域">
              <Select showSearch placeholder="选择区域">
                {dict.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="typeId" label="类别">
              <Select showSearch placeholder="选择区域">
                {dict.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </>
        ) : null}
      </Form>
    </BaseModal>
  );
};
export default MaintainModal;
