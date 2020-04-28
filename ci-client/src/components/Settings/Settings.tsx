import React from 'react';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {initialStateSettings} from "../../reducers/settings";
import {initialStateCommon} from "../../reducers/common";
import {ConfigurationInput} from '../../typings/api/models';
import {actionTypes} from '../../constants/actionTypes';
import WebApiClient from '../../api/WebApiClient';

import {FormErrors} from '../FormErrors/FormErrors';
import {Header} from '../Header/Header';
import {Button} from '../Button/Button';
import {Input} from '../Input/Input';

import './Settings.scss';

interface stateProps {
    settings: initialStateSettings;
    common: initialStateCommon;
}

const mapStateToProps = ({settings, common}: stateProps) => ({
    ...settings,
    ...common
});

interface Props extends initialStateSettings, initialStateCommon {
    onLoad(): void;

    onSubmitForm(): void;

    onSettingsSaved(): void;
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
    onLoad: () =>
        dispatch({type: actionTypes.SETTINGS_PAGE_LOADED,}),
    onSubmitForm: () =>
        dispatch({type: actionTypes.SETTINGS_SUBMIT_FORM,}),
    onSettingsSaved: () =>
        dispatch({type: actionTypes.SETTINGS_SAVED,})
});

interface stateLocal {
    repository: string;
    command: string;
    branch: string;
    syncMinutes: number;
    repositoryValid: boolean;
    commandValid: boolean;
    branchValid: boolean;
    syncMinutesValid: boolean;
    formValid: boolean;
    formErrors: Array<string>;
}

export interface FormControlEventTarget extends EventTarget {
    value: string;
    name: string;
}

class Settings extends React.Component<Props> {
    public state: stateLocal;

    constructor(props: Props) {
        super(props);

        this.state = {
            repository: '',
            command: '',
            branch: '',
            syncMinutes: 1,

            repositoryValid: false,
            commandValid: false,
            branchValid: false,
            syncMinutesValid: false,
            formValid: false,

            formErrors: [],
        }
    }

    handleUserInput = (event: React.ChangeEvent<FormControlEventTarget>) => {
        const {name, value} = (event.target as FormControlEventTarget);

        if (name) {
            this.setState({[name]: value},
                () => {
                    this.validateField(name, value)
                });
        }
    }

    handleResetField = (event: React.MouseEvent) => {
        event.preventDefault();
        const name = event.currentTarget.getAttribute('data-name');

        if (name) {
            this.setState({[name]: ''},
                () => {
                    this.validateField(name, '')
                });
        }
    }

    validateField(fieldName: string, value?: string | null) {
        let formErrors = new Set(this.state.formErrors);
        let valid = false;

        switch (fieldName) {
            case 'repository':
                if (value) valid = /(.)\/(.)/g.test(value);
                if (!valid) formErrors.add(fieldName + ' is invalid');
                else formErrors.delete(fieldName + ' is invalid');
                break;
            case 'command':
                if (value) valid = value.length > 2;
                if (!valid) formErrors.add(fieldName + ' is invalid');
                else formErrors.delete(fieldName + ' is invalid');
                break;
            case 'branch':
                if (value) valid = value.length > 0;
                if (!valid) formErrors.add(fieldName + ' is invalid');
                else formErrors.delete(fieldName + ' is invalid');
                break;
            case 'syncMinutes':
                if (value) valid = Number(value) > 0;
                if (!valid) formErrors.add(fieldName + ' is invalid');
                else formErrors.delete(fieldName + ' is invalid');
                break;
            default:
                break;
        }

        this.setState({[fieldName + 'Valid']: valid, formErrors: Array.from(formErrors)}, this.validateForm);
    }

    validateForm() {
        this.setState({
            formValid: this.state.repositoryValid &&
                this.state.commandValid &&
                this.state.branchValid &&
                this.state.syncMinutesValid
        });
    }

    errorClass(error: boolean): string {
        return (!error && this.state.formErrors.length > 0 ? 'form__item_error' : '');
    }

    componentDidMount() {
        this.props.onLoad();
        if (this.props.userConfig) {
            if (this.props.userConfig.repoName.length > 0) {
                this.setState({repository: this.props.userConfig.repoName},
                    () => {
                        this.validateField('repository', this.props.userConfig.repoName)
                    });
            }

            if (this.props.userConfig.buildCommand.length > 0) {
                this.setState({command: this.props.userConfig.buildCommand},
                    () => {
                        this.validateField('command', this.props.userConfig.buildCommand)
                    });
            }

            if (this.props.userConfig.mainBranch.length > 0) {
                this.setState({branch: this.props.userConfig.mainBranch},
                    () => {
                        this.validateField('branch', this.props.userConfig.mainBranch)
                    });
            }

            if (this.props.userConfig.buildCommand.length > 0) {
                this.setState({syncMinutes: this.props.userConfig.period},
                    () => {
                        this.validateField('syncMinutes', this.props.userConfig.period.toString())
                    });
            }
        }
    }

    async submit(e: React.FormEvent) {
        e.preventDefault();
        if (this.state.formValid) {
            let dataRequest: ConfigurationInput;
            let formErrors = [];

            this.props.onSubmitForm();
            dataRequest = {
                repoName: this.state.repository,
                buildCommand: this.state.command,
                mainBranch: this.state.branch,
                period: this.state.syncMinutes,
            };

            try {
                await WebApiClient.postSettings(dataRequest);
            } catch (err) {
                formErrors.push(err.toString());
            }

            this.setState({formErrors: formErrors});
            this.props.onSettingsSaved();
        }
    }

    render() {
        return (
            <div>
                <Header title='School CI server' viewTitle="secondary" sizeTitle="xxl"/>
                <div className="layout">
                    <div className="layout__container">
                        <div className="settings">
                            <h2 className="settings__title text_size_l text_weight_bold">Settings</h2>
                            <div className="settings__description text_size_m text_view_secondary">Configure repository
                                connection and synchronization settings
                            </div>
                            <FormErrors formErrors={this.state.formErrors}/>
                            <form className="form" onSubmit={e => this.submit(e)}>
                                <div className={`form__item ${this.errorClass(this.state.repositoryValid)}`}>
                                    <Input labelText="GitHub repository" name="repository"
                                           closeBtnOnClick={this.handleResetField} onChange={this.handleUserInput}
                                           value={this.state.repository} placeholder="user-name/repo-name" require
                                           closeBtn/>
                                </div>
                                <div className={`form__item ${this.errorClass(this.state.commandValid)}`}>
                                    <Input labelText="Build command" name="command"
                                           closeBtnOnClick={this.handleResetField} onChange={this.handleUserInput}
                                           value={this.state.command} placeholder="npm ci && npm run build" closeBtn/>
                                </div>
                                <div className={`form__item ${this.errorClass(this.state.branchValid)}`}>
                                    <Input labelText="Main branch" name="branch" closeBtnOnClick={this.handleResetField}
                                           onChange={this.handleUserInput} value={this.state.branch}
                                           placeholder="master |" closeBtn/>
                                </div>
                                <div className={`form__item ${this.errorClass(this.state.syncMinutesValid)}`}>
                                    <label htmlFor="syncMinutes" className="form__label text_size_m">Synchronize
                                        every</label>
                                    <Input name="syncMinutes" onChange={this.handleUserInput}
                                           value={this.state.syncMinutes.toString()} maxlength={3}
                                           inputClass="minutes"/>
                                    <label htmlFor="syncMinutes" className="form__label text_size_m">minutes</label>
                                </div>
                                <div className="form__item">
                                    <div className="form__control">
                                        <Button text='Save' type="medium"
                                                disabled={!this.state.formValid || this.props.inProgress} action
                                                additional="form"/>
                                        <Button to="/" text='Cancel' type="medium" additional="form"/>
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