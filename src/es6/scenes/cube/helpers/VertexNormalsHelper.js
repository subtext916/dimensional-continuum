/**
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
 */

import {
    BufferGeometry,
    Float32BufferAttribute,
    LineSegments,
    LineBasicMaterial,
    Matrix3,
    Vector3
} from 'three'; // todo: @Russ - UNTESTED

var _v1 = new Vector3();
var _v2 = new Vector3();
var _normalMatrix = new Matrix3();
var _keys = [ 'a', 'b', 'c' ];

function VertexNormalsHelper( object, size, hex, linewidth ) {
    this.object = object;
    this.size = ( size !== undefined ) ? size : 1;
    let color = ( hex !== undefined ) ? hex : 0xff0000;
    let width = ( linewidth !== undefined ) ? linewidth : 1;
    let nNormals = 0;
    let objGeometry = this.object.geometry;
    if ( objGeometry && objGeometry.isGeometry ) { nNormals = objGeometry.faces.length * 3; }
    else if ( objGeometry && objGeometry.isBufferGeometry ) {
        nNormals = objGeometry.attributes.normal.count;
    }
    let geometry = new BufferGeometry();
    let positions = new Float32BufferAttribute( nNormals * 2 * 3, 3 );
    geometry.setAttribute( 'position', positions );
    LineSegments.call( this, geometry, new LineBasicMaterial( { color: color, linewidth: width } ) );
    this.matrixAutoUpdate = false;
    this.update();
}

VertexNormalsHelper.prototype = Object.create( LineSegments.prototype );
VertexNormalsHelper.prototype.constructor = VertexNormalsHelper;
VertexNormalsHelper.prototype.update = function () {
    this.object.updateMatrixWorld( true );
    _normalMatrix.getNormalMatrix( this.object.matrixWorld );
    let matrixWorld = this.object.matrixWorld;
    let position = this.geometry.attributes.position;
    let objGeometry = this.object.geometry;
    if ( objGeometry && objGeometry.isGeometry ) {
        let vertices = objGeometry.vertices;
        let faces = objGeometry.faces;
        let idx = 0;
        for ( var i = 0, l = faces.length; i < l; i ++ ) {
            var face = faces[ i ];
            for ( let j = 0, jl = face.vertexNormals.length; j < jl; j ++ ) {
                let vertex = vertices[ face[ _keys[ j ] ] ];
                let normal = face.vertexNormals[ j ];
                _v1.copy( vertex ).applyMatrix4( matrixWorld );
                _v2.copy( normal ).applyMatrix3( _normalMatrix ).normalize().multiplyScalar( this.size ).add( _v1 );
                position.setXYZ( idx, _v1.x, _v1.y, _v1.z );
                idx = idx + 1;
                position.setXYZ( idx, _v2.x, _v2.y, _v2.z );
                idx = idx + 1;
            }
        }
    }
    else if ( objGeometry && objGeometry.isBufferGeometry ) {
        let objPos = objGeometry.attributes.position;
        let objNorm = objGeometry.attributes.normal;
        let idx = 0;
        // for simplicity, ignore index and drawcalls, and render every normal
        for ( let j = 0, jl = objPos.count; j < jl; j ++ ) {
            _v1.set( objPos.getX( j ), objPos.getY( j ), objPos.getZ( j ) ).applyMatrix4( matrixWorld );
            _v2.set( objNorm.getX( j ), objNorm.getY( j ), objNorm.getZ( j ) );
            _v2.applyMatrix3( _normalMatrix ).normalize().multiplyScalar( this.size ).add( _v1 );
            position.setXYZ( idx, _v1.x, _v1.y, _v1.z );
            idx = idx + 1;
            position.setXYZ( idx, _v2.x, _v2.y, _v2.z );
            idx = idx + 1;
        }
    }
    position.needsUpdate = true;
};
export { VertexNormalsHelper };
