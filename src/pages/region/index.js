import React from 'react';
import { Tree, Table, Button } from 'antd';
const { DirectoryTree } = Tree;
const Region = () => {
  const onSelect = (keys, event) => {
    console.log('Trigger Select', keys, event);
  };

  const onExpand = () => {
    console.log('Trigger Expand');
  };
  const column = [
    {
      title: '名称',
    },
    {
      title: '位置',
    },
    {
      title: '类型',
    },
    {
      title: '负责人',
    },
    {
      title: '联系电话',
    },
    {
      title: '单位地址',
    },
    {
      title: '操作',
    },
  ];

  return (
    <div className="treeWrapper">
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
      <div className="normalTable mt0">
        <Button className="shadowBtn">新增</Button>
        <Table className="mt1" columns={column} />
      </div>
    </div>
  );
};

export default Region;
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
