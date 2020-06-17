import React, { useEffect, useState } from 'react';
import { Button, Divider, Input, Modal, notification, Table } from 'antd';
import RoleModal from '@/pages/role/component/roleModal';
import { myLocale } from '@/utils/common';
import { delRole, getRoleList } from '@/service/role';
import { showTotal, tableOpe } from '@/utils/func';
import { QuestionCircleFilled } from '@ant-design/icons';
import { delOperation } from '@/service/menu';
import AuthComponent from '@/components/authButton';
const AuthButton = AuthComponent(Button);

const Role = () => {
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
    getRoleList({ page: current, limit: pageSize, keyword }).then((r) => {
      if (r.code === 0) {
        setTableList(r.data.list);
        setTotal(r.data.totalCount);
        setTotalPage(r.data.totalPage);
      }
    });
  };
  // 搜索和重置
  const onSearch = () => {
    console.log(keyword);
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
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '角色代码',
      dataIndex: 'code',
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
          <a href="#!" className="opeA" onClick={() => onClickRole('edit', record)}>
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
  const [roleTitle, setRoleTitle] = useState('');
  const [roleV, setRoleV] = useState(false);
  const [editInfo, setEditInfo] = useState({});
  const roleProps = {
    roleTitle,
    roleV,
    setRoleV,
    getTable,
    editInfo,
  };
  const onClickRole = (type, record) => {
    if (type === 'add') {
      setEditInfo({});
      setRoleTitle('新增');
    } else {
      setRoleTitle('编辑');
      setEditInfo(record);
    }
    setRoleV(true);
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
        delRole({ id: record.id }).then((r) => {
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
      <RoleModal {...roleProps} />
      <div className="searchWrapper">
        <span>角色名称：</span>
        <Input
          className="searchInput mr1"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
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
      <AuthButton className="shadowBtn" authName="add" onClick={() => onClickRole('add')}>
        新增
      </AuthButton>
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
export default Role;
