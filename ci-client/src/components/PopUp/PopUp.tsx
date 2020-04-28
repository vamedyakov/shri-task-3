import React from 'react';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import {History} from 'history';
import {FormErrors} from '../FormErrors/FormErrors';
import WebApiClient from '../../api/WebApiClient';
import {actionTypes} from '../../constants/actionTypes';
import {initialStateHistory} from '../../reducers/history';
import {
    BuildModel,
    BuildRequestResultModel
} from '../../typings/api/models';

import {Input} from '../Input/Input';
import {Button} from '../Button/Button';

import './PopUp.scss';

interface stateProps {
    historyPage: initialStateHistory;
}

interface stateLocal {
    commitHash: string;
    commitHashValid: boolean;
    formValid: boolean;
    formErrors: Array<string>;
}

const mapStateToProps = ({historyPage}: stateProps) => ({
    ...historyPage
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    onReload: (buildsList: Array<BuildModel>) =>
        dispatch({type: actionTypes.HISTORY_RELOAD, buildsList}),
});

interface Props extends initialStateHistory {
    onReload(buildList: Array<BuildModel>): void;

    onClose(): void;

    history?: History;
}

export interface FormControlEventTarget extends EventTarget {
    value: string;
    name: string;
}

class PopUp extends React.Component<Props> {
    public state: stateLocal;

    constructor(props: Props) {
        super(props);

        this.state = {
            commitHash: '',
            commitHashValid: false,
            formValid: false,
            formErrors: [],
        } as stateLocal;
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
            case 'commitHash':
                if (value) valid = value.length > 0;
                if (!valid) formErrors.add(fieldName + ' is empty');
                else formErrors.delete(fieldName + ' is empty');
                break;
            default:
                break;
        }

        this.setState({[fieldName + 'Valid']: valid, formErrors: Array.from(formErrors)}, this.validateForm);
    }

    validateForm() {
        this.setState({
            formValid: this.state.commitHashValid
        });
    }

    errorClass(error: boolean): string {
        return (!error && this.state.formErrors.length > 0 ? 'form__item_error' : '');
    }

    async submit(e: React.FormEvent) {
        e.preventDefault();
        if (this.state.formValid) {
            let responseAddBuild: BuildRequestResultModel | undefined;
            let formErrors = [];

            try {
                responseAddBuild = await WebApiClient.postAddBuildQueue(this.state.commitHash);
                const response = await WebApiClient.getBuilds(this.props.offset, this.props.limit);

                this.props.onReload(response);
            } catch (err) {
                formErrors.push(err.toString());
            }
            this.props.onClose();

            if (this.props.history && responseAddBuild) {
                this.props.history.push(`/build/${responseAddBuild.id}/`);
            }

            this.setState({formErrors: formErrors});
        }
    }

    render() {
        return (
            <div className='popup'>
                <div className='popup__wrapper'>
                    <form className='popup__form' onSubmit={e => this.submit(e)}>
                        <h3 className='popup__title'>New build</h3>
                        <p className='popup__description'>Enter the commit hash which you want to build.</p>
                        <FormErrors formErrors={this.state.formErrors}/>

                        <div className={`form__item ${this.errorClass(this.state.commitHashValid)}`}>
                            <Input name="commitHash" closeBtnOnClick={this.handleResetField}
                                   onChange={this.handleUserInput} value={this.state.commitHash}
                                   placeholder="Commit hash" closeBtn/>
                        </div>

                        <div className='popup__button-wrapper'>
                            <Button text='Run build' disabled={!this.state.formValid} type="medium" action
                                    additional="form"/>
                            <Button text='Cancel' onClick={this.props.onClose} type="medium" additional="form"/>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(PopUp);