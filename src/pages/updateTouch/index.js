import React from 'react';
import Update from '@/components/update';

const UpdateTouch = () => {
  const props = {
    title: '触摸屏升级',
    info:
      '最新的升级固件，请到易简官网下载，或联系小弈的运维工程师获取，得到新的升级固件后，点击网站上的本页的“上传文件”，上传成功后，触摸屏在下一次重启时自动升级',
  };
  return <Update {...props} />;
};
export default UpdateTouch;
