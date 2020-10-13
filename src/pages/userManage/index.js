import React, { useEffect, useState } from 'react';
import { Button, Divider, Input, Modal, notification, Table } from 'antd';
import { isAuthorized, showTotal } from '@/utils/func';
import { myLocale } from '@/utils/common';
import { delUser, getUserList, resetPwd } from '@/service/userManage';
import UserModal from '@/pages/userManage/userModal';
import ChangePwd from '@/pages/userManage/changePwd';
import { QuestionCircleFilled } from '@ant-design/icons';
const UserManage = () => {
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
    getUserList({ page: current, limit: pageSize, keyword }).then(r => {
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
      title: '账号',
      dataIndex: 'account',
    },
    {
      title: '所属学校',
      dataIndex: 'school',
    },
    {
      title: '联系人',
      dataIndex: 'userName',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
    },
    {
      title: '状态',
      dataIndex: 'status',
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
          <a href="#!" className="opeA" onClick={() => onClickChange(record)}>
            修改密码
          </a>
          <Divider type="vertical" />
          <a href="#!" className="opeA" onClick={() => onClickResetPwd(record)}>
            重置密码
          </a>
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
  // 操作区
  const [selectUser, setSelectUser] = useState('');
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
    selectUser,
  };
  const onClickOperation = (type, record) => {
    if (type === 'add') {
      setEditInfo({});
      setModalTitle('新增');
    } else {
      setModalTitle('编辑');
      setEditInfo(record);
      setSelectUser(record.id);
    }
    setModalV(true);
  };
  // 修改密码
  const [pwdV, setPwdV] = useState(false);
  const [userId, setUserId] = useState('');
  const pwdProps = {
    pwdV,
    setPwdV,
    getTable,
    userId,
  };
  const onClickChange = record => {
    setUserId(record.id);
    setPwdV(true);
  };
  // 重置和删除
  const { confirm } = Modal;
  function onClickDel(record) {
    confirm({
      title: `确认删除${record.account || ''} 吗？`,
      okText: '确定',
      cancelText: '取消',
      icon: <QuestionCircleFilled />,
      onOk() {
        delUser({ id: record.id }).then(r => {
          if (r.code === 0) {
            notification.success({
              message: r.msg,
            });
            getTable();
          }
        });
      },
      onCancel() {},
    });
  }
  function onClickResetPwd(record) {
    confirm({
      title: '确认重置密码？',
      okText: '确定',
      cancelText: '取消',
      icon: <QuestionCircleFilled />,
      onOk() {
        resetPwd({ id: record.id }).then(r => {
          if (r.code === 0) {
            notification.success({
              message: r.msg,
            });
            getTable();
          }
        });
      },
      onCancel() {},
    });
  }
  return (
    <div className="normalWrap">
      <UserModal {...modalProps} />
      <ChangePwd {...pwdProps} />
      <div className="searchWrapper">
        <span>账号名称：</span>
        <Input
          className="searchInput mr1"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onPressEnter={onSearch}
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
export default UserManage;
