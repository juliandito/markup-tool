import React, {useState, useRef, useEffect} from "react";
import './style.css'
import { faPaintBrush, faMinus, faCircle, faSquare, faEraser, faUpload, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


class ShapeBounding {
    left: number
    top: number
    width: number
    height: number

    constructor(left: number, top: number, width: number, height: number) {
        this.left = left
        this.top = top
        this.width = width
        this.height = height
    }
}

class MouseDownPos {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
}

class Location {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
}

class PolygonPoint {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
}


const Canvas: React.FC = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [activeButton, setActiveButton] = useState<string | null>();
    const [file, setFile] = useState<any>();

    const [canvasWidth, setCanvasWidth] = useState<number>(400);
    const [canvasHeight, setCanvasHeight] = useState<number>(300);


    const canvasRef = useRef<HTMLCanvasElement>(null);
    let canvas2DContextRef = React.useRef<CanvasRenderingContext2D | null>(null);

    let imageDataUrl = canvasRef.current?.toDataURL()
    let savedImage: ImageData
    let isMouseDragging = false
    let strokeColor = 'black'
    let fillColor = 'black'
    let strokeWidth = 2
    let polygonSide = 6
    let currentTool = 'brush'

    let isUsingBrush = false;
    let brushXPoints: any = [];
    let brushYPoints: any  = [];
    let brushDownPos: any = [];

    let shapeBoundingBox = new ShapeBounding(0,0,0,0);
    let mouseDownPos = new MouseDownPos(0,0);
    let loc = new Location(0,0);
    
    function handleUploadButtonClick() {
        inputRef.current?.click();
    };
    function handleUploadImage(e: any) {
        setFile(URL.createObjectURL(e.target.files[0]));

        setImageOnCanvas(URL.createObjectURL(e.target.files[0]))
    }
    function setImageOnCanvas(uploadedImgUrl: string){
        if (canvasRef!.current) {
            canvas2DContextRef.current!.clearRect(0,0,canvasRef.current!.width, canvasRef.current!.height);


            canvas2DContextRef.current!.fillStyle = "white";
            canvas2DContextRef.current!.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            let img = new Image();
            img.onload = function(){
                canvas2DContextRef.current!.drawImage(img, 0, 0);
            }
            img.src = uploadedImgUrl
        }
    }

    function saveCanvasImage(){
        if (canvasRef!.current) {
            savedImage = canvas2DContextRef.current!.getImageData(0,0,canvasRef.current.width,canvasRef.current.height);
        }
    }
    function redrawCanvasImage(){
        canvas2DContextRef.current!.putImageData(savedImage,0,0);
    }

    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.width  = canvasWidth;
            canvasRef.current.height = canvasHeight;
            canvasRef.current.style.width = canvasWidth * 2 + 'px';
            canvasRef.current.style.height = canvasHeight * 2 + 'px';

            canvas2DContextRef.current = canvasRef.current.getContext("2d");

            canvas2DContextRef.current!.fillStyle = "white";
            canvas2DContextRef.current!.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    },[canvasWidth, canvasHeight])

    return <>
    <div className="caontiner-fluid h-100">
        <div className="row min-vh-100">
            <div className="col-md-1 text-center wrapper">
                <div className="card shadow mt-4 p-1">
                    <h5>Tools</h5>
                    <button className={'btn btn-light mx-1 my-2 ' + (activeButton === 'brush'? 'active' :'' )} onClick={ () => {setActiveButton('brush')}}>
                        <FontAwesomeIcon icon={faPaintBrush} />
                    </button>
                    <button className={'btn btn-light mx-1 my-2 ' + (activeButton === 'line'? 'active' :'' )} onClick={ () => {setActiveButton('line')}}>
                        <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <button className={'btn btn-light mx-1 my-2 ' + (activeButton === 'circle'? 'active' :'' )} onClick={ () => {setActiveButton('circle')}}>
                        <FontAwesomeIcon icon={faCircle} />
                    </button>
                    <button className={'btn btn-light mx-1 my-2 ' + (activeButton === 'rectangle'? 'active' :'' )} onClick={ () => {setActiveButton('rectangle')}}>
                        <FontAwesomeIcon icon={faSquare} />
                    </button>
                    <button className={'btn btn-light mx-1 my-2 ' + (activeButton === 'eraser'? 'active' :'' )} onClick={ () => {setActiveButton('eraser')}}>
                        <FontAwesomeIcon icon={faEraser} />
                    </button>
                    <hr className="mt-4" />
                    <h5>File</h5>
                    <button className={'btn btn-light mx-1 my-2' + (activeButton === 'open'? 'active' :'' )} onClick={handleUploadButtonClick}>
                        <FontAwesomeIcon icon={faUpload} />
                    </button>
                    <a href={imageDataUrl} download="image.png">
                        <button className='btn btn-light mx-1 my-2'>
                        <FontAwesomeIcon icon={faDownload} />
                        </button>
                    </a>
                </div>
            </div>
            <div className="col-md-11 wrapper">
                <div className="mt-4">
                    <canvas ref={canvasRef} id="drawing-canvas" className="shadow-sm" />
                </div>
                <div style={{display: 'none'}}>
                    <input ref={inputRef} type="file" onChange={handleUploadImage} />
                    <img ref={imageRef} src={file} alt="im" />
                </div>
            </div>
        </div>
    </div>
    </>
}

export default Canvas
