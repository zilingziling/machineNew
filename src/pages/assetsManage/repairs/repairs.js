import React, { useEffect, useState } from 'react';
import {
  Button,
  DatePicker,
  Divider,
  Input,
  Modal,
  notification,
  Select,
  Table,
  Tooltip,
} from 'antd';
import { myLocale } from '@/utils/common';
import { del, getBrandList } from '@/service/device';
import { showTotal } from '@/utils/func';
import {
  delRepair,
  getAssetsRepairList,
  getLogList,
  getMaintainer,
  getMaintainSelect,
  getRepairProcess,
} from '@/service/assetsManage';
import { QuestionCircleFilled } from '@ant-design/icons';
import OpeModal from '@/pages/assetsManage/repairs/components/opeModal';
import BaseModal from '@/components/baseModal';
import HandleModal from '@/pages/assetsManage/repairs/components/handleModal';
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
  const [time, setTime] = useState(undefined);
  const [timeString, setTimeString] = useState(undefined);
  // search
  const [keyword, setKeyword] = useState('');
  useEffect(() => getTable(), [current]);
  const onTableChange = p => {
    setCurrent(p.current);
    setPageSize(p.pageSize);
  };
  const getTable = () => {
    getAssetsRepairList({
      page: current,
      limit: pageSize,
      keyword,
      type,
      typeId,
      time: timeString,
    }).then(r => {
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
    getTable();
  };
  const onReset = () => {
    setCurrent(1);
    setKeyword(undefined);
    setType(undefined);
    setTypeId(undefined);
    setTime();
    setTimeString(undefined);
  };
  const pagination = {
    total,
    pageSize,
    current: current,
    showQuickJumper: true,
    showTotal: () => showTotal(totalPage, total),
  };
  const timeChange = (time, string) => {
    setTime(time);
    setTimeString(string);
  };
  const column = [
    {
      title: '资产编号',
      dataIndex: 'assetsNumber',
      render: (text, record) => (
        <a href="#!" className="lightGreen">
          {text}
        </a>
      ),
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
      render: (text, record) => (
        <p>
          <span className="mr1">{text}</span>
          {record.file && (
            <a href="#!" className="lightGreen" onClick={checkBigImg}>
              附件
            </a>
          )}
        </p>
      ),
    },
    {
      title: '报修时间',
      dataIndex: 'repairTime',
    },
    {
      title: '报修人',
      dataIndex: 'repairUser',
      render: (text, record) => (
        <p>
          <span className="mr1">{text}</span>
          {record.repairUserPhone && (
            <Tooltip title={record.repairUserPhone}>
              <a href="#!" className="lightGreen">
                电话
              </a>
            </Tooltip>
          )}
        </p>
      ),
    },
    {
      title: '维修进度',
      dataIndex: 'process',
      render: (text, record) => (
        <a
          href="#!"
          className={
            record.process === '待维修'
              ? 'red'
              : record.process === '维修中'
              ? 'yellow'
              : 'greenStatus'
          }
        >
          {text}
        </a>
      ),
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
      render: (text, record) => (
        <p>
          <span className="mr1">{text}</span>
          {record.maintainerPhone && (
            <Tooltip title={record.maintainerPhone}>
              <a href="#!" className="lightGreen">
                电话
              </a>
            </Tooltip>
          )}
        </p>
      ),
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
      render: (text, record) => (
        <>
          <a href="#!" className="opeA" onClick={() => onClickHandle(record)}>
            处理
          </a>
          <Divider type="vertical" />
          <a href="#!" className="opeA" onClick={() => onClickOperation('edit', record)}>
            编辑
          </a>
          <Divider type="vertical" />
          <a href="#!" className="opeA" onClick={() => checkLog(record)}>
            日志
          </a>
          <Divider type="vertical" />
          <a href="#!" className="opeA" onClick={() => onClickDel(record)}>
            删除
          </a>
        </>
      ),
    },
  ];
  // 处理
  const [handleV, setHandleV] = useState(false);
  const [handleId, setHandleId] = useState('');
  const handleProps = {
    handleV,
    setHandleV,
    process,
    maintainer,
    handleId,
    getTable,
  };
  const onClickHandle = record => {
    setHandleV(true);
    setHandleId(record.id);
  };
  // 查看大图
  const checkBigImg = record => {
    Modal.info({
      title: '附件',
      icon: null,
      width: 600,
      okText: '确定',
      maskClosable: true,
      content: <img src={record.file} style={{ height: '20rem' }} />,
      onOk() {},
    });
  };
  // 查看日志
  const logColumn = [
    {
      title: '时间',
      dataIndex: 'time',
    },
    {
      title: '记录',
      dataIndex: 'record',
    },
    {
      title: '处理人',
      dataIndex: 'user',
    },
  ];
  const checkLog = record => {
    getLogList({ id: record.id }).then(r => {
      if (r.code === 0) {
        Modal.info({
          title: '日志',
          icon: null,
          width: 600,
          okText: '确定',
          maskClosable: true,
          centered: true,
          content: (
            <Table
              bordered
              rowKey="id"
              dataSource={r.data}
              className="normalTable fixHeight"
              columns={logColumn}
              scroll={{ y: 300 }}
              pagination={false}
            />
          ),
          onOk() {},
        });
      }
    });
  };
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
    process,
    maintainer,
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
        delRepair({ id: record.id }).then(r => {
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
  return (
    <div className="normalWrap">
      <OpeModal {...modalProps} />
      <HandleModal {...handleProps} />
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
        <RangePicker className="mr1" allowClear onChange={timeChange} value={time} />
        <Button className="shadowBtn mr1" onClick={onSearch}>
          搜索
        </Button>
        <Button className="shadowBtn mr1" onClick={onReset}>
          重置
        </Button>
        <Button className="shadowBtn mr1" onClick={() => onClickOperation('add')}>
          报修录入
        </Button>
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
