import React,{useState,useContext,} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'


export default function Reset() {

    const history = useHistory()
    const [email,setEmail] =  useState("")

    //Signin-Action
    const PostData = () =>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
             return M.toast({html: "Invalid email", classes: '#e65100 orange darken-4'})
        }
        fetch("/reset-password",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error, classes: '#e65100 orange darken-4'})
            }
            else{
                M.toast({html:data.message, classes: '#9ccc65 light-green lighten-1'})
                history.push('/signin')
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
                    <button className="btn waves-effect waves-light #ffb74d orange lighten"
                            onClick={()=>PostData()}
                            >
                        Reset password
                    </button>
            </div>
        </div>
        
    )
}
