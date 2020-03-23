/**
 *
 * Dynamic CSS content for element matrix scenes
 * @Author: Russ Stratfull
 */
import * as C from '../dimension-constants';
export default function (options) {
    return `
    
.${C.CLS_FILE_MATRIX_ELEMENT} {
    width: 100px;
    height: 140px;
    box-shadow: 0px 0px 12px rgba(0,0,0,0.5);
    border: 1px solid rgba(0,0,0,0.25);
    font-family: Helvetica, sans-serif;
    text-align: center;
    line-height: normal;
    background-color: #ccc;
    cursor: pointer;
    opacity: .8;
}    
.${C.CLS_FILE_MATRIX_ELEMENT}:hover {
    box-shadow: 0px 0px 12px rgba(0,255,255,0.75);
    border: 1px solid rgba(127,255,255,0.75);
    background-color: #333;
    opacity: 1;
}

    
    `;
}
