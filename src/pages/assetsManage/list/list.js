import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Divider, Input, Modal, notification, Select, Table } from 'antd';
import { myLocale } from '@/utils/common';
import { del, getBrandList, getBrandsTree, getTypes } from '@/service/device';
import { showTotal } from '@/utils/func';
import { delAssets, getAssetsList, getMaintainSelect } from '@/service/assetsManage';
import { QuestionCircleFilled } from '@ant-design/icons';
import ListModal from '@/pages/assetsManage/list/listModal';
const { RangePicker } = DatePicker;
const { Option } = Select;

const List = () => {
  // table列表 区域
  const [tableList, setTableList] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState('');
  const [totalPage, setTotalPage] = useState('');
  // search
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('');
  const [typeId, setTypeId] = useState('');
  const [options, setOptions] = useState([]);
  useEffect(() => getTable(), [pageSize, current, keyword, type, typeId]);
  const onTableChange = (p) => {
    setCurrent(p.current);
    setPageSize(p.pageSize);
  };
  const getTable = () => {
    getAssetsList({ page: current, limit: pageSize, keyword, type, typeId }).then((r) => {
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
    setType('');
    setTypeId('');
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
  const [maintainTree, setMaintainTree] = useState([]);
  useEffect(() => {
    getTypes().then((r) => {
      if (r.code === 0) {
        setTypes(r.data);
      }
    });
    getBrandsTree().then((r) => {
      if (r.code === 0) {
        setBrands(r.data);
      }
    });
    getMaintainSelect().then((r) => {
      if (r.code === 0) {
        setMaintainTree(r.data);
      }
    });
  }, []);
  const onSelect1 = (value) => {
    setType(value);
    switch (value) {
      case '设备类型':
        setOptions(types);
        break;
      case '设备品牌':
        setOptions(brands);
        break;
      case '维修人':
        setOptions(maintainTree);
        break;
      default:
        setOptions([]);
    }
  };
  const column = [
    {
      title: '资产编号',
      dataIndex: 'number',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
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
      title: '位置',
      dataIndex: 'position',
    },
    {
      title: '添加时间',
      dataIndex: 'addtime',
    },
    {
      title: '购入时间',
      dataIndex: 'buyTime',
    },
    {
      title: '使用年限',
      dataIndex: 'useYear',
    },
    {
      title: '维修负责人',
      dataIndex: 'maintainer',
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
          <a href="#!" className="opeA" onClick={() => onClickOperation('edit', record)}>
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
  const [modalTitle, setModalTitle] = useState('');
  const [modalV, setModalV] = useState(false);
  const [editInfo, setEditInfo] = useState({});
  const modalProps = {
    modalTitle,
    modalV,
    setModalV,
    getTable,
    editInfo,
    types,
    brands,
    maintainTree,
  };
  const onClickOperation = (type, record) => {
    if (type === 'add') {
      setEditInfo({});
      setModalTitle('新增');
    } else {
      setModalTitle('编辑');
      setEditInfo(record);
    }
    setModalV(true);
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
        delAssets({ id: record.id }).then((r) => {
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
      <ListModal {...modalProps} />
      <div className="searchWrapper">
        <span>筛选：</span>
        <Select className="searchInput mr1" placeholder="选择筛选类型" onSelect={onSelect1}>
          <Option value="设备类型">类型</Option>
          <Option value="设备品牌">品牌</Option>
          <Option value="维修人">维修负责人</Option>
        </Select>
        <Select
          className="searchInput mr1"
          placeholder="请选择"
          onSelect={(value) => setTypeId(value)}
        >
          {options.map((item) => (
            <Option value={item.id}>{item.name}</Option>
          ))}
        </Select>
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onPressEnter={onSearch}
          className="searchInput mr1"
          placeholder="输入名称"
        />
        <Button className="shadowBtn mr1" onClick={onSearch}>
          搜索
        </Button>
        <Button className="shadowBtn mr1" onClick={onReset}>
          重置
        </Button>
        <Button className="shadowBtn mr1" onClick={() => onClickOperation('add')}>
          资产录入
        </Button>
        <Button className="shadowBtn">数据导出</Button>
      </div>
      <Table
        rowKey="equipmentClassroomId"
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
export default List;
