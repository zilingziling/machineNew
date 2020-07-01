import React, { Component, useEffect, useReducer, useState } from 'react';
import { Button, Divider, Form, Input, Table, Popconfirm, Modal, notification } from 'antd';
// import Add_edit from './components/add_edit';
import { showTotal } from '../../../utils/func';
import { del, getBrandList } from '@/service/device';
import { QuestionCircleFilled } from '@ant-design/icons';
import { myLocale } from '@/utils/common';
import Add_edit from '@/pages/brand/components/add_edit';
import { delMaintain, getMaintainEdit, getMaintainList } from '@/service/assetsManage';
import MaintainModal from '@/pages/assetsManage/maintain/maintainModal';

const Maintain = () => {
  // table列表 区域
  const [tableList, setTableList] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState('');
  const [totalPage, setTotalPage] = useState('');
  // search
  const [keyword, setKeyword] = useState('');
  useEffect(() => getTable(), [pageSize, current, keyword]);
  const onTableChange = (p) => {
    setCurrent(p.current);
    setPageSize(p.pageSize);
  };
  const getTable = () => {
    getMaintainList({ page: current, limit: pageSize, keyword }).then((r) => {
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
      title: '人员账号',
      dataIndex: 'account',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '电话',
      dataIndex: 'phone',
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
  };
  const onClickOperation = (type, record) => {
    if (type === 'add') {
      setEditInfo({});
      setModalTitle('新增');
    } else {
      setModalTitle('编辑');
      getMaintainEdit({ id: record.id }).then((r) => {
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
        delMaintain({ id: record.id }).then((r) => {
          if (r.code === 0) {
            notification.success({
              message: r.msg,
            });
            getTable();
            setEditInfo({});
          } else {
            notification.error({
              message: r.msg,
            });
          }
        });
      },
      onCancel() {},
    });
  }

  return (
    <div className="normalWrap">
      <MaintainModal {...modalProps} />
      <div className="searchWrapper">
        <span>名称：</span>
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
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
        添加人员
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

export default Maintain;
