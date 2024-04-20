import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { ArrowLeft, Edit, Info, Package, PieChart, Plus, Search, Settings, ShoppingBag, User } from 'react-feather';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { Actions, StateType } from '../root.store';
import Barcode from 'react-barcode';
let customerSearch:any = null;
export const Seller = () => {
    const dispatch = useDispatch();
    const {products, categories, config, user} = useSelector((state: any)=>state.rootState)
    const [allEmployees, setAllEmployees] = useState([])
    const [advance, turnOfAdvance] = useState(false)
    const [filterData, setFilterData] = useState({
        name: '',
        category: [],
        sku: '',
        price_from: '',
        price_to: '',
        quantity_from: '',
        quantity_to: '',
    })
    const [filterSKU, setFilterSKU] = useState({sku: ''})
    const [openAddStock, setOpenAddStock] = useState(false)
    const [confirmSell, setOpenConfirmSell] = useState(false)
    const [soldBy, setSoldBy]= useState<null|number>(user.id)
    const [customer, setCustomer]= useState<any>({
        customerID: null,
        name: '',
        phone: ''
    })
    const [customerList, setCustomerList] = useState([]);
    const [selectedStock, setSelectedStock] = useState({
        id: null,
        quantity: 0
    })
    const [orderCart, setOrderCart] = useState<any>([])
    const toggleStockModel = ()=>{setOpenAddStock(!openAddStock)}
    const addToOrderCard = ({ ProductID, Name, Price, Quantity, Discount, RegularPrice,AvQT, ImgALoc })=>{
        const temp = [...orderCart]
        temp.push({
            Name,
            Price,
            Quantity,
            Discount,
            RegularPrice,
            ProductID,
            ImgALoc,
            AvQT
        })
        setOrderCart(temp);
    }
    const updateOrderCart = (index, key, value)=>{
        const temp = [...orderCart]
        temp[index][key] = value;
        setOrderCart(temp);
    }

    const [filteredProducts, setFilterdProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const onFinish = (values) => {
        console.log(values);
        setFilterData({...filterData, sku: values.sku})
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
            case "all-active-employee":
                if(arg.success){
                    setAllEmployees(arg.data.map((d)=>({
                        label: d.FirstName+' '+d.LastName,
                        value: d.EmployeeID
                    })))
                }
            break;
            case "customer-by-phone":
                if(arg.success){
                    console.log('Customers: ',arg.data)
                    setCustomerList(arg.data)
                }
            break;
            case "save-customer":

                console.log(arg.data, arg.data[0]?.CustomerID)
            if(arg.success){
                setCustomer({
                    customerID: arg.data[0].CustomerID,
                    name: arg.data[0].Name,
                    phone: arg.data[0].Phone
                });
            }
            break;
            case  'sell-item':
                if(arg.success){
                    console.log(arg)
                    setOrderCart([]);
                    setCustomer({
                        customerID: null,
                        name: '',
                        phone: ''
                    })
                    setCustomerList([])
                    setOpenConfirmSell(false)
                    setOpenAddStock(false)
                    
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
        const filterProducts = products.filter((product:any)=>{
            let nameCheck = true;
            let priceCheckFrom = true;
            let priceCheckTo = true;
            let quantityCheckFrom = true;
            let quantityCheckTo = true;
            let categoryCheck = true;
            let skuCheck = true;
            if(filterData.name ){
                nameCheck = product.Name.toLowerCase().includes(filterData.name.toLowerCase());
            }
            if(filterData.sku ){
                skuCheck = product.ProductID == filterData.sku;
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
        return nameCheck && priceCheckFrom && priceCheckTo && quantityCheckFrom && quantityCheckTo && skuCheck;
        })
        setFilterdProducts([...filterProducts])
    }, [products,filterData])
    const filterBYSKU = (values)=>{
        setFilterData({...filterData, sku: values.sku})
        const product = products.find(d=>d.ProductID==values.sku)
        let inIndex = orderCart.findIndex(d=>d.ProductID==values.sku)
        if(inIndex == -1){
            addToOrderCard({ImgALoc: product.ImgALoc,Name: product.Name, AvQT: product.QuantityAvailable, Quantity: 1,Discount: product.Discount, Price: product.Price, RegularPrice: product.RegularPrice, ProductID: product.ProductID})
        }else{
            console.log(orderCart[inIndex].QuantityAvailable)
            updateOrderCart(inIndex, 'QuantityAvailable', Number(orderCart[inIndex].QuantityAvailable)+1)
        }
    }
    const sell = ()=>{
        const payload = {
            customerId: customer.customerID,
            employeeId: soldBy,
            items: orderCart.map((item)=>{
                return {
                    productID: item.ProductID,
                    quantity: item.Quantity,
                    unitPrice: (Number( item.Price )* Number(item.Quantity))-((Number( item.Price )*Number(item.Discount))/100),
                    realPrice: item.RegularPrice,
                    discount: item.Discount
                }
            })
            
        }
        window.electron.ipcRenderer.sendMessage('action', {
            action: 'sell-item',
            params: {},
            payload: payload
          });
        // window.electron.ipcRenderer.sendMessage('action', {
        //     action: 'add-to-stock',
        //     params: {},
        //     payload: {...selectedStock}
        //   });
    }

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
          window.electron.ipcRenderer.sendMessage('action', {
            action: 'all-active-employee',
            params: {},
            payload: {}
          });
          return ()=>{
            if(uneventCallback) uneventCallback();
            if(customerSearch){
                clearTimeout(customerSearch);
            }
        }
    },[])



    return <div className='page'>
        <Button style={{display: 'flex', marginBottom: '2rem'}} onClick={() => navigate('/')}><ArrowLeft size={16} style={{paddingTop: '3px'}}/> Back</Button>

        <div className='filters'>
            <span style={{fontSize: '18px', marginBottom: '20px', float: 'right', cursor: 'pointer'}}><span onClick={()=>{turnOfAdvance(true)}} style={advance?{background: 'var(--primary-color)', color: 'white', padding: '5px', borderRadius: '5px', cursor: 'pointer'}:{}}>Bu SKU</span>/<span onClick={()=>{turnOfAdvance(false)}} style={!advance?{background: 'var(--primary-color)', color: 'white', padding: '5px', borderRadius: '5px'}:{}}>Advance</span></span>
            {advance&&<Form layout="inline" 
            initialValues={filterSKU}
            onFinish={filterBYSKU}
            onValuesChange={(val, values: any) => {
                    setFilterSKU(values);
                }}>
                        <Form.Item
                            name="sku"
                            label="Sku"
                        >
                            <Input />
                        </Form.Item>
                        <Button htmlType="submit">Submit</Button>
            </Form>}
            {!advance&&<Form initialValues={filterData}
                onFinish={onFinish}
                layout="vertical"
                onValuesChange={(val, values: any) => {
                    setFilterData(values);
                }}>
                <Row gutter={20}>
                    <Col lg={6} md={6} sm={12} xs={24}>

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
                    <Col lg={4} md={6} sm={12} xs={24}>

                        <Form.Item
                            name="sku"
                            label="Sku"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={24}>
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
                    <Col lg={6} md={6} sm={12} xs={24}>
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
            </Form>}
            <p className='clearfix' style={{display: 'table', clear: 'both', content: ' '}}></p>
        </div>
        <Row gutter={15}>
                <Col span={16}>
        <div className='products seller'>
            
                    {filteredProducts.map((product:any, index)=>{
                        const existsOnCart = orderCart.find(d=>d.ProductID==product.ProductID)
                        return <ProductCard canAdd={!existsOnCart} add={()=>{
                            addToOrderCard({ImgALoc: product.ImgALoc,Name: product.Name, AvQT: product.QuantityAvailable, Quantity: 1,Discount: product.Discount, Price: product.Price, RegularPrice: product.RegularPrice, ProductID: product.ProductID})
                        }}  key={index} img={product.ImgALoc} name={product.Name} discount={product.Discount} description={product.Description} quantity={product.QuantityAvailable} price={product.Price}
                        regularPrice={product.RealPrice}
                        />
                    })}
            
        </div>    </Col>
                <Col span={6}>
                    <div style={{textAlign: 'center'}} className='sell-recipt'>
                    <h4>{config.shopName}</h4>
                    <p>{config.shopAddress}</p>
                    <p>Phone: {config.phone} {config.phone2?`.${config.phone2}`:''}</p>
                    </div>
                    <table className='order-placement'>
                        <tr>
                            <td style={{fontWeight: 600}}>Product</td>
                            <td style={{fontWeight: 600}}>Quantity</td>
                            <td style={{fontWeight: 600}}>Price</td>
                            <td style={{fontWeight: 600}}>Total</td>
                        </tr>
                        {orderCart.map((cart,index)=>{
                            let net = cart.Price*cart.Quantity;
                            return <tr key={index}>
                            <td>{cart.Name}({cart.ProductID})</td>
                            <td><Input style={{width: '60px'}} value={cart.Quantity} onChange={(e)=>{
                                if(cart.AvQT<e.target.value) return
                                if(isNaN(Number(e.target.value))){
                                    updateOrderCart(index, 'Quantity', 0)
                                }
                                updateOrderCart(index, 'Quantity', Number(e.target.value))
                            }}/></td>
                            <td>{cart.Price}</td>
                            <td>{net}</td>
                        </tr>
                        })}
                    </table>
                    <div>
                        Sold By: <Select style={{width: '100%'}} options={allEmployees} value={soldBy} onChange={(v)=>{setSoldBy(v)}}/>
                    </div>
                    <div style={{marginTop: '25px'}}>
                        <label>Customer:</label> 
                        
                        <Input style={{width: '100%', marginBottom: '15px'}} placeholder='Customer Phone' value={customer.phone} onChange={(e)=>{
                            setCustomer({...customer, phone: e.target.value, customerID: null})
                            if(customerSearch){
                                clearTimeout(customerSearch)
                            }
                            customerSearch = setTimeout(()=>{
                                console.log('getting ')
                                window.electron.ipcRenderer.sendMessage('action', {
                                    action: 'customer-by-phone',
                                    params: {},
                                    payload: {
                                        phone: e.target.value
                                    }
                                  });
                            }, 400)
                            }}/>

                        {(customer.phone&&customerList.length==0)&&<Input  placeholder='Customer Name' style={{width: '100%', marginBottom: '15px'}} value={customer.name} onChange={(e)=>{
                            setCustomer({...customer, name: e.target.value})
                         
                            }}/>}
                            <ul>
                            {
                            customerList.map((customer=>{
                                return <li onClick={()=>{
                                    setCustomer({
                                        customerID: customer.CustomerID,
                                        name: customer.Name,
                                        phone: customer.Phone
                                    })
                                    setCustomerList([])
                                }}>{customer.Name || customer.FirstName}</li>
                            }))
                        }
                            </ul>
                        {customer.phone&&customer.name&&!customer.customerID&&customerList.length==0&&<Button onClick={()=>{
                            window.electron.ipcRenderer.sendMessage('action', {
                                action: 'save-customer',
                                params: {},
                                payload: {
                                    Name: customer.name,
                                    Phone: customer.phone,
                                }
                              });
                        }}>Create Customer</Button>}
                    </div>
                    {orderCart.length>0&&<Button type='primary' style={{float: 'right', marginTop: '25px'}} onClick={()=>{setOpenConfirmSell(true)}}>Confirm Sell</Button>}
                </Col>
            </Row>
            <Modal open={confirmSell} onCancel={()=>{setOpenConfirmSell(false)}} footer={null}>
            <div style={{textAlign: 'center'}} className='sell-recipt'>
                    <h4>{config.shopName}</h4>
                    <p>{config.shopAddress}</p>
                    <p>Phone: {config.phone} {config.phone2?`.${config.phone2}`:''}</p>
                    </div>
                    <table className='order-placement'>
                        <tr>
                            <td style={{fontWeight: 600}}>Product</td>
                            <td style={{fontWeight: 600}}>Quantity</td>
                            <td style={{fontWeight: 600}}>Price</td>
                            <td style={{fontWeight: 600}}>Total</td>
                        </tr>
                        {orderCart.map((cart,index)=>{
                            let net = cart.Price*cart.Quantity;
                            return <tr key={index}>
                            <td>{cart.Name}({cart.ProductID})</td>
                            <td>{cart.Quantity}</td>
                            <td>{cart.Price}</td>
                            <td>{net}</td>
                        </tr>
                        })}
                    </table>
                    <Button style={{marginRight: '10px', marginLeft: '10px'}} onClick={()=>{
                        window.print()
                    }}>Print</Button>
                    <Button type='primary' style={{float: 'right', marginTop:'25px'}} onClick={sell}>Sell</Button>
                    <p style={{clear: 'both', display: 'table', contain: ''}}></p>
            </Modal>
    </div>
}

const ProductCard = ({img, name,description,add,canAdd = true, quantity, price, regularPrice, discount})=>{
    return <div className='product-card'>
       <div className='main-details'>
       <div className='img'>
            <img src={img} alt='No Image'/>
        </div>
        <div className='details'>
            <h3>{name}</h3>
            <p>{description}</p>
            <Button disabled={!canAdd} onClick={add}>Add</Button>
        </div>
       </div>

        <div className='summery'>
                <div className='quantity'><strong>Quantity:</strong><span>{quantity} </span></div>
                <div className='price'>

                    <div>
                    <strong>Regular Price:</strong><span>{regularPrice}</span>
                    </div>
                    <div><strong>Discount:</strong> <span>{discount}</span></div>
                    <div><strong>Price:</strong> <span>{price}</span></div>
                </div>
            </div>
    </div>
}