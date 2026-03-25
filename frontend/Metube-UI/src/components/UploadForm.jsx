import { useState } from "react";
import '../../public/upVideo.css';
import * as icon from 'lucide-react';

const UpVideo = () => {

    return (
        <div className="upVideoBox">
            <div className="p1">
                <p>Upload your video</p>
                <div className="ext&info" style={{display: "flex", flexDirection: 'row', gap: '10px', alignItems: 'center', justifyContent: 'center'}}>
                    <icon.Info></icon.Info>
                    <icon.X></icon.X>
                </div>
            </div>
            <div className="divider"></div>
            <div className="p2">
                <div className="upVideoIco"><icon.Upload size={70} color="#C0C0C0"></icon.Upload></div>
                <div style={{fontSize: "17px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                    <p>Drag and drop video files to upload</p>
                    <p style={{marginTop: "1px"}}>Your videos will be private until you publish them.</p>
                </div>
                <button className="chooseVideoBtn">Select video</button>
            </div>
            <div className="p3">
                <div style={{fontSize: "1.1vw", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                    <p>By uploading videos to Metube, you confirm that you agree to our <span>Terms of Service</span> and <span>Community Guidelines</span>.</p>
                    <p style={{marginTop: "0"}}>You need to ensure you don't infringe on anyone's copyright or privacy rights. <span>Learn more</span>.</p>
                </div>
            </div>
        </div>
    )
}

export default UpVideo;