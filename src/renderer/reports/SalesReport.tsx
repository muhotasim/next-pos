import { Button, Col, Row, Table } from 'antd';
import { useEffect, useState } from 'react';
import { ArrowLeft, Edit, Package, PieChart, Plus, Settings, ShoppingBag, User } from 'react-feather';
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { Actions } from '../root.store';
export const SalesReport = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const handleActionResult = (arg) => {
    switch (arg.action) {
      case 'reports-sales':
        console.log(arg)
        if(arg.success){
           setData(arg.data)
        }
        break;
    }
  };

  useEffect(() => {
    const uneventCallback =  window.electron.ipcRenderer.on('action-result', handleActionResult);
    window.electron.ipcRenderer.sendMessage('action', {
        action: 'reports-sales',
        params: {},
        payload: {}
      });
      return ()=>{
        if(uneventCallback) uneventCallback();
    }
  }, []);
  return (<div className='page'>
    <Button style={{display: 'flex', marginBottom: '2rem'}} onClick={() => navigate('/reports')}><ArrowLeft size={16} style={{paddingTop: '3px'}}/> Back</Button>

    <Table dataSource={data} columns={[
        {
            title: 'Date',
            dataIndex: 'Date',
            key: 'Date',
        },
        {
            title: 'Total Transactions',
            dataIndex: 'TotalTransactions',
            key: 'TotalTransactions',
        },
        {
            title: 'Total Sales',
            dataIndex: 'TotalSales',
            key: 'TotalSales',
        },
    ]} />
  </div>)


}