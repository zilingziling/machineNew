import React, { useEffect, useState } from 'react';
import { Form, Input, notification, Radio, InputNumber, Select } from 'antd';
import { layout, roleLayout } from '../../../utils/common';
import BaseModal from '@/components/baseModal';
import { getBrandsTree, getTypes } from '@/service/device';
const { Option } = Select;
const ChooseType = ({
  chooseV,
  setChooseV,
  setInfo,
  curGroup,
  maintainerTypeBrands,
  setTypeBrands,
  maintainerId,
}) => {
  const [form] = Form.useForm();
  const onModalCancel = () => {
    setChooseV(false);
    form.resetFields();
  };

  const onModalOk = () => {
    form
      .validateFields()
      .then((value) => {
        if (value) {
          const typeName = types.find((item) => item.id === value[`typeId${curGroup}`]).name;
          const brandName = brand.find((item) => item.id === value[`brandId${curGroup}`]).name;
          let param = [...maintainerTypeBrands];
          try {
            (param[curGroup] || (param[curGroup] = {})).brandId = value[`brandId${curGroup}`];
            (param[curGroup] || (param[curGroup] = {})).typeId = value[`typeId${curGroup}`];
            (param[curGroup] || (param[curGroup] = {})).groupId = curGroup;
            (param[curGroup] || (param[curGroup] = {})).maintainerId = maintainerId;
          } catch (e) {
            console.log(e);
          }
          setTypeBrands(param);
          const newInfo = { ...value };
          newInfo[`combineName${curGroup}`] = brandName + typeName;
          setInfo(newInfo);
          onModalCancel();
        }
      })
      .catch(() => {});
  };
  const [types, setTypes] = useState([]);
  const [brand, setBrand] = useState([]);
  useEffect(() => {
    getBrandsTree().then((r) => {
      if (r.code === 0) {
        setBrand(r.data);
      }
    });
    getTypes().then((r) => {
      if (r.code === 0) {
        setTypes(r.data);
      }
    });
  }, []);
  return (
    <BaseModal onOk={onModalOk} title="选择类别" visible={chooseV} onCancel={onModalCancel}>
      <Form form={form} {...layout} className="mt1">
        <Form.Item
          name={`brandId${curGroup}`}
          label="品牌"
          rules={[{ required: true, message: '请选择品牌！' }]}
        >
          <Select showSearch placeholder="选择品牌">
            {brand.map((item) => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name={`typeId${curGroup}`}
          label="类型"
          rules={[{ required: true, message: '请选择类型！' }]}
        >
          <Select showSearch placeholder="选择类型">
            {types.map((item) => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </BaseModal>
  );
};
export default ChooseType;
