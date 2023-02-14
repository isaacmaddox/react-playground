import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/styles.css';

const root = ReactDOM.createRoot(document.querySelector('#root'));

class User {
    constructor(id, username, password, handle, pfp) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.handle = handle ? handle : username;
        this.url = `user/${username}`;
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
            newPfp: './images/user-undefined.png',
        }

        this.users = [];
        if (localStorage.getItem('footphone-users') !== null) {
            JSON.parse(localStorage.getItem('footphone-users')).map(user => {
                return this.users.push(user);
            })
            // this.users = 
        }

        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.inputUpdate = this.inputUpdate.bind(this);
        this.createAccount = this.createAccount.bind(this);
        this.handleCreateAccount = this.handleCreateAccount.bind(this);
    }

    handleLogin(e) {
        e.preventDefault();
        console.log(
            this.users
        )
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
        switch (input) {
            case 'username':
                this.setState({
                    unameInputValue: e.target.value,
                })
                break;
            case 'password':
                this.setState({
                    passInputValue: e.target.value,
                })
                break;
            case 'newUname':
                this.setState({
                    newUnameInputValue: e.target.value,
                })
                break;
            case 'newHandle':
                this.setState({
                    newHandleInputValue: e.target.value !== '@' ? '@' + e.target.value.replace(/@/g, '') : '',
                })
                break;
            case 'newPass':
                this.setState({
                    newPassInputValue: e.target.value,
                })
                break;
            case 'confirmPass':
                this.setState({
                    confirmPassInputValue: e.target.value,
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
            default:
                alert('arg');
                break;
        }
    }

    createAccount() {
        this.setState({
            createAccount: true,
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
        let newUser = new User(this.users.length + 1, this.state.newUnameInputValue, this.state.newPassInputValue, this.state.newHandleInputValue, this.state.newPfp)
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

    render() {
        if (this.state.client !== null) {
            return (
                <>
                    <img src={this.state.client.pfp} alt="Profile" />
                    <h1>Welcome, {this.state.client.username}</h1>
                    <button onClick={this.handleLogout}>Log Out</button>
                </>
            )
        } else {
            if (!this.state.createAccount) {
                document.title = "Log In";
                return (
                    <form onSubmit={this.handleLogin}>
                        <h2>Log In</h2>
                        <label>
                            <input type="text" className={this.state.failedLogin && !this.state.userMatch ? 'incorrect' : ''} onChange={(e) => { this.inputUpdate(e, 'username') }} value={this.state.unameInputValue} />
                            <span>Username</span>
                        </label>
                        {
                            this.state.failedLogin && !this.state.userMatch &&
                            <div>User does not exist. Make sure you spelled the username correctly.</div>
                        }
                        <label>
                            <input type="password" className={this.state.failedLogin && this.state.userMatch ? 'incorrect' : ''} onChange={(e) => { this.inputUpdate(e, 'password') }} value={this.state.passInputValue} />
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
                            <p>No Account? <button className="link" onClick={this.createAccount} type="button">Sign Up</button></p>
                        </span>
                    </form>
                )
            } else {
                document.title = "Create New Account"; 
                return (
                    <form onSubmit={this.handleCreateAccount}>
                        <h2>Create Account</h2>
                        <label>
                            <input type="text" value={this.state.newUnameInputValue} onChange={(e) => {this.inputUpdate(e, 'newUname')}} />
                            <span>Username</span>
                        </label>
                        <label>
                            <input type="text" value={this.state.newHandleInputValue} onChange={(e) => {this.inputUpdate(e, 'newHandle')}} />
                            <span>Handle</span>
                        </label>
                        <label>
                            <input type="password" className={this.state.passNotMatch ? 'incorrect' : ''} value={this.state.newPassInputValue} onChange={(e) => {this.inputUpdate(e, 'newPass')}} />
                            <span>Password</span>
                        </label>
                        <label>
                            <input type="password" className={this.state.passNotMatch ? 'incorrect' : ''} value={this.state.confirmPassInputValue} onChange={(e) => {this.inputUpdate(e, 'confirmPass')}} />
                            <span>Confirm Password</span>
                        </label>
                        {
                            this.state.passNotMatch &&
                            <div>Passwords do not match.</div>
                        }
                        <label htmlFor="pfpFile" id="fileSelect" className={this.state.newPfpName ? 'selected' : ''}>
                            <span className="static">Profile Picture</span>
                            <div>
                                <img src={this.state.newPfp === null ? './images/user-undefined.png' : this.state.newPfp} alt="PFP" />
                                <p>{this.state.newPfpName ? this.state.newPfpName : 'None Selected'}</p>
                            </div>
                        </label>
                        <input id="pfpFile" type="file" onChange={(e) => {this.inputUpdate(e, 'pfpFile')}} />
                        <span>
                            <button 
                                type="submit"
                                disabled={
                                    this.state.newUnameInputValue === '' || this.state.confirmPassInputValue === '' || this.state.newHandleInputValue === ''
                                }
                            >
                                Create Account
                            </button>
                            <p>
                                Already have an account? <button className='link' type="button" onClick={() => {this.setState({ createAccount: false, })}}>Log In</button>
                            </p>
                        </span>
                    </form>
                )
            }
        }
    }
}

root.render(<App />);