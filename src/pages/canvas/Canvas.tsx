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
    const [strokeColor, setStrokeColor] = useState<string>('#000000');
    const [fillColor, setFillColor] = useState<string>('#000000');

    const [currentTool, setCurrentTool] = useState<string>('');

    const canvasRef = useRef<HTMLCanvasElement>(null);
    let canvas2DContextRef = React.useRef<CanvasRenderingContext2D | null | undefined>(null);

    let imageDataUrl = canvasRef.current?.toDataURL()
    let savedImage: ImageData
    let isMouseDragging = false
    let isUsingBrush = false;

    let strokeWidth = 2
    let polygonSide = 6

    let brushXPoints: any = [];
    let brushYPoints: any  = [];
    let brushDownPos: any = [];

    let shapeBoundingBox = new ShapeBounding(0,0,0,0);
    let mouseDownPos = new MouseDownPos(0,0);
    let loc = new Location(0,0);

    function handleChangeColor(e: any) {
        let newColor = e.target.value

        setStrokeColor(newColor)
        setFillColor(newColor)

    }
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

    function updateRubberbandSizeData(loc: Location){
        shapeBoundingBox.width = Math.abs(loc.x - mouseDownPos.x);
        shapeBoundingBox.height = Math.abs(loc.y - mouseDownPos.y);

        if(loc.x > mouseDownPos.x){
            shapeBoundingBox.left = mouseDownPos.x;
        } else {
            shapeBoundingBox.left = loc.x;
        }

        if(loc.y > mouseDownPos.y){
            shapeBoundingBox.top = mouseDownPos.y;
        } else {
            shapeBoundingBox.top = loc.y;
        }
    }

    function updateRubberbandOnMove(loc: Location){
        updateRubberbandSizeData(loc);
        drawRubberbandShape(loc);
    }

    function drawRubberbandShape(loc: Location){

        canvas2DContextRef.current!.strokeStyle = strokeColor;
        canvas2DContextRef.current!.fillStyle = fillColor;

        switch (currentTool) {
            case 'brush':
                drawBrush();
                break;
            case 'line':
                canvas2DContextRef.current!.beginPath();
                canvas2DContextRef.current!.moveTo(mouseDownPos.x, mouseDownPos.y);
                canvas2DContextRef.current!.lineTo(loc.x, loc.y);
                canvas2DContextRef.current!.stroke();
                break;
            case 'circle':
                
                break;
            case 'rectangle':
                
                break;
            case 'eraser':
                
                break;
        
            default:
                break;
        }
    }

    function addBrushPoint(x: number, y: number, mouseDown: boolean){
        brushXPoints.push(x);
        brushYPoints.push(y);
        brushDownPos.push(mouseDown);
    }

    function drawBrush(){
        for(let i = 1; i < brushXPoints.length; i++){
            canvas2DContextRef.current!.beginPath();

            if(brushDownPos[i]){
                canvas2DContextRef.current!.moveTo(brushXPoints[i-1], brushYPoints[i-1]);
            } else {
                canvas2DContextRef.current!.moveTo(brushXPoints[i]-1, brushYPoints[i]);
            }
            canvas2DContextRef.current!.lineTo(brushXPoints[i], brushYPoints[i]);

            canvas2DContextRef.current!.closePath();
            canvas2DContextRef.current!.strokeStyle = strokeColor
            
            canvas2DContextRef.current!.stroke();
        }
    }

    function getMousePosOnCanvas (x: number, y: number){
        let canvasSize = canvasRef.current?.getBoundingClientRect()
        const currentCanvasWidth = canvasRef.current?.width
        const currentCanvasHeight = canvasRef.current?.height

        if (
            canvasSize !== undefined && 
            currentCanvasWidth !== undefined && 
            currentCanvasHeight !== undefined
            ) {
            const xPos = (x - canvasSize?.left) * (currentCanvasWidth / canvasSize.width)
            const yPos = (y - canvasSize?.top) * (currentCanvasHeight / canvasSize.height)

            return {x: xPos, y: yPos}
        } else {
            return {x: 0, y: 0}
        }
    }


    const handleMouseDown = (e: any) => {
        if (canvasRef.current) {
            canvasRef.current.style.cursor = 'crosshair'

            const currentMouseLoc = getMousePosOnCanvas(e.clientX, e.clientY);

            loc.x = currentMouseLoc.x
            loc.y = currentMouseLoc.y

            mouseDownPos.x = loc.x;
            mouseDownPos.y = loc.y;

            addBrushPoint(loc.x, loc.y, false);
            isMouseDragging = true
            isUsingBrush = true

            saveCanvasImage()
        }
    }
    const handleMouseUp = (e: any) => {
        if (canvasRef.current) {
            canvasRef.current.style.cursor = 'default'

            const currentMouseLoc = getMousePosOnCanvas(e.clientX, e.clientY);

            loc.x = currentMouseLoc.x
            loc.y = currentMouseLoc.y

            isMouseDragging = false
            isUsingBrush = false
        }
    }
    const handleMouseMove = ((e: any) => {
        if (canvasRef.current) {
            canvasRef.current.style.cursor = 'crosshair'

            const currentMouseLoc = getMousePosOnCanvas(e.clientX, e.clientY);
            loc.x = currentMouseLoc.x
            loc.y = currentMouseLoc.y

            if(isMouseDragging && isUsingBrush && currentTool === 'brush'){
                if(loc.x > 0 && loc.x < canvasWidth && loc.y > 0 && loc.y < canvasHeight){
                    addBrushPoint(loc.x, loc.y, true);
                }

                redrawCanvasImage();
                drawBrush();
            } else if (isMouseDragging) {
                redrawCanvasImage();
                updateRubberbandOnMove(loc);
            }
        }
    })


    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.addEventListener('mousedown', handleMouseDown, false)
            canvasRef.current.addEventListener('mouseup', handleMouseUp, false)
            canvasRef.current.addEventListener('mousemove', handleMouseMove, false)
        
            canvasRef.current.width  = canvasWidth;
            canvasRef.current.height = canvasHeight;
            canvasRef.current.style.width = canvasWidth * 2 + 'px';
            canvasRef.current.style.height = canvasHeight * 2 + 'px';
        
            canvas2DContextRef.current = canvasRef.current?.getContext("2d");

            canvas2DContextRef.current!.fillStyle = "white";
            canvas2DContextRef.current!.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    },[currentTool])

    return <>
    <div className="caontiner-fluid h-100">
        <div className="row min-vh-100">
            <div className="col-md-1 text-center wrapper">
                <div className="card shadow mt-4 p-1">
                    <h5>Tools</h5>
                    <button className={'btn btn-light mx-1 my-2 ' + (activeButton === 'brush'? 'active' :'' )} onClick={ () => {setActiveButton('brush'); setCurrentTool('brush'); console.log('log');
                    }}>
                        <FontAwesomeIcon icon={faPaintBrush} />
                    </button>
                    <button className={'btn btn-light mx-1 my-2 ' + (activeButton === 'line'? 'active' :'' )} onClick={ () => {setActiveButton('line'); setCurrentTool('line')}}>
                        <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <button className={'btn btn-light mx-1 my-2 ' + (activeButton === 'circle'? 'active' :'' )} onClick={ () => {setActiveButton('circle'); setCurrentTool('circle')}}>
                        <FontAwesomeIcon icon={faCircle} />
                    </button>
                    <button className={'btn btn-light mx-1 my-2 ' + (activeButton === 'rectangle'? 'active' :'' )} onClick={ () => {setActiveButton('rectangle'); setCurrentTool('rectangle')}}>
                        <FontAwesomeIcon icon={faSquare} />
                    </button>
                    <button className={'btn btn-light mx-1 my-2 ' + (activeButton === 'eraser'? 'active' :'' )} onClick={ () => {setActiveButton('eraser'); setCurrentTool('eraser')}}>
                        <FontAwesomeIcon icon={faEraser} />
                    </button>
                    <input type="color" className="form-control form-control-color mx-1 my-2"  value={fillColor} onChange={handleChangeColor} title="Choose your color"/>
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
