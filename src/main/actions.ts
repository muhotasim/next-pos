import { createCategory, createCustomer, createEmployee, createProduct, deleteCategory, deleteCustomer, deleteEmployee, deleteProduct, getCategories, getCategoryById, getCustomerById, getCustomers, getEmployeeById, getEmployies, getProductById, getProducts, sellItems, updateCategory, updateCustomer, updateEmployee, updateProduct } from "./db-actions"

export const actionController: { [key: string]: any } = {
    // products crud
    'save-product': async (event: any, body: any) => {
        const payload = body.payload;
        const result = await createProduct({ Name: payload.name, Description: payload.description, QuantityAvailable: payload.quantity, Price: payload.price, CategoryID: null })
        if (result) {
            event(body)
        } else {
            event({})
        }
    },
    'delete-product': async (event: any, body: any) => {
        const id = body.params.id;
        const result = await deleteProduct(id);
        if (result) {
            event(body)
        } else {
            event({})
        }
    },
    'get-products': async (event: any, body: any) => {
        const payload = body.payload;
        const { page = 1, perPage = 10, searchQuery = '', filters = {} } = body.params;
        const results = await getProducts(page, perPage, searchQuery, filters);
        if (results) {
            event(results);
        } else {
            event({})
        }
    },
    'get-products-by-id': async (event: any, body: any) => {
        const id = body.params.id;
        const results = await getProductById(id);
        if (results) {
            event(results);
        } else {
            event({})
        }
    },
    'update-product': async (event: any, body: any) => {
        const id = body.params.id;
        const payload = body.payload;
        const result = await updateProduct(id, { Name: payload.name, Description: payload.description, QuantityAvailable: payload.quantity, Price: payload.price, CategoryID: null })
        if (result) {
            event(body)
        } else {
            event({})
        }
    },
    // category crud
    'save-category': async (event: any, body: any) => {
        const payload = body.payload;
        const result = await createCategory({ Name: payload.name })
        if (result) {
            event(body)
        } else {
            event({})
        }
    },
    'delete-category': async (event: any, body: any) => {
        const id = body.params.id;
        const result = await deleteCategory(id);
        if (result) {
            event(body)
        } else {
            event({})
        }
    },
    'get-category': async (event: any, body: any) => {
        const payload = body.payload;
        const { page = 1, perPage = 10, searchQuery = '', filters = {} } = body.params;
        const results = await getCategories(page, perPage, searchQuery, filters);
        if (results) {
            event(results);
        } else {
            event({})
        }
    },
    'get-category-by-id': async (event: any, body: any) => {
        const id = body.params.id;
        const results = await getCategoryById(id);
        if (results) {
            event(results);
        } else {
            event({})
        }
    },
    'update-category': async (event: any, body: any) => {
        const id = body.params.id;
        const payload = body.payload;
        const result = await updateCategory(id, { Name: payload.name })
        if (result) {
            event(body)
        } else {
            event({})
        }
    },
    // employee
    'save-employee': async (event: any, body: any) => {
        const payload = body.payload;
        const result = await createEmployee({
            FirstName: payload.firstName,
            LastName: payload.lastName,
            Username: payload.username,
            Password: payload.password,
            Email: payload.email,
            Phone: payload.phone,
            Role: payload.role,
            Active: payload.active,
        })
        if (result) {
            event(body)
        } else {
            event({})
        }
    },
    'delete-employee': async (event: any, body: any) => {
        const id = body.params.id;
        const result = await deleteEmployee(id);
        if (result) {
            event(body)
        } else {
            event({})
        }
    },
    'get-employee': async (event: any, body: any) => {
        const payload = body.payload;
        const { page = 1, perPage = 10, searchQuery = '', filters = {} } = body.params;
        const results = await getEmployies(page, perPage, searchQuery, filters);
        if (results) {
            event(results);
        } else {
            event({})
        }
    },
    'get-employee-by-id': async (event: any, body: any) => {
        const id = body.params.id;
        const results = await getEmployeeById(id);
        if (results) {
            event(results);
        } else {
            event({})
        }
    },
    'update-employee': async (event: any, body: any) => {
        const id = body.params.id;
        const payload = body.payload;
        const result = await updateEmployee(id, {
            FirstName: payload.firstName,
            LastName: payload.lastName,
            Username: payload.username,
            Password: payload.password,
            Email: payload.email,
            Phone: payload.phone,
            Role: payload.role,
            Active: payload.active,
        })
        if (result) {
            event(body)
        } else {
            event({})
        }
    },

    // customer
    'save-customer': async (event: any, body: any) => {
        const payload = body.payload;
        const result = await createCustomer({
            FirstName: payload.firstName,
            LastName: payload.lastName,
            Email: payload.email,
            Phone: payload.phone,
            Address: payload.address,
            Active: payload.active,
        })
        if (result) {
            event(body)
        } else {
            event({})
        }
    },
    'delete-customer': async (event: any, body: any) => {
        const id = body.params.id;
        const result = await deleteCustomer(id);
        if (result) {
            event(body)
        } else {
            event({})
        }
    },
    'get-customer': async (event: any, body: any) => {
        const payload = body.payload;
        const { page = 1, perPage = 10, searchQuery = '', filters = {} } = body.params;
        const results = await getCustomers(page, perPage, searchQuery, filters);
        if (results) {
            event(results);
        } else {
            event({})
        }
    },
    'get-customer-by-id': async (event: any, body: any) => {
        const id = body.params.id;
        const results = await getCustomerById(id);
        if (results) {
            event(results);
        } else {
            event({})
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
            event(body)
        } else {
            event({})
        }
    },
    // sell items
    'sell-item': async (event: any, body: any) => {
        const payload = body.payload;
        const result = await sellItems(payload.customerId, payload.employeeId, payload.items)
        if (result) {
            event(body)
        } else {
            event({})
        }
    }
}
export const actions = (ipcMain: any) => {
    ipcMain.on('action', async (event: any, arg: any) => {
        console.log('action:', arg.action)
        await actionController[arg.action]((body: any) => {
            event.reply('action-result', body)
        }, arg);
    });

}

