import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'

export default function Home() {
    const [data,setData] = useState([])
    const {state,dispatch} = useContext(UserContext)
    useEffect(()=>{
        fetch('/allposts',{
            headers:{
                "Authorization":" Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
            .then(result=>{
                setData(result.posts)
            })
    },[])

    //Like by a user
    const likePost = (id) =>{
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":" Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData= data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    //Unlike by a user
    const unlikePost = (id) =>{
        fetch('/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":" Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData= data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    //Comment by a user
    const makeComment = (text,postId) =>{
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":" Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text
            })

        }).then(res=>res.json())
        .then(result=>{
            const newData= data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    //Delete a post
    const deletePost = (postId) =>{
        fetch(`/deletepost/${postId}`,{
            method:"delete",
            headers:{
                "Authorization":" Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.filter(item=>{
                return item._id !==result._id
            })
            setData(newData)
        })
    }

    return (
        <div className="home">
            {
                data.map(item=>{
                    return (
                        <div className="card home-card" key={item._id}>
                            <h5 style={{padding:"5px"}}><img src={item.uploadedBy.pic} alt="" style={{width:"40px" ,height: "40px",borderRadius: "80px"}}/>  <Link to={item.uploadedBy._id !== state._id ? "/profile/"+item.uploadedBy._id : "/profile"} 
                            style={{ position: "relative" ,bottom: "9px" }}>{item.uploadedBy.name}</Link> {item.uploadedBy._id == state._id 
                            && <i className="material-icons" style={{float:"right"}} onClick={()=>deletePost(item._id)}>delete</i>
                            } </h5>
                            <div className="card-image">
                                <img alt="" src={item.photo}/>
                            </div>
                            <div className="card-content">
                            {item.likes.includes(state._id)
                                ? <i className="material-icons" onClick={()=>{unlikePost(item._id)}} style={{color:"red"}}>thumb_down</i>
                                : <i className="material-icons" onClick={()=>{likePost(item._id)}} style={{color:"orange"}}>thumb_up</i>
                            }
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record=>{
                                        return(
                                            <h6 key={record._id}><img src={record.uploadedBy.pic} alt="" style={{width:"20px" ,height: "20px",borderRadius: "60px"}}/>  <Link to={record.uploadedBy._id !== state._id ? "/profile/"+record.uploadedBy._id : "/profile"}>
                                                <span style={{fontWeight:"500"}}>{record.uploadedBy.name}</span></Link>  {record.text}</h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                    makeComment(e.target[0].value,item._id)
                                }}>
                                    <input type="text" placeholder="Add a comment"></input>
                                </form>
                                
                            </div>
                        </div>
                    )
                })
            }        
        </div>
    )
}
