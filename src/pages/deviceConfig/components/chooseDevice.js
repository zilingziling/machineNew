import BaseModal from '@/components/baseModal';
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, Table } from 'antd';
import { getBrandsTree, getTypes } from '@/service/device';
import { myLocale } from '@/utils/common';
import { showTotal } from '@/utils/func';
import { getCodeList } from '@/service/codeStore';
import styles from '../../codeStore/index.less';
const { Option } = Select;
const ChooseDevice = ({ chooseV, setChooseV, setModalV, setEditInfo, setModalTitle }) => {
  const [types, setType] = useState([]);
  const [typeId, setTypeId] = useState(undefined);
  const [brandId, setBrandId] = useState(undefined);
  const [brand, setBrand] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState('');
  const [totalPage, setTotalPage] = useState('');
  const [keyword, setKeyword] = useState('');
  const [selectedRows, setSelectedRows] = useState(null);
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
    getTable();
  }, []);
  const onCancel = () => {
    setChooseV(false);
  };
  const getTable = (page, pageSize1, reset = false) => {
    const p = reset
      ? {
          page: 1,
          limit: 10,
        }
      : {
          page: page ? page : current,
          limit: pageSize1 ? pageSize1 : pageSize,
          keyword,
          typeId,
          brandId,
        };
    getCodeList(p).then(r => {
      if (r.code === 0) {
        setTableList(r.data.list);
        setTotal(r.data.totalCount);
        setTotalPage(r.data.totalPage);
      }
    });
  };
  const onReset = () => {
    setCurrent(1);
    setTypeId(undefined);
    setBrandId(undefined);
    setKeyword('');
    setPageSize(10);
    getTable(1, 10, true);
  };
  const pagination = {
    total,
    pageSize,
    current: current,
    showQuickJumper: true,
    showTotal: () => showTotal(totalPage, total),
  };
  const onTableChange = p => {
    setCurrent(p.current);
    setPageSize(p.pageSize);
  };
  const column = [
    {
      title: '设备类型',
      dataIndex: 'type',
    },
    {
      title: '品牌',
      dataIndex: 'brand',
    },
    {
      title: '型号',
      dataIndex: 'model',
    },
    {
      title: '控制方式',
      dataIndex: 'connectionWay',
    },
    {
      title: '创建时间',
      dataIndex: 'brand',
    },
  ];
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows[0]);
      setEditInfo(selectedRows[0]);
    },
    type: 'radio',
  };
  const onChoose = () => {
    setModalTitle('新增设备');
    setChooseV(false);
    setModalV(true);
  };
  return (
    <BaseModal
      maskClosable={false}
      footer={null}
      onCancel={onCancel}
      width={850}
      visible={chooseV}
      title="选择设备"
    >
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
        <Input
          placeholder="请输入设备型号"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          className="mr1 w200"
        />
        <Button className="shadowBtn mr1" onClick={() => getTable()}>
          搜索
        </Button>
        <Button className="shadowBtn" onClick={onReset}>
          重置
        </Button>
      </div>
      <Table
        rowSelection={{
          ...rowSelection,
        }}
        rowKey="id"
        pagination={pagination}
        onChange={onTableChange}
        dataSource={tableList}
        locale={myLocale}
        className="normalTable mt1"
        columns={column}
      />
      <div className={styles.center}>
        <Button onClick={onChoose} className="shadowBtn mt1" disabled={!selectedRows}>
          选择完成
        </Button>
      </div>
    </BaseModal>
  );
};

export default ChooseDevice;
