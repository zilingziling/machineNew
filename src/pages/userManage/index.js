import React from 'react';
import { Button, Input, Table } from 'antd';
const UserManage = () => {
  const column = [
    {
      title: '账号',
    },
    {
      title: '所属学校',
    },
    {
      title: '联系人',
    },
    {
      title: '联系电话',
    },
    {
      title: '状态',
    },
    {
      title: '操作',
    },
  ];
  return (
    <div className="normalWrap">
      <div className="searchWrapper">
        <span>账号名称：</span>
        <Input className="searchInput mr1" />
        <Button className="shadowBtn">搜索</Button>
      </div>
      <br />
      <Button className="shadowBtn">新增</Button>
      <Table className="normalTable" columns={column} />
    </div>
  );
};
export default UserManage;
