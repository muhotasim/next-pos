import { Button, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { Package, PieChart, Plus, Settings, ShoppingBag, User } from 'react-feather';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
export const Home = () => {
  const navigate = useNavigate()
  useEffect(() => {
  }, []);
  return (
    <div className='page'>
      <div className='dashboard'>
        <div className='summery'>
          <Row gutter={25} justify={'space-evenly'}>
            <Col xl={6} lg={6} md={8} sm={12} xs={24}>
              <div className='dashboard-card'>
                <h2>Number of Active SKU</h2>
                <p>50</p>
              </div>
            </Col>
            <Col xl={6} lg={6} md={8} sm={12} xs={24}>
              <div className='dashboard-card'>
                <h2>Todays Sell</h2>
                <p>150$</p>
              </div>
            </Col>
            <Col xl={6} lg={6} md={8} sm={12} xs={24}>
              <div className='dashboard-card'>
                <h2>Todays Gain</h2>
                <p>150$</p>
              </div>
            </Col>
          </Row>
        </div>

        <div className='actions'>
          <div className='action' onClick={()=>navigate('/products')}>
            <div className='icon'><Package size={26}/></div>
            <div className='content'><p>Products</p></div>
          </div>
          <div className='action'>
            <div className='icon'><ShoppingBag size={26}/></div>
            <div className='content'><p>Seller</p></div>
          </div>
          
          <div className='action'>
            <div className='icon'><User size={26}/></div>
            <div className='content'><p>Customers</p></div>
          </div>
          <div className='action'>
            <div className='icon'><Settings size={26}/></div>
            <div className='content'><p>Settings</p></div>
          </div>
          <div className='action'>
            <div className='icon'><PieChart size={26}/></div>
            <div className='content'><p>Reports</p></div>
          </div>
          <div className='action'>
            <div className='icon'><User size={26}/></div>
            <div className='content'><p>Employee</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
