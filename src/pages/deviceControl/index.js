import React, { useEffect, useState } from 'react';
import { Tree } from 'antd';
import ClassRooms from '@/pages/deviceControl/components/classRooms';
import { connect } from 'dva';
const { DirectoryTree } = Tree;
const DeviceControlMain = ({ dispatch, treeData }) => {
  useEffect(() => {
    dispatch({
      type: 'deviceControl/getDeviceCtrlTree',
    });
  }, []);
  // 选中学校id
  const [schoolId, setSchoolId] = useState(null);
  const onSelect = (value, node, extra) => {
    if (node.node.code === 'school_academic_building') {
      setSchoolId(value);
    }
  };
  const props = {
    schoolId,
  };
  return (
    <div className="treeWrapper p24">
      <DirectoryTree
        multiple
        showLine
        onSelect={onSelect}
        // onExpand={onExpand}
        treeData={treeData}
        className="normalTree"
        showIcon={false}
      />
      <ClassRooms {...props} />
    </div>
  );
};
export default connect(({ deviceControl }) => ({
  treeData: deviceControl.treeData,
}))(DeviceControlMain);
