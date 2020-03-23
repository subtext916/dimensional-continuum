/**
 *  <dimensional-continuum> - The multi dimension management web component
 *  Manage parallel threads, shadows, & 3D scenes
 *  @Author Russ Stratfull
 *
 *  Future Research:
 *  https://stackoverflow.com/questions/19152772/how-to-pass-large-data-to-web-workers
 *  https://html2canvas.hertzen.com/getting-started
 *
 */
import {DimensionalCore} from './dimensional-core';
import styleBuilder from './style-builder';
import * as C from './dimension-constants';
import * as THREE from 'three'; // THREE - 3d canvas library

class DimensionalContinuum extends HTMLElement {

    constructor() {
        super();
        this._core = new DimensionalCore(this, THREE);
    }

    /* * * Public methods * * */
    /**
     * Create parallel thread
     * @param {Object} configuration
     */
    createParallel(configuration) {
        return this._core.createParallel(configuration);
    }

    /**
     * Create new shadow instance
     * @param {Object} options
     * @return {*}
     */
    createShadow(options) {
        return this._core.createShadowDom(options);
    }

    /**
     * Create new 3D scene
     * @param options
     * @return {*}
     */
    createScene(options) {
        return this._core.createScene(options);
    }

    /* * * Native lifecycle callbacks * * */
    connectedCallback() {

    }
    disconnectedCallback() {

    }
    attributeChangedCallback() {

    }

}

window.customElements.define(C.WC_DC, DimensionalContinuum);
