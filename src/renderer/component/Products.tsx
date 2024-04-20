import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import { useEffect, useState } from 'react';

import { ArrowLeft, Edit, Info, Package, PieChart, Plus, Printer, Search, Settings, ShoppingBag, User } from 'react-feather';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { Actions, StateType } from '../root.store';
import Barcode from 'react-barcode';
export const Products = () => {
    const dispatch = useDispatch()
    const [filterData, setFilterData] = useState({
        name: '',
        category: [],
        sku: '',
        price_from: '',
        price_to: '',
        quantity_from: '',
        quantity_to: '',
    })
    const [openAddStock, setOpenAddStock] = useState(false)
    const [openSkuCode, setOpenSkuCode] = useState(false)
    const [selectedStock, setSelectedStock] = useState({
        id: null,
        quantity: 0
    })
    const [orderCart, setOrderCart] = useState<any>([])
    const toggleStockModel = ()=>{setOpenAddStock(!openAddStock)}
    const updateOrderCart = (index, key, value)=>{
        const temp = [...orderCart]
        temp[index][key] = value;
        setOrderCart(temp);
    }

    const {products, categories} = useSelector((state: any)=>state.rootState)
    const [filteredProducts, setFilterdProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const onFinish = (values) => {
        console.log(values);
    }
    const handleActionResult = (arg) => {
        switch (arg.action) {
          case "get-all-products":
            if(arg.success){
                dispatch({
                    type: Actions.SET_PRODUCTS,
                    payload:{
                        products: arg.data.map(d=>{
                            d.Categories = JSON.parse(d.Categories);
                            return d;
                        })
                    }
                })
            }
            break;
            case "get-all-category":
                if(arg.success){
                    dispatch({
                        type: Actions.SET_CATEGORIES,
                        payload:{
                            categories: arg.data
                        }
                    })
                }
            break;
            case "add-to-stock":
                if(arg.success){
                    setOpenAddStock(false);
                    window.electron.ipcRenderer.sendMessage('action', {
                        action: 'get-all-products',
                        params: {},
                        payload: {}
                      });
                }
            break;
        }
        setLoading(false);
      };
      
    const  onAddToStock= ()=>{
        window.electron.ipcRenderer.sendMessage('action', {
            action: 'add-to-stock',
            params: {},
            payload: {...selectedStock}
          });
    }
    useEffect(()=>{
        setFilterdProducts(products.filter((product:any)=>{
            let nameCheck = true;
            let priceCheckFrom = true;
            let priceCheckTo = true;
            let quantityCheckFrom = true;
            let quantityCheckTo = true;
            let categoryCheck = true;
            let skyCheck = true;
            if(filterData.name ){
                nameCheck = product.Name.toLowerCase().includes(filterData.name.toLowerCase());
            }
            if(filterData.sku ){
                skyCheck = product.ProductID == filterData.sku;
            }
            if(filterData?.category?.length){
                let found = false;
                for(let category of product.Categories){
                    categoryCheck = filterData.category.includes(category);
                    if(categoryCheck) {
                        found = true;
                        break;
                    }
                }
                if(!found){
                    categoryCheck = false;
                }
                // 
            }
            if(filterData.price_from){
                priceCheckFrom = product.Price>=filterData.price_from
            }
            if(filterData.price_to){
                priceCheckTo = product.Price<=filterData.price_to
            }
            
            if(filterData.quantity_from){
                quantityCheckFrom = product.QuantityAvailable>=filterData.quantity_from
            }
            if(filterData.quantity_to){
                quantityCheckTo = product.QuantityAvailable<=filterData.quantity_to
            }
        return nameCheck && priceCheckFrom && priceCheckTo && quantityCheckFrom && quantityCheckTo && skyCheck;
        }))
    }, [products,filterData])

    useEffect(()=>{
      const uneventCallback =  window.electron.ipcRenderer.on('action-result', handleActionResult);
        window.electron.ipcRenderer.sendMessage('action', {
            action: 'get-all-products',
            params: {},
            payload: {}
          });
          window.electron.ipcRenderer.sendMessage('action', {
            action: 'get-all-category',
            params: {},
            payload: {}
          });
          return ()=>{
            if(uneventCallback) uneventCallback();
        }
    },[])

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
                    {/* <Col lg={4} md={6} sm={12} xs={24}>

                        <Form.Item
                            name="category"
                            label="Category"
                        >
                            <Select mode='multiple'>
                                {categories.map((category, index)=>{
                                    return <Select.Option value={category.Name} key={index}>{category.Name}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Col> */}
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
                </Row>
            </Form>

            <Button type='primary' onClick={()=>{
                navigate('/create-product')
            }} style={{display: 'flex', float: 'right'}}><Plus size={16} style={{paddingTop: '3px', paddingRight: '5px'}}/> Create Product</Button>
            <p className='clearfix' style={{display: 'table', clear: 'both', content: ' '}}></p>
        </div>
        <div className='products'>
            {filteredProducts.map((product:any, index)=>{
                return <ProductCard edit={()=>{
                    navigate('/products/edit/'+product.ProductID)
                }} onOpenAddStock={()=>{
                    
                    setSelectedStock({
                        id: product.ProductID,
                        quantity: 0
                    })
                    toggleStockModel();
                }} key={index} img={product.ImgALoc} openSku={()=>{
                    setSelectedStock({
                        id: product.ProductID,
                        quantity: 0
                    })
                    setOpenSkuCode(true)
                }} name={product.Name} discount={product.Discount} description={product.Description} quantity={product.QuantityAvailable} price={product.Price}
                regularPrice={product.RealPrice}
                realPrice={product.RealPrice}
                />
            })}
        </div>
        <Modal open={openAddStock}  onCancel={toggleStockModel} onOk={onAddToStock}>
            <label>Number of new unit</label>
            <Input  value={selectedStock.quantity} onChange={e=>{
                setSelectedStock({...selectedStock, quantity: e.target.value})
            }}/>
        </Modal>
        <Modal open={openSkuCode} onCancel={()=> setOpenSkuCode(false)} footer={null}>
        <div style={{textAlign: 'center'}} className='printable' id='barcode-holder'>
        <Barcode displayValue={false} value={selectedStock.id?selectedStock.id:''} />
        </div>
        <Button onClick={()=>{
            // window.electron.ipcRenderer.sendMessage('print-receipt', document.getElementById('barcode-holder')?.innerHTML);
            window.print()
            }}><Printer size={16} style={{paddingTop: '2px', paddingRight: '10px'}}/> Print</Button>
        </Modal>
    </div>
}

const ProductCard = ({img, name,onOpenAddStock,openSku,edit, description, quantity, price, regularPrice, realPrice, discount})=>{
    return <div className='product-card'>
       <div className='main-details'>
       <div className='img'>
            <img src={img} alt='No Image'/>
        </div>
        <div className='details'>
            <h3>{name}</h3>
            <p>{description}</p>
            <span onClick={openSku} style={{marginRight: '5px'}}><Info size={16} style={{paddingTop: '20px', cursor: 'pointer'}}/></span>
            <span onClick={edit}><Edit size={16} style={{paddingTop: '20px', cursor: 'pointer'}}/></span>
           
        </div>
       </div>

        <div className='summery'>
                <div className='quantity'><strong>Quantity:</strong><span>{quantity} <span onClick={onOpenAddStock}><Plus size={16} style={{paddingTop: '20px', cursor: 'pointer'}}/></span></span></div>
                <div className='price'>

                    <div>
                    <strong>Regular Price:</strong><span>{regularPrice}</span>
                    </div>
                    <div><strong>Brought At:</strong> <span>{realPrice}</span></div>
                    <div><strong>Discount:</strong> <span>{discount}</span></div>
                    <div><strong>Price:</strong> <span>{price}</span></div>
                </div>
            </div>
    </div>
}