import React, { useEffect, useState } from 'react';
import styles from '../../assets.less';
import {
  Form,
  List,
  notification,
  Radio,
  Table,
  Select,
  Upload,
  Button,
  Descriptions,
  TreeSelect,
  Input,
} from 'antd';
import BaseModal from '@/components/baseModal';
import { getBrandsTree, getTypes } from '@/service/device';
import { myLocale } from '@/utils/common';
import { getFactorySelect } from '@/service/assetsManage';
const { Option } = Select;
const FirmTable = ({ firmV, setFirmV, setSelectFirmInfo }) => {
  const [tableData, setTableData] = useState([]);
  const [types, setTypes] = useState([]);
  const [brand, setBrand] = useState([]);
  const [typeId, setTypeId] = useState('');
  const [brandId, setBrandId] = useState('');
  useEffect(() => {
    getBrandsTree().then(r => {
      if (r.code === 0) {
        setBrand(r.data);
      }
    });
    getTypes().then(r => {
      if (r.code === 0) {
        setTypes(r.data);
      }
    });
    getFactorySelect().then(r => {
      if (r.code === 0) {
        setTableData(r.data);
      }
    });
  }, []);
  const onModalCancel = () => {
    setFirmV(false);
  };
  const onModalOk = () => {};
  const onSearch = () => {
    getFactorySelect({ typeId, brandId }).then(r => {
      if (r.code === 0) {
        setTableData(r.data);
      }
    });
  };
  const columns = [
    {
      title: '厂商',
      dataIndex: 'name',
    },
    {
      title: '电话',
      dataIndex: 'phone',
    },
    {
      title: '说明',
      dataIndex: 'content',
    },
    {
      title: '操作',
      render: (text, record) => (
        <a
          href="#!"
          className="opeA"
          onClick={() => {
            setSelectFirmInfo(record);
            setFirmV(false);
          }}
        >
          选择
        </a>
      ),
    },
  ];
  const onReset = () => {
    setBrandId(null);
    setTypeId(null);
    getFactorySelect().then(r => {
      if (r.code === 0) {
        setTableData(r.data);
      }
    });
  };
  return (
    <BaseModal
      width={700}
      className={styles.assets}
      onOk={onModalOk}
      title="厂商选择"
      visible={firmV}
      onCancel={onModalCancel}
    >
      <div className="searchWrapper mb1">
        <Select
          value={typeId}
          onChange={v => setTypeId(v)}
          style={{ width: 280 }}
          placeholder="选择类型"
          className="mr1"
        >
          {types.map(item => (
            <Option value={item.id} key={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
        <Select
          value={brandId}
          onChange={v => setBrandId(v)}
          style={{ width: 280 }}
          placeholder="选择品牌"
          className="mr1"
        >
          {brand.map(item => (
            <Option value={item.id} key={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
        <Button className="shadowButton mr1" onClick={onSearch}>
          搜索
        </Button>
        <Button className="shadowButton" onClick={onReset}>
          清空
        </Button>
      </div>
      <Table
        rowKey="id"
        dataSource={tableData}
        locale={myLocale}
        className="normalTable"
        columns={columns}
        scroll={{ y: 300 }}
        pagination={false}
      />
    </BaseModal>
  );
};
export default FirmTable;
