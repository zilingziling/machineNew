import React from 'react';
import { Button, Input, Table, Form, Radio, DatePicker } from 'antd';
import styles from './index.less';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const Log = ({ form }) => {
  const { getFieldDecorator } = form;
  const column = [
    {
      title: '时间',
    },
    {
      title: '用户',
    },
    {
      title: 'IP',
    },
    {
      title: '操作结果',
    },
    {
      title: '操作类型',
    },
  ];
  return (
    <div className="normalWrap">
      <Form className="searchWrapper">
        <FormItem className="formItem">
          {getFieldDecorator('selsign')(
            <Radio.Group buttonStyle="solid">
              <Radio.Button value={1}>今天</Radio.Button>
              <Radio.Button value={2}>昨天</Radio.Button>
              <Radio.Button value={3}>本周</Radio.Button>
            </Radio.Group>,
          )}
        </FormItem>
        <FormItem label="用户" className="formItem">
          {getFieldDecorator('username')(<Input allowClear placeholder="输入用户名" />)}
        </FormItem>
        <FormItem label="选择时间" className="formItem">
          {getFieldDecorator('time')(<RangePicker format={dateFormat} />)}
        </FormItem>
        <Button className="shadowBtn" type="primary">
          搜索
        </Button>
      </Form>
      <Table className="normalTable" columns={column} />
    </div>
  );
};
export default Form.create({})(Log);
