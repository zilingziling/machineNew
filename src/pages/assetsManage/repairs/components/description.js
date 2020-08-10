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
  Checkbox,
  TreeSelect,
  Input,
} from 'antd';
import BaseModal from '@/components/baseModal';
import { getDesList } from '@/service/assetsManage';
const { Option } = Select;
const DescriptionTable = ({ desV, setDesV, setSelectDes }) => {
  const [listData, setList] = useState([]);
  useEffect(() => {
    getDesList().then(r => {
      if (r.code === 0) {
        setList(r.data);
      }
    });
  }, []);
  const onModalCancel = () => {
    setDesV(false);
    form.resetFields();
  };
  const onModalOk = () => {};
  const [form] = Form.useForm();
  const onSearch = () => {
    let values = form.getFieldsValue();
    if (values.keyword) {
      getDesList({ keyword: values.keyword }).then(r => {
        if (r.code === 0) {
          setList(r.data);
        }
      });
    }
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
      <Form form={form}>
        <Form.Item name="keyword">
          <Input placeholder="输入关键字筛选" />
        </Form.Item>
      </Form>
      <Button className="shadowButton" Click={onSearch}>
        搜索
      </Button>
      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={listData}
        renderItem={item => (
          <List.Item>
            <p>
              {item.content}
              <a href="#!" className="opeA">
                使用
              </a>
            </p>
          </List.Item>
        )}
      />
    </BaseModal>
  );
};
export default DescriptionTable;
