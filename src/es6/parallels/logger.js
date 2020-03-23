/** (c) 2020 Objective Systems Integrators, Inc. (MYCOM OSI) All Rights Reserved.
 *  Parallel logger
 *  @param {Object} options
 */

export default function (options) {
    let logLevel = options.loglevel || {
            info: false,
            debug: false,
            warn: false,
            error: true
        },
        logFn = (options.logFn) ? options.logFn : 'self.console';
    return ` 
/**
 *  Parallel Logger
 *  Dynamically created logger instance
 */       
let logger = (level, msg) => {
        let isLogging = ${(logLevel.info || logLevel.warn || logLevel.error || logLevel.debug)?'true':'false'},
            logLevel = {
                info: ${logLevel.info || false },
                warn: ${logLevel.warn || false },
                error: ${logLevel.error || true },
                debug: ${logLevel.debug || false }
            },
            logFn = ${logFn};
            
        if (logLevel[level]) {
            logFn[level](msg);
        }
    };  
              
    
    `;
}
