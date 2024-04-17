import knex from 'knex';
import knexConfig from '../../knexfile';

const db = knex(knexConfig.development);

export const createProduct = async ({ Name, Description, Price, QuantityAvailable, CategoryID }) => {
  try {
    const newProduct = {
      Name, Description, Price, QuantityAvailable, CategoryID
    };
    await db('Products').insert(newProduct).returning('*');
    return true;
  } catch (error) {
    return false;
  }
}
export const getProducts = async (pageNumber, perPage, searchQuery, filters: any) => {
  try {
    // Calculate the offset based on the page number and perPage
    const offset = (pageNumber - 1) * perPage;

    // Query to count total products
    const countQuery = db('Products').count('* as total');

    // Apply search filter if provided
    if (searchQuery) {
      countQuery.where('Name', 'like', `%${searchQuery}%`);
    }

    // Apply additional filters if provided
    if (filters) {
      Object.entries(filters).forEach(([key, value]: [any, any]) => {
        countQuery.where(key, value);
      });
    }

    // Get total count of products
    const [{ total }] = await countQuery;

    // Query to fetch paginated products
    const productsQuery = db('Products')
      .select('*')
      .limit(perPage)
      .offset(offset);

    // Apply search filter if provided
    if (searchQuery) {
      productsQuery.where('Name', 'like', `%${searchQuery}%`);
    }

    // Apply additional filters if provided
    if (filters) {
      Object.entries(filters).forEach(([key, value]: [any, any]) => {
        productsQuery.where(key, value);
      });
    }

    // Fetch paginated products
    const products = await productsQuery;

    return { total, data: products };
  } catch (error) {
    return false;
  }
}
export const deleteProduct = async (productId) => {
  try {
    // Delete the product from the Products table
    const rowsAffected = await db('Products')
      .where('ProductID', productId)
      .del();

    if (rowsAffected > 0) {
      return true;
    } else {

      return false;
    }
  } catch (error) {
    return false;
  }
}
export const updateProduct = async (productId, updatedProductData) => {
  try {
    // Update the product in the Products table
    const rowsAffected = await db('Products')
      .where('ProductID', productId)
      .update(updatedProductData);

    if (rowsAffected > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}
export const getProductById = async (productId) => {
  try {
    const category = await db('Products').where('ProductID', productId).first();
    return category;
  } catch (error) {
    return false;
  }
}


export const createCategory = async (categoryData) => {
  try {
    const category = await db('Categories').insert(categoryData).returning('*');
    return category;
  } catch (error) {
    return false;
  }
}

export const getCategories = async (pageNumber, perPage, searchQuery, filters: any) => {
  try {
    // Calculate the offset based on the page number and perPage
    const offset = (pageNumber - 1) * perPage;

    // Query to count total products
    const countQuery = db('Categories').count('* as total');

    // Apply search filter if provided
    if (searchQuery) {
      countQuery.where('Name', 'like', `%${searchQuery}%`);
    }

    // Apply additional filters if provided
    if (filters) {
      Object.entries(filters).forEach(([key, value]: [any, any]) => {
        countQuery.where(key, value);
      });
    }

    // Get total count of products
    const [{ total }] = await countQuery;

    // Query to fetch paginated products
    const categoriesQuery = db('Categories')
      .select('*')
      .limit(perPage)
      .offset(offset);

    // Apply search filter if provided
    if (searchQuery) {
      categoriesQuery.where('Name', 'like', `%${searchQuery}%`);
    }

    // Apply additional filters if provided
    if (filters) {
      Object.entries(filters).forEach(([key, value]: [any, any]) => {
        categoriesQuery.where(key, value);
      });
    }

    // Fetch paginated products
    const categories = await categoriesQuery;

    return { total, data: categories };
  } catch (error) {
    return false;
  }
}
// Read operation
export const getCategoryById = async (categoryId) => {
  try {
    const category = await db('Categories').where('CategoryID', categoryId).first();
    return category;
  } catch (error) {
    return false;
  }
}

// Update operation
export const updateCategory = async (categoryId, updatedCategoryData) => {
  try {
    const rowsAffected = await db('Categories')
      .where('CategoryID', categoryId)
      .update(updatedCategoryData);

    if (rowsAffected > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

// Delete operation
export const deleteCategory = async (categoryId) => {
  try {
    const rowsAffected = await db('Categories').where('CategoryID', categoryId).del();

    if (rowsAffected > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}


export const getEmployies = async (pageNumber, perPage, searchQuery, filters: any) => {
  try {
    // Calculate the offset based on the page number and perPage
    const offset = (pageNumber - 1) * perPage;

    // Query to count total products
    const countQuery = db('Employees').count('* as total');

    // Apply search filter if provided
    if (searchQuery) {
      countQuery.where('FirstName', 'like', `%${searchQuery}%`)
        .orWhere('LastName', 'like', `%${searchQuery}%`)
        .orWhere('Username', 'like', `%${searchQuery}%`)
        .orWhere('Email', 'like', `%${searchQuery}%`)
        .orWhere('Phone', 'like', `%${searchQuery}%`);
    }

    // Apply additional filters if provided
    if (filters) {
      Object.entries(filters).forEach(([key, value]: [any, any]) => {
        countQuery.where(key, value);
      });
    }

    // Get total count of products
    const [{ total }] = await countQuery;

    // Query to fetch paginated products
    const employiessQuery = db('Employees')
      .select('*')
      .limit(perPage)
      .offset(offset);

    // Apply search filter if provided
    if (searchQuery) {
      employiessQuery.where('FirstName', 'like', `%${searchQuery}%`)
        .orWhere('LastName', 'like', `%${searchQuery}%`)
        .orWhere('Username', 'like', `%${searchQuery}%`)
        .orWhere('Email', 'like', `%${searchQuery}%`)
        .orWhere('Phone', 'like', `%${searchQuery}%`);
    }

    // Apply additional filters if provided
    if (filters) {
      Object.entries(filters).forEach(([key, value]: [any, any]) => {
        employiessQuery.where(key, value);
      });
    }

    // Fetch paginated products
    const emploies = await employiessQuery;

    return { total, data: emploies };
  } catch (error) {
    return false;
  }
}

export const createEmployee = async (employeeData) => {
  try {
    const employee = await db('Employees').insert(employeeData).returning('*');
    return employee;
  } catch (error) {
    return false;
  }
};

// Read operation
export const getEmployeeById = async (employeeId) => {
  try {
    const employee = await db('Employees').where('EmployeeID', employeeId).first();
    return employee;
  } catch (error) {
    return false;
  }
};

// Update operation
export const updateEmployee = async (employeeId, updatedEmployeeData) => {
  try {
    const rowsAffected = await db('Employees')
      .where('EmployeeID', employeeId)
      .update(updatedEmployeeData);

    if (rowsAffected > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

// Delete operation
export const deleteEmployee = async (employeeId) => {
  try {
    const rowsAffected = await db('Employees').where('EmployeeID', employeeId).del();

    if (rowsAffected > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};



export const getCustomers = async (pageNumber, perPage, searchQuery, filters: any) => {
  try {
    // Calculate the offset based on the page number and perPage
    const offset = (pageNumber - 1) * perPage;

    // Query to count total products
    const countQuery = db('Customers').count('* as total');

    // Apply search filter if provided
    if (searchQuery) {
      countQuery.where('FirstName', 'like', `%${searchQuery}%`)
        .orWhere('LastName', 'like', `%${searchQuery}%`)
        .orWhere('Username', 'like', `%${searchQuery}%`)
        .orWhere('Email', 'like', `%${searchQuery}%`)
        .orWhere('Phone', 'like', `%${searchQuery}%`)
        .orWhere('Address', 'like', `%${searchQuery}%`);
    }

    // Apply additional filters if provided
    if (filters) {
      Object.entries(filters).forEach(([key, value]: [any, any]) => {
        countQuery.where(key, value);
      });
    }

    // Get total count of products
    const [{ total }] = await countQuery;

    // Query to fetch paginated products
    const customersQuery = db('Customers')
      .select('*')
      .limit(perPage)
      .offset(offset);

    // Apply search filter if provided
    if (searchQuery) {
      customersQuery.where('FirstName', 'like', `%${searchQuery}%`)
        .orWhere('LastName', 'like', `%${searchQuery}%`)
        .orWhere('Username', 'like', `%${searchQuery}%`)
        .orWhere('Email', 'like', `%${searchQuery}%`)
        .orWhere('Phone', 'like', `%${searchQuery}%`)
        .orWhere('Address', 'like', `%${searchQuery}%`);
    }

    // Apply additional filters if provided
    if (filters) {
      Object.entries(filters).forEach(([key, value]: [any, any]) => {
        customersQuery.where(key, value);
      });
    }

    // Fetch paginated products
    const customers = await customersQuery;

    return { total, data: customers };
  } catch (error) {
    return false;
  }
}

export const createCustomer = async (customerData) => {
  try {
    const customer = await db('Customers').insert(customerData).returning('*');
    return customer;
  } catch (error) {
    return false;
  }
};

// Read operation
export const getCustomerById = async (customerId) => {
  try {
    const customer = await db('Customers').where('CustomerID', customerId).first();
    return customer;
  } catch (error) {
    return false;
  }
};

// Update operation
export const updateCustomer = async (customerId, updatedCustomerData) => {
  try {
    const rowsAffected = await db('Customers')
      .where('CustomerID', customerId)
      .update(updatedCustomerData);

    if (rowsAffected > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

// Delete operation
export const deleteCustomer = async (customerId) => {
  try {
    const rowsAffected = await db('Customers').where('CustomerID', customerId).del();

    if (rowsAffected > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const sellItems = async (customerId, employeeId, items) => {
  const trx = await db.transaction();

  try {
    // Insert a new sale record
    const [saleId] = await trx('Sales').insert({
      CustomerID: customerId,
      EmployeeID: employeeId,
      SaleDate: db.fn.now(),
      TotalAmount: getTotalAmount(items)
    });

    for (const item of items) {
      await trx('SaleItems').insert({
        SaleID: saleId,
        ProductID: item.productID,
        Quantity: item.quantity,
        UnitPrice: item.unitPrice
      });

      await trx('Products')
        .where('ProductID', item.productID)
        .decrement('QuantityAvailable', item.quantity);
    }

    await trx.commit();
    return true
  } catch (error) {
    await trx.rollback();
    return false;
  }
}

function getTotalAmount(items) {
  return items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
}
export const markProductAsUnsold = async (saleId) => {
  const trx = await db.transaction();

  try {
    // Get sale details
    const saleItems = await trx('SaleItems').where('SaleID', saleId);
    for (const saleItem of saleItems) {
      const { ProductID, Quantity } = saleItem;
      await trx('Products')
        .where('ProductID', ProductID)
        .increment('QuantityAvailable', Quantity);
      await trx('SaleItems').where('SaleID', saleId).del();
    }
    await trx('Sales').where('SaleID', saleId).del();

    await trx.commit();
    return true;
  } catch (error) {
    await trx.rollback();
    return false;
  }
}

export const addStockToProduct = async (productId, additionalQuantity) => {
  try {
    await db('Products')
      .where('ProductID', productId)
      .increment('QuantityAvailable', additionalQuantity);
    return true;
  } catch (error) {
    return false;
  }
}

export const getSalesReport = async () => {
  return await db('Sales')
    .select(
      db.raw('date(SaleDate) as Date'),
      db.raw('count(*) as TotalTransactions'),
      db.raw('sum(TotalAmount) as TotalSales')
    )
    .groupByRaw('date(SaleDate)')
    .orderByRaw('date(SaleDate) DESC');
}

export const getInventoryReport = async () => {
  return await db('Products')
    .select('ProductName', 'QuantityAvailable')
    .orderBy('ProductName');
}

export const getTopSell = async () => {
  return await db('SaleItems')
    .select('ProductID', 'ProductName')
    .sum('Quantity as TotalQuantitySold')
    .leftJoin('Products', 'SaleItems.ProductID', 'Products.ProductID')
    .groupBy('ProductID', 'ProductName')
    .orderByRaw('TotalQuantitySold DESC')
}

export const getCustomerReport = async () => {
  return await db('Sales')
    .select(
      db.raw('count(distinct CustomerID) as TotalCustomers'),
      db.raw('sum(TotalAmount) as TotalRevenue'),
      db.raw('avg(TotalAmount) as AverageTransactionValue')
    )
}

export const getEmployeePerformance = async () => {
  return await db('Sales')
    .select('EmployeeID')
    .countDistinct('SaleID as TotalTransactions')
    .sum('TotalAmount as TotalSales')
    .groupBy('EmployeeID');
}