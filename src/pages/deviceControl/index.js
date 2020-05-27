import React from 'react';
import { Button, Table, Tree } from 'antd';
const { DirectoryTree } = Tree;

const DeviceControl = () => {
  const onSelect = (keys, event) => {
    console.log('Trigger Select', keys, event);
  };

  const onExpand = () => {
    console.log('Trigger Expand');
  };
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
      <div className="normalTable mt0">deviceControl</div>
    </div>
  );
};
export default DeviceControl;
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
