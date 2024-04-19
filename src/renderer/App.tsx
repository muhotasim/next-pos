import { MemoryRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import Login from './component/Login';
import { Home } from './component/Home';
import { Config } from './component/Config';
import { Actions } from './root.store';
import { Spin } from 'antd';
import { CreateProduct } from './component/CreateProduct';
import { Products } from './component/Products';
import { Seller } from './component/Seller';
import { Employee } from './component/Employee';
import { CreateEmployee } from './component/CreateEmployee';
import { Reports } from './component/Report';
import { SalesReport } from './reports/SalesReport';
import { InventoryReport } from './reports/InventoryReport';
import { TopSellReport } from './reports/TopSellReport';

const ConfRapper = ()=>{
  const navigate = useNavigate()
  return <Config goBack={()=>{navigate('/')}}/>;
}

export default function App() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  const { isLogedIn, config } = useSelector((state: any) => state.rootState)
  const handleActionResult = (arg) => {
    switch (arg.action) {
      case "get-config":

        if (arg.success) {
          const configObj = {
            id: arg.data.ConfigID,
            shopName: arg.data.ShopName,
            shopAddress: arg.data.ShopAddress,
            lang: arg.data.Lang,
            phone: arg.data.Phone,
            phone2: arg.data.Phone2
          }
          dispatch({
            type: Actions.SET_CONFIG,
            payload: {
              config: configObj
            }
          })
        }

        break;
    }
    setLoading(false);
  };
  useEffect(() => {
   const uneventCallback = window.electron.ipcRenderer.on('action-result', handleActionResult);
    setLoading(true);
    window.electron.ipcRenderer.sendMessage('action', {
      action: 'get-config',
      params: {},
      payload: {}
    });
    return ()=>{
      if(uneventCallback) uneventCallback();
    }
  }, [])
  if (loading) {
    return <div style={{ padding: '20px', margin: '30px', textAlign: 'center' }}>
      <Spin size='large' />
    </div>
  }
  if (!config.id) {
    return <Config goBack={null}/>
  }
  if (!isLogedIn) {
    return <>
      <Login />
    </>
  }
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/create-product" element={<CreateProduct />} />
        <Route path="/products/edit/:id" element={<CreateProduct />} />
        <Route path="/seller" element={<Seller />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/sales-report" element={<SalesReport />} />
        <Route path="/inventory-report" element={<InventoryReport />} />
        <Route path="/top-sell-report" element={<TopSellReport />} />
        
        <Route path="/employee/create-employee" element={<CreateEmployee />} />
        <Route path="/employee/edit-employee/:id" element={<CreateEmployee />} />
       
        <Route path="/config" element={<ConfRapper/>} />
      </Routes>
    </Router>
  );
}
