import React,{useState,useContext,} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import M from 'materialize-css'


export default function Signin() {
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    const [password,setPassword] =  useState("")
    const [email,setEmail] =  useState("")

    //Signin-Action
    const PostData = () =>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
             return M.toast({html: "Invalid email", classes: '#e65100 orange darken-4'})
        }
        fetch("/signin",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                password,
                email
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.error){
                M.toast({html: data.error, classes: '#e65100 orange darken-4'})
            }
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                M.toast({html:"Logged in", classes: '#9ccc65 light-green lighten-1'})
                history.push('/')
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    return (
        <div className="login-box">
            <div className="card hoverable auth-card input-field">
                    <h2>Psython</h2>
                    <input
                        type="text"
                        placeholder="email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        />
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        />
                    <button className="btn waves-effect waves-light #ffb74d orange lighten"
                            onClick={()=>PostData()}
                            >
                        Login
                    </button>
                    <h5>
                        <Link to="/signup">Don't have an account?</Link>
                    </h5>
            </div>
        </div>
        
    )
}
