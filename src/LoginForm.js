import React from 'react';

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            client: null,
            userMatch: false,
            failedLogin: false,
            rememberUser: false,
            unameValue: '',
            passValue: '',
        }

        this.users = this.props.users;

        this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin(e) {
        this.setState({
            loggingIn: true,
        })
        e.preventDefault();

        let match = this.users.find(user => (user.username === this.state.unameValue || user.email === this.state.unameValue));
        if (match && atob(match.password) === this.state.passValue) {
            this.setState({
                client: match,
                userMatch: false,
                failedLogin: false,
                unameInputValue: '',
                passInputValue: '',
            });
            if (this.state.rememberUser) {
                let expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + 7);
                document.cookie = `token=${match.id}; expires=${expireDate};`;
            }
            setTimeout(() => {
                this.props.context.setState({
                    currentView: 'home',
                    client: match
                })
            }, 300);
            return;
        } else if (match && atob(match.password) !== this.state.passValue) {
            this.setState({
                userMatch: true,
                failedLogin: true,
                loggingIn: false,
            })
            return;
        }

        this.setState({
            passInputValue: '',
            failedLogin: true,
            userMatch: false,
            loggingIn: false,
        })
    }

    render() {
        return (
            <form onSubmit={this.handleLogin}>
                <h2>Log In</h2>
                <label>
                    <input type="text" className={this.state.failedLogin ? 'incorrect' : ''} value={this.state.unameValue} onChange={(e) => { this.setState({ unameValue: e.target.value, userMatch: undefined, failedLogin: false, }) }} />
                    <span>Username</span>
                </label>
                {
                    this.state.failedLogin && !this.state.userMatch &&
                    <div>User does not exist. Make sure you spelled the username correctly.</div>
                }
                <label>
                    <input type="password" className={this.state.failedLogin ? 'incorrect' : ''} value={this.state.passValue} onChange={(e) => {
                        this.setState({ passValue: e.target.value, userMatch: undefined, failedLogin: false, })
                    }} />
                    <span>Password</span>
                </label>
                {
                    this.state.failedLogin && this.state.userMatch &&
                    <div>Username and password do not match. Try again.</div>
                }
                <span>
                    <label className='checkbox'>
                        <input type="checkbox" onChange={this.toggleRemember} id="remember" />
                        <div className="checkmark"></div>
                    </label>
                    <label htmlFor="remember">
                        Remember Me
                    </label>
                </span>
                <span>
                    <button type="submit" disabled={(this.state.unameValue !== "" && this.state.passValue !== "") ? false : true} className={this.state.loggingIn ? 'loading' : ''}>{this.state.loggingIn ? 'Logging In...' : 'Log In'}</button>
                    <p>No Account? <button className="link" onClick={() => this.props.context.handlePageChange('createAccount')} type="button">Sign Up</button></p>
                    <p>Forgot Your Password? <button className="link" onClick={() => this.props.context.handlePageChange('reset')} type="button">Reset</button></p>
                </span>
            </form >
        )
    }
}