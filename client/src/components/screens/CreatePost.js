import React,{useState,useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import M from 'materialize-css'


export default function CreatePost() {
    const history = useHistory()
    const [title,setTitle] = useState("")
    const [body,setBody] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")

    //Api call to upload image
    useEffect(()=>{
        if(url){
            fetch("/createpost",{
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    body,
                    picture:url
    
                })
            }).then(res=>res.json())
            .then(data=>{
                if(data.error){
                    M.toast({html: data.error, classes: '#e65100 orange darken-4'})
                }
                else{   
                    M.toast({html:"Uploaded successfully", classes: '#9ccc65 light-green lighten-1'})
                    history.push('/')
                }
            }).catch(err=>{
                console.log(err)
            })
        }
        
    },[url])

    //CreatePost-Action
    const PostDetails = ()=>{
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


    return (
        <div className="card input-field" style={{
            margin:"10px auto",
            maxWidth: "500px",
            padding: "20px",
            textAlign: "center"
        }}>
            <input type="text" 
                placeholder="title"
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
                />
            <input type="text" 
                placeholder="body"
                value={body}
                onChange={(e)=>setBody(e.target.value)}
                />
            <div className="file-field input-field">
                <div className="btn #ffb74d orange lighten-1">
                    <span>Upload Image</span>
                    <input type="file"
                        onChange={(e)=>setImage(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate " type="text"/>
                </div>
            </div>
            <button className="btn waves-effect waves-light #ffb74d orange lighten-1"
                    onClick={()=>PostDetails()}>
                Post
            </button>
            
            
        </div>
    )
}
