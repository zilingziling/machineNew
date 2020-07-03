import React, { Component, useEffect, useReducer, useState } from 'react';
import { Button, Divider, Input, Modal, notification, Select, Table } from 'antd';
import A_e_modal from './components/A-E-modal';
import { delType, getDtypeList, getTypes } from '@/service/device';
import { showTotal } from '@/utils/func';
import { QuestionCircleFilled } from '@ant-design/icons';
import { myLocale } from '@/utils/common';
const DeviceType = () => {
  // table列表 区域
  const [tableList, setTableList] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState('');
  const [totalPage, setTotalPage] = useState('');
  // search
  const [keyword, setKeyword] = useState('');
  useEffect(() => getTable(), [pageSize, current, keyword]);
  const onTableChange = p => {
    setCurrent(p.current);
    setPageSize(p.pageSize);
  };
  const getTable = () => {
    getDtypeList({ page: current, limit: pageSize, keyword }).then(r => {
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
      title: '设备类型',
      dataIndex: 'name',
    },
    {
      title: '排序',
      dataIndex: 'sort',
    },
    {
      title: '控制页显示',
      dataIndex: 'isShow',
      render: text => (text === 1 ? '显示' : '不显示'),
    },
    {
      title: '类型编码',
      dataIndex: 'code',
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
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
  // 图片上传
  const [tempImg, setTempImg] = useState('');

  const modalProps = {
    modalTitle,
    modalV,
    setModalV,
    getTable,
    editInfo,
    tempImg,
    setTempImg,
  };
  const onClickOperation = (type, record) => {
    if (type === 'add') {
      setEditInfo({});
      setModalTitle('新增');
    } else {
      setModalTitle('编辑');
      setEditInfo(record);
    }
    setTempImg('');
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
        delType({ id: record.id }).then(r => {
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
      <A_e_modal {...modalProps} />
      <div className="searchWrapper">
        <span>设备类型：</span>
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
      <Button className="shadowBtn" onClick={() => onClickOperation('add')}>
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

export default DeviceType;
