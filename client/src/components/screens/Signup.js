import React,{useState,useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';

export default function Signup() {
    const history = useHistory()
    const [name,setName] =  useState("")
    const [password,setPassword] =  useState("")
    const [email,setEmail] =  useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState(undefined)

    useEffect(()=>{
        if(url){
            uploadFields()
        }
    },[url])

    //Upload DP
    const uploadDp = () =>{
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","psython")
        data.append("cloud_name","socialmedia-app")

        //Api call to the cloud service
        fetch("https://api.cloudinary.com/v1_1/socialmedia-app/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            setUrl(data.url)
        }).catch(err=>{
            console.log(err)
        })
    }

    //Upload Fields
    const uploadFields = ()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            return M.toast({html: "Invalid email", classes: '#e65100 orange darken-4'})
       }
       fetch("/signup",{
           method:"POST",
           headers:{
               "Content-Type":"application/json"
           },
           body: JSON.stringify({
               name,
               password,
               email,
               pic:url
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

    //Signup-Action
    const PostData = () =>{
        if(image){
            uploadDp()
        }else{
            uploadFields()
        }
    }

    
    return (
        <div className="signup-box">
            <div className="card hoverable auth-card input-field">
                    <h2>Psython</h2>
                    <input 
                        type="text"
                        placeholder="username"
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                        />
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
                    <div className="file-field input-field">
                        <div className="btn #ffb74d orange lighten-1">
                            <span>Upload Display Picture</span>
                            <input type="file"
                                onChange={(e)=>setImage(e.target.files[0])}/>
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate " type="text"/>
                        </div>
                    </div>
                    <button className="btn waves-effect waves-light #ffb74d orange lighten"
                            onClick={()=>PostData()}
                            >
                        Signup
                    </button>
                    <h5>
                        <Link to="/signin">Already have an account?</Link>
                    </h5>
            </div>
        </div>
    )
}
