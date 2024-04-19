import { Button, Col, Form, Input, Modal, Row, Select, Upload } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Package, PieChart, Plus, Save, Search, Settings, ShoppingBag, UploadCloud, User } from 'react-feather';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import { Actions } from '../root.store';
export const CreateProduct = () => {
    const dispatch = useDispatch()
    const formRef = useRef(null);
    const {id} = useParams();
    const [formData, setFormData] = useState<any>({
        name: '',
        category: [],
        sku: '',
        price: 0,
        realprice: 0,
        regularprice: 0,
        discount: 0,
        quantity: ''
    })
    const [loading, setLoading] = useState(true)
    const [file, setFile] = useState<any>(null)
    const { products, categories } = useSelector((state: any) => state.rootState)
    const navigate = useNavigate()
    const handleActionResult = (arg) => {
        switch (arg.action) {
          case "save-product":
          case "update-product":
            if (arg.success) {
                Modal.success({title: "Product Saved Successfully"})
                navigate('/products')
            }else{
                Modal.error({title: "Product Failed To Save"})
            }
    
            break;

            case 'get-products-by-id':

            console.log(arg)
            const data = {
            name: arg.data.Name,
            category: JSON.parse(arg.data.Categories),
            price: arg.data.Price,
            realprice: arg.data.RealPrice,
            regularprice: arg.data.RegularPrice,
            discount: arg.data.Discount,
            quantity: arg.data.QuantityAvailable}
            console.log(data)
            setFile(arg.data.ImgALoc);
            setFormData(data)
            if(formRef?.current) formRef.current?.setFieldsValue(data);

            break;
        }
        setLoading(false);
      };

    const updateFormField = (key, value) => {
        const tempFormData = { ...formData };
        tempFormData[key] = value;
        setFormData(tempFormData)
    }

    const onFinish = (values) => {
        const data = {
            ...values, file: (file&&file?.path) ? file?.path : file?file:""
        }
        if(id){
            
            window.electron.ipcRenderer.sendMessage('action', {
                action: 'update-product',
                params: {id: id},
                payload: data
              });
        }else{
            window.electron.ipcRenderer.sendMessage('action', {
                action: 'save-product',
                params: {},
                payload: data
              });
        }
        
    }

    useEffect(()=>{
       const uneventCallback = window.electron.ipcRenderer.on('action-result', handleActionResult);
        if(id){
            window.electron.ipcRenderer.sendMessage('action', {
                action: 'get-products-by-id',
                params: {id: id},
                payload: {}
              });
        }
        return ()=>{
            if(uneventCallback) uneventCallback();
        }
    },
    [])

    return <div className='page'>
        <Button onClick={() => navigate('/products')} style={{}}><ArrowLeft size={16} style={{ paddingTop: '3px', paddingRight: '5px' }} /> Back</Button>

        <Form initialValues={formData}
            ref={formRef}
            onFinish={onFinish}
            layout="vertical"
            onValuesChange={(val, values: any) => {
                setFormData(values);
            }}>
            <Form.Item
                name="name"
                label="Name"

                rules={[{ required: true, message: 'Please input Name!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Category"
                name="category"

                rules={[{ required: true, message: 'Please input Category!' }]}
            >
                <Select mode='tags' tokenSeparators={[',']}>
                    {categories.map((category, index) => {
                        return <Select.Option value={category.CategoryID} key={index}>{category.Name}</Select.Option>
                    })}
                </Select>
            </Form.Item>

            <Row gutter={25}>

                <Col>
                    <Form.Item
                        label="Real Price"
                        name="realprice"

                        rules={[{ required: true, message: 'Please input Real Price!' }]}
                    >
                        <Input type='number' />
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item
                        label="Regular Price"
                        name="regularprice"

                        rules={[{ required: true, message: 'Please input RegularPrice!' }]}
                    >
                        <Input type='number' />
                    </Form.Item>
                </Col>

                <Col>
                    <Form.Item
                        label="Discount"
                        name="discount"

                        rules={[{ required: true, message: 'Please input Discount!' }]}
                    >
                        <Input type='number' />
                    </Form.Item></Col>
                    <Col>
                    <Form.Item
                        label="Price"
                        name="price"

                        rules={[{ required: true, message: 'Please input Price!' }]}
                    >
                        <Input type='number' />
                    </Form.Item>
                </Col>
            </Row>


            <div style={{ margin: '15px 0' }}>
                <label>Image</label>
                <Input type='file' onChange={(e) => {
                    if (e.target.files?.length) setFile(e.target.files[0])
                }} />
                {(id&&file)? file instanceof File?<img src={URL.createObjectURL(file)} style={{width: '80px'}}/>:<img src={file} style={{width: '80px'}}/>:file instanceof File?<img src={URL.createObjectURL(file)} style={{width: '80px'}}/>:''}
            </div>
            <Form.Item
                label="Quantity"
                name="quantity"

                rules={[{ required: true, message: 'Please input Quantity!' }]}
            >
                <Input />
            </Form.Item>
            <Col span={3}>
                <Button type='primary' style={{ display: 'flex', marginTop: '3rem' }} htmlType="submit"><Save size={16} style={{ paddingRight: '15px', paddingTop: '2px' }} /> Submit</Button>
            </Col>
        </Form>
    </div>
}