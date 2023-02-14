import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/styles.css';

const root = ReactDOM.createRoot(document.querySelector('#root'));

class User {
    constructor(id, username, password, handle, url, pfp) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.handle = handle ? handle : username;
        this.url = url ? url : `user/${username}`;
        this.pfp = pfp ? pfp : './images/user-undefined.png';
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            client: null,
            unameInputValue: '',
            passInputValue: '',
            failedLogin: false,
            userMatch: false,
            rememberUser: false,
        }

        this.users = [
            new User(1, 'example', 'example123', undefined, undefined, 'https://source.unsplash.com/random/100x100')
        ];

        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.unameInputUpdate = this.unameInputUpdate.bind(this);
        this.inputUpdate = this.inputUpdate.bind(this);
    }

    handleLogin(e) {
        e.preventDefault();
        let match = this.users.find(user => user.username === this.state.unameInputValue);
        if (match && match.password === this.state.passInputValue) {
            this.setState({
                client: match,
                userMatch: false,
                failedLogin: false,
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

    unameInputUpdate(e) {
        this.setState({
            unameInputValue: e.target.value,
        });
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
            default:
                alert('arg');
                break;
        }
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
            return (
                <form className='login' onSubmit={this.handleLogin}>
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
                    <button type="submit" disabled={(this.state.unameInputValue !== "" && this.state.passInputValue !== "") ? false : true}>Log In</button>
                </form>
            )
        }
    }
}

root.render(<App />);