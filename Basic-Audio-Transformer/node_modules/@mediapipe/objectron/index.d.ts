/**
 * @fileoverview Declarations for the Objectron API.
 */

/**
 * Version number of this package.
 */
export const VERSION: string;

/**
 * Represents pairs of (start,end) indices so that we can connect landmarks with
 * lines to provide wireframe box when we draw 2d normalized points.
 */
export declare type LandmarkConnectionArray = Array<[number, number]>;

/**
 * Object detections return an array of keypoints. This array provides the edges
 * necessary to connect those keypoints (by id) into a bounding box.
 */
export declare const BOX_CONNECTIONS: LandmarkConnectionArray;

/**
 * Provide a way to access keypoints by their friendly names. Using an interface
 * allows us to prevent obfuscation for external javascript linkage, while still
 * allowing optimization for internal linkages.
 */
export declare const BOX_KEYPOINTS: {
  CENTER: number,
  BACK_BOTTOM_LEFT: number,
  FRONT_BOTTOM_LEFT: number,
  BACK_TOP_LEFT: number,
  FRONT_TOP_LEFT: number,
  BACK_BOTTOM_RIGHT: number,
  FRONT_BOTTOM_RIGHT: number,
  BACK_TOP_RIGHT: number,
  FRONT_TOP_RIGHT:number,
};

/**
 * Represents a single normalized landmark, with depth.
 */
export declare interface Point2D {
  x: number;
  y: number;
  depth: number;
}

/**
 * Represents a point in 3D space.
 */
export declare interface Point3D {
  x: number;
  y: number;
  z: number;
}

/**
 * Represents a particular keypoint from an object detection. The id denotes
 * which keypoint this is (consistent over time), and then two representations
 * are included for this point, a 2D normalized version, and a 3D version.
 */
export declare interface Keypoint {
  id: number;
  point3d: Point3D;
  point2d: Point2D;
}

/**
 * List of keypoints.
 */
export type KeypointList = Keypoint[];

/**
 * The relevant information about a particular object detection.
 */
export declare interface ObjectDetection {
  /**
   * The unique object instance identifier.
   */
  id: number;
  /**
   * The list of keypoints for this detection (8 for a 3D bounding box).
   */
  keypoints: KeypointList;
  /**
   * The visibility of this object detection in a frame.
   */
  visibility: number;
  /**
   * 3x3 row-major rotation matrix describing the orientation of the rigid
   * object's frame of reference in the camera-coordinate system.
   */
  rotation: number[];
  /**
   * 3x1 vector describing the scale of the rigid object's frame of reference in
   * the camera-coordinate system.
   */
  scale: number[];
  /**
   * 3x1 vector describing the translation of the rigid object's frame of
   * reference in the camera-coordinate system in meters.
   */
  translation: number[];
}

/**
 * List of object detections.
 */
export type ObjectDetectionList = ObjectDetection[];

/**
 * We support several ways to get image inputs.
 */
export type InputImage = HTMLVideoElement | HTMLImageElement | HTMLCanvasElement;

/**
 * Legal inputs.
 */
export interface InputMap {
  image: InputImage;
}

/**
 * GpuBuffers should all be compatible with Canvas' `drawImage`
 */
type GpuBuffer = HTMLCanvasElement | HTMLImageElement | ImageBitmap;

/**
 * Possible results from Objectron.
 */
export interface Results {
  objectDetections: ObjectDetectionList;
  image: GpuBuffer;
}

/**
 * These are the models known to Objectron.
 */
export type KnownModel = 'Shoe'|'Cup'|'Chair'|'Camera';

/**
 * Configurable options for Objectron. (Not yet hooked up!)
 */
export interface Options {
  selfieMode?: boolean;
  maxNumObjects?: number;  // 1 to 10
  minDetectionConfidence?: number;
  minTrackingConfidence?: number;
  staticImageMode?: boolean;
  modelName?: KnownModel;
  focalLength?: number[];
  principalPoint?: number[];
  imageSize?: number[];
}

/**
 * Listener for any results from Objectron.
 */
export type ResultsListener = (results: Results) => (Promise<void>|void);

/**
 * Contains all of the setup options to drive the Objectron solution.
 */
export interface ObjectronConfig {
  locateFile?: (path: string, prefix?: string) => string;
}

/**
 * Declares the interface of Objectron.
 */
declare interface ObjectronInterface {
  close(): Promise<void>;
  onResults(listener: ResultsListener): void;
  initialize(): Promise<void>;
  reset(): void;
  send(inputs: InputMap): Promise<void>;
  setOptions(options: Options): void;
}

/**
 * Encapsulates the entire Objectron solution. All that is needed from the
 * developer is the source of the image data. The user will call `send`
 * repeatedly and if objects are detected, then the user can receive callbacks
 * with this metadata.
 */
export declare class Objectron implements ObjectronInterface {
  constructor(config?: ObjectronConfig);

  /**
   * Shuts down the object. Call before creating a new instance.
   */
  close(): Promise<void>;

  /**
   * Registers a single callback that will carry any results that occur
   * after calling Send().
   */
  onResults(listener: ResultsListener): void;

  /**
   * Initializes the solution. This includes loading ML models and mediapipe
   * configurations, as well as setting up potential listeners for metadata. If
   * `initialize` is not called manually, then it will be called the first time
   * the developer calls `send`.
   */
  initialize(): Promise<void>;

  /**
   * Tells the graph to restart before the next frame is sent.
   */
  reset(): void;

  /**
   * Processes a single frame of data, which depends on the options sent to the
   * constructor.
   */
  send(inputs: InputMap): Promise<void>;

  /**
   * Adjusts options in the solution. This may trigger a graph reload the next
   * time the graph tries to run.
   */
  setOptions(options: Options): void;
}
