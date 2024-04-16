import { createProduct, getProducts } from "./db-actions"

export const actionController:{[key:string]: any} = {
    'save-product': async (event:any, body: any)=>{
        const payload = body.payload;
        const result = await createProduct({ Name: payload.name, Description: payload.description, QuantityAvailable: payload.quantity, Price: payload.price, CategoryID: null })
        if(result){

            event(body)
        }else{
            event({})
        }
    },
    'delete-product': async (event:any, body: any)=>{
        event(body)
    },
    'get-products': async (event:any, body: any)=>{
        const result = await getProducts(1, 10,'', {})
        event(result)
    },
    'update-product': async (event:any, body: any)=>{
        event(body)
    },
}
export const actions = (ipcMain:any)=>{
    ipcMain.on('action', async (event:any, arg:any) => {
        console.log('action:',arg.action)
        await actionController[arg.action]((body:any)=>{
            event.reply('action-result', body)
        }, arg);
      });
    
}

