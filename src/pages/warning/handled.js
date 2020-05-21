import React from 'react';
import {Table} from 'antd';

const Handled=()=>{
  const column=[
    { title: "位置", dataIndex: "schoolroom",  },
    { title: "发生时间", dataIndex: "event_time",  },
    { title: "事件类型", dataIndex: "eventtypename",  },
    { title: "处理人员", dataIndex: "eventtypename",  },
    { title: "处理时间", dataIndex: "eventtypename",  },
    {
      title: "处理",
    }
  ]
    return (
      <Table
        className='normalTable'
      />
    )
}
export default Handled
