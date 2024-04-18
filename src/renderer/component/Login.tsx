import { Button, Checkbox, Form, Input } from "antd";
import Icon from "../assets/512x512.png";
import { LogIn } from 'react-feather';
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Actions } from "../root.store";
const Login = () => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const handleActionResult = (arg) => {
        switch (arg.action) {
          case "login":
    
            if (arg.success) {
             dispatch({
                type: Actions.LOGIN,
                payload: {
                    user: {
                        firstName: arg.data.FirstName,
                        lastName: arg.data.LastName,
                        username: arg.data.Username,
                        email: arg.data.Email,
                        phone: arg.data.Phone,
                        role: arg.data.Role,
                    }
                }
             })
            }
    
            break;
        }
        setLoading(false);
      };
    const onFinish = (values) => {
        window.electron.ipcRenderer.sendMessage('action', {
            action: 'login',
            params: {},
            payload: values
          });
    };
    const onFinishFailed = (errorInfo) => {
    };
    useEffect(() => {
        window.electron.ipcRenderer.on('action-result', handleActionResult);
        setLoading(true);
    },[])
    return <>
        <div className="login-panel">
            <div style={{textAlign: 'center', marginBottom: '25px'}}>
                <img src={Icon} style={{width: '110px', borderRadius: '75px'}}/>
            </div>
            <Form
                name="basic"
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                  
                >
                    <Button type="primary" style={{float: 'right'}} htmlType="submit">
                     Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    </>
}

export default Login;