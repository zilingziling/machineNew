import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Input, Select, Table } from 'antd';
import { myLocale } from '@/utils/common';
import { getBrandList } from '@/service/device';
import { showTotal } from '@/utils/func';
import {
  getAssetsRepairList,
  getMaintainer,
  getMaintainSelect,
  getRepairProcess,
} from '@/service/assetsManage';
const { RangePicker } = DatePicker;
const { Option } = Select;
const Repair = () => {
  // table列表 区域
  const [tableList, setTableList] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState('');
  const [totalPage, setTotalPage] = useState('');
  //
  const [type, setType] = useState(undefined);
  const [typeId, setTypeId] = useState(undefined);
  const [time, setTime] = useState([]);
  // search
  const [keyword, setKeyword] = useState('');
  useEffect(() => getTable(), [pageSize, current, keyword, type, typeId]);
  const onTableChange = p => {
    setCurrent(p.current);
    setPageSize(p.pageSize);
  };
  const getTable = () => {
    getAssetsRepairList({ page: current, limit: pageSize, keyword, type, typeId }).then(r => {
      if (r.code === 0) {
        setTableList(r.data.list);
        setTotal(r.data.totalCount);
        setTotalPage(r.data.totalPage);
      }
    });
  };
  const [process, setProcess] = useState([]);
  const [options, setOptions] = useState([]);
  const [maintainer, setMaintainer] = useState([]);
  useEffect(() => {
    getMaintainSelect().then(r => {
      if (r.code === 0) {
        setMaintainer(r.data);
      }
    });
    getRepairProcess().then(r => {
      if (r.code === 0) {
        setProcess(r.data);
      }
    });
  }, []);
  const onSelect1 = value => {
    setType(value);
    switch (value) {
      case 'process':
        setOptions(process);
        break;
      case 'maintainer':
        setOptions(maintainer);
        break;
      default:
        setOptions([]);
    }
  };
  // 搜索和重置
  const onSearch = () => {
    setCurrent(1);
  };
  const onReset = () => {
    setCurrent(1);
    setKeyword('');
    setType(undefined);
    setTypeId(undefined);
    setTime([]);
  };
  const pagination = {
    total,
    pageSize,
    current: current,
    showQuickJumper: true,
    showTotal: () => showTotal(totalPage, total),
  };
  const timeChange = (time, string) => {
    setTime(string);
  };
  const column = [
    {
      title: '资产编号',
      dataIndex: 'assetsNumber',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '位置',
      dataIndex: 'position',
    },
    {
      title: '报修原因',
      dataIndex: 'reason',
    },
    {
      title: '报修时间',
      dataIndex: 'repairTime',
    },
    {
      title: '报修人',
      dataIndex: 'repairUser',
    },
    {
      title: '维修进度',
      dataIndex: 'process',
    },
    {
      title: '维修方式',
      dataIndex: 'repairWay',
    },
    {
      title: '维修花费',
      dataIndex: 'cost',
    },
    {
      title: '维修人',
      dataIndex: 'maintainer',
    },
    {
      title: '维修单号',
      dataIndex: 'repairNumber',
    },
    {
      title: '处理人',
      dataIndex: 'handleUser',
    },
    {
      title: '操作',
    },
  ];
  return (
    <div className="normalWrap">
      <div className="searchWrapper">
        <span>筛选：</span>
        <Select
          className="searchInput mr1"
          value={type}
          onSelect={onSelect1}
          placeholder="选择筛选条件"
        >
          {/*<Option value="设备类型">资产类型</Option>*/}
          <Option value="process">维修进度</Option>
          <Option value="maintainer">维修人</Option>
        </Select>
        <Select
          className="searchInput mr1"
          onSelect={value => setTypeId(value)}
          placeholder="请选择"
        >
          {options.map(item => (
            <Option value={item.id} key={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
        <Input
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onPressEnter={onSearch}
          className="searchInput mr1"
          placeholder="输入名称"
        />
        <RangePicker className="mr1" allowClear onChange={timeChange} />
        <Button className="shadowBtn mr1" onClick={onSearch}>
          搜索
        </Button>
        <Button className="shadowBtn mr1" onClick={onReset}>
          重置
        </Button>
        <Button className="shadowBtn mr1">报修录入</Button>
        <Button className="shadowBtn">数据导出</Button>
      </div>
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
export default Repair;
