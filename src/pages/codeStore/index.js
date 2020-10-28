import React, { useEffect, useState } from 'react';
import { Button, Divider, Input, Modal, notification, Select, Table } from 'antd';
import { isAuthorized, showTotal } from '@/utils/func';
import { myLocale } from '@/utils/common';
import { del, getBrandsTree, getTypes } from '@/service/device';
import { delCodeStore, getCodeList } from '@/service/codeStore';
import Add from '@/pages/codeStore/components/add';
import { QuestionCircleFilled } from '@ant-design/icons';

const CodeStore = () => {
  // table列表 区域
  const [tableList, setTableList] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState('');
  const [totalPage, setTotalPage] = useState('');
  const [types, setType] = useState([]);
  const [typeId, setTypeId] = useState(undefined);
  const [brandId, setBrandId] = useState(undefined);
  const [brand, setBrand] = useState([]);
  // search
  const [keyword, setKeyword] = useState('');
  const pagination = {
    total,
    pageSize,
    current: current,
    showQuickJumper: true,
    showTotal: () => showTotal(totalPage, total),
  };
  const onTableChange = p => {
    setCurrent(p.current);
    setPageSize(p.pageSize);
    getTable(p.current, p.pageSize, false);
  };
  const getTable = (page, pageSize1, reset = false) => {
    const p = reset
      ? {
          page: 1,
          limit: 10,
        }
      : {
          page: page ? page : current,
          limit: pageSize1 ? pageSize1 : pageSize,
          keyword,
          typeId,
          brandId,
        };
    getCodeList(p).then(r => {
      if (r.code === 0) {
        setTableList(r.data.list);
        setTotal(r.data.totalCount);
        setTotalPage(r.data.totalPage);
      }
    });
  };
  useEffect(() => {
    getTable();
  }, []);
  // 获取设备类型列表

  useEffect(() => {
    getTypes().then(r => {
      if (r.code === 0) {
        setType(r.data);
      }
    });
    getBrandsTree().then(r => {
      if (r.code === 0) {
        setBrand(r.data);
      }
    });
  }, []);
  const onSearch = () => {
    getTable();
  };
  const onReset = () => {
    setCurrent(1);
    setTypeId(undefined);
    setBrandId(undefined);
    setKeyword('');
    setPageSize(10);
    getTable(1, 10, true);
  };
  const column = [
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
      title: '控制方式',
      dataIndex: 'connectionWay',
    },
    {
      title: '创建时间',
      dataIndex: 'brand',
    },
    {
      title: '添加人员',
      dataIndex: 'username',
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
          <Button
            onClick={() => onClickAdd('edit', record)}
            disabled={isAuthorized('edit')}
            className="opeA"
          >
            编辑
          </Button>
          <Divider type="vertical" />
          <Button
            onClick={() => onClickDel(record)}
            disabled={isAuthorized('delete')}
            className="opeA"
          >
            删除
          </Button>
        </>
      ),
    },
  ];
  const { confirm } = Modal;
  function onClickDel(record) {
    confirm({
      title: '确认删除吗？',
      okText: '确定',
      cancelText: '取消',
      icon: <QuestionCircleFilled />,
      onOk() {
        delCodeStore({ id: record.id }).then(r => {
          if (r.code === 0) {
            notification.success({
              message: r.msg,
            });
            getTable();
          }
        });
      },
      onCancel() {},
    });
  }

  // 弹窗
  const [modalV, setModalV] = useState(false);
  const [title, setTitle] = useState('');
  const [editInfo, setEditInfo] = useState({});
  const modalProps = {
    modalV,
    setModalV,
    title,
    types,
    brand,
    getTable,
    editInfo,
  };
  const onClickAdd = (type, record) => {
    if (type === 'add') {
      setEditInfo({});
      setTitle('添加控制码');
    } else if (type === 'edit') {
      setTitle('编辑控制码');
      setEditInfo(record);
    }
    setModalV(true);
  };
  return (
    <div className="normalWrap">
      <Button
        onClick={() => onClickAdd('add')}
        disabled={isAuthorized('add')}
        className="shadowBtn mb1"
      >
        新增设备控制码
      </Button>
      <br />
      <div className="searchWrapper">
        <span>设备类型：</span>
        <Select value={typeId} onChange={e => setTypeId(e)} style={{ width: 200 }} className="mr1">
          {types.map(type => (
            <Select.Option value={type.id} key={type.id}>
              {type.name}
            </Select.Option>
          ))}
        </Select>
        <span>品牌：</span>
        <Select
          value={brandId}
          onChange={e => setBrandId(e)}
          style={{ width: 200 }}
          className="mr1"
        >
          {brand.map(type => (
            <Select.Option value={type.id} key={type.id}>
              {type.name}
            </Select.Option>
          ))}
        </Select>
        <Input
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="请输入设备型号"
          className="searchInput mr1"
        />
        <Button className="shadowBtn mr1" onClick={onSearch}>
          搜索
        </Button>
        <Button className="shadowBtn" onClick={onReset}>
          重置
        </Button>
      </div>

      <Table
        columns={column}
        pagination={pagination}
        onChange={onTableChange}
        dataSource={tableList}
        rowKey="id"
        locale={myLocale}
        className="normalTable"
      />
      <Add {...modalProps} />
    </div>
  );
};
export default CodeStore;
