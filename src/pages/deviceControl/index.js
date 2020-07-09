import React, { useEffect, useState } from 'react';
import { Tree } from 'antd';
import ClassRooms from '@/pages/deviceControl/components/classRooms';
import { connect } from 'dva';
import { getClassrooms } from '@/service/deviceControl';
import { initClassroomData } from '@/pages/deviceControl/components/someFunc';
const { DirectoryTree } = Tree;
const DeviceControlMain = ({ dispatch, treeData }) => {
  useEffect(() => {
    dispatch({
      type: 'deviceControl/getDeviceCtrlTree',
    });
  }, []);
  // 选中学校id
  const [schoolId, setSchoolId] = useState(null);
  const [buildingName, setBuildingName] = useState('');
  const [roomData, setRoomData] = useState([]);
  const [position, setPosition] = useState('');
  const [buttons, setButtons] = useState([]);
  const onSelect = (value, node, extra) => {
    if (node.node.code === 'school_academic_building') {
      setSchoolId(value);
      setBuildingName(node.node.title);
      getClassrooms({ schoolId: value }).then(r => {
        if (r.code === 0) {
          setRoomData(initClassroomData(r.data.resultList));
          setPosition(r.data.position);
          setButtons([]);
        } else {
          setRoomData([]);
          setPosition('');
          setButtons([]);
        }
      });
    }
  };
  const props = {
    schoolId,
    buildingName,
    roomData,
    setRoomData,
    position,
    setPosition,
    buttons,
    setButtons,
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
        onClick={e => e.nativeEvent.stopImmediatePropagation()}
      />
      <ClassRooms {...props} />
    </div>
  );
};
export default connect(({ deviceControl }) => ({
  treeData: deviceControl.treeData,
}))(DeviceControlMain);
