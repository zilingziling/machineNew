import React from 'react';
import { Button, DatePicker, Input, Select, Table } from 'antd';
import { myLocale } from '@/utils/common';
const { RangePicker } = DatePicker;

const Repair = () => {
  const column = [
    {
      title: '资产编号',
      dataIndex: 'name',
    },
    {
      title: '名称',
      dataIndex: 'sort',
    },
    {
      title: '位置',
    },
    {
      title: '报修原因',
    },
    {
      title: '报修时间',
    },
    {
      title: '报修人',
    },
    {
      title: '维修进度',
    },
    {
      title: '维修方式',
    },
    {
      title: '维修花费',
    },
    {
      title: '维修人',
    },
    {
      title: '维修单号',
    },
    {
      title: '处理人',
    },
    {
      title: '操作',
    },
  ];
  return (
    <div className="normalWrap">
      <div className="searchWrapper">
        <span>筛选：</span>
        <Select className="searchInput mr1" />
        <Select className="searchInput mr1" />
        <Input className="searchInput mr1" />
        <RangePicker className="mr1" />
        <Button className="shadowBtn mr1">全部时间</Button>
        <Button className="shadowBtn mr1">搜索</Button>
        <Button className="shadowBtn mr1">数据导出</Button>
        <Button className="shadowBtn">报修录入</Button>
      </div>

      <Table rowKey="id" locale={myLocale} className="normalTable" columns={column} />
    </div>
  );
};
export default Repair;
