import React from "react";

export default class ForgotPass extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            unameValue: '',
            code: null,
            codeValue: '',
            userNotFound: false,
            userFound: false,
            codeMatch: false,
            newPassValue: '',
            passSame: false,
            requestedUser: null,
            resetting: false,
        }

        this.handleForgot = this.handleForgot.bind(this);
        this.checkCode = this.checkCode.bind(this);
        this.resetPass = this.resetPass.bind(this);
    }

    handleForgot(e) {
        e.preventDefault();
        let reqUser = this.props.users.find(u => u.username === this.state.unameValue || u.email === this.state.unameValue);
        if (reqUser) {
            let code = '';

            for (let i = 0; i < 6; i++) {
                let rand = Math.round(Math.random() * 9);
                code += rand.toString();
            }

            this.setState({
                code: code,
                userNotFound: false,
                userFound: true,
                requestedUser: reqUser,
            })

            console.log(code);
        } else {
            this.setState({
                userNotFound: true,
                userFound: false,
            })
        }
    }

    checkCode(e) {
        e.preventDefault();
        if (this.state.codeValue === this.state.code) {
            this.setState({
                codeMatch: true,
                codeError: false,
            })
        } else {
            this.setState({
                codeMatch: false,
                codeError: true,
            })
        }
    }

    resetPass(e) {
        e.preventDefault();
        if (btoa(this.state.newPassValue) === this.state.requestedUser.password) {
            this.setState({
                passSame: true,
                newPassValue: '',
            })
        } else {
            this.setState({
                resetting: true,
            })
            let users = this.props.users;
            let ind = users.indexOf(this.state.requestedUser);
            users[ind].password = btoa(this.state.newPassValue);
            this.props.context.setState({
                users: users,
                currentView: 'signIn',
            });
            localStorage.setItem('footphone-users', JSON.stringify(users));
        }
    }

    render() {
        console.log(this.state.requestedUser);
        return (
            <form onSubmit={
                this.state.code === null ? this.handleForgot : (this.state.codeMatch === false ? this.checkCode : this.resetPass)
            }>
                <div className="title">
                    {
                        (this.state.code === null) && 
                        <>
                            <h2>Forgot your password?</h2>
                            <p>We'll send a code to your email, then let you reset your password.</p>
                        </>
                    }
                    {
                        this.state.requestedUser !== null &&
                        <>
                            <h2>Enter the code we sent</h2>
                            <p>We sent a code to you at <strong>{this.state.requestedUser.email}</strong></p>
                        </>
                    }
                </div>
                {
                    this.state.code === null &&
                    <label>
                        <input type="text" onChange={(e) => { this.setState({ unameValue: e.target.value, userNotFound: false }) }} value={this.state.unameValue} />
                        <span>Username or email</span>
                    </label>
                }
                {
                    this.state.userNotFound &&
                    <div>We could not find a user with that username or email</div>
                }
                {
                    this.state.code !== null && this.state.codeMatch === false &&
                    <label>
                        <input type="text" pattern="[0-9]+" inputMode="numeric" onChange={(e) => { this.setState({ codeValue: e.target.value }) }} value={this.state.codeValue} />
                        <span>6-Digit Code</span>
                    </label>
                }
                {
                    this.state.code !== null && this.state.codeError &&
                    <div>Codes do not match.</div>
                }
                {
                    this.state.codeMatch &&
                    <label>
                        <input type="password" onChange={(e) => { this.setState({ newPassValue: e.target.value, passSame: false, }) }} value={this.state.newPassValue} />
                        <span>New Password</span>
                    </label>
                }
                {
                    this.state.passSame &&
                    <div>New password cannot be the same as previous password</div>
                }
                <span>
                    <button type="submit" className={this.state.resetting ? 'loading' : ''}>
                        {
                            (this.state.code === null &&
                                "Send Code") || ((this.state.userFound && !this.state.codeMatch) &&
                                    "Check Code") || ((this.state.codeMatch) && "Reset Password")
                        }</button>
                </span>
            </form>
        )
    }
}