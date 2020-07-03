import React, { useEffect, useState } from 'react';
import { Button, Divider, Input, Radio, Select, Table } from 'antd';
import { myLocale } from '@/utils/common';
import { getBrandsTree, getTypes } from '@/service/device';
import { showTotal } from '@/utils/func';
import { getAssetsWarningList } from '@/service/assetsManage';
const { Option } = Select;

const AssetsWarning = () => {
  // table列表 区域
  const [tableList, setTableList] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState('');
  const [totalPage, setTotalPage] = useState('');
  // search
  const [keyword, setKeyword] = useState('');
  const [typeId, setTypeId] = useState(undefined);
  const [brandId, setBrandId] = useState(undefined);
  const [orderBy, setOrderBy] = useState('');
  useEffect(() => getTable(), [pageSize, current, keyword, brandId, typeId, orderBy]);
  const onTableChange = p => {
    setCurrent(p.current);
    setPageSize(p.pageSize);
  };
  const getTable = () => {
    getAssetsWarningList({
      page: current,
      limit: pageSize,
      keyword,
      brandId,
      typeId,
      orderBy,
    }).then(r => {
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
    setBrandId(undefined);
    setTypeId(undefined);
    setOrderBy('');
  };
  const pagination = {
    total,
    pageSize,
    current: current,
    showQuickJumper: true,
    showTotal: () => showTotal(totalPage, total),
  };
  const [types, setTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  useEffect(() => {
    getTypes().then(r => {
      if (r.code === 0) {
        setTypes(r.data);
      }
    });
    getBrandsTree().then(r => {
      if (r.code === 0) {
        setBrands(r.data);
      }
    });
  }, []);
  const column = [
    {
      title: '类型',
      dataIndex: 'type',
    },
    {
      title: '品牌',
      dataIndex: 'brand',
    },
    {
      title: '型号',
      dataIndex: 'model',
    },
    {
      title: '总台数',
      dataIndex: 'total',
    },
    {
      title: '最早购入时间',
      dataIndex: 'buyTime',
    },
    {
      title: '使用年限',
      dataIndex: 'useYear',
    },

    {
      title: '平均免修年限',
      dataIndex: 'repairFreeYear',
    },
    {
      title: '平均维护费用',
      dataIndex: 'cost',
      render: text => <span className={orderBy === 'cost' ? 'orange' : ''}>{text}</span>,
    },
    {
      title: '平均保修次数',
      dataIndex: 'repairTimes',
      render: text => <span className={orderBy === 'repairTimes' ? 'orange' : ''}>{text}</span>,
    },
    {
      title: '即将报废（半年内）',
      dataIndex: 'scrapTotal',
      render: text => <span className={orderBy === 'scrap' ? 'orange' : ''}>{text}</span>,
    },
  ];

  return (
    <div className="normalWrap">
      <div className="searchWrapper">
        <span>筛选：</span>
        <Select
          className="searchInput mr1"
          placeholder="选择品牌"
          value={brandId}
          onSelect={value => setBrandId(value)}
        >
          {brands.map(item => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
        <Select
          className="searchInput mr1"
          placeholder="选择类型"
          value={typeId}
          onSelect={value => setTypeId(value)}
        >
          {types.map(item => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
        <Input
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onPressEnter={onSearch}
          className="searchInput mr1"
          placeholder="输入型号"
        />
        <Button className="shadowBtn mr1" onClick={onSearch}>
          搜索
        </Button>
        <Button className="shadowBtn mr1" onClick={onReset}>
          重置
        </Button>
        <Radio.Group
          value={orderBy}
          onChange={e => setOrderBy(e.target.value)}
          buttonStyle="solid"
          className="mr1"
        >
          <Radio.Button value="scrap">报废数量</Radio.Button>
          <Radio.Button value="repairTimes">报修次数</Radio.Button>
          <Radio.Button value="cost">维护费用</Radio.Button>
        </Radio.Group>
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
export default AssetsWarning;
