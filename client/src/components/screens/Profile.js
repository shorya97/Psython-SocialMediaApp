import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'

export default function Profile() {
    const [pics,setPics] = useState([])
    const [image,setImage] = useState("")
    const {state,dispatch} = useContext(UserContext)
    useEffect(()=>{
        fetch('/myposts',{
            headers:{
                "Authorization":" Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
            .then(result=>{
                setPics(result.mypost)
            })
    },[])

    useEffect(()=>{
        if(image){
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
            fetch('/updatepic',{
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    pic:data.url
                })
            }).then(res=>res.json())
            .then(result=>{
                console.log(result)
                localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                dispatch({type:"UPDATEPIC",payload:result.pic})
            })
            
        }).catch(err=>{
            console.log(err)
        })
        }
    },[image])

    //Update Profile Picture
    const updateDp = (file) =>{
        setImage(file)
    }

    return (
        <div style={{maxWidth:"670px", margin:"0px auto"}}>
            <div style={{
                
                margin:"18px 0px",
                borderBottom:"1px solid grey"

            }}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                

            }}>
                <div >
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                        src={state?state.pic:"loading..."}/>
                    
                </div>
                <div>
                    <h4>{state?state.name:"loading"}</h4>
                    <h6>{state?state.email:"loading"}</h6>
                    <div style={{
                        display:"flex",
                        justifyContent:"space-around",
                        width:"108%"
                    }}>
                        <h5>{pics.length} posts</h5>
                        <h5>{state?state.followers.length:"0"} followers</h5>
                        <h5>{state?state.following.length:"0"} following</h5>
                    </div>
                </div>
            </div>
            <div className="file-field input-field" style={{margin:"10px"}}>
                    <div className="btn #ffb74d orange lighten-1">
                        <span>Upload Picture</span>
                        <input type="file"
                            onChange={(e)=>updateDp(e.target.files[0])}/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate " type="text"/>
                    </div>
                    </div>
            </div>
            <div className="gallery">
                {
                    pics.map(item=>{
                        return(
                            <img className="item"key={item._id} src={item.photo} alt={item.title}/>
                        )
                    })
                }
            </div>
        </div>
    )
}
