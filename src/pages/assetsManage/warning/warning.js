import React from 'react';
import { Button, DatePicker, Input, Radio, Select, Table } from 'antd';
import { myLocale } from '@/utils/common';
const { RangePicker } = DatePicker;

const AssetsWarning = () => {
  const column = [
    {
      title: '类型',
      dataIndex: 'name',
    },
    {
      title: '品牌',
      dataIndex: 'sort',
    },
    {
      title: '型号',
    },
    {
      title: '总台数',
    },
    {
      title: '最早购入时间',
    },
    {
      title: '使用年限',
    },
    {
      title: '平均免修年限',
    },
    {
      title: '平均维护费用',
    },
    {
      title: '平均报修次数',
    },
    {
      title: '即将报废（半年内）',
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
        <Radio.Group buttonStyle="solid" className="mr1">
          <Radio.Button value={1}>报警数量</Radio.Button>
          <Radio.Button value={2}>报修次数</Radio.Button>
          <Radio.Button value={3}>维护费用</Radio.Button>
        </Radio.Group>
        <Button className="shadowBtn mr1">数据导出</Button>
      </div>

      <Table rowKey="id" locale={myLocale} className="normalTable" columns={column} />
    </div>
  );
};
export default AssetsWarning;
