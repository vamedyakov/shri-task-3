
import React from 'react';
import { connect } from 'react-redux';
import './Settings.scss';
import '../Text/Text.scss';
import '../Layout/Layout.scss';
import { Header } from '../Header/Header';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';

import ciServer from '../../api/ciServer';
import {
    SETTINGS_PAGE_LOADED,
} from '../../constants/actionTypes';


const mapStateToProps = state => ({
    userConfig: state.common.userConfig
});

const mapDispatchToProps = dispatch => ({
    onLoad: () =>
        dispatch({ type: SETTINGS_PAGE_LOADED, })
});
class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            repository: '',
            command: '',
            branch: '',
            syncMinutes: '',

            repositoryValid: false,
            commandValid: false,
            branchValid: false,
            syncMinutesValid: false,
            formValid: false,

            formErrors: { repository: '', command: '', branch: '', syncMinutes: '' },
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
        
        this.setState({ [name]: '1234' },
            () => { this.validateField(name, '1234') });
    }

    validateField(fieldName, value) {
        let { formErrors } = this.state;
        console.log(this.state);
        let valid = false;

        switch (fieldName) {
            case 'repository':
                valid = /(.)\/(.)/g.test(value);
                formErrors.repository = valid ? '' : ' is invalid';
                break;
            case 'command':
                valid = value.length > 2;
                formErrors.command = valid ? '' : ' is too short';
                break;
            case 'branch':
                valid = value.length > 0;
                formErrors.branch = valid ? '' : ' is empty';
                break;
            case 'syncMinutes':
                valid = Number(value) > 0;
                formErrors.syncMinutes = valid ? '' : ' is empty';
                break;
            default:
                break;
        }

        this.setState({ [fieldName + 'Valid']: valid, formErrors: formErrors }, this.validateForm);
    }

    validateForm() {
        this.setState({
            formValid: this.state.repositoryValid &&
                this.state.commandValid &&
                this.state.branchValid &&
                this.state.syncMinutesValid
        });
    }

    errorClass(error) {
        return (error.length === 0 ? '' : 'form__item_error');
    }

    componentWillMount() {
        this.setState({ repository: this.props.userConfig.repoName },
            () => { this.validateField('repository', this.props.userConfig.repoName) });

        this.setState({ command: this.props.userConfig.buildCommand },
            () => { this.validateField('command', this.props.userConfig.buildCommand) });

        this.setState({ branch: this.props.userConfig.mainBranch },
            () => { this.validateField('branch', this.props.userConfig.mainBranch) });

        this.setState({ syncMinutes: this.props.userConfig.period },
            () => { this.validateField('syncMinutes', this.props.userConfig.period) });

        this.props.onLoad();
    }

    submit(e) {
        e.preventDefault();
        if(this.state.formValid) {
            ciServer.postSaveSettings(this.state).then(res => {
                console.log(res);
            });
        }
    }

    render() {
        return (
            <div>
                <Header title='School CI server' viewTitle="secondary" sizeTitle="xxl" />
                <div className="layout">
                    <div className="layout__container">
                        <div className="settings">
                            <h2 className="settings__title text_size_l text_weight_bold">Settings</h2>
                            <div className="settings__description text_size_m text_view_secondary">Configure repository connection and synchronization settings</div>
                            <form className="form" onSubmit={this.submit.bind(this)}>
                                <div className={`form__item ${this.errorClass(this.state.formErrors.repository)}`}>
                                    <Input labelText="GitHub repository" name="repository" closeBtnOnClick={this.handleResetField} onChange={this.handleUserInput} value={this.state.repository} placeholder="user-name/repo-name" require closeBtn />
                                </div>
                                <div className={`form__item ${this.errorClass(this.state.formErrors.command)}`}>
                                    <Input labelText="Build command" name="command" closeBtnOnClick={this.handleResetField} onChange={this.handleUserInput} value={this.state.command} placeholder="npm ci && npm run build" closeBtn />
                                </div>
                                <div className={`form__item ${this.errorClass(this.state.formErrors.branch)}`}>
                                    <Input labelText="Main branch" name="branch" closeBtnOnClick={this.handleResetField} onChange={this.handleUserInput} value={this.state.branch} placeholder="master |" closeBtn />
                                </div>
                                <div className={`form__item ${this.errorClass(this.state.formErrors.syncMinutes)}`}>
                                    <label htmlFor="syncMinutes" className="form__label text_size_m">Synchronize every</label>
                                    <Input name="syncMinutes" onChange={this.handleUserInput} value={this.state.syncMinutes} maxlength="3" inputClass="minutes" />
                                    <label htmlFor="syncMinutes" className="form__label text_size_m">minutes</label>
                                </div>
                                <div className="form__item">
                                    <div className="form__control">
                                        <Button text='Save' type="medium" disabled={!this.state.formValid} action additional="form" />
                                        <Button to="/" text='Cancel' type="medium" additional="form" />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Settings);