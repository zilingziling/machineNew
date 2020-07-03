import React, { Component, useEffect, useReducer, useState } from 'react';
import { Button, Divider, Form, Input, Table, Popconfirm, Modal, notification, Select } from 'antd';
import { showTotal } from '../../../utils/func';
import { getBrandsTree, getTypes } from '@/service/device';
import { QuestionCircleFilled } from '@ant-design/icons';
import { myLocale } from '@/utils/common';

import { delFactory, getFactoryEdit, getFactoryList } from '@/service/assetsManage';
import FactoryModal from '@/pages/assetsManage/factory/factoryModal';
const { Option } = Select;
const Factory = () => {
  // table列表 区域
  const [tableList, setTableList] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState('');
  const [totalPage, setTotalPage] = useState('');
  // search
  const [typeId, setTypeId] = useState(undefined);
  const [brandId, setBrandId] = useState(undefined);
  const [types, setTypes] = useState([]);
  const [brand, setBrand] = useState([]);
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
  }, []);
  useEffect(() => getTable(), [pageSize, current, typeId, brandId]);
  const onTableChange = p => {
    setCurrent(p.current);
    setPageSize(p.pageSize);
  };
  const getTable = () => {
    getFactoryList({ page: current, limit: pageSize, typeId, brandId }).then(r => {
      if (r.code === 0) {
        setTableList(r.data.list);
        setTotal(r.data.totalCount);
        setTotalPage(r.data.totalPage);
      }
    });
  };
  // 搜索和重置
  const onSearch = () => {
    setCurrent(1);
  };
  const onReset = () => {
    setCurrent(1);
    setTypeId(undefined);
    setBrandId(undefined);
  };
  const pagination = {
    total,
    pageSize,
    current: current,
    showQuickJumper: true,
    showTotal: () => showTotal(totalPage, total),
  };
  const column = [
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
      title: '负责设备',
      dataIndex: 'dict',
    },
    {
      title: '总维修数量',
      dataIndex: 'allRepair',
    },
    {
      title: '在修数量',
      dataIndex: 'inRepair',
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
          <a href="#!" className="opeA">
            维修记录
          </a>
          <Divider type="vertical" />
          <a href="#!" className="opeA" onClick={() => onClickOperation('edit', record)}>
            编辑
          </a>
          <Divider type="vertical" />
          <a href="#!" className="opeA" onClick={() => onClickDel(record)}>
            删除
          </a>
        </>
      ),
    },
  ];
  // 弹窗区域
  const [modalTitle, setModalTitle] = useState('');
  const [modalV, setModalV] = useState(false);
  const [editInfo, setEditInfo] = useState({});
  const modalProps = {
    modalTitle,
    modalV,
    setModalV,
    getTable,
    editInfo,
    types,
    brand,
  };
  const onClickOperation = (type, record) => {
    if (type === 'add') {
      setEditInfo({});
      setModalTitle('新增');
    } else {
      setModalTitle('编辑');
      getFactoryEdit({ id: record.id }).then(r => {
        if (r.code === 0) {
          setEditInfo({ ...record, groupInfo: r.data });
        } else {
          setEditInfo(record);
        }
      });
    }
    setModalV(true);
  };
  // 删除
  const { confirm } = Modal;
  function onClickDel(record) {
    confirm({
      title: `确认删除${record.name} 吗？`,
      okText: '确定',
      cancelText: '取消',
      icon: <QuestionCircleFilled />,
      onOk() {
        delFactory({ id: record.id }).then(r => {
          if (r.code === 0) {
            notification.success({
              message: r.msg,
            });
            getTable();
            setEditInfo({});
          }
        });
      },
      onCancel() {},
    });
  }

  return (
    <div className="normalWrap">
      <FactoryModal {...modalProps} />
      <div className="searchWrapper">
        <span>名称：</span>
        <Select
          className="searchInput mr1"
          placeholder="类型"
          value={typeId}
          onSelect={value => setTypeId(value)}
        >
          {types.map(item => (
            <Option value={item.id} key={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
        <Select
          className="searchInput mr1"
          placeholder="品牌"
          value={brandId}
          onSelect={value => setBrandId(value)}
        >
          {brand.map(item => (
            <Option value={item.id} key={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
        <Button className="shadowBtn mr1" onClick={onSearch}>
          搜索
        </Button>
        <Button className="shadowBtn" onClick={onReset}>
          重置
        </Button>
      </div>
      <br />
      <Button className="shadowBtn" onClick={() => onClickOperation('add')}>
        添加厂商
      </Button>

      <Table
        rowKey="id"
        pagination={pagination}
        onChange={onTableChange}
        dataSource={tableList}
        locale={myLocale}
        className="normalTable"
        columns={column}
      />
    </div>
  );
};

export default Factory;
