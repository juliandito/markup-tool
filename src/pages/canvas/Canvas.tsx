import React, {useState, useRef} from "react";
import './style.css'
import { faPaintBrush, faMinus, faCircle, faSquare, faEraser, faUpload, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Canvas: React.FC = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [activeButton, setActiveButton] = useState<string | null>()

    const handleUploadButtonClick = () => {
        inputRef.current?.click();
    };

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
                    <hr />
                    <h5 className="mt-4">File</h5>
                    <input style={{display: 'none'}} type="file" />
                    <button className={'btn btn-light mx-1 my-2' + (activeButton === 'open'? 'active' :'' )} onClick={handleUploadButtonClick} >
                        <FontAwesomeIcon icon={faUpload} />
                    </button>
                    <a href="#" download="image.png">
                        <button className='btn btn-light mx-1 my-2'>
                        <FontAwesomeIcon icon={faDownload} />
                        </button>
                    </a>
                </div>
            </div>
            <div className="col-md-11 wrapper">
            </div>
        </div>
    </div>
    </>
}

export default Canvas
