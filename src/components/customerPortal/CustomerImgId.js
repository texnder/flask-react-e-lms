import React from "react";

export default class CustomerImgId extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            customerPhoto: '',
            idProve : '',
            message: '',
        };
    }
	

	_fileChange = (ev) => {
		if (ev.target.files.length > 0) {
			if (ev.target.files[0].type === "image/jpeg" || ev.target.files[0].type === "image/png") {
				if (ev.target.files[0].size > 10000 && ev.target.files[0].size < 150000) {
					this.setState({[ev.target.name] : ev.target.files[0], message: ''});
				}else{
					this.setState({message: 'file size should be between 10-150 kb '});
				}
			}else{
				this.setState({message: 'only jpg,jpeg,png image allowed!!'});
			}
		}else{
			this.setState({message: 'please choose an image file!!'});
		}
    }
    
    _uploadHandler = () => {
        if (this.state.customerPhoto && this.state.idProve) {
            let message = this.props.setImg(this.state.customerPhoto,this.state.idProve);
            this.setState({message: message});
        }else{
			this.setState({message: 'please upload valid image files!!'});
		}
    }

    render () {
        return (
			<div className="modal fade" id="imgUploader">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">

					<div className="modal-header">
					<h4 className="modal-title">Upload: <span style={{color: "red"}}>{this.state.message}</span></h4>
						<button type="button" className="close" data-dismiss="modal">&times;</button>
					</div>

					<div className="modal-body">
                        <div className="form-group">
                            <label >Customer Photo:</label>
                            <input 
                            type="file" 
                            name="customerPhoto" 
                            className="form-control form-input" 
                            onChange={this._fileChange}
                            required/>
                        </div>
                        <div className="form-group">
                            <label >Id Prove:</label>
                            <input 
                            type="file" 
                            name="idProve" 
                            className="form-control form-input" 
                            onChange={this._fileChange}
                            required/>
                        </div>
					</div>

					<div className="modal-footer">
						<button onClick={this._uploadHandler} className="btn primary-btn ui-btn">Upload</button>
					</div>
                    
					</div>
				</div>
			</div>
        );
    }
}