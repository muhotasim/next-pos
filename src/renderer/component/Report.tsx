import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Actions, actions } from '../root.store';
import Icon from "../assets/512x512.png";
import { ArrowLeft, Database } from 'react-feather';
import { useNavigate } from 'react-router-dom';
export const Reports = ({ }) => {
    const navigate = useNavigate()
    return <div className='dashboard'>
        <Button style={{ display: 'flex', marginBottom: '2rem' }} onClick={() => navigate('/')}><ArrowLeft size={16} style={{ paddingTop: '3px' }} /> Back</Button>

        <div className='actions'>
            <div className='action' onClick={() => navigate('/sales-report')}>
                <div className='icon'><Database size={26} /></div>
                <div className='content'><p>Sales Report</p></div>
            </div>
            <div className='action' onClick={() => navigate('/inventory-report')}>
                <div className='icon'><Database size={26} /></div>
                <div className='content'><p>Inventory Report</p></div>
            </div>
            <div className='action' onClick={() => navigate('/top-sell-report')}>
                <div className='icon'><Database size={26} /></div>
                <div className='content'><p>Top Sell Report</p></div>
            </div>
        </div>
    </div>
}