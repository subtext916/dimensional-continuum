/**
 *
 * Dimensional Continuum web component core class prototype
 * @Author: Russ Stratfull
 */

import styleBuilder from "./style-builder";
let COMPONENT, Three, Id, FIRING, INSTANCES, LAYOUTS;
import parallelCore from './parallels/parallel-core';
import * as C from './dimension-constants';
// scene modules
import { OrbitControls } from './scenes/cube/controls/OrbitControls';
import {VertexNormalsHelper} from './scenes/cube/helpers/VertexNormalsHelper';
import {TWEEN} from "./scenes/elementMatrix/tween";
import {TrackballControls} from './scenes/elementMatrix/controls/TrackballControls';
import { CSS3DRenderer, CSS3DObject } from './scenes/elementMatrix/renderers/CSS3DRenderer';

// Element Matrix Layouts
import {layouts, transform} from "./scenes/elementMatrix/layouts";

/**
 * Generate random key
 * @return {number}
 */
let id = () => {
    let i = Date.now(), id = (i !== Id) ? i : i+1;
    Id = id;
    return id;
};
export class DimensionalCore {

    /**
     * Params are not exposed
     * @param {HTMLElement} component
     * @param {Class} THREE
     */
    constructor(component, THREE) {

        // Private
        COMPONENT = component;
        Three = THREE;
        Id = Date.now();
        FIRING = {}; // Collection of fire requests in progress
        INSTANCES = {}; // Collection of instances
        LAYOUTS = layouts(THREE);

        // Public
        this.parallels = new Map();
        this.shadows = new Map();
        this.scenes = new Map();
        this.matrices = new Map();
    }

    /* * * Public Methods * * */
    /**
     * Create parallel dimension
     * @param configuration
     * @return {{created: number, id: *, updated: number}|boolean}
     */
    createParallel(configuration) {
        // Validate configuration
        if (!configuration || !configuration.id || this.parallels.has(configuration.id)) {
            if (configuration && configuration.debug) {
                window.console.debug(`dimensions#createParallel unable to create parallel with id ${(!configuration) ? '{No ID}' : configuration.id}`);
            }
            return false;
        }
        // Initialize parallels instance...
        let start = Date.now();
        let inst = { id: configuration.id, created: start, updated: start };

        // Asyncronously create the instance
        let i = this._createParallelAsync(configuration, inst);

        // Assign methods to the instance
        inst.terminate = this._terminate.bind(i);
        inst.fire = this._fire.bind(i);

        // Keep reference in component registry
        this.parallels.set(configuration.id, inst);
        INSTANCES[configuration.id] = inst;
        return inst;
    }

    /**
     * Create shadow dimension
     * @param {Object} options
     */
    createShadow(options) {
        let id_ = `${C.SHADOW_}${id()}`;
        let shadow = COMPONENT.attachShadow({ mode: (options.mode) ? options.mode: C.OPEN });
        let style = (options.css) ? shadow.appendChild(document.createElement(C.STYLE)) : false;
        let shadowInst = {
            // todo: @Russ (temp)
            style: style,
            /**
             * Get id of this shadow instance
             * @return {string}
             */
            getId: function () {
                return id_;
            },
            /**
             * Add content to shadow
             * @param content
             * @param {Object} options
             */
            addContent: function (content, options) {
                try {
                    if (options && options.type &&
                        options.type === C.REPLACE) { shadow.innerHTML = ''; }
                    else if (options && options.type &&
                        options.type === C.PREPEND) {
                        // todo: Un-tested - theoretical
                        shadow.firstChild.insertBefore(content, shadow.firstChild);
                    }
                    else { shadow.appendChild(content); }
                }
                catch (e) {
                    if (options && options.type &&
                        options.type === C.REPLACE) { shadow.innerHTML = content; }
                    else if (options && options.type &&
                        options.type === C.PREPEND) {
                        shadow.innerHTML = `${content}\r\n${shadow.innerHTML}`;
                    }
                    else { shadow.innerHTML = shadow.innerHTML.concat(content); }
                }
            },
            /**
             * Set CSS content - un-implemented...
             * @param {String} content
             */
            // setStyle: function (content/*, options*/) {
            //     if (style) {
            //
            //     }
            // }
        };
        this.shadows.set(id_, shadowInst);
        return shadowInst;

    }

    /**
     * Create scene dimension
     * @param options
     * @return {Object}
     */
    createScene(options) {
        switch (options.type) {
            case C.CUBE:
                return this._createCubeScene(options);
            case C.GLOBE:
                return this._createGlobeScene(options);
            case C.ELEMENT_MATRIX:
                return this._createElementMatrix(options);
            default:
                // todo: @Russ - Placeholder for default behavior
                window.console.error(`Default not defined yet for createScene`);
                return false;
        }
    }

    /* * * Private Methods * * */
    /**
     *
     * @param {Object} options
     * @private
     */
    _createElementMatrix(options) {
        // validate?
        let elementMatrix = {};
        this._initializeScene(elementMatrix, options);

        // Define some methods for this instance
        /**
         *
         * @param {String} name
         * @param {Boolean} reset
         * @return {*}
         */
        elementMatrix.layout = (name, reset) => {
            if (elementMatrix.targets[name].length === 0) {
                LAYOUTS[name](elementMatrix);
            }
            if (reset) {
                let vector = new Three.Vector3(0, 0, 500);
                elementMatrix.camera.position.copy(vector);
                elementMatrix.camera.rotation.z = Math.PI;

            }
            transform(name, elementMatrix);

            return COMPONENT;
        };
        elementMatrix.moveCameraTo = (x, y, z) => {
            let vector = new Three.Vector3(x, y, z);
            elementMatrix.camera.position.copy(vector);
            elementMatrix.camera.rotation.z = Math.PI;

        };

        // todo: potential leak of event listener?
        window.addEventListener(C.RESIZE, () => {
            elementMatrix.camera.aspect = window.innerWidth / window.innerHeight;
            elementMatrix.camera.updateProjectionMatrix();
            elementMatrix.renderer.setSize( window.innerWidth, window.innerHeight );
            elementMatrix.renderer.render( elementMatrix.scene, elementMatrix.camera );

        }, false);

        // Bind to target resize event
        //let resizer = new MutationObserver(elementMatrix.target);
        // elementMatrix.observer = new window.ResizeObserver(entries => {
        //     // for (let entry of entries) {
        //     //
        //     // }
        // });

        elementMatrix.layout(options.layout || C.GRID);

        return elementMatrix;
    }

    /**
     * Creates cube type 3d scene
     * @param {Object} options
     * @return {Object}
     * @private
     */
    _createCubeScene(options) {
        let cube = {
            options: {
                Geometry: 0
            }
        };
        cube.material = new Three.MeshBasicMaterial( { color: 0xffffff, wireframe: true, opacity: 0.5 } );
        cube.mesh = null;
        this._initializeScene(cube, options);
        return cube;
    }

    /**
     *
     * @param options
     * @return {{options: {}}}
     * @private
     */
    _createGlobeScene(options) {
        let globe = {
            options: {
                Geometry: 0
            }
        };

        globe.material = new Three.MeshBasicMaterial( { color: 0xffffff, wireframe: true, opacity: 0.5 } );
        globe.mesh = null;
        this._initializeScene(globe, options);
        return globe;
    }

    /**
     *
     * @param type
     * @return {CircleBufferGeometry|CircleBufferGeometry}
     * @private
     */
    _getGeometry(type) {
        switch (type) {
            case C.CUBE:
                return new Three.BoxBufferGeometry( 200, 200, 200, 5, 5, 5);
            case C.GLOBE:
                return new Three.CircleBufferGeometry( 200, 32 );
            default:
                throw 'Unable to resolve geometry type';
        }
    }

    /**
     *
     * @param {Object} instance
     * @param {Object} options
     * @private
     */
    _initializeScene(instance, options) {

        // Persist the type to the returned instance (useful)
        instance.type = options.type;

        // Resolve target (dom location to display)
        this._resolveTarget(instance, options);

        // Setup camera
        this._startCamera(instance, options);

        // Create scene instance
        switch (options.type) {
            case C.CUBE:
                this._sceneCube(instance, options);
                break;
            case C.ELEMENT_MATRIX:
                this._sceneElementMatrix(instance, options);
                break;
            default:
                // todo
        }

        // Create renderer and append to target dom element
        this._renderToTarget(instance, options);

        // Add controls
        this._addControls(instance);

        // Define animation and renderer functions
        instance.animate = function () {
            requestAnimationFrame( instance.animate );
            if (instance.type === C.CUBE) {
                instance.render();
            }
            if (instance.type === C.ELEMENT_MATRIX) {
                TWEEN.update();
                instance.controls.update();
            }
        };
        instance.render = function () {
            instance.renderer.render(instance.scene, instance.camera);
        };

        // Begin animating scene
        instance.animate();

        if (options.type === C.CUBE) {
            instance.camera.aspect = window.innerWidth / window.innerHeight;
            instance.camera.updateProjectionMatrix();
            instance.renderer.setSize( window.innerWidth, window.innerHeight );
        }

    }

    /**
     *
     * @param instance
     * @param options
     * @private
     */
    _sceneCube(instance, options) {
        instance.scene = new Three.Scene();
        // Raycaster
        instance.raycaster = new Three.Raycaster();
        instance.mouse = new Three.Vector2( 1, 1 );

        // Add mesh
        this._addMesh(instance, this._getGeometry(options.type));
    }

    /**
     *
     * @param instance
     * @param options
     * @private
     */
    _sceneElementMatrix(instance, options) {
        let me = this;
        this._setStyle(options); // Set style *if* it hasn't already been set yet
        instance.scene = new Three.Scene();
        instance.objects = [];
        instance.targets = {sphere: [],helix: [],grid: []};
        let elementType = options.element && options.element.type ?
            options.element.type : C.DIV;
        let elementTemplate = options.template && typeof options.template === C.FUNCTION ?
            options.template : (data) => { return data; };

        for (let el of options.elements) {
            let element = document.createElement(elementType);

            // Assign event handlers
            if (options.on) {
                this._addElementEvents(options.on, element, el.data);
            }

            // Set element base css class
            element.setAttribute(C.CLASS, C.CLS_FILE_MATRIX_ELEMENT);

            // Populate element content
            let content = elementTemplate(el.data); // todo: Wrap in try/catch? Validate?
            if (typeof content === C.STRING) {
                element.innerHTML = content;
            }
            else {
                // Otherwise, try to attach it
                // todo: wrap in try/catch?
                element.appendChild(content);
            }

            let object = new CSS3DObject( element );
            object.position.x = Math.random() * 4000 - 2000;
            object.position.y = Math.random() * 4000 - 2000;
            object.position.z = Math.random() * 4000 - 2000;

            instance.scene.add(object);
            instance.objects.push(object);
        }

        window.addEventListener(C.RESIZE, () => {
            // todo: @Russ - Combine all instances together into one window event...
            // Also, is this really working or helping?
            instance.camera.aspect = window.innerWidth / window.innerHeight; // REPLACE WITH CONTAINER
            instance.camera.updateProjectionMatrix();
            let parentHeight = me._firstContainerWithHeight(instance.target);
            instance.renderer.setSize(
                instance.target.scrollWidth,
                (parentHeight>options.minHeight) ? parentHeight : window.innerHeight
            );

        }, false);
    }

    /**
     *
     * @param {Object} events
     * @param {Array} element
     * @param {Object} data
     * @private
     */
    _addElementEvents(events, element, data) {
        for (let [key, val] of Object.entries(events)) {
            element.addEventListener(key, () => {
                val(data);
            });
        }
    }

    /**
     *
     * @param instance
     * @param options
     * @private
     */
    _startCamera(instance, options) {
        let me = this;
        let fov, far, cp;
        switch (options.type) {
            case C.CUBE:
                fov = 70;
                far = 1000;
                cp = 500;
                break;
            case C.ELEMENT_MATRIX:
                fov = 30;
                far = 10000;
                cp = DimensionalCore._elementMatrixZ(options); // 2000 per layer of 25 elements
                break;
            default:
                fov = 70;
                far = 1000;
                cp = 500;
        }
        let parentHeight = me._firstContainerWithHeight(instance.target);
        instance.camera = new Three.PerspectiveCamera(
            fov,                                        // fov — Camera frustum vertical field of view
            instance.target.scrollWidth,
            (parentHeight>options.minHeight) ? parentHeight : window.innerHeight,     // aspect — Camera frustum aspect ratio
            1,                                          // near — Camera frustum near plane
            far                                        // far — Camera frustum far plane
        );
        instance.camera.position.z = (options && options.camera && options.camera.position) ?
            options.camera.position : cp;
    }

    /**
     *
     * @param options
     * @return {number}
     * @private
     */
    static _elementMatrixZ(options) {
        switch (options.layout) {
            case C.GRID:
                return Math.floor(options.elements.length / 25) * 1000;
            case C.SPHERE:
                return 1700;
            case C.HELIX:
                return 1700;
            default: return 1700;
        }
    }

    /**
     *
     * @param instance
     * @param options
     */
    _renderToTarget(instance, options) {
        let parentHeight;
        switch (instance.type) {
            case C.CUBE:
                instance.renderer = new Three.WebGLRenderer({antialias:true});
                instance.renderer.setPixelRatio( window.devicePixelRatio );
                instance.renderer.setSize( window.innerWidth, window.innerHeight );
                instance.target.appendChild(instance.renderer.domElement);
                break;
            case C.ELEMENT_MATRIX:
                instance.renderer = new CSS3DRenderer();
                parentHeight = this._firstContainerWithHeight(instance.target);
                instance.renderer.setSize(
                    instance.target.scrollWidth,
                    (parentHeight>options.minHeight) ? parentHeight : window.innerHeight
                );
                instance.target.appendChild(instance.renderer.domElement);
        }

    }

    /**
     * Search up the dom chain for an element with a height
     * @param {HTMLElement} element
     * @return {Number}
     * @private
     */
    _firstContainerWithHeight(element) {
        let find = (level) => {
            if (level.parentNode.scrollHeight) {
                return level.parentNode.scrollHeight;
            }
            else return find (level.parentNode);
        };
        return find(element);

    }

    /**
     *
     * @param instance
     * @param options
     * @private
     */
    _resolveTarget(instance, options) {
        instance.target = (options && options.target) ?
            // User defined target
            // todo: @Russ - Validation?
            options.target :
            // Otherwise, append to web component
            COMPONENT.appendChild(document.createElement(C.DIV));
    }

    /**
     *
     * @param {Object} instance
     * @private
     */
    _addControls(instance) {
        let render = () => {
            instance.renderer.render( instance.scene, instance.camera );
        };
        switch (instance.type) {
            case C.CUBE:
                instance.controls = new OrbitControls(instance.camera, instance.renderer.domElement);
                instance.controls.minDistance = 400;
                instance.controls.maxDistance = 1000;
                window.addEventListener( C.RESIZE, () => {
                    instance.camera.aspect = window.innerWidth / window.innerHeight;
                    instance.camera.updateProjectionMatrix();
                    instance.renderer.setSize( window.innerWidth, window.innerHeight );
                }, false );
                window.addEventListener(C.CLICK, (event) => {
                    event.preventDefault();
                    instance.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                    instance.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
                    instance.raycaster.setFromCamera(instance.mouse, instance.camera);
                    let intersects = instance.raycaster.intersectObject(instance.mesh);
                    if (intersects.length>0) {
                        window.console.info(intersects);
                    }

                }, false);
                break;
            case C.ELEMENT_MATRIX:
                instance.controls = new TrackballControls( instance.camera, instance.renderer.domElement );
                instance.controls.minDistance = 500;
                instance.controls.maxDistance = 60000;
                instance.controls.addEventListener(C.CHANGE, render);
        }

    }

    /**
     *
     * @param instance
     * @param geometry
     * @private
     */
    _addMesh(instance, geometry) {
        if (instance.mesh !== null) {
            instance.scene.remove(instance.mess);
            instance.geometry.dispose();
        }

        instance.geometry = geometry;
        instance.geometry.computeBoundingSphere();
        let scaleFactor = 160 / instance.geometry.boundingSphere.radius;
        instance.geometry.scale( scaleFactor, scaleFactor, scaleFactor );
        instance.mesh = new Three.Mesh(instance.geometry, instance.material);
        instance.scene.add(instance.mesh);
        let vertexNormalsHelper = new VertexNormalsHelper( instance.mesh, 1 );
        instance.mesh.add( vertexNormalsHelper );
    }

    /**
     * Create the parallels instance asynchronously
     * @param {Object} configuration
     * @param {Object} inst
     * @return {Promise<any>}
     * @private
     */
    _createParallelAsync(configuration, inst) {
        let blob = new Blob([parallelCore(configuration)]);
        let session = window.URL.createObjectURL(blob);
        inst.thread = session.split('/').pop();
        let worker = new Worker(session);
        let promise = new Promise((resolve/*, error*/) => {
            worker.onmessage = (msg) => {
                switch(msg.data.type) {
                    // User defined messaging
                    case C.P_USR:
                        if (FIRING[msg.data.id]) {
                            FIRING[msg.data.id].callback(msg.data.reply);
                            // Remove from pending collection...
                            delete FIRING[msg.data.id];
                        }
                        break;

                    // Terminate this parallel
                    case C.P_END:
                        clearTimeout(FIRING[msg.data.id]);
                        resolve(msg.data.data);
                        worker.terminate();
                        window.URL.revokeObjectURL(session);
                        // Remove from parallels collection...
                        this.parallels.delete(inst.id);
                        INSTANCES[inst.id] = null;
                        break;
                    default:
                    // ???
                }
            };
        });
        return {
            worker: worker,
            promise: promise
        };
    }

    /**
     *
     * @param {String} msgCls
     * @param {String, Object, Number} msg
     * @param {Object} options {
     *     reply: {true|false}
     *     callback: {Function}
     * }
     * @private
     */
    _fire(msgCls, msg, options) {
        let ID = id();
        let message = {
            id: ID,
            type: C.P_USR,
            msgCls: msgCls,
            args: msg
        };
        if (options && (options.reply)) { message.opts = {reply: true}; }
        // ...additional options should be appended to opts
        // Send message to parallels worker
        this.worker.postMessage(message);
        if (options && options.callback) {
            FIRING[ID] = options;
        }
    }

    /**
     *
     * @param {Object} options
     * @private
     */
    _terminate(options) {
        let ID = id();
        this.worker.postMessage({ id: ID, instId: this.id, type: C.P_END });
        FIRING[ID] = setTimeout(() => {
            if (options && options.onTimeout) {
                options.onTimeout(this, options);
            }
            else {
                window.console.error(`Request to terminate parallel timed out after ${(options && options.timeout) ? options.timeout : 60000}`);
            }
        }, (options && options.timeout) ? options.timeout : 60000);

    }

    /**
     * Expose currently firing requests
     * @return {*}
     * @private
     */
    _getFiring() {
        return FIRING;
    }

    /**
     *
     * @return {*}
     * @private
     */
    _getInstances() {
        return INSTANCES;
    }

    /**
     *
     * @param {Object} options
     * @private
     */
    _setStyle(options) {
        if (!this._style) {
            this._style = document.createElement(C.STYLE);
            this._style.setAttribute(C.SCOPED, '');
            COMPONENT.appendChild(this._style);
        }
        this._style.innerHTML = styleBuilder(options);
    }

}
