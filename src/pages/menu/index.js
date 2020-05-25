import React from 'react';
import { Tree, Table, Button, Divider } from 'antd';
import styles from './index.less';
const { DirectoryTree } = Tree;
const Menu = () => {
  const onSelect = (keys, event) => {
    console.log('Trigger Select', keys, event);
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

  return (
    <div className="treeWrapper">
      <div>
        <div className={styles.ope}>
          <span className={styles.clicked}>新增</span>
          <Divider className={styles.divider} type="vertical" />
          <span>编辑</span>
          <Divider className={styles.divider} type="vertical" />
          <span>删除</span>
        </div>
        <DirectoryTree
          multiple
          showLine
          defaultExpandAll
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
const treeData = [
  {
    title: 'parent 0',
    key: '0-0',
    children: [
      { title: 'leaf 0-0', key: '0-0-0', isLeaf: true },
      { title: 'leaf 0-1', key: '0-0-1', isLeaf: true },
    ],
  },
  {
    title: 'parent 1',
    key: '0-1',
    children: [
      { title: 'leaf 1-0', key: '0-1-0', isLeaf: true },
      { title: 'leaf 1-1', key: '0-1-1', isLeaf: true },
    ],
  },
];
