/**
 *
 * Element Matrix Layouts
 * @Reference https://github.com/mrdoob/three.js/blob/master/examples/css3d_periodictable.html
 */
import * as C from '../../dimension-constants';
import {TWEEN} from "./tween";

/**
 *
 * @param THREE
 */
export function layouts(THREE) {
    const Three = THREE;
    let layouts = {};
    layouts[C.SPHERE] = (instance) => {
        let vector = new Three.Vector3();
        let i = 0;
        while (i < instance.objects.length) {
            let phi = Math.acos(-1 + (2 * i)/instance.objects.length);
            let theta = Math.sqrt(instance.objects.length * Math.PI) * phi;
            let obj = new Three.Object3D();
            obj.position.setFromSphericalCoords( 800, phi, theta );
            vector.copy( obj.position ).multiplyScalar( 2 );
            obj.lookAt( vector );
            instance.targets.sphere.push( obj );
            i++;
        }
    };
    layouts[C.HELIX] = (instance) => {
        let vector = new Three.Vector3();
        let i = 0;
        while (i < instance.objects.length) {
            let theta = i * 0.175 + Math.PI;
            let y = - ( i * 8 ) + 450;
            let obj = new Three.Object3D();
            obj.position.setFromCylindricalCoords( 900, theta, y );
            vector.x = obj.position.x * 2;
            vector.y = obj.position.y;
            vector.z = obj.position.z * 2;
            obj.lookAt( vector );
            instance.targets.helix.push( obj );
            i++;
        }
    };
    layouts[C.GRID] = (instance) => {
        let i = 0;
        while (i < instance.objects.length) {
            let obj = new Three.Object3D();
            obj.position.x = ( ( i % 5 ) * 400 ) - 800;
            obj.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
            obj.position.z = ( Math.floor( i / 25 ) ) * 1000 - 100;
            instance.targets.grid.push( obj );
            i++;
        }
    };
    return layouts;
}

/**
 *
 * @param name
 * @param instance
 */
export function transform(name, instance) {
    TWEEN.removeAll();
    let i = 0;
    while (i < instance.objects.length) {
        let obj = instance.objects[i];
        let target = instance.targets[name][i];
        new TWEEN.Tween(obj.position)
            .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * 2000 + 2000 )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start();
        new TWEEN.Tween(obj.rotation)
            .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * 2000 + 2000 )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start();
        new TWEEN.Tween(this)
            .to( {}, 2000 * 2 )
            .onUpdate( instance.render )
            .start();

        i++;
    }
}
