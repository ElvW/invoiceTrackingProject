import "../styles/Login.css"
import { useState } from 'react' 
import { useNavigate } from "react-router-dom"

export default function Login(props) {
    const navigate = useNavigate()

    const [isSignIn, setIsSignIn] = useState(true)

    const [loginData, setLoginData] = useState({
        usernameOrEmail: "",
        password: ""
    })

    function handleLoginChange(name, value) {
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }))
    }
    
    function changeSignToReg() {
        setIsSignIn(prev => !prev)
    }

    function loginUser(e) {
        e.preventDefault()

        fetch("https://localhost:7163/api/Auth/login", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(loginData),
        }).then(response => {
            if(!response.ok) {
                alert("No such User!")
            } else {
                return response.json()
            }
        }).then(json => {
            props.setUserToken(json.token)
            navigate("/")
        })
    }

    return(
        <>
            <div className="sign-in">
                <div className="side">  
                    <form onSubmit={loginUser} className={`form ${isSignIn ? "": "not-active"}`}>
                        <label htmlFor="email">Email</label>
                        <input value={loginData.usernameOrEmail} onChange={(e) => handleLoginChange("usernameOrEmail", e.target.value)} id="email" name="email" type="text"/>
                        <label htmlFor="password">Password</label>
                        <input value={loginData.password} onChange={(e) => handleLoginChange("password", e.target.value)} id="password" name="password" type="text" />
                        <button className="login-button">Sign in</button>
                    </form>
                    <div className={`info ${isSignIn ? "not-active": ""}`}>
                        <p>Already have an account?</p>
                        <button className="login-button" onClick={changeSignToReg}>Sign in</button>
                    </div>
                </div> 
                
                {/* <div className="side">
                    <form className={`form ${isSignIn ? "not-active": ""}`}>
                        <label htmlFor="email">Email</label>
                        <input id="email" name="email" type="text"/>
                        <label htmlFor="password">Password</label>
                        <input id="password" name="password" type="text" />
                        <button className="login-button" type="Submit">Sign up</button>
                    </form>:
                    <div className={`info ${isSignIn ? "" :"not-active"}`}>
                        <p>Don't have an account?</p>
                        <button className="login-button" onClick={changeSignToReg}>Sign up</button>
                    </div>
                </div> */}
            </div>
            
        </>
    )
    
}