import React, { useEffect, useState } from 'react';
import styles from './login.less';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Input } from 'antd';
const Login = ({}) => {
  const [form] = Form.useForm();
  const [authCode, setCode] = useState('');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [code, setAuth] = useState('');
  useEffect(() => {
    getCode();
  }, []);
  const getCode = () => {
    form.setFieldsValue('code', '');
    const numbers = Math.floor(Math.random() * 10000);
    let code = 'baseapi/integrated/identifyingCode?' + parseInt(numbers);
    setCode(code);
  };
  return (
    <div className={styles.loginWrapper}>
      <h1>弈简运维管控平台</h1>
      <div className={styles.login}>
        <h6>用户登录</h6>
        <div className={styles.loginForm}>
          <Form className={styles.form}>
            <Form.Item name="account" rules={[{ required: true, message: '请输入账号！' }]}>
              <Input
                maxLength={20}
                placeholder="请输入账号"
                prefix={
                  <img className={styles.icon} src={require('../../../assets/images/user.png')} />
                }
              />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: '请输入密码！' }]}>
              <Input.Password
                placeholder="请输入用户密码"
                prefix={
                  <img className={styles.icon} src={require('../../../assets/images/pass.png')} />
                }
              />
            </Form.Item>

            <Form.Item
              className={styles.flex}
              name="code"
              rules={[{ required: true, message: '请输入验证码！' }]}
            >
              <Input
                className={styles.vertify}
                placeholder="请输入验证码"
                maxLength={4}
                prefix={
                  <img
                    className={styles.icon}
                    src={require('../../../assets/images/vertify.png')}
                  />
                }
              />
              <img className={styles.vertifyImg} src={authCode} onClick={getCode} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
