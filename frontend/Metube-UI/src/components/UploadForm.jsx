import React, { useState, useRef } from 'react';
import { Info, X, Upload, CircleHelp } from 'lucide-react';

const UploadWizard = () => {
    const [step, setStep] = useState(1); // Step 1: Upload, Step 2: Details
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    // Xử lý click thì chọn file video
    const fileInputRef = useRef(null);
    const onButtonClick = () => {
        fileInputRef.current.click();
    };

    // --- LOGIC XỬ LÝ FILE ---
    const handleFiles = (files) => {
        const uploadedFile = files[0];
        // Security check: Chỉ chấp nhận video
        if (uploadedFile && uploadedFile.type.startsWith('video/')) {
            setFile(uploadedFile);
            setStep(2); // Tự động chuyển sang bước nhập Detail
        } else {
            alert("Vui lòng chọn file video hợp lệ (mp4, mov...)");
        }
    };

    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => setIsDragging(false);

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    // --- UPLOAD FORM ---
    const UploadStep = () => (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div 
                className={`card bg-dark text-white shadow-lg w-100 ${isDragging ? 'border-primary' : 'border-secondary'}`}
                style={{ maxWidth: '600px', borderRadius: '15px', borderStyle: isDragging ? 'dashed' : 'solid', borderWidth: '2px' }}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                <div className="card-header d-flex justify-content-between align-items-center border-secondary py-3">
                    <h5 className="mb-0 fw-bold">Upload your video</h5>
                    <X className="text-secondary cursor-pointer" size={20} />
                </div>
                <div className="card-body text-center py-5">
                    <div className="upload-icon-wrapper mb-4">
                        <div className={`d-inline-block p-4 rounded-circle ${isDragging ? 'bg-primary' : 'bg-secondary'} bg-opacity-25`}>
                            <Upload size={64} className={isDragging ? 'text-primary' : 'text-secondary'} />
                        </div>
                    </div>
                    <div className="mb-4">
                        <p className="fs-5 mb-1">{isDragging ? "Thả file ra để upload!" : "Drag and drop video file to upload"}</p>
                        <p className="text-secondary small">Your videos will be private until you publish them</p>
                    </div>
                    <input // Ẩn input file 
                        type="file" 
                        id="fileInput" 
                        className="d-none"
                        accept="video/*" 
                        ref={fileInputRef}
                        onChange={(e) => handleFiles(e.target.files)} 
                    />
                    <button type="button" className="btn btn-outline-warning" onClick={onButtonClick}>Select video</button>
                </div>
            </div>
        </div>
    );

    // --- DETAIL STEP ---
    const DetailStep = () => (
        <div className="container mt-5 pb-5">
            <div className="card bg-dark text-white shadow-lg border-0" style={{ borderRadius: '15px' }}>
                <div className="card-header d-flex justify-content-between align-items-center border-secondary py-3 bg-transparent">
                    <h5 className="mb-0 fw-bold text-truncate" style={{maxWidth: '70%'}}>File: {file?.name}</h5>
                    <X className="text-secondary cursor-pointer" onClick={() => setStep(1)} size={20} />
                </div>
                <div className="card-body p-4">
                    <div className="row g-4">
                        <div className="col-lg-8">
                            <h4 className="mb-4">Details</h4>
                            <div className="mb-4 p-3 border border-secondary rounded bg-dark">
                                <label className="form-label text-secondary small d-flex align-items-center gap-1">
                                    Title (required) <CircleHelp size={14} />
                                </label>
                                <textarea className="form-control bg-transparent text-white border-0 p-0 shadow-none" rows="2" placeholder="Describe your video..." style={{ resize: 'none' }} />
                            </div>
                            <div className="mb-4 p-3 border border-secondary rounded bg-dark">
                                <label className="form-label text-secondary small d-flex align-items-center gap-1">
                                    Description <CircleHelp size={14} />
                                </label>
                                <textarea className="form-control bg-transparent text-white border-0 p-0 shadow-none" rows="6" placeholder="Tell viewers more..." style={{ resize: 'none' }} />
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="card bg-black border-secondary">
                                <div className="ratio ratio-16x9 bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center">
                                    <span className="text-secondary small text-center px-2 italic">Video Preview (Processing...)</span>
                                </div>
                                <div className="card-body p-3">
                                    <p className="small mb-1 text-secondary">Status</p>
                                    <div className="progress bg-secondary bg-opacity-25" style={{height: '8px'}}>
                                        <div className="progress-bar progress-bar-striped progress-bar-animated" style={{width: '45%'}}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-footer border-secondary d-flex justify-content-end p-3 bg-transparent">
                    <button className="btn btn-primary px-5 fw-bold" onClick={() => alert("Ready to publish!")}>PUBLISH</button>
                </div>
            </div>
        </div>
    );

    return step === 1 ? <UploadStep /> : <DetailStep />;
};

export default UploadWizard;