import React, { useEffect, useState } from 'react';
import { Tree, Table, Button, Divider } from 'antd';
import styles from './index.less';
import { getMenuTree } from '@/service/menu';
import OpeModal from '@/pages/menu/components/opeModal';
import { formatTreeData } from '@/utils/func';
const { DirectoryTree } = Tree;
const Menu = () => {
  const [menuTitle, setMTitle] = useState('');
  const [menuV, setMV] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [selectMenuInfo, setMenuInfo] = useState({});
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
    });
  };
  // 获取下拉菜单
  const getMenu = () => {
    getMenuTree().then(r => {
      if (r.code === 0) {
        setTreeData(formatTreeData(r.data));
      }
    });
  };
  const onExpand = () => {
    console.log('Trigger Expand');
  };
  const column = [
    {
      title: '操作名称',
    },
    {
      title: '操作代码',
    },
    {
      title: '操作URL',
    },
    {
      title: '启用状态',
    },
    {
      title: '操作',
    },
  ];
  const menuProps = {
    menuTitle,
    menuV,
    setMV,
    getMenu,
    selectMenuInfo,
  };
  const onClickOpe = type => {
    if (type === 'add') {
      setMTitle('新增');
    } else {
      setMTitle('编辑');
    }
    setMV(true);
  };
  return (
    <div className="treeWrapper">
      <OpeModal {...menuProps} />
      <div>
        <div className={styles.ope}>
          <a href="#!" onClick={() => onClickOpe('add')}>
            新增
          </a>
          <Divider className={styles.divider} type="vertical" />
          <a href="#!" onClick={() => onClickOpe('edit')}>
            编辑
          </a>
          <Divider className={styles.divider} type="vertical" />
          <a href="#!">删除</a>
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
        <Button className="shadowBtn">新增</Button>
        <Table className="mt1" columns={column} />
      </div>
    </div>
  );
};

export default Menu;
