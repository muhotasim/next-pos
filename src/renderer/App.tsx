import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
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
    window.electron.ipcRenderer.on('action-result', handleActionResult);
    setLoading(true);
    window.electron.ipcRenderer.sendMessage('action', {
      action: 'get-config',
      params: {},
      payload: {}
    });

  }, [])
  if (loading) {
    return <div style={{ padding: '20px', margin: '30px', textAlign: 'center' }}>
      <Spin size='large' />
    </div>
  }
  if (!config.id) {
    return <Config />
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
      </Routes>
    </Router>
  );
}
