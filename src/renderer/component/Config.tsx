import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Actions, actions } from '../root.store';
import Icon from "../assets/512x512.png";
import { ArrowLeft } from 'react-feather';
export const Config = ({ goBack }) => {
    const dispatch = useDispatch()
    const formRef = useRef(null)
    const [step, setStep] = useState<any>(0);
    const [config, setConfig] = useState({
        id: null,
        shopName: '',
        shopAddress: '',
        phone: '',
        phone2: '',
        lang: 'ENG',
        // first name
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        email: '',
        userPhone: '',
        role: 'Superadmin'
    })

    const handleActionResult = (arg) => {
        switch (arg.action) {
            case "get-config":
                if (arg.success) {
                    console.log(arg)
                    const configObj = {
                        id: arg.data.ConfigID,
                        shopName: arg.data.ShopName,
                        shopAddress: arg.data.ShopAddress,
                        lang: arg.data.Lang,
                        phone: arg.data.Phone,
                        phone2: arg.data.Phone2
                    }
                    setConfig({...config,...configObj})
                    if(formRef.current){
                        formRef.current.setFieldsValue({
                            shopName: arg.data.ShopName,
                            shopAddress: arg.data.ShopAddress,
                            lang: arg.data.Lang,
                            phone: arg.data.Phone,
                            phone2: arg.data.Phone2
                        })
                    }
                    
                    dispatch({
                        type: Actions.SET_CONFIG,
                        payload: {
                            config: configObj
                        }
                    })
                } else {

                }

                break;
            case "save-config":
                if (arg.success) {
                    Modal.success({
                        title: "Successfully updated",
                    })
                    window.electron.ipcRenderer.sendMessage('action', {
                        action: 'get-config',
                        params: {},
                        payload: {}
                    });
                } else {
                    Modal.error({
                        title: "Failed To Save Config",
                    })
                }
                break;
        }
    };
    const onFinish = (values) => {
        if (step == 0 && !goBack) {
            setStep(1)
        } else {
            window.electron.ipcRenderer.sendMessage('action', {
                action: 'save-config',
                params: {},
                payload: {
                    shopName: config.shopName,
                    shopAddress: config.shopAddress,
                    phone: config.phone,
                    phone2: config.phone2,
                    lang: config.lang
                }
            });
            if(step == 1){
                window.electron.ipcRenderer.sendMessage('action', {
                    action: 'save-employee',
                    params: {},
                    payload: {
                        firstName: config.firstName,
                        lastName: config.lastName,
                        username: config.username,
                        password: config.password,
                        email: config.email,
                        phone: config.userPhone,
                        role: 'Superadmin',
                        active: true
                    }
                });
            }
        }
    };
    useEffect(() => {
       const uneventCallback = window.electron.ipcRenderer.on('action-result', handleActionResult);

        window.electron.ipcRenderer.sendMessage('action', {
            action: 'get-config',
            params: {},
            payload: {}
        });
        return ()=>{
            if(uneventCallback) uneventCallback();
        }
    }, []);
    return (
        <div className="login-panel">

            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                <img src={Icon} style={{ width: '110px', borderRadius: '75px' }} />
            </div>
            {(goBack || step == 1) ? <div>
                <Button style={{ cursor: 'pointer', marginBottom: '15px', display: 'flex', gap: '10px' }} onClick={(e) => {
                    e.preventDefault();
                    if (goBack) {
                        goBack();
                    } else {
                        setStep(0)
                    }
                }}><span style={{paddingTop: '2px'}}><ArrowLeft size={14} /> </span><span>Back</span></Button>
            </div> : null}
            <Form
                ref={formRef}
                initialValues={config}
                onFinish={onFinish}
                layout="vertical"
                onValuesChange={(val, values: any) => {
                    setConfig(values);
                }}
            >
               <div >
                    <Form.Item
                        name="shopName"
                        label="Shop Name"
                        rules={[{ required: true, message: 'Please input shop name!' }]}
                        hidden={step == 1}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="shopAddress"
                        label="Shop Address"
                        rules={[{ required: true, message: 'Please input shop address!' }]}
                        hidden={step == 1}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        name="lang"
                        label="Language"
                        rules={[{ required: true, message: 'Please input Language!' }]}
                        hidden={step == 1}
                    >
                        <Select options={[{ label: "ENG", value: "ENG" }, { label: "BN", value: "BN" }]} />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Phone"
                        rules={[{ required: true, message: 'Please input phone number!' }]}
                        hidden={step == 1}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="phone2"
                        label="Second Phone"
                        hidden={step == 1}
                    >
                        <Input />
                    </Form.Item>

  
                </div> 
                <div >
                    <Row gutter={15}>
                        <Col>
                        <Form.Item
                        name="firstName"
                        label="First Name"
                        hidden={(step == 0)}
                        rules={[{ required:  (goBack||step==0)?false:true, message: 'Please input First Name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    </Col>
                    <Col>
                    <Form.Item
                        name="lastName"
                        label="Last Name"
                        hidden={(step == 0)}
                        rules={[{ required:  (goBack||step==0)?false:true, message: 'Please input Last Name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    </Col>
                    </Row>
                    
                    <div style={{paddingRight: '15px'}}>
                        
                    <Form.Item
                        name="username"
                        label="User Name"
                        hidden={(step == 0)}
                        rules={[{ required:  (goBack||step==0)?false:true, message: 'Please input User Name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        hidden={(step == 0)}
                        rules={[{ required:  (goBack||step==0)?false:true, message: 'Please input Password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Row gutter={15}>
                        <Col>
                            <Form.Item
                                name="email"
                                label="Email"
                                hidden={(step == 0)}
                                rules={[{ required: (goBack||step==0)?false:true, message: 'Please input Email!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item
                                name="userPhone"
                                label="Phone"
                                hidden={(step == 0)}
                                rules={[{ required:  (goBack||step==0)?false:true, message: 'Please input Phone!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    
                    
                    <Form.Item
                        hidden
                        name="role"
                        label="role"
                    >
                        <Input />
                    </Form.Item>
                    </div>
                </div>
                <Form.Item>
                        {(goBack || step == 1) ? <Button type="primary" style={{ float: 'right' }} htmlType="submit">
                            Save
                        </Button> : <Button type="primary" style={{ float: 'right' }} htmlType="submit">
                            Continue
                        </Button>}
                    </Form.Item>
            </Form>
        </div>
    );
}
