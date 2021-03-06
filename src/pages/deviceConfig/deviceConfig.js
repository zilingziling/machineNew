import React, { useEffect, useState } from 'react';
import { Tree, Table, Button, Input, notification, Divider, Modal } from 'antd';
import {
  del,
  delDevice,
  getBrandList,
  getDetails,
  getDeviceConfig,
  getDeviceConfigTree,
} from '@/service/device';
import { formatTreeData, isAuthorized, showTotal } from '@/utils/func';
import { myLocale } from '@/utils/common';
import DeviceConfigModal from '@/pages/deviceConfig/deviceConfigModal';
import { QuestionCircleFilled } from '@ant-design/icons';
import ChooseDevice from '@/pages/deviceConfig/components/chooseDevice';
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
  const onTableChange = p => {
    setCurrent(p.current);
    setPageSize(p.pageSize);
  };
  const getTable = id => {
    if (!classroomId && !id) return;
    getDeviceConfig({
      page: current,
      limit: pageSize,
      keyword,
      classroomId: id || classroomId,
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
    getDeviceConfigTree().then(r => {
      if (r.code === 0) {
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
      dataIndex: 'model',
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
          <Button
            disabled={isAuthorized('edit')}
            className="opeA"
            onClick={() => onClickOperation('edit', record)}
          >
            编辑
          </Button>
          <Divider type="vertical" />
          <Button
            disabled={isAuthorized('delete')}
            className="opeA"
            onClick={() => onClickDel(record)}
          >
            删除
          </Button>
        </>
      ),
    },
  ];
  // 弹窗区域
  const [modalTitle, setModalTitle] = useState('');
  const [modalV, setModalV] = useState(false);
  const [editInfo, setEditInfo] = useState({});
  const [command, setCommand] = useState([]);

  const onClickOperation = (type, record) => {
    if (type === 'add') {
      if (!classroomId) {
        notification.info({
          message: '请选择教室！',
        });
        return;
      }
      setEditInfo({});
      setCommand([]);
      setModalTitle('新增');
    } else {
      setModalTitle('编辑');
      getDetails({ id: record.id }).then(r => {
        if (r.code === 0) {
          let commands = r.data.length
            ? r.data.map(item => {
                item.id = item.controlId;
                delete item.controlId;
                return item;
              })
            : [];
          setEditInfo({ ...record, commands });
        }
      });
    }
    setModalV(true);
  };
  // 删除
  const { confirm } = Modal;
  const [chooseV, setChooseV] = useState(false);
  function onClickDel(record) {
    confirm({
      title: `确认删除${record.name} 吗？`,
      okText: '确定',
      cancelText: '取消',
      icon: <QuestionCircleFilled />,
      onOk() {
        delDevice({ id: record.id }).then(r => {
          if (r.code === 0) {
            notification.success({
              message: r.msg,
            });
            getTable();
            setEditInfo({});
          }
        });
      },
      onCancel() {},
    });
  }
  // 点击添加设备
  const onClickAddDevice = () => {
    setChooseV(true);
  };
  const chooseDeviceProps = {
    chooseV,
    setChooseV,
    setModalV,
    setEditInfo,
    setModalTitle,
  };
  const modalProps = {
    modalTitle,
    modalV,
    setModalV,
    getTable,
    editInfo,
    classroomId,
    command,
    setCommand,
    setChooseV,
  };
  return (
    <div className="treeWrapper">
      <DeviceConfigModal {...modalProps} />
      <ChooseDevice {...chooseDeviceProps} />
      <DirectoryTree
        multiple
        showLine
        onSelect={onSelect}
        onExpand={onExpand}
        treeData={classTree}
        className="normalTree"
        showIcon={false}
      />
      <div className="normalTable mt0">
        <Input
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onPressEnter={onSearch}
          className="searchInput mr1"
        />
        <Button className="shadowBtn mr1" onClick={onSearch}>
          搜索
        </Button>
        <Button className="shadowBtn mr1" onClick={onReset}>
          重置
        </Button>
        <Button disabled={!classroomId} className="shadowBtn" onClick={onClickAddDevice}>
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
