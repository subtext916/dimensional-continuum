/**
 *  Parallel core creating factory
 *  @param options
 *  @return {string}
 *  @Author Russ Stratfull
 */
import logger from './logger';
import messenger from './messenger';
export default function (options) {
    return `

// Logging    
${logger(options)}

// Messenger
${messenger(options)}      
    
    `;
}
