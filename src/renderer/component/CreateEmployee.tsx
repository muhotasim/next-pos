import { Button, Checkbox, Col, Form, Input, Row, Select, Table } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, Package, PieChart, Plus, Settings, ShoppingBag, User } from 'react-feather';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import { Actions } from '../root.store';
export const CreateEmployee = () => {
  const formRef = useRef(null)
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    Username: '',
    Password: '',
    Email: '',
    Phone: '',
    Role: '',
    Active: false
  })
  const { id } = useParams();
  const handleActionResult = (arg) => {
    switch (arg.action) {
      case 'get-employee-by-id':
        if (arg.success) {
          console.log(arg)
          delete arg.data.EmployeeID
          arg.data.Active = Boolean(arg.data.Active);
          setFormData(arg.data)
          if(formRef?.current) formRef.current?.setFieldsValue(arg.data);
        }
        break;
        case 'update-employee':
        case 'save-employee':
        navigate('/employee')
        break;

    }
  };
  const onFinish = (values) => {
    const data = {
      firstName: values.FirstName,
      lastName: values.LastName,
      username: values.Username,
      password: values.Password,
      email: values.Email,
      phone: values.Phone,
      role: values.Role,
      active: values.Active,
    }
    console.log(data)
    if (id) {

      window.electron.ipcRenderer.sendMessage('action', {
        action: 'update-employee',
        params: { id: id },
        payload: data
      });
    } else {
      window.electron.ipcRenderer.sendMessage('action', {
        action: 'save-employee',
        params: {},
        payload: data
      });
    }

  }
  useEffect(() => {
    const uneventCallback = window.electron.ipcRenderer.on('action-result', handleActionResult);

    if(id){
      // 
      window.electron.ipcRenderer.sendMessage('action', {
        action: 'get-employee-by-id',
        params: {id: id},
        payload: {}
      });
    }

    return () => {
      if (uneventCallback) uneventCallback();
    }
  }, []);
  return (<div className='page'>
    <Button style={{ display: 'flex', marginBottom: '2rem' }} onClick={() => navigate('/employee')}><ArrowLeft size={16} style={{ paddingTop: '3px' }} /> Back</Button>
    <Form
      ref={formRef}
      initialValues={formData}
      name="basic"
      layout="vertical"
      onFinish={onFinish} 
      onValuesChange={(val, values: any) => {
        setFormData(values);
    }}
      autoComplete="off"
    >
      <Form.Item
        name="FirstName"
        label="FirstName"
        rules={[{ required: true, message: 'Please input First Name!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="LastName"
        label="Last Name"
        rules={[{ required: true, message: 'Please input Last Name!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="Username"
        label="Username"
        rules={[{ required: true, message: 'Please input User Name!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="Password"
        label="Password"
        rules={[{ required: true, message: 'Please input Password!' }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="Email"
        label="Email"
        rules={[{ required: true, message: 'Please input Email!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="Phone"
        label="Phone"
        rules={[{ required: true, message: 'Please input Phone!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="Role"
        label="Role"

        rules={[{ required: true, message: 'Please input Role!' }]}
      >
        <Select options={[{label: 'Manager', value: 'Manager'}, {label: 'Salesman', value: 'Salesman'}]}/>
      </Form.Item>
      <Form.Item
        name="Active"
        label="Active"
        valuePropName='checked'
        rules={[{ required: true, message: 'Please input Active!' }]}
      >
        <Checkbox />
      </Form.Item>
      <Button htmlType='submit'>{id?"Update":"Create"}</Button>
    </Form>


  </div>)


}