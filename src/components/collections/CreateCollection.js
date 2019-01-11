import React, { Component } from 'react'
import { connect } from 'react-redux';
import { createCollection } from '../../store/actions/collectionActions';
import { Redirect } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/storage';

class CreateCollection extends Component {
  state = {
    title: '',
    content: '',
    status:'ativo',
    imageCover1: '',
    imageCover2: '',
    uploadValue: 0
  }

  fileSelectedHandler = (e) => {
    const file = e.target.files[0];
    const fileId = e.target.id;
    const storageRef = firebase.storage().ref(`covers/${file.lastModified}_${file.name}`)
    const task = storageRef.put(file)
    task.on('state_changed', (snapshot) => {
      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      this.setState({
        uploadValue: percentage
      })
    }, (error) => {
      this.setState({
        message: `Ocorreu um erro: ${error.message}`
      })
    }, () => {
      task.snapshot.ref.getDownloadURL().then((urlImage)=> {
        // console.log(urlImage);
        switch(fileId){
          case 'imageCover1':
            return (
              // console.log('Cover 1')
              this.setState({
                imageCover1: urlImage
              })
            );
          case 'imageCover2':
            return (
              // console.log('Cover 2')
              this.setState({
                imageCover2: urlImage
              })
            );
          default:
            return null
        }
      })
    })
  }

  handleChange = (e) => {
    console.log(e.target.id);
    console.log(e.target.value);
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state);
    this.props.createCollection(this.state);
    this.props.history.push('/');
  }
  render() {
    const { auth } = this.props;

    if (!auth.uid) return <Redirect to='/signin' />

    return (
      <div className="container">
        <form onSubmit={this.handleSubmit} className="white">
          <h5 className="grey-text text-darken-3">Create new Collection</h5>
          <div className="input-field">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" onChange={this.handleChange} />
          </div>
          <div className="input-field">
            <label htmlFor="content">Collection Content</label>
            <textarea id="content" cols="30" rows="10" className="materialize-textarea" onChange={this.handleChange}>
            </textarea>
          </div>

          <div className="file-field input-field">
            <div className="btn">
              <span>Capa 1</span>
              <input type="file" id="imageCover1" onChange={this.fileSelectedHandler}/>
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" placeholder="Imagem da Capa 1"/>
            </div>
            <div>
              <img className="responsive-img" src={this.state.imageCover1} alt="" />
            </div>
          </div>

          <div className="file-field input-field">
            <div className="btn">
              <span>Capa 2</span>
              <input type="file" id="imageCover2" onChange={this.fileSelectedHandler}/>
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" placeholder="Imagem da Capa 2"/>
            </div>
            <div>
              <img className="responsive-img" src={this.state.imageCover2} alt="" />
            </div>
          </div>
          <div className="progress">
            <div className="determinate" style={{width: this.state.uploadValue+"%"}}></div>
          </div>

          <div className="input-field">
            <button className="btn pink lighten-1 z-depth-0">Create</button>
          </div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    createCollection: (collection) => dispatch(createCollection(collection))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateCollection);
