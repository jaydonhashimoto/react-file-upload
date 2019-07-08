import React, { Fragment, useState } from 'react';
import Message from './Message';
import Progress from './/Progress';
import axios from 'axios';

const FileUpload = () => {
    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Choose File');
    const [uploadedFile, setUploadedFile] = useState({});
    const [msg, setMsg] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);

    const onChange = e => {
        //file upload allows for multiple files
        //e.target.files returns an array
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    }

    //async is used bc this is an arrow func
    const onSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        //'file' is used because of: const file = req.files.file;
        //in server.js
        formData.append('file', file);

        try {
            const res = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                //set upload progress
                onUploadProgress: progressEvent => {
                    setUploadPercentage(parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total)))
                    //clear percentage
                    setTimeout(() => setUploadPercentage(0), 10000);
                }
            });

            const { fileName, filePath } = res.data;
            setUploadedFile({ fileName, filePath });
            setMsg('File Uploaded');
        } catch (err) {
            if (err.response.status === 500) {
                setMsg('There was a problem with the server');
            } else {
                setMsg(err.response.data.msg);
            }
        }
    }

    return (
        <Fragment>
            {msg ? <Message msg={msg} /> : null}
            <form onSubmit={onSubmit}>
                <div className="custom-file mb-4" >
                    <input type="file" className="custom-file-input" id="customFile" onChange={onChange} />
                    <label className="custom-file-label" htmlFor="customFile">{filename}</label>
                </div>
                <Progress percentage={uploadPercentage} />
                <input type="submit" value="Upload" className="btn btn-primary btn-block mt-4" />
            </form>
            {uploadedFile ? <div className="row mt-5">
                <div className="col-md-6 m-auto">
                    <h3 className="text-center">{uploadedFile.fileName}</h3>
                    <img style={{ width: '100%' }} src={uploadedFile.filePath} alt="" />
                </div>
            </div> : null}
        </Fragment>
    )
}

export default FileUpload

