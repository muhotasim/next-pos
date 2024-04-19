import { Button, Col, Row, Table } from 'antd';
import { useEffect, useState } from 'react';
import { ArrowLeft, Edit, Package, PieChart, Plus, Settings, ShoppingBag, User } from 'react-feather';
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { Actions } from '../root.store';
export const Employee = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const handleActionResult = (arg) => {
    switch (arg.action) {
      case 'get-employee':
        if(arg.success){
           setData(arg.data.data)
           setTotalData(arg.data.total)
        }
        break;
    }
  };
  useEffect(()=>{
    window.electron.ipcRenderer.sendMessage('action', {
      action: 'get-employee',
      params: {page: currentPage, perPage: perPage},
      payload: {}
    });
  },[perPage, currentPage])
  useEffect(() => {
    const uneventCallback =  window.electron.ipcRenderer.on('action-result', handleActionResult);
    window.electron.ipcRenderer.sendMessage('action', {
        action: 'get-employee',
        params: {page: currentPage, perPage: perPage},
        payload: {}
      });
      return ()=>{
        if(uneventCallback) uneventCallback();
    }
  }, []);
  return (<div className='page'>
    <Button style={{display: 'flex', marginBottom: '2rem'}} onClick={() => navigate('/')}><ArrowLeft size={16} style={{paddingTop: '3px'}}/> Back</Button>
    <Button style={{float: 'right', marginBottom: '15px'}} onClick={()=>navigate('/employee/create-employee')}>Create Employee</Button>

    <Table dataSource={data} rowKey={(d)=>d.EmployeeID} columns={[
        {
            title: 'First Name',
            dataIndex: 'FirstName',
            key: 'FirstName',
        },
        {
            title: 'Last Name',
            dataIndex: 'LastName',
            key: 'LastName',
        },
        {
            title: 'User Name',
            dataIndex: 'Username',
            key: 'Username',
        },
        {
            title: 'Role',
            dataIndex: 'Role',
            key: 'Role',
        },
        {
            title: 'Phone',
            dataIndex: 'Phone',
            key: 'Phone',
        },
        {
            title: 'Active',
            dataIndex: 'Active',
            key: 'Active',
        },
        {
          title: 'Actions',
          render:(text, record)=> <Link to={`/employee/edit-employee/${record.EmployeeID}`}><Edit size={16}/></Link>
      },
    ]} pagination={{
        total: totalData,
        pageSize: perPage,
        current: currentPage,
        onChange(page, pageSize) {
          setPerPage(pageSize)
          setCurrentPage(page)
        },
    }}/>
  </div>)


}