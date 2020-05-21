import React from 'react';
import { Table } from 'antd';

const NotHandle = () => {
  const column = [
    { title: '位置', dataIndex: 'schoolroom' },
    { title: '发生时间', dataIndex: 'event_time' },
    { title: '事件类型', dataIndex: 'eventtypename' },
    {
      title: '操作',
    },
  ];
  return <Table className="normalTable" columns={column} />;
};
export default NotHandle;
