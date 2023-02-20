import React from "react";
// const fs = require('fs').promises;

class User {
    constructor(firstName, lastName, email, id, username, password, handle, pfp, adminPriv = false) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.id = id;
        this.username = username;
        this.password = password;
        this.handle = handle !== '' ? handle : username;
        this.url = `user/${handle}`;
        this.pfp = pfp ? pfp : './images/user-undefined.png';
        this.adminPriv = adminPriv;
        this.friends = [];
        this.likedPosts = [];
    }

    newNotification(message, sender = 'system', displaySender = false) {
        this.notifications.push(
            new Notification(message, sender, displaySender)
        )
    }
}

export default class SignupForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // pfpReset: false,
            firstNameValue: '',
            lastNameValue: '',
            emailValue: '',
            unameValue: '',
            handleValue: '',
            passValue: '',
            confirmPassValue: '',
            newPfp: '',
            newPfpName: '',
            changePfp: false,
            creating: false,
        }

        this.updatePFP = this.updatePFP.bind(this);
        this.createAccount = this.createAccount.bind(this);
    }

    updatePFP(e) {
        if (e.target.files[0]) {
            this.setState({
                newPfp: URL.createObjectURL(e.target.files[0]),
                newPfpName: e.target.files[0].name,
            })
        }
    }

    createAccount(e) {
        this.setState({
            creating: true,
        })
        e.preventDefault();
        let newUsers = this.props.users;
        let newUser = new User(this.state.firstNameValue, this.state.lastNameValue, this.state.emailValue, newUsers.length, this.state.unameValue, btoa(this.state.passValue), this.state.handleValue !== '' ? this.state.handleValue : this.state.unameValue, this.state.newPfp);
        newUsers.push(newUser);
        localStorage.setItem('footphone-users', JSON.stringify(newUsers));
        this.props.context.setState({
            users: newUsers,
            currentView: 'signIn',
        })
    }

    render() {
        return (
            <form onSubmit={this.createAccount}>
                <h2>Create Account <span>* = required</span></h2>
                <label>
                    <input type="text" value={this.state.firstNameValue} onChange={(e) => { this.setState({ firstNameValue: e.target.value }) }} required />
                    <span>First Name*</span>
                </label>
                <label>
                    <input type="text" value={this.state.lastNameValue} onChange={(e) => { this.setState({ lastNameValue: e.target.value }) }} />
                    <span>Last Name</span>
                </label>
                <label>
                    <input type="email" value={this.state.emailValue} onChange={(e) => { this.setState({ emailValue: e.target.value }) }} required />
                    <span>Email*</span>
                </label>
                <label className='inline'>
                    <input type="text" value={this.state.unameValue} onChange={(e) => { this.setState({ unameValue: e.target.value }) }} required />
                    <span>Username*</span>
                </label>
                <label className='inline'>
                    <input type="text" value={this.state.handleValue} onChange={(e) => { this.setState({ handleValue: e.target.value }) }} />
                    <span>Handle</span>
                </label>
                {
                    this.props.users.find(u => u.username === this.state.unameValue) &&
                    <div>Username {this.state.unameValue} is taken.</div>
                }
                {
                    (this.props.users.find(u => u.handle === this.state.handleValue) || (this.props.users.find(u => u.handle === this.state.unameValue) && this.state.handleValue === '')) && (!this.props.users.find(u => u.username === this.state.unameValue)) &&
                    <>
                        <div>Handle {this.state.handleValue} is taken. {
                            this.props.users.find(u => u.handle === this.state.unameValue) &&
                            'Choose a different username or handle'
                        }</div>
                    </>
                }
                <label>
                    <input type="password" className={(this.state.passValue === '' || this.state.confirmPassValue === '') ? '-' : '' + ((this.state.passValue === this.state.confirmPassValue) ? ' correct' : 'incorrect')} value={this.state.passValue} onChange={(e) => { this.setState({ passValue: e.target.value }) }} required />
                    <span>Password*</span>
                </label>
                <label>
                    <input type="password" className={(this.state.passValue === '' || this.state.confirmPassValue === '') ? '-' : '' + ((this.state.passValue === this.state.confirmPassValue) ? ' correct' : 'incorrect')} value={this.state.confirmPassValue} onChange={(e) => { this.setState({ confirmPassValue: e.target.value }) }} required />
                    <span>Confirm Password*</span>
                </label>
                {
                    ((this.state.passValue !== this.state.confirmPassValue) && (this.state.passValue !== "" && this.state.confirmPassValue !== "")) &&
                    <div>Passwords do not match.</div>
                }
                <label htmlFor="pfpFile" id="fileSelect" className={(this.state.newPfpName && this.state.newPfpName !== "Default") ? 'selected' : ''}>
                    <span className="static">Profile Picture</span>
                    <div>
                        <img src={this.state.newPfp === '' ? './images/user-undefined.png' : this.state.newPfp} alt="PFP" />
                        <p>{this.state.newPfpName !== '' ? this.state.newPfpName : 'Default'}</p>
                        <button type="button" onClick={() => { this.setState({ newPfp: '', newPfpName: 'Default' }) }}>Clear</button>
                    </div>
                </label>
                <input id="pfpFile" type="file" accept="image/png, image/jpeg" onChange={this.updatePFP} />
                <span>
                    <button
                        type="submit"
                        disabled={
                            this.state.unameValue === '' || this.state.firstNameValue === '' || this.state.emailValue === '' || this.state.passValue === '' || this.state.confirmPassValue === '' || (this.state.passValue !== this.state.confirmPassValue)
                        } className={this.creating ? 'loading' : ''}
                    >
                        {
                            !this.creating ?
                                'Create Account' :
                                'Creating Account...'
                        }
                    </button>
                    <p>
                        Already have an account? <button className='link' type="button" onClick={() => { this.props.context.setState({ currentView: 'signIn' }) }}>Log In</button>
                    </p>
                </span>
            </form>
        )
    }
}