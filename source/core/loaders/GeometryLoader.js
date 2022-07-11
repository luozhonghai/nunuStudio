import {DefaultLoadingManager, FileLoader, ObjectLoader} from "three";
import {TerrainBufferGeometry} from "../geometries/TerrainBufferGeometry.js";
import {RoundedBoxBufferGeometry} from "../geometries/RoundedBoxBufferGeometry.js";
import {CapsuleBufferGeometry} from "../geometries/CapsuleBufferGeometry.js";
import {ParametricBufferGeometry} from "../geometries/ParametricBufferGeometry.js";
import {LegacyGeometryLoader} from "./LegacyGeometryLoader.js";
import {StaticPair} from "@as-com/pson";
import {Locale} from "../../editor/locale/LocaleManager";
import {Editor} from "../../editor/Editor";
import {FileSystem} from "../FileSystem";

/**
 * Geometry loader can be used to load geometry files.
 *
 * @class GeometryLoader
 * @module Loaders
 * @param {Object} manager
 */
function GeometryLoader(manager)
{
	this.manager = manager !== undefined ? manager : DefaultLoadingManager;

	this.shapes = {};

	this.images = {};
}

/**
 * Set list of images to be used by the loader.
 *
 * @method setImages
 * @param {Array} images
 */
GeometryLoader.prototype.setImages = function(images)
{
	this.images = images;
	return this;
};

/**
 * Set list of shapes to be used by this loader.
 *
 * @method setShapes
 * @param {Array} shapes
 */
GeometryLoader.prototype.setShapes = function(shapes)
{
	this.shapes = shapes;
	return this;
};


/**
 * Load geometry json file from URL.
 *
 * @method load
 * @param {string} url
 * @param {Function} onLoad
 * @param {Function} onProgress
 * @param {Function} onError
 */
GeometryLoader.prototype.load = function(url, onLoad, onProgress, onError)
{
	var loader = new FileLoader(this.manager);
	loader.load(url, function(text)
	{
		onLoad(self.parse(JSON.parse(text)));
	}, onProgress, onError);
};

/**
 * Parse geometry json.
 *
 * @method parse
 * @param {Object} json
 * @return {Geometry} Geometry loaded from json.
 */
GeometryLoader.prototype.parse = function(data)
{
	var geometry = null;

	if (data.type === "CapsuleBufferGeometry")
	{
		geometry = new CapsuleBufferGeometry(data.radiusTop, data.radiusBottom, data.height, data.radialSegments, data.heightSegments, data.capsTopSegments, data.capsBottomSegments, data.thetaStart, data.thetaLength);
	}
	else if (data.type === "RoundedBoxBufferGeometry")
	{
		geometry = new RoundedBoxBufferGeometry(data.width, data.height, data.depth, data.radius, data.radiusSegments);
	}
	else if (data.type === "TerrainBufferGeometry")
	{
		geometry = new TerrainBufferGeometry(data.width, data.height, data.widthSegments, data.heightSegments, data.scale, this.images[data.image]);
	}
	else if (data.type === "ParametricBufferGeometry")
	{
		geometry = new ParametricBufferGeometry(data.code, data.slices, data.stacks);
	}
	else if (data.type === "Geometry")
	{
		var loader = new LegacyGeometryLoader();
		geometry = loader.parse(data.data).geometry;
	}
	else if (data.format === "chunk")
	{
		var chunkData = JSON.parse(FileSystem.readFile(Editor.projectPath + "\\" + data.path, true));
		geometry = this.parseChunk(chunkData);
		return geometry;
	}
	else
	{
		var geometries = ObjectLoader.prototype.parseGeometries([data], this.shapes);
		for (var i in geometries)
		{
			geometry = geometries[i];
			break;
		}
	}

	geometry.uuid = data.uuid;
	geometry.name = data.name !== undefined ? data.name : "geometry";

	return geometry;
};

GeometryLoader.prototype.parseChunk = function (data)
{
	var geometry = null;

	if (data.type === "CapsuleBufferGeometry")
	{
		geometry = new CapsuleBufferGeometry(data.radiusTop, data.radiusBottom, data.height, data.radialSegments, data.heightSegments, data.capsTopSegments, data.capsBottomSegments, data.thetaStart, data.thetaLength);
	}
	else if (data.type === "RoundedBoxBufferGeometry")
	{
		geometry = new RoundedBoxBufferGeometry(data.width, data.height, data.depth, data.radius, data.radiusSegments);
	}
	else if (data.type === "TerrainBufferGeometry")
	{
		geometry = new TerrainBufferGeometry(data.width, data.height, data.widthSegments, data.heightSegments, data.scale, this.images[data.image]);
	}
	else if (data.type === "ParametricBufferGeometry")
	{
		geometry = new ParametricBufferGeometry(data.code, data.slices, data.stacks);
	}
	else if (data.type === "Geometry")
	{
		var loader = new LegacyGeometryLoader();
		geometry = loader.parse(data.data).geometry;
	}
	else
	{
		var geometries = ObjectLoader.prototype.parseGeometries([data], this.shapes);
		for (var i in geometries)
		{
			geometry = geometries[i];
			break;
		}
	}

	geometry.uuid = data.uuid;
	geometry.name = data.name !== undefined ? data.name : "geometry";

	return geometry;
};
export {GeometryLoader};
