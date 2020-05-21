import React from 'react';
import { Button, Input, Table } from 'antd';
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
  return (
    <div className="normalWrap">
      <div className='searchWrapper'>
        <span>角色名称：</span>
        <Input className="searchInput mr1" />
        <Button className="shadowBtn">搜索</Button>
      </div>
      <br />
      <Button className="shadowBtn">新增</Button>
      <Table
        className='normalTable'
      columns={column}
      />
    </div>
  );
};
export default Role;
