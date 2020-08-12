import React, { useEffect, useState } from 'react';
import styles from '../../assets.less';
import {
  Form,
  List,
  notification,
  Radio,
  Table,
  Select,
  Upload,
  Button,
  Descriptions,
  TreeSelect,
  Input,
} from 'antd';
import BaseModal from '@/components/baseModal';
import { getDesList } from '@/service/assetsManage';
const { Option } = Select;
const DescriptionTable = ({ desV, setDesV, setSelectDes }) => {
  const [listData, setList] = useState([]);
  const [keyword, setKeyword] = useState('');
  useEffect(() => {
    getDesList().then(r => {
      if (r.code === 0) {
        setList(r.data);
      }
    });
  }, []);
  const onModalCancel = () => {
    setDesV(false);
    setKeyword('');
  };
  const onModalOk = () => {};

  const onSearch = () => {
    getDesList({ keyword }).then(r => {
      if (r.code === 0) {
        setList(r.data);
      }
    });
  };
  return (
    <BaseModal
      width={700}
      className={styles.assets}
      onOk={onModalOk}
      title="资产选择"
      visible={desV}
      onCancel={onModalCancel}
    >
      <div className="searchWrapper mb1">
        <Input
          placeholder="输入关键字筛选"
          className="searchInput mr1"
          onChange={e => setKeyword(e.target.value)}
          allowClear
        />
        <Button className="shadowButton" onClick={onSearch}>
          搜索
        </Button>
      </div>
      <Descriptions bordered column={2} dataSource={listData}>
        {listData.map((item, index) => (
          <Descriptions.Item key={index}>
            <p className={styles.content}>
              <span className="white">{item.content}</span>
              <a
                href="#!"
                className="opeA"
                onClick={() => {
                  setSelectDes(item.content);
                  setDesV(false);
                }}
              >
                使用
              </a>
            </p>
          </Descriptions.Item>
        ))}
      </Descriptions>
    </BaseModal>
  );
};
export default DescriptionTable;
