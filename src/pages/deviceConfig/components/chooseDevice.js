import BaseModal from '@/components/baseModal';
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select } from 'antd';
import { getBrandsTree, getTypes } from '@/service/device';
const { Option } = Select;
const ChooseDevice = ({ chooseV, setChooseV }) => {
  const [form] = Form.useForm();
  const [types, setType] = useState([]);
  const [typeId, setTypeId] = useState(undefined);
  const [brandId, setBrandId] = useState(undefined);
  const [brand, setBrand] = useState([]);
  useEffect(() => {
    getBrandsTree().then(r => {
      if (r.code === 0) {
        setBrand(r.data);
      }
    });
    getTypes().then(r => {
      if (r.code === 0) {
        setType(r.data);
      }
    });
  }, []);
  const onCancel = () => {
    setChooseV(false);
  };
  return (
    <BaseModal onCancel={onCancel} width={850} visible={chooseV} title="选择设备">
      <div className="searchWrapper">
        <span>设备类型：</span>
        <Select
          className="searchInput mr1"
          placeholder="设备类型"
          value={typeId}
          onSelect={value => setTypeId(value)}
        >
          {types.map(item => (
            <Option value={item.id} key={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
        <span>品牌：</span>
        <Select
          className="searchInput mr1"
          placeholder="设备品牌"
          value={brandId}
          onSelect={value => setBrandId(value)}
        >
          {brand.map(item => (
            <Option value={item.id} key={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
        <Input placeholder="请输入设备型号" className="mr1 w200" />
        <Button className="shadowBtn mr1">搜索</Button>
        <Button className="shadowBtn">重置</Button>
      </div>
    </BaseModal>
  );
};

export default ChooseDevice;
