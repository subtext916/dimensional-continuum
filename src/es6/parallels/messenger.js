/**
 * Thread messenger to message between parallels worker threads and main ui
 * @param configuration
 * @return {string}
 * @Author Russ Stratfull
 */
import * as C from '../dimension-constants';
export default function (configuration) {

    /**
     * Add events to script dynamically
     * @param events
     */
    let on = (events) => {
        let out = '';
        Object.entries(events).forEach(e => {
            if (out !== '') out = out.concat(',\r\n\t\t');
            out = out.concat(e[0] + ': ' + e[1].toString());
        });
        return out;
    };
    return `
/**
 *  Parallel Messenger
 *  @Author Russ Stratfull
 */    
let messenger = {
        
        on: {
        ${on(configuration.on || [])} 
        }
}
self.onmessage = (e) => {
    switch(e.data.type) {
        case '${C.P_END}':
            // todo: Inject user defined exit functions here
            
            // then send response when ready to terminate
            self.postMessage({ id: e.data.id, instId: e.data.instId, type: '${C.P_END}' });
            break;
            
        case '${C.P_USR}':    
            let msgCls = e.data.msgCls;
            if (typeof messenger.on[msgCls] === 'function' || (messenger.opts && messenger.opts.reply)) {
                
                if (e.data.opts && e.data.opts.reply) {  
                    let response = messenger.on[msgCls](e.data.args);               
                    self.postMessage({
                        id: e.data.id,
                        type: '${C.P_USR}',
                        msgCls: '' + msgCls + '',
                        reply: response
                    });
                }
                else {
                    messenger.on[msgCls](e.data.args);  
                    self.postMessage({
                        id: e.data.id,
                        type: '${C.P_USR}',
                        msgCls: '' + msgCls + ''
                    });   
                }
                
            }
    }
};    
    
    `;
}


