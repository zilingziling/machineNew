import React, { useEffect, useState } from 'react';
import { Tree, Table, Button, Input } from 'antd';
import { getBrandList, getDeviceConfig, getDeviceConfigTree } from '@/service/device';
import { formatTreeData, showTotal } from '@/utils/func';
import { myLocale } from '@/utils/common';
import DeviceConfigModal from '@/pages/deviceConfig/deviceConfigModal';
const { DirectoryTree } = Tree;
const DeviceConfig = () => {
  // table列表 区域
  const [tableList, setTableList] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState('');
  const [totalPage, setTotalPage] = useState('');
  // 选中的教室id
  const [classroomId, setClassRoomId] = useState('');
  // search
  const [keyword, setKeyword] = useState('');
  useEffect(() => getTable(), [pageSize, current, keyword]);
  const onTableChange = (p) => {
    setCurrent(p.current);
    setPageSize(p.pageSize);
  };
  const getTable = (id) => {
    if (!classroomId && !id) return;
    getDeviceConfig({
      page: current,
      limit: pageSize,
      keyword,
      classroomId: id || classroomId,
    }).then((r) => {
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
  };
  const pagination = {
    total,
    pageSize,
    current: current,
    showQuickJumper: true,
    showTotal: () => showTotal(totalPage, total),
  };
  // 树菜单操作区

  const onSelect = (keys, event) => {
    if (keys[0].includes('classroom')) {
      setClassRoomId(event.node.id);
      getTable(event.node.id);
    }
  };
  const onExpand = () => {};
  const [classTree, setClassTree] = useState([]);
  useEffect(() => {
    getDeviceConfigTree().then((r) => {
      if (r.code === 0) {
        // console.log(formatTreeData(r.data, true));
        setClassTree(formatTreeData(r.data, true));
      }
    });
  }, []);
  const column = [
    {
      title: '设备名称',
      dataIndex: 'name',
    },
    {
      title: '设备类型',
      dataIndex: 'type',
    },
    {
      title: '品牌',
      dataIndex: 'brand',
    },
    {
      title: '型号',
      dataIndex: 'equipmentSort',
    },
    {
      title: '控制方式',
      dataIndex: '',
    },
    {
      title: 'IP地址',
      dataIndex: '',
    },
    {
      title: '操作',
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
  return (
    <div className="treeWrapper">
      <DeviceConfigModal {...modalProps} />
      <DirectoryTree
        multiple
        showLine
        defaultExpandAll
        onSelect={onSelect}
        onExpand={onExpand}
        treeData={classTree}
        className="normalTree"
        showIcon={false}
      />
      <div className="normalTable mt0">
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onPressEnter={onSearch}
          className="searchInput mr1"
        />
        <Button className="shadowBtn mr1" onClick={onSearch}>
          搜索
        </Button>
        <Button className="shadowBtn mr1" onClick={onReset}>
          重置
        </Button>
        <Button className="shadowBtn" onClick={() => onClickOperation('add')}>
          添加设备
        </Button>
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
    </div>
  );
};

export default DeviceConfig;
