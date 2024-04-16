export const actionController:{[key:string]: any} = {
    'save-product': (event:any, payload: any)=>{
        event(payload)
    },
    'delete-product': (event:any, payload: any)=>{
        event(payload)
    },
    'get-products': (event:any, payload: any)=>{
        event(payload)
    },
    'update-product': (event:any, payload: any)=>{
        event(payload)
    },
}
export const actions = (ipcMain:any)=>{
    ipcMain.on('action', async (event:any, arg:any) => {
        console.log('action:',arg.action)
        actionController[arg.action]((payload:any)=>{
            event.reply('action-result', payload)
        }, arg);
      });
    
}

