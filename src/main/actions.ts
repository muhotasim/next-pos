
import { readFile, writeFile } from "fs/promises";
import { createCategory, createCustomer, getConfig, createEmployee, createProduct, deleteCategory, deleteCustomer, deleteEmployee, deleteProduct, getCategories, getCategoryById, getCustomerById, getCustomerReport, getCustomers, getEmployeeById, getEmployeeByUserName, getEmployeePerformance, getEmployies, getInventoryReport, getProductById, getProducts, getSalesReport, getTopSell, saveOrUpdateConfig, sellItems, updateCategory, updateCustomer, updateEmployee, updateProduct, getAllProducts, getAllCategories, addStockToProduct, getEmployiesAllActive, getCustomersByPhone, getDashboardData } from "./db-actions"
import path from "path";
import { app } from "electron";
const crypto = require('crypto');
// const sharp = require('sharp');
const Jimp = require('jimp');
const fs = require('fs');
function createHash(data) {
    const hash = crypto.createHash('md5');
    hash.update(data);
    return hash.digest('hex');
}
const RESOURCES_PATH = app.isPackaged
? path.join(process.resourcesPath, 'assets')
: path.join(__dirname, '../../assets');

const getAssetPath = (...paths: string[]): string => {
return path.join(RESOURCES_PATH, ...paths);
};

// Function to verify a hash
function verifyHash(data, hashToCompare) {
    const generatedHash = createHash(data);
    return generatedHash === hashToCompare;
}
export const actionController: { [key: string]: any } = {
    // products crud
    // 'save-product': async (event: any, body: any) => {
    //     const payload = body.payload;
    //     const productData:any = { Name: payload.name,
    //         Description: payload.description ?? '',
    //         QuantityAvailable: payload.quantity,
    //         RealPrice: payload.realprice,
    //         RegularPrice: payload.regularprice,
    //         Discount: payload.discount,
    //         Price: payload.price, Categories: payload.category?JSON.stringify(payload.category):JSON.stringify([]) }
    //     let outputPath = ''
    //     if(payload.file){
    //         const filePath = '/assets/uploads'
    //         const file = await readFile(payload.file);
    //         const resizedBuffer = await sharp(file)
    //             .resize(256, 256)
    //             .toBuffer();
    //         const assetsDir = path.join(__dirname, '../..'+filePath);
    //         const outputFileName = 'p_img_'+new Date().getTime()+'.png';
    //         outputPath = path.join(assetsDir, outputFileName);
    //         await writeFile(outputPath, resizedBuffer);
            
    //         productData.ImgALoc= payload.file?`/uploads/${outputFileName}`:'';
    //     }
        
    //     const result = await createProduct(productData)
    //        await createCategory(payload.category.map((c)=>({Name: c})))
        
    //     if (result) {
    //         event({
    //             action: 'save-product',
    //             data: body,
    //             success: true
    //         })
    //     } else {
    //         event({
    //             action: 'save-product',
    //             data: null,
    //             success: false
    //         })
    //     }
    // },
    'dashboard': async (event: any, body: any) => {
        const result = await getDashboardData();
        console.log(result)
        if (result) {
            event({
                action: 'dashboard',
                data: result,
                success: true
            })
        } else {
            event({
                action: 'dashboard',
                data: null,
                success: false
            })
        }
    },
    'save-product': async (event: any, body: any) => {
        const payload = body.payload;
        const productData:any = { Name: payload.name,
            Description: payload.description ?? '',
            QuantityAvailable: payload.quantity,
            RealPrice: payload.realprice,
            RegularPrice: payload.regularprice,
            Discount: payload.discount,
            Price: payload.price, Categories: payload.category ? JSON.stringify(payload.category) : JSON.stringify([]) }
        let outputPath = ''
        if (payload.file) {
            const filePath = '/assets/uploads'
            const assetsDir = path.join(__dirname, '../..' + filePath);
            const outputFileName = 'p_img_' + new Date().getTime() + '.png';
            outputPath = path.join(assetsDir, outputFileName);
            const file = await readFile(payload.file);
            const image = await Jimp.read(file);
            const resizedImage = image.resize(256, 256);
            

            await resizedImage.writeAsync(outputPath);
            
            productData.ImgALoc = payload.file ? `/uploads/${outputFileName}` : '';
        }
        
        const result = await createProduct(productData);
        await createCategory(payload.category.map((c) => ({ Name: c })));
        
        if (result) {
            event({
                action: 'save-product',
                data: body,
                success: true
            })
        } else {
            event({
                action: 'save-product',
                data: null,
                success: false
            })
        }
    },
    'delete-product': async (event: any, body: any) => {
        const id = body.params.id;
        const result = await deleteProduct(id);
        if (result) {
            event({
                action: 'delete-product',
                data: result,
                success: true
            })
        } else {
            event({
                action: 'delete-product',
                data: null,
                success: false
            })
        }
    },
    'get-all-products':  async (event: any, body: any) => {
        const products = await getAllProducts();
        if (products.length) {
            event({
                action: 'get-all-products',
                data: products.map((d)=>{
                    d.ImgALoc = d.ImgALoc?getAssetPath(d.ImgALoc):''
                    return d
                }),
                success: true
            })
        } else {

            event({
                action: 'get-all-products',
                data: null,
                success: false
            })
        }

    },

    'get-products': async (event: any, body: any) => {
        const payload = body.payload;
        const { page = 1, perPage = 10, searchQuery = '', filters = {} } = body.params;
        const results = await getProducts(page, perPage, searchQuery, filters);
       
        if (results) {
            event({
                action: 'get-products',
                data: results,
                success: true
            })
        } else {
            event({
                action: 'get-products',
                data: null,
                success: false
            })
        }
    },
    'get-products-by-id': async (event: any, body: any) => {
        const id = body.params.id;
        const results = await getProductById(id);
        if(results.ImgALoc){
            results.ImgALoc = getAssetPath(results.ImgALoc);
        }
        console.log('product: ', results)
        if (results) {
            event({
                action: 'get-products-by-id',
                data: results,
                success: true
            })
        } else {
            event({
                action: 'get-products-by-id',
                data: null,
                success: false
            })
        }
    },
    // 'update-product': async (event: any, body: any) => {
        
    //     const id = body.params.id;
    //     const prevProduct = await getProductById(id);
    //     const payload = body.payload;
    //     let outputPath = ''
    //     const upProductData:any = { Name: payload.name,
    //         Description: payload.description ?? '',
    //         QuantityAvailable: payload.quantity,
    //         RealPrice: payload.realprice,
    //         RegularPrice: payload.regularprice,
    //         Discount: payload.discount,
    //         Price: payload.price, Categories: payload.category?JSON.stringify(payload.category):JSON.stringify([]) }
    //     if(payload.file &&prevProduct.ImgALoc!=payload.file){
    //         const filePath = '/assets/uploads'
    //         const file = await readFile(payload.file);
    //         const resizedBuffer = await sharp(file)
    //             .resize(256, 256)
    //             .toBuffer();
    //         const assetsDir = path.join(__dirname, '../..'+filePath);
    //         const outputFileName = 'p_img_'+new Date().getTime()+'.png';
    //         outputPath = path.join(assetsDir, outputFileName);
    //         await writeFile(outputPath, resizedBuffer);
            
    //         upProductData.ImgALoc= payload.file?`/uploads/${outputFileName}`:'';
    //     }
        
    //     const result = await updateProduct(id, upProductData)
    //     if (result) {
    //         event({
    //             action: 'update-product',
    //             data: result,
    //             success: true
    //         })
    //     } else {
    //         event({
    //             action: 'update-product',
    //             data: null,
    //             success: false
    //         })
    //     }
    // },
  
'update-product': async (event: any, body: any) => {
    const id = body.params.id;
    const prevProduct = await getProductById(id);
    const payload = body.payload;
    let outputPath = ''
    const upProductData:any = { Name: payload.name,
        Description: payload.description ?? '',
        QuantityAvailable: payload.quantity,
        RealPrice: payload.realprice,
        RegularPrice: payload.regularprice,
        Discount: payload.discount,
        Price: payload.price, Categories: payload.category ? JSON.stringify(payload.category) : JSON.stringify([]) }
    if (payload.file && prevProduct.ImgALoc != payload.file) {
        const filePath = '/assets/uploads'
        const assetsDir = path.join(__dirname, '../..' + filePath);
        const outputFileName = 'p_img_' + new Date().getTime() + '.png';
        outputPath = path.join(assetsDir, outputFileName);
        const file = await readFile(payload.file);
        const image = await Jimp.read(file);
        await image.resize(256, 256)
            .writeAsync(outputPath);
        

        await image.writeAsync(outputPath);
        
        upProductData.ImgALoc = payload.file ? `/uploads/${outputFileName}` : '';
    }
    
    const result = await updateProduct(id, upProductData)
    if (result) {
        event({
            action: 'update-product',
            data: result,
            success: true
        })
    } else {
        event({
            action: 'update-product',
            data: null,
            success: false
        })
    }
},
    // category crud
    'save-category': async (event: any, body: any) => {
        const payload = body.payload;
        const result = await createCategory({ Name: payload.name })
        if (result) {
            event({
                action: 'save-category',
                data: result,
                success: true
            })
        } else { 
            event({
                action: 'save-category',
                data: null,
                success: false
            })
        }
    },
    'delete-category': async (event: any, body: any) => {
        const id = body.params.id;
        const result = await deleteCategory(id);
        if (result) {
            event({
                action: 'delete-category',
                data: result,
                success: true
            })
        } else {
            event({
                action: 'delete-category',
                data: null,
                success: false
            })
        }
    },
    'get-all-category': async (event: any, body: any) => {
        
        const results = await getAllCategories();
        if (results) {
            event({
                action: 'get-all-category',
                data: results,
                success: true
            })
        } else {
            event({
                action: 'get-all-category',
                data: null,
                success: false
            })
        }
    },
    'get-category': async (event: any, body: any) => {
        const payload = body.payload;
        const { page = 1, perPage = 10, searchQuery = '', filters = {} } = body.params;
        const results = await getCategories(page, perPage, searchQuery, filters);
        if (results) {
            event({
                action: 'get-category',
                data: results,
                success: true
            })
        } else {
            event({
                action: 'get-category',
                data: null,
                success: false
            })
        }
    },
    'get-category-by-id': async (event: any, body: any) => {
        const id = body.params.id;
        const results = await getCategoryById(id);
        if (results) {
            event({
                action: 'get-category-by-id',
                data: results,
                success: true
            })
        } else {
            event({
                action: 'get-category-by-id',
                data: null,
                success: false
            })
        }
    },
    'update-category': async (event: any, body: any) => {
        const id = body.params.id;
        const payload = body.payload;
        const result = await updateCategory(id, { Name: payload.name })
        if (result) {
            event({
                action: 'update-category',
                data: result,
                success: true
            })
        } else {
            event({
                action: 'update-category',
                data: null,
                success: false
            })
        }
    },
    // employee
    'save-employee': async (event: any, body: any) => {
        const payload = body.payload;
        const result = await createEmployee({
            FirstName: payload.firstName,
            LastName: payload.lastName,
            Username: payload.username,
            Password: createHash(payload.password),
            Email: payload.email,
            Phone: payload.phone,
            Role: payload.role,
            Active: payload.active,
        })
        if (result) {
            event({
                action: 'save-employee',
                data: result,
                success: true
            })
        } else {
            event({
                action: 'save-employee',
                data: null,
                success: false
            })
        }
    },
    'delete-employee': async (event: any, body: any) => {
        const id = body.params.id;
        const result = await deleteEmployee(id);
        if (result) {
            event({
                action: 'delete-employee',
                data: result,
                success: true
            })
        } else {
            event({
                action: 'delete-employee',
                data: null,
                success: false
            })
        }
    },
    'get-employee': async (event: any, body: any) => {
        const payload = body.payload;
        const { page = 1, perPage = 10, searchQuery = '', filters = {} } = body.params;
        const results = await getEmployies(page, perPage, searchQuery, filters);
        if (results) {
            event({
                action: 'get-employee',
                data: results,
                success: true
            })
        } else {
            event({
                action: 'get-employee',
                data: null,
                success: false
            })
        }
    },
    'get-employee-by-id': async (event: any, body: any) => {
        const id = body.params.id;
        const results = await getEmployeeById(id);
        if (results) {
            event({
                action: 'get-employee-by-id',
                data: results,
                success: true
            })
        } else {
            event({
                action: 'get-employee-by-id',
                data: null,
                success: false
            })
        }
    },
    'update-employee': async (event: any, body: any) => {
        const id = body.params.id;
        const payload = body.payload;
        const employeeInfo = await getEmployeeById(id);
        let password = employeeInfo.Password;
        // console.log('Password:',password,payload.password)
        if (payload.password != password) {
            // console.log('password: ',payload.password, payload.password==password)
            password = createHash(payload.password)
        }
        const result = await updateEmployee(id, {
            FirstName: payload.firstName,
            LastName: payload.lastName,
            Username: payload.username,
            Password: password,
            Email: payload.email,
            Phone: payload.phone,
            Role: payload.role,
            Active: payload.active,
        })
        if (result) {
            event({
                action: 'update-employee',
                data: result,
                success: true
            })
        } else {
            event({
                action: 'update-employee',
                data: null,
                success: false
            })
        }
    },

    // login
    'login': async (event: any, body: any) => {
        const { username, password } = body.payload;
        const employee = await getEmployeeByUserName(username);
        const verifyPassword = verifyHash(password, employee.Password);
        if (verifyPassword) {
            event({
                action: 'login',
                data: employee,
                success: true
            })
        } else {
            event({
                action: 'login',
                data: null,
                success: false
            })
        }
    },

    // customer
    'save-customer': async (event: any, body: any) => {
        const payload = body.payload;
        const result = await createCustomer({
            Name: payload.Name,
            Phone: payload.Phone,
        })
        console.log(result,payload)
        if (result) {
            event({
                action: 'save-customer',
                data: result,
                success: true
            })
        } else {
            event({
                action: 'save-customer',
                data: null,
                success: false
            })
        }
    },
    'delete-customer': async (event: any, body: any) => {
        const id = body.params.id;
        const result = await deleteCustomer(id);
        if (result) {
            event({
                action: 'delete-customer',
                data: result,
                success: true
            })
        } else {
            event({
                action: 'delete-customer',
                data: null,
                success: false
            })
        }
    },
    'get-customer': async (event: any, body: any) => {
        const payload = body.payload;
        const { page = 1, perPage = 10, searchQuery = '', filters = {} } = body.params;
        const results = await getCustomers(page, perPage, searchQuery, filters);
        if (results) {
            event({
                action: 'get-customer',
                data: results,
                success: true
            })
        } else {
            event({
                action: 'get-customer',
                data: null,
                success: false
            })
        }
    },
    'get-customer-by-id': async (event: any, body: any) => {
        const id = body.params.id;
        const results = await getCustomerById(id);
        if (results) {
            event({
                action: 'get-customer-by-id',
                data: results,
                success: true
            })
        } else {
            event({
                action: 'get-customer-by-id',
                data: null,
                success: false
            })
        }
    },
    'update-customer': async (event: any, body: any) => {
        const id = body.params.id;
        const payload = body.payload;
        const result = await updateCustomer(id, {
            FirstName: payload.firstName,
            LastName: payload.lastName,
            Email: payload.email,
            Phone: payload.phone,
            Address: payload.address,
            Active: payload.active,
        })
        if (result) {
            event({
                action: 'update-customer',
                data: result,
                success: true
            })
        } else {
            event({
                action: 'update-customer',
                data: null,
                success: false
            })
        }
    },
    'all-active-employee': async (event: any, body: any) => {
        const result = await getEmployiesAllActive()
        if (result) {
            event({
                action:'all-active-employee',
                data: result,
                success: true
            })
        } else {
            event({
                action:'all-active-employee',
                data: null,
                success: false
            })
        }
    },
    'customer-by-phone': async (event: any, body: any) => {
        const payload = body.payload;
        const result = await getCustomersByPhone(payload.phone)
        if (result) {
            event({
                action:'customer-by-phone',
                data: result,
                success: true
            })
        } else {
            event({
                action:'customer-by-phone',
                data: null,
                success: false
            })
        }
    },
    // sell items
    'sell-item': async (event: any, body: any) => {
        const payload = body.payload;
        const result = await sellItems(payload.customerId, payload.employeeId, payload.items)
        if (result) {
            event({
                action:'sell-item',
                data: result,
                success: true
            })
        } else {
            event({
                action:'sell-item',
                data: null,
                success: false
            })
        }
    },
    // config 
    // reports
    'add-to-stock':  async (event: any, body: any) => {
        const payload = body.payload;
        console.log(payload)
        const result = await addStockToProduct(payload.id, payload.quantity);
        console.log(result)
        if (result) {
            event({
                action: 'add-to-stock',
                data: result,
                success: true
            })
        } else {
            event({
                action: 'add-to-stock',
                data: null,
                success: false
            })
        }
    },
    'save-config': async (event: any, body: any) => {
        const payload = body.payload;
        const result = await saveOrUpdateConfig({ 
            ShopName: payload.shopName,
            ShopAddress: payload.shopAddress,
            Lang: payload.lang,
            Phone: payload.phone,
            Phone2: payload.phone2 });
        if (result) {
            event({
                action: 'save-config',
                data: result,
                success: true
            })
        } else {
            event({
                action: 'save-config',
                data: null,
                success: false
            })
        }
    },
    'get-config': async (event: any, body: any) => {
       const result = await getConfig()
       if (result) {
        event({
            action: 'get-config',
            data: result,
            success: true
        })
        } else {
            event({
                action: 'get-config',
                data: null,
                success: false
            })
        }
    },
    'reports-sales': async (event: any, body: any) => {
        const result = await getSalesReport()
        event({
            action: 'reports-sales',
            data: result,
            success: true
        })
    },
    'reports-inventory': async (event: any, body: any) => {
        const result = await getInventoryReport()
        event({
            action:'reports-inventory',
            data: result,
            success: true
        })
    },
    'reports-top-sell': async (event: any, body: any) => {
        const result = await getTopSell()
        event({
            action: 'reports-top-sell',
            data: result,
            success: true
        })
    },
    'reports-customer': async (event: any, body: any) => {
        const result = await getCustomerReport()
        event({
            action: 'reports-customer',
            data: result,
            success: true
        })
    },
    'reports-employee-performance': async (event: any, body: any) => {
        const result = await getEmployeePerformance()
        event({
            action: 'reports-employee-performance',
            data: result,
            success: true
        })
    }
}
export const actions = (ipcMain: any) => {
    ipcMain.on('action', async (event: any, arg: any) => {
        await actionController[arg.action]((body: any) => {
            event.reply('action-result', body)
        }, arg);
    });

}
