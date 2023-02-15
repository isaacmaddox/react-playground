import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/styles.css';

const root = ReactDOM.createRoot(document.querySelector('#root'));

class User {
    constructor(firstName, lastName, id, username, password, handle, pfp) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.id = id;
        this.username = username;
        this.password = password;
        this.handle = handle !== '' ? handle : username;
        this.url = `user/${handle}`;
        this.pfp = pfp ? pfp : './images/user-undefined.png';
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            client: null,
            // Login Form
            unameInputValue: '',
            passInputValue: '',
            failedLogin: false,
            userMatch: false,
            rememberUser: false,
            // Signup Form
            newUnameInputValue: '',
            newHandleInputValue: '',
            newPassInputValue: '',
            confirmPassInputValue: '',
            passEmpty: true,
            newPfp: './images/user-undefined.png',
        }

        this.users = [];

        if (localStorage.getItem('footphone-users') !== null) {
            JSON.parse(localStorage.getItem('footphone-users')).map(user => {
                return this.users.push(user);
            })
        }

        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.inputUpdate = this.inputUpdate.bind(this);
        this.toggleCreateAccount = this.toggleCreateAccount.bind(this);
        this.handleCreateAccount = this.handleCreateAccount.bind(this);
        this.handleDeleteAccount = this.handleDeleteAccount.bind(this);
    }

    handleLogin(e) {
        e.preventDefault();
        if (this.users.length === 0) {
            this.setState({
                userMatch: false,
                failedLogin: true,
            })
            return;
        };
        let match = this.users.find(user => user.username === this.state.unameInputValue);
        if (match && match.password === this.state.passInputValue) {
            this.setState({
                client: match,
                userMatch: false,
                failedLogin: false,
                unameInputValue: '',
                passInputValue: '',
            })
            if (this.state.rememberUser) {
                let expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + 7);
                document.cookie = `token=${match.id}; expires=${expireDate};`;
            }
            return;
        } else if (match) {
            this.setState({
                userMatch: true,
                failedLogin: true,
            })
            return;
        }

        this.setState({
            passInputValue: '',
            failedLogin: true,
            userMatch: false,
        })
    }

    handleLogout() {
        this.setState({
            client: null,
        })
        document.cookie = `token=; expires=Sun, Jan 1 2023 0:00:00 UTC;`;
    }

    componentDidMount() {
        // Check for existing login
        let token = parseInt(document.cookie.split(';')[0].split('=')[1]);
        let user;
        if (token) {
            user = this.users.find(user => user.id === token);
            if (user) {
                this.setState({
                    client: user,
                })
            }
        }
    }

    inputUpdate(e, input) {
        let empty = true;
        let match = false;
        switch (input) {
            case 'username':
                this.setState({
                    unameInputValue: e.target.value,
                    failedLogin: false,
                    userMatch: false
                })
                break;
            case 'password':
                this.setState({
                    passInputValue: e.target.value,
                    failedLogin: false,
                    userMatch: false,
                })
                break;
            case 'newUname':
                this.setState({
                    newUnameInputValue: e.target.value,
                })
                break;
            case 'newHandle':
                this.setState({
                    newHandleInputValue: (e.target.value !== '@' && e.target.value !== '') ? '@' + e.target.value.replace(/@/g, '') : '',
                })
                break;
            case 'newPass':
                empty = true;
                match = false;

                if (this.state.confirmPassInputValue !== e.target.value) {
                    match = false;
                    empty = false;
                } else {
                    match = true;
                    empty = false;
                }

                if (e.target.value === '' || this.state.confirmPassInputValue === '') {
                    empty = true;
                }

                this.setState({
                    newPassInputValue: e.target.value,
                    passDoMatch: match,
                    passEmpty: empty
                })
                break;
            case 'confirmPass':
                match = false;
                empty = true;

                if (this.state.newPassInputValue !== e.target.value) {
                    match = false;
                    empty = false;
                } else {
                    match = true;
                    empty = false;
                }

                if (e.target.value === '' || this.state.newPassInputValue === '') {
                    empty = true;
                }

                this.setState({
                    confirmPassInputValue: e.target.value,
                    passDoMatch: match,
                    passEmpty: empty
                })
                break;
            case 'pfpFile':
                if (e.target.files[0]) {
                    this.setState({
                        newPfp: URL.createObjectURL(e.target.files[0]),
                        newPfpName: e.target.files[0].name,
                    })
                }
                break;
            case 'firstName':
                this.setState({
                    firstNameValue: e.target.value,
                });
                break;
            case 'lastName':
                this.setState({
                    lastNameValue: e.target.value,
                })
                break;
            default:
                alert(input);
                break;
        }
    }

    toggleCreateAccount() {
        this.setState({
            createAccount: !this.state.createAccount,
            unameInputValue: '',
            passInputValue: '',
            failedLogin: false,
            userMatch: false,
            rememberUser: false,
            // Signup Form
            firstNameValue: '',
            lastNameValue: '',
            newUnameInputValue: '',
            newHandleInputValue: '',
            newPassInputValue: '',
            confirmPassInputValue: '',
            passEmpty: true,
            passDoMatch: true,
            newPfp: './images/user-undefined.png',
            newPfpReset: true,
            newPfpName: 'Default',
        })
    }

    handleCreateAccount(e) {
        e.preventDefault();
        if (this.state.newPassInputValue !== this.state.confirmPassInputValue) {
            this.setState({
                passNotMatch: true,
            })
            return;
        }
        let newUser = new User(this.state.firstNameValue, this.state.lastNameValue, this.users.length + 1, this.state.newUnameInputValue, this.state.newPassInputValue, this.state.newHandleInputValue, this.state.newPfp)
        this.users.push(newUser);
        localStorage.setItem('footphone-users', JSON.stringify(this.users));

        this.setState({
            passNotMatch: false,
            createAccount: false,
            unameInputValue: this.users.at(-1).username,
            passInputValue: '',
            failedLogin: false,
            userMatch: false,
            rememberUser: false,
            // Signup Form
            newUnameInputValue: '',
            newHandleInputValue: '',
            newPassInputValue: '',
            confirmPassInputValue: '',
            newPfp: './images/user-undefined.png',
        })
    }

    handleDeleteAccount() {
        let index = this.users.indexOf(this.state.client);
        this.users.splice(index, 1);
        localStorage.setItem('footphone-users', JSON.stringify(this.users));
        this.handleLogout();
    }

    render() {
        if (this.state.client !== null) {
            document.title = "Footphone - Shittiest Social Media Platform on the Internet";
            return (
                <>
                    <img src={this.state.client.pfp} alt="Profile" height="50" width="50" />
                    <h1>Welcome, {this.state.client.firstName}</h1>
                    <button onClick={this.handleLogout}>Log Out</button>
                    <button onClick={this.handleDeleteAccount}>Delete Account</button>
                </>
            )
        } else {
            if (!this.state.createAccount) {
                document.title = "Log In";
                return (
                    <form onSubmit={this.handleLogin}>
                        <h2>Log In</h2>
                        <label>
                            <input type="text" className={this.state.failedLogin ? 'incorrect' : ''} onChange={(e) => { this.inputUpdate(e, 'username') }} value={this.state.unameInputValue} />
                            <span>Username</span>
                        </label>
                        {
                            this.state.failedLogin && !this.state.userMatch &&
                            <div>User does not exist. Make sure you spelled the username correctly.</div>
                        }
                        <label>
                            <input type="password" className={this.state.failedLogin ? 'incorrect' : ''} onChange={(e) => { this.inputUpdate(e, 'password') }} value={this.state.passInputValue} />
                            <span>Password</span>
                        </label>
                        {
                            this.state.failedLogin && this.state.userMatch &&
                            <div>Username and password do not match. Try again.</div>
                        }
                        <span>
                            <label className='checkbox'>
                                <input type="checkbox" onChange={() => { this.setState({ rememberUser: this.state.rememberUser ? false : true }) }} id="remember" />
                                <div className="checkmark"></div>
                            </label>
                            <label htmlFor="remember">
                                Remember Me
                            </label>
                        </span>
                        <span>
                            <button type="submit" disabled={(this.state.unameInputValue !== "" && this.state.passInputValue !== "") ? false : true}>Log In</button>
                            <p>No Account? <button className="link" onClick={this.toggleCreateAccount} type="button">Sign Up</button></p>
                            <p>Forgot Your Password? <button className="link" onClick={this.toggleCreateAccount} type="button">Reset</button></p>
                        </span>
                    </form>
                )
            } else {
                document.title = "Create New Account";
                return (
                    <form onSubmit={this.handleCreateAccount}>
                        <h2>Create Account <span>* = required</span></h2>
                        <label className='inline'>
                            <input type="text" value={this.state.firstNameValue} onChange={(e) => { this.inputUpdate(e, 'firstName') }} required />
                            <span>First Name*</span>
                        </label>
                        <label className='inline'>
                            <input type="text" value={this.state.lastNameValue} onChange={(e) => { this.inputUpdate(e, 'lastName') }} />
                            <span>Last Name</span>
                        </label>
                        <label className='inline'>
                            <input type="text" value={this.state.newUnameInputValue} onChange={(e) => { this.inputUpdate(e, 'newUname') }} required />
                            <span>Username*</span>
                        </label>
                        <label className='inline'>
                            <input type="text" value={this.state.newHandleInputValue} onChange={(e) => { this.inputUpdate(e, 'newHandle') }} />
                            <span>Handle</span>
                        </label>
                        <label>
                            <input type="password" className={this.state.passEmpty ? '-' : '' + (this.state.passDoMatch ? ' correct' : 'incorrect')} value={this.state.newPassInputValue} onChange={(e) => { this.inputUpdate(e, 'newPass') }} required />
                            <span>Password*</span>
                        </label>
                        <label>
                            <input type="password" className={this.state.passEmpty ? '-' : '' + (this.state.passDoMatch ? ' correct' : 'incorrect')} value={this.state.confirmPassInputValue} onChange={(e) => { this.inputUpdate(e, 'confirmPass') }} />
                            <span>Confirm Password*</span>
                        </label>
                        {
                            !this.state.passDoMatch && !this.state.passEmpty &&
                            <div>Passwords do not match.</div>
                        }
                        <label htmlFor="pfpFile" id="fileSelect" className={(this.state.newPfpName && this.state.newPfpName !== "Default") ? 'selected' : ''}>
                            <span className="static">Profile Picture</span>
                            <div>
                                <img src={this.state.newPfp === null ? './images/user-undefined.png' : this.state.newPfp} alt="PFP" />
                                <p>{this.state.newPfpName ? this.state.newPfpName : 'Default'}</p>
                                <button type="button" onClick={() => { this.setState({ newPfp: null, newPfpName: undefined }); console.log(this.state) }}>Clear</button>
                            </div>
                        </label>
                        <input id="pfpFile" value={this.state.newPfpReset ? '' : null} type="file" accept="image/png, image/jpeg" onChange={(e) => { this.inputUpdate(e, 'pfpFile') }} />
                        <span>
                            <button
                                type="submit"
                                disabled={
                                    this.state.newUnameInputValue === '' || this.state.confirmPassInputValue === '' || this.state.firstNameValue === '' || !this.state.passDoMatch
                                }
                            >
                                Create Account
                            </button>
                            <p>
                                Already have an account? <button className='link' type="button" onClick={this.toggleCreateAccount}>Log In</button>
                            </p>
                        </span>
                    </form>
                )
            }
        }
    }
}

root.render(<App />);