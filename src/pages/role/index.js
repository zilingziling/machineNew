import React, { useState } from 'react';
import { Button, Input, Table } from 'antd';
import RoleModal from '@/pages/role/component/roleModal';
import { myLocale } from '@/utils/common';
const Role = () => {
  const column = [
    {
      title: '角色名称',
    },
    {
      title: '角色代码',
    },
    {
      title: '操作',
    },
  ];
  const [roleTitle, setRoleTitle] = useState('');
  const [roleV, setRoleV] = useState(false);
  const roleProps = {
    roleTitle,
    roleV,
    setRoleV,
  };
  const onClickRole = (type, record) => {
    if (type === 'add') {
      setRoleTitle('新增');
    }
    setRoleV(true);
  };
  return (
    <div className="normalWrap">
      <RoleModal {...roleProps} />
      <div className="searchWrapper">
        <span>角色名称：</span>
        <Input className="searchInput mr1" />
        <Button className="shadowBtn mr1">搜索</Button>
        <Button className="shadowBtn">重置</Button>
      </div>
      <br />
      <Button className="shadowBtn" onClick={() => onClickRole('add')}>
        新增
      </Button>
      <Table className="normalTable" columns={column} locale={myLocale} />
    </div>
  );
};
export default Role;
