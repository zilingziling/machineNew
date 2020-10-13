import React, { Component, useEffect, useReducer, useState } from 'react';
import { Button, Divider, Form, Input, Modal, notification, Select, Table } from 'antd';
import A_e_func from './components/a_e_func';
import { delFunc, getFuncList, getTypes } from '@/service/device';
import { isAuthorized, showTotal } from '@/utils/func';
import { QuestionCircleFilled } from '@ant-design/icons';
import { myLocale } from '@/utils/common';
const DeviceFunc = () => {
  // table列表 区域
  const [tableList, setTableList] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState('');
  const [totalPage, setTotalPage] = useState('');
  // search
  const [keyword, setKeyword] = useState('');
  const [typeId, setTypeId] = useState(undefined);
  useEffect(() => getTable(), [pageSize, current, keyword, typeId]);
  const onTableChange = p => {
    setCurrent(p.current);
    setPageSize(p.pageSize);
  };
  const getTable = () => {
    getFuncList({ page: current, limit: pageSize, keyword, typeId }).then(r => {
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
    setKeyword('');
    setTypeId(undefined);
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
      title: '按键名称',
      dataIndex: 'name',
    },
    {
      title: '控制命令',
      dataIndex: 'command',
    },
    {
      title: '设备类型',
      dataIndex: 'type',
    },
    {
      title: '控制页显示',
      dataIndex: 'isShow',
      render: text => (text === 1 ? '显示' : '不显示'),
    },
    {
      title: '排序',
      dataIndex: 'sort',
    },

    {
      title: '操作',
      render: (text, record) => (
        <>
          <Button
            disabled={isAuthorized('edit')}
            className="opeA"
            onClick={() => onClickOperation('edit', record)}
          >
            编辑
          </Button>
          <Divider type="vertical" />
          <Button
            disabled={isAuthorized('delete')}
            className="opeA"
            onClick={() => onClickDel(record)}
          >
            删除
          </Button>
        </>
      ),
    },
  ];
  // 弹窗区域
  const [modalTitle, setModalTitle] = useState('');
  const [modalV, setModalV] = useState(false);
  const [editInfo, setEditInfo] = useState({});

  // 图片上传
  const [tempImg, setTempImg] = useState('');
  const modalProps = {
    modalTitle,
    modalV,
    setModalV,
    getTable,
    editInfo,
    typeId,
    tempImg,
    setTempImg,
  };
  const onClickOperation = (type, record) => {
    if (type === 'add') {
      if (!typeId) {
        notification.info({
          message: '请先选择设备类型！',
        });
        return;
      }
      setEditInfo({});
      setModalTitle('新增');
      setModalV(true);
    } else {
      setModalTitle('编辑');
      setEditInfo(record);
      setModalV(true);
    }
    setTempImg('');
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
        delFunc({ id: record.id }).then(r => {
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
  // 获取设备类型列表
  const [types, setType] = useState([]);
  useEffect(() => {
    getTypes().then(r => {
      if (r.code === 0) {
        setType(r.data);
      }
    });
  }, []);
  return (
    <div className="normalWrap">
      <A_e_func {...modalProps} />
      <div className="searchWrapper">
        <span>设备类型：</span>
        <Select value={typeId} onChange={e => setTypeId(e)} style={{ width: 200 }} className="mr1">
          {types.map(type => (
            <Select.Option value={type.id} key={type.id}>
              {type.name}
            </Select.Option>
          ))}
        </Select>
        <Input
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onPressEnter={onSearch}
          className="searchInput mr1"
        />
        <Button className="shadowBtn mr1" onClick={onSearch}>
          搜索
        </Button>
        <Button className="shadowBtn" onClick={onReset}>
          重置
        </Button>
      </div>
      <br />
      <Button
        disabled={isAuthorized('add')}
        className="shadowBtn"
        onClick={() => onClickOperation('add')}
      >
        新增
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

export default DeviceFunc;
