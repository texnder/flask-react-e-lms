import React from "react";

export default class UploadAdminImg extends React.Component {

	uploadUrl = '/upload-image';
	state = {
		uploadedFile: '',
		message: ''
	};

	_fileChange = (ev) => {
		if (ev.target.files.length > 0) {
			if (ev.target.files[0].type === "image/jpeg" || ev.target.files[0].type === "image/png") {
				if (ev.target.files[0].size > 200000 && ev.target.files[0].size < 550000) {
					this.setState({[ev.target.name] : ev.target.files[0], message: ''});
				}else{
					this.setState({message: 'file size should be between 200-500 kb '});
				}
			}else{
				this.setState({message: 'only jpg,jpeg,png image allowed!!'});
			}
		}else{
			this.setState({message: 'please choose an image file!!'});
		}
	}

	_uploadPicture = (ev) => {
		if (!this.state.message && this.state.uploadedFile) {
			var fd = new FormData();
			fd.append('file', this.state.uploadedFile);
			
			fetch(this.uploadUrl,{
				method: "POST",
				body: fd
			}).then(res=>res.json()).then(data => {
				this.setState({message: data.message});
				if('filename' in data){
					console.log(data);
					this.props.setImg(data.filename);
				}
			},err=>console.log(err));
		}else{
			this.setState({message: 'please choose an image file!!'});
		}
	}

    render () {
        return (
            
			<div className="modal fade" id="uploadImg-modal">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">

					
					<div className="modal-header">
					<h4 className="modal-title">Upload New: <span style={{color: "red"}}>{this.state.message}</span></h4>
						<button type="button" className="close" data-dismiss="modal">&times;</button>
					</div>

					<div className="modal-body">
						<input type="file" name="uploadedFile" onChange={this._fileChange} className="form-control form-input" />
					</div>

					<div className="modal-footer">
						<button className="btn primary-btn ui-btn" onClick={this._uploadPicture}>Upload</button>
					</div>

					</div>
				</div>
			</div>
        );
    }
}