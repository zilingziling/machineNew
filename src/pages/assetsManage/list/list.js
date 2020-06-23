import React from 'react';
import { Button, DatePicker, Input, Select, Table } from 'antd';
import { myLocale } from '@/utils/common';
const { RangePicker } = DatePicker;

const List = () => {
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
      title: '类型',
    },
    {
      title: '品牌',
    },
    {
      title: '型号',
    },
    {
      title: '位置',
    },
    {
      title: '添加时间',
    },
    {
      title: '购入时间',
    },
    {
      title: '使用年限',
    },
    {
      title: '维修负责人',
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
        <Button className="shadowBtn mr1">搜索</Button>
        <Button className="shadowBtn mr1">数据导出</Button>
        <Button className="shadowBtn">报修录入</Button>
      </div>

      <Table rowKey="id" locale={myLocale} className="normalTable" columns={column} />
    </div>
  );
};
export default List;
