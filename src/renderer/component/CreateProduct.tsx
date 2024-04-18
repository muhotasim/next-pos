import { Button, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { ArrowLeft, Package, PieChart, Plus, Settings, ShoppingBag, User } from 'react-feather';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
export const CreateProduct = () => {
    const [formData, setFormData] = useState({})
    const navigate = useNavigate()

    const updateFormField = (key, value)=>{
        const tempFormData = {...formData};
        tempFormData[key] = value;
        setFormData(tempFormData)
    }

    return <div className='page'>
        <Button onClick={()=>navigate('/')}><ArrowLeft/> Back</Button>
    </div>
}