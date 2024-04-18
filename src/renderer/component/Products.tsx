import { Button, Col, Form, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { ArrowLeft, Package, PieChart, Plus, Search, Settings, ShoppingBag, User } from 'react-feather';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { StateType } from '../root.store';
export const Products = () => {
    const [filterData, setFilterData] = useState({
        name: '',
        category: [],
        sku: '',
        price_from: '',
        price_to: '',
        quantity_from: '',
        quantity_to: '',
    })

    const {products, categories} = useSelector((state: any)=>state.rootState)
    const [filteredProducts, setFilterdProducts] = useState([])
    const navigate = useNavigate()
    const onFinish = (values) => {
        console.log(values);
    }

    useEffect(()=>{
        setFilterdProducts(products.filter((product:any)=>{
            let included = true;

            if(filterData.name ){
                included = product.name.toLowerCase().includes(filterData.name.toLowerCase());
            }
            if(filterData.category.length){
                included = filterData.category.includes(product.category);
            }
            if(filterData.price_from){
                included = product.price>=filterData.price_from
            }
            if(filterData.price_to){
                included = product.price<=filterData.price_to
            }
            
            if(filterData.quantity_from){
                included = product.quantity>=filterData.price_from
            }
            if(filterData.quantity_to){
                included = product.quantity<=filterData.quantity_to
            }

        }))
    }, [products,filterData])

    return <div className='page'>
        <Button style={{display: 'flex', marginBottom: '2rem'}} onClick={() => navigate('/')}><ArrowLeft size={16} style={{paddingTop: '3px'}}/> Back</Button>

        <div className='filters'>
            <Form initialValues={filterData}
                onFinish={onFinish}
                layout="vertical"
                onValuesChange={(val, values: any) => {
                    setFilterData(values);
                }}>
                <Row gutter={20}>
                    <Col lg={4} md={6} sm={12} xs={24}>

                        <Form.Item
                            name="name"
                            label="Name"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col lg={4} md={6} sm={12} xs={24}>

                        <Form.Item
                            name="Category"
                            label="category"
                        >
                            <Select mode='multiple'>
                                {categories.map((category, index)=>{
                                    return <Select.Option value={category.id} key={index}>{category.name}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col lg={3} md={6} sm={12} xs={24}>

                        <Form.Item
                            name="sku"
                            label="Sku"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col lg={5} md={6} sm={12} xs={24}>
                        <Row gutter={10}>
                            <Col span={12}>
                                <Form.Item
                                    label="Price from"
                                    name="price_from"
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Price to"
                                    name="price_to"
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col lg={5} md={6} sm={12} xs={24}>
                        <Row gutter={10}>
                            <Col span={12}>
                                <Form.Item
                                    label="Quantity from"
                                    name="quantity_from"
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Quantity to"
                                    name="quantity_to"
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={3}>
                        <Button type='primary' style={{display: 'flex', marginTop: '3rem'}}><Search size={16} style={{paddingRight: '15px', paddingTop: '2px'}}/> Filter</Button>
                    </Col>
                </Row>
            </Form>


        </div>
        <div className='products'>
            {products.map((product, index)=>{
                return <ProductCard key={index} img={product.img} name={product.name} description={product.description} quantity={product.quantity} price={product.price}/>
            })}
        </div>
    </div>
}

const ProductCard = ({img, name, description, quantity, price})=>{
    return <div className='product-card'>
        <div className='img'>
            <img src={img} alt='No Image'/>
        </div>
        <div className='details'>
            <h3>{name}</h3>
            <p>{description}</p>
            <div className='summery'>
                <div className='quantity'><span>{quantity}</span></div>
                <div className='price'>{price}</div>
            </div>
        </div>
    </div>
}