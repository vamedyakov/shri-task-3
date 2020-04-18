import React from 'react';
import { connect } from 'react-redux';
import './PopUp.scss';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { FormErrors } from '../FormErrors/FormErrors';

import ciServer from '../../api/ciServer';

import {
    HISTORY_RELOAD,
} from '../../constants/actionTypes';

const mapStateToProps = state => ({
  ...state.history,
  userConfig: state.common.userConfig
});

const mapDispatchToProps = dispatch => ({
  onReload: (buildsList) =>
      dispatch({ type: HISTORY_RELOAD, buildsList }),
});

class PopUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      commitHash: '',

      commitHashValid: false,
      formValid: false,

      formErrors: [],
    }
  }

  handleUserInput = (event) => {
      const { name, value } = event.target;

      this.setState({ [name]: value },
          () => { this.validateField(name, value) });
  }

  handleResetField = event => {
      event.preventDefault();
      const name = event.target.getAttribute('data-name');
      
      this.setState({ [name]: '' },
          () => { this.validateField(name, '') });
  }

  validateField(fieldName, value) {
      let { formErrors } = this.state;
      let valid = false;

      switch (fieldName) {
        case 'commitHash':
            valid = value.length > 0;
            if(!valid) formErrors.push(fieldName+' is empty');
            break;
          default:
              break;
      }

      this.setState({ [fieldName + 'Valid']: valid, formErrors: formErrors }, this.validateForm);
  }

  validateForm() {
      this.setState({
          formValid: this.state.commitHashValid
      });
  }

  errorClass(error) {
      return (!error && this.state.formErrors.length > 0 ? 'form__item_error' : '');
  }

  submit(e) {
      e.preventDefault();
      console.log(this.state);
      if(this.state.formValid) {
          let formErrors = [];
          ciServer.postAddQueue(this.state).then(res => {
              if(res.status !== 200){
                  formErrors.push(res.data);
              }else{
                ciServer.getBuilds(0, this.props.limit)
                    .then(response => {
                        if (response.data) {
                            this.props.onReload(response.data);
                        }
                        this.props.onClose();
                        
                        this.props.history.push(`/build/${response.data.id}/`);
                    });
              }
              this.setState({formErrors: formErrors });
          });
      }
  }
  
  render() {
    return (
      <div className='popup'>
        <div className='popup__wrapper'>
          <form className='popup__form' onSubmit={this.submit.bind(this)}>
            <h3 className='popup__title'>New build</h3>
            <p className='popup__description'>Enter the commit hash which you want to build.</p>
            <FormErrors formErrors={this.state.formErrors} />

            <div className={`form__item ${this.errorClass(this.state.commitHashValid)}`}>
              <Input name="commitHash" closeBtnOnClick={this.handleResetField} onChange={this.handleUserInput} value={this.state.commitHash} placeholder="Commit hash" closeBtn />
            </div>

            <div className='popup__button-wrapper'>
              <Button text='Run build' disabled={!this.state.formValid} type="medium" action additional="form" />
              <Button text='Cancel' onClick={this.props.onClose} type="medium" additional="form" />
            </div>
          </form>
        </div>
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(PopUp);