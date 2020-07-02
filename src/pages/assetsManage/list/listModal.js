import React, { useEffect, useState } from 'react';
import { Form, Input, notification, DatePicker, InputNumber, Select, TreeSelect } from 'antd';
import { layout } from '../../../utils/common';
import { getDeviceConfigTree } from '@/service/device';
import BaseModal from '@/components/baseModal';
import { formatTreeSelect } from '@/utils/func';
import { addAssets, getFactorySelect, getYear } from '@/service/assetsManage';
import moment from 'moment';

const { Option } = Select;
const ListModal = ({
  modalTitle,
  modalV,
  setModalV,
  getTable,
  editInfo,
  types,
  brands,
  maintainTree,
}) => {
  const [form] = Form.useForm();
  const [position, setPosition] = useState([]);
  const [year, setYear] = useState([]);
  const [factory, setFactory] = useState([]);
  useEffect(() => {
    //  选择区域
    getDeviceConfigTree().then(r => {
      if (r.code === 0) {
        setPosition(formatTreeSelect(r.data));
      }
    });
    //   使用年限
    getYear().then(r => {
      if (r.code === 0) {
        setYear(r.data);
      }
    });
    getFactorySelect().then(r => {
      if (r.code === 0) {
        setFactory(r.data);
      }
    });
  }, []);
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
      .then(value => {
        if (value) {
          let params = value;
          if (modalTitle.includes('编辑')) {
            params.id = editInfo.id;
          }
          value.buyTime = moment(value.buyTime, 'YYYY-MM-DD');
          addAssets(params).then(r => {
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
          name="number"
          label="资产编号"
          rules={[{ required: true, message: '请输入资产编号！' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="typeId" label="类型" rules={[{ required: true, message: '请选择类型！' }]}>
          <Select placeholder="选择类型">
            {types.map(item => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="brandId"
          label="品牌"
          rules={[{ required: true, message: '请选择品牌！' }]}
        >
          <Select placeholder="选择品牌">
            {brands.map(item => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="model" label="型号" rules={[{ required: true, message: '请输入型号！' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="position"
          label="位置"
          rules={[{ required: true, message: '请输入位置！' }]}
        >
          <TreeSelect treeData={position} />
        </Form.Item>
        <Form.Item name="buyTime" label="购入时间">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="yearDict.id" label="使用年限">
          <Select>
            {year.map(item => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="maintainer.id" label="维修负责人">
          <Select>
            {maintainTree.map(item => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="manufacturer.id" label="维修厂商">
          <Select>
            {factory.map(item => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="content" label="备注">
          <Input.TextArea></Input.TextArea>
        </Form.Item>
      </Form>
    </BaseModal>
  );
};
export default ListModal;
