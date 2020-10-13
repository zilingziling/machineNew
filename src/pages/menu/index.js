import React, { useEffect, useState } from 'react';
import { Tree, Table, Button, Divider, notification, Modal } from 'antd';
import styles from './index.less';
import { delMenu, delOperation, getMenuTree, getOpeList } from '@/service/menu';
import OpeModal from '@/pages/menu/components/opeModal';
import { formatTreeData, isAuthorized, showTotal } from '@/utils/func';
import { QuestionCircleFilled } from '@ant-design/icons';
import { myLocale } from '@/utils/common';
import OperationModal from '@/pages/menu/components/operationModal';
import { connect } from 'dva';
const { DirectoryTree } = Tree;
const { confirm } = Modal;
const Menu = props => {
  const [menuTitle, setMTitle] = useState('');
  const [menuV, setMV] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [selectMenuInfo, setMenuInfo] = useState({});
  const [canAdd, setCanAdd] = useState(false);
  useEffect(() => {
    getMenu();
  }, []);
  const onSelect = (keys, event) => {
    // 保存所点击的菜单以便回显
    setMenuInfo({
      id: event.node.id,
      title: event.node.title,
      url: event.node.url,
      icon: event.node.icon,
      sort: event.node.sort,
    });

    if (event.node.children) {
      setCanAdd(false);
    } else {
      setCanAdd(true);
    }
  };
  // 获取下拉菜单
  const getMenu = () => {
    getMenuTree().then(r => {
      if (r.code === 0) {
        setTreeData(formatTreeData(r.data));
      }
    });
  };
  const onExpand = () => {};
  const column = [
    {
      title: '操作名称',
      dataIndex: 'name',
    },
    {
      title: '操作代码',
      dataIndex: 'operationCode',
    },
    {
      title: '操作URL',
      dataIndex: 'url',
    },
    {
      title: '启用状态',
      dataIndex: 'is_show',
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
          <Button
            disabled={isAuthorized('edit')}
            className="opeA"
            onClick={() => onClickAdd('edit', record)}
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
  const menuProps = {
    menuTitle,
    menuV,
    setMV,
    getMenu,
    selectMenuInfo,
    treeData,
    setMenuInfo,
  };
  const onClickOpe = type => {
    if (type === 'add') {
      setMTitle('新增');
      setMV(true);
    } else if (type === 'edit') {
      if (!Object.keys(selectMenuInfo).length) {
        notification.info({
          message: '请先选择菜单！',
        });
      } else {
        setMTitle('编辑');
        setMV(true);
      }
    } else {
      if (!Object.keys(selectMenuInfo).length) {
        notification.info({
          message: '请先选择菜单！',
        });
      } else {
        onDelete();
      }
    }
  };
  // 删除操作
  function onClickDel(record) {
    confirm({
      title: `确认删除${record.name} 吗？`,
      okText: '确定',
      cancelText: '取消',
      icon: <QuestionCircleFilled />,
      onOk() {
        delOperation({ id: record.id }).then(r => {
          if (r.code === 0) {
            notification.success({
              message: r.msg,
            });
            getOperationList();
            setEditInfo({});
          }
        });
      },
      onCancel() {},
    });
  }
  function onDelete() {
    confirm({
      title: `确认删除${selectMenuInfo.title} 吗？`,
      okText: '确定',
      cancelText: '取消',
      icon: <QuestionCircleFilled />,
      onOk() {
        delMenu({ id: selectMenuInfo.id }).then(r => {
          if (r.code === 0) {
            notification.success({
              message: r.msg,
            });
            getMenu();
            setMenuInfo({});
          }
        });
      },
      onCancel() {},
    });
  }
  //  操作相关

  const [opeList, setOpeList] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [editInfo, setEditInfo] = useState({});
  const [totalPage, setTotalPage] = useState('');
  const getOperationList = id => {
    getOpeList({ menuId: id || selectMenuInfo.id, page: current, limit: pageSize }).then(r => {
      if (r.code === 0) {
        setOpeList(r.data.list);
        setTotal(r.data.totalCount);
        setTotalPage(r.data.totalPage);
      }
    });
  };
  const [opeV, setOpeV] = useState(false);
  const [opeTitle, setOpeTitle] = useState('');
  const [total, setTotal] = useState('');
  const operationProps = {
    opeV,
    opeTitle,
    setOpeV,
    selectMenuInfo,
    getOperationList,
    editInfo,
    setEditInfo,
  };
  const onClickAdd = (type, record) => {
    if (type === 'add') {
      setEditInfo({});
      setOpeTitle('新增');
    } else {
      setOpeTitle('编辑');
      setEditInfo(record);
    }
    setOpeV(true);
  };
  const onTableChange = p => {
    setCurrent(p.current);
    setPageSize(p.pageSize);
  };
  useEffect(() => getOperationList(), [selectMenuInfo.id, pageSize, current]);

  const pagination = {
    total,
    pageSize,
    current: current,
    showQuickJumper: true,
    showTotal: () => showTotal(totalPage, total),
  };
  return (
    <div className="treeWrapper">
      <OpeModal {...menuProps} />
      <OperationModal {...operationProps} />
      <div>
        <div className={styles.ope}>
          <a href="#!" disabled={isAuthorized('add')} onClick={() => onClickOpe('add')}>
            新增
          </a>
          <Divider className={styles.divider} type="vertical" />
          <a href="#!" disabled={isAuthorized('edit')} onClick={() => onClickOpe('edit')}>
            编辑
          </a>
          <Divider className={styles.divider} type="vertical" />
          <a href="#!" disabled={isAuthorized('delete')} onClick={() => onClickOpe('del')}>
            删除
          </a>
        </div>
        <DirectoryTree
          showLine
          onSelect={onSelect}
          onExpand={onExpand}
          treeData={treeData}
          className="normalTree"
          showIcon={false}
        />
      </div>
      <div className="normalTable mt0">
        <Button className="shadowBtn" disabled={!canAdd} onClick={() => onClickAdd('add')}>
          新增
        </Button>
        <Table
          className="mt1"
          rowKey="id"
          pagination={pagination}
          onChange={onTableChange}
          dataSource={opeList}
          columns={column}
          locale={myLocale}
        />
      </div>
    </div>
  );
};
export default connect(({ global }) => ({
  moreMenu: global.moreMenu,
}))(Menu);
