import { Button, Col, Divider, Row } from 'antd';
import { useEffect, useState } from 'react';
import { LogOut, Package, PieChart, Plus, Settings, ShoppingBag, User, UserCheck, UserX } from 'react-feather';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { Actions } from '../root.store';
export const Home = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [dashboardData, setDashboardData] = useState({
    numberOfActiveSKU: 0,
    todaysSell:0
  })
  const { user } = useSelector((state: any)=>state.rootState)
  const handleActionResult = (arg) => {
    switch (arg.action) {
      case "dashboard":
        console.log(arg)
        if(arg.success){
          setDashboardData(arg.data)
        }
        break;
    }
  };
  useEffect(() => {
    const uneventCallback =  window.electron.ipcRenderer.on('action-result', handleActionResult);
    window.electron.ipcRenderer.sendMessage('action', {
      action: 'dashboard',
      params: {},
      payload: {}
    });
    return ()=>{
      if(uneventCallback) uneventCallback();
  }
  }, []);
  return (
    <div className='page'>
      <div className='dashboard'>
        <div style={{textAlign: 'right'}}>
          <span style={{fontSize: '20px', }}>
            <UserCheck/> {user.username}
          </span>
          <span>
            <Button onClick={()=>{
              dispatch({type: Actions.LOGOUT})
            }} danger style={{marginLeft: '25px'}}><LogOut style={{paddingTop: '3px', paddingRight: '5px'}} size={14}/> Logout</Button>
          </span>
        </div>
        <br />
        <Divider/><br />
        <div className='summery'>
          <Row gutter={25} justify={'space-evenly'}>
            <Col xl={6} lg={6} md={8} sm={12} xs={24}>
              <div className='dashboard-card'>
                <h2>Number of Active SKU</h2>
                <p>{dashboardData.numberOfActiveSKU}</p>
              </div>
            </Col>
            <Col xl={6} lg={6} md={8} sm={12} xs={24}>
              <div className='dashboard-card'>
                <h2>Todays Sell</h2>
                <p>{dashboardData.todaysSell}</p>
              </div>
            </Col>
            {/* <Col xl={6} lg={6} md={8} sm={12} xs={24}>
              <div className='dashboard-card'>
                <h2>Todays Gain</h2>
                <p>150$</p>
              </div>
            </Col> */}
          </Row>
        </div>

        <div className='actions'>
          <div className='action' onClick={()=>navigate('/products')}>
            <div className='icon'><Package size={26}/></div>
            <div className='content'><p>Products</p></div>
          </div>
          <div className='action'  onClick={()=>navigate('/seller')}>
            <div className='icon'><ShoppingBag size={26}/></div>
            <div className='content'><p>Seller</p></div>
          </div>
          
          {/* <div className='action'>
            <div className='icon'><User size={26}/></div>
            <div className='content'><p>Customers</p></div>
          </div> */}
          <div className='action'  onClick={()=>navigate('/config')}>
            <div className='icon'><Settings size={26}/></div>
            <div className='content'><p>Settings</p></div>
          </div>
          <div className='action'   onClick={()=>navigate('/reports')}>
            <div className='icon'><PieChart size={26}/></div>
            <div className='content'><p>Reports</p></div>
          </div>
          <div className='action' onClick={()=>{navigate('/employee')}}>
            <div className='icon'><User size={26}/></div>
            <div className='content'><p>Employee</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
