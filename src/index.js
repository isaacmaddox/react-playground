import React from 'react';
import ReactDOM from 'react-dom/client';
import Navbar from './Navbar';
import LoginForm from './LoginForm';
import './css/styles.css';
import SignupForm from './SignupForm';
import ForgotPass from './ForgotPass';

const root = ReactDOM.createRoot(document.querySelector('#root'));

class Notification {
    constructor(message, sender, displaySender) {
        this.message = message;
        this.sender = sender;
        this.displaySender = displaySender;
        this.dateTime = new Date();
    }
}

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

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
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
            emailValue: '',

            // Page Values
            currentView: 'home',
        }


        this.handleLogout = this.handleLogout.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleDeleteAccount = this.handleDeleteAccount.bind(this);
    }

    handleLogout() {
        this.setState({
            client: null,
            currentView: 'signIn',
        })
        document.cookie = `token=; expires=Sun, Jan 1 2023 0:00:00 UTC;`;
    }

    componentDidMount() {
        // Check for existing login
        if (localStorage.getItem('footphone-users') !== null && JSON.parse(localStorage.getItem('footphone-users')).length > 0) {
            JSON.parse(localStorage.getItem('footphone-users')).map(user => {
                return this.state.users.push(user);
            })
        } else {
            let newUser = new User('Admin', 'Root', 'root@footphone.com', 1, 'ROOT', btoa('ROOT'), 'admin', './images/user-admin.png', true);
            if (this.state.users.length === 0)
                this.state.users.push(newUser);
            localStorage.setItem('footphone-users', JSON.stringify(this.state.users));
        }
        let token = parseInt(document.cookie.split(';')[0].split('=')[1]);
        if (token) {
            let user = this.state.users.find(user => user.id === token);
            if (user) {
                this.setState({
                    client: user,
                    currentView: 'home'
                })
            }
        } else {
            this.setState({
                currentView: 'signIn',
            })
        }
    }

    handleDeleteAccount(e, all = false) {
        if (all) {
            this.state.users.forEach(user => {
                if (!user.adminPriv) {
                    this.state.users.splice(this.state.users.indexOf(user));
                }
            });
            return;
        }
        let index = this.state.users.indexOf(this.state.client);
        this.state.users.splice(index, 1);
        localStorage.setItem('footphone-users', JSON.stringify(this.state.users));
        this.handleLogout();
    }

    handlePageChange(newPage) {
        this.setState({
            currentView: newPage,
        })
    }

    render() {
        if (this.state.currentView === 'home' && this.state.client !== null) {
            document.title = "Footphone - Shittiest Social Media Platform on the Internet";
            return (
                <>
                    <Navbar client={this.state.client} currentPage={this.state.currentView} handlePageChange={this.handlePageChange} />
                    <div className="main-content">
                        <img src={this.state.client.pfp} alt="Profile" height="50" width="50" />
                        <h1>Welcome, {this.state.client.firstName}</h1>
                        <button onClick={this.handleLogout}>Log Out</button>
                        {
                            !this.state.client.adminPriv &&
                            <button onClick={this.handleDeleteAccount}>Delete Account</button>
                        }
                    </div>
                </>
            )
        } else {
            switch (this.state.currentView) {
                case 'home':
                    return (
                        <>
                            <Navbar client={this.state.client} currentPage={this.state.currentView} handlePageChange={this.handlePageChange} />
                            <div className="main-content">
                                <h1>No user signed in</h1>
                                <button onClick={() => { this.handlePageChange('signIn') }}>Sign In</button>
                            </div>
                            <div className="sidebar"></div>
                        </>
                    )
                case 'signIn':
                    document.title = "Log In";
                    return (
                        <>
                            <Navbar client={this.state.client} currentPage={this.state.currentView} handlePageChange={this.handlePageChange} />
                            <LoginForm users={this.state.users} context={this} />
                        </>
                    )
                case 'createAccount':
                    document.title = "Create New Account";
                    return (
                        <>
                            <Navbar client={this.state.client} currentPage={this.state.currentView} handlePageChange={this.handlePageChange} />
                            <SignupForm users={this.state.users} context={this} />
                        </>
                    )
                case 'reset':
                    document.title = "Forgot Password";
                    return (
                        <>
                            <Navbar client={this.state.client} currentPage={this.state.currentView} handlePageChange={this.handlePageChange} />
                            <ForgotPass users={this.state.users} context={this} />
                        </>
                    )
                case "admin":
                    return (
                        <>
                            <Navbar client={this.state.client} currentPage={this.state.currentView} handlePageChange={this.handlePageChange} />
                            <div className="main-content has-content">
                                <h1>Admin Panel</h1>
                                <button onClick={(e) => { this.handleDeleteAccount(e, true) }}>Delete All</button>
                            </div>
                        </>
                    )
                default:
                    document.title = "Error - Unhandled Case"
                    return (
                        <>
                            <div className="page-wrap">
                                <Navbar client={this.state.client} currentPage={this.state.currentView} handlePageChange={this.handlePageChange} />
                                <h1>Error. View: {this.state.currentView}. Client exists: {this.state.client === null ? 'False' : 'True'}</h1>
                            </div>
                        </>
                    )
            }
        }
    }
}

root.render(
    <div className="page-wrap">
        <App />
    </div>
);