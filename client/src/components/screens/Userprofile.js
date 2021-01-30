import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'

export default function Userprofile() {
    const [profile,setProfile] = useState(null)
    
    const {state,dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [showfollow,setShowFollow] = useState(state?!state.following.includes(userid):true)
    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":" Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
            .then(result=>{
                setProfile(result)
            })
    },[])

    //Follow a user
    const followUser = () =>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                    }
                }
            })
            setShowFollow(false)
        })
    }


    //Unfollow a user
    const unfollowUser = () =>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item!==data._id)
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFollower
                    }
                }
            })
            setShowFollow(true)
        })
    }

    return (
        <>
        {profile ?
        
        <div style={{
            maxWidth:"670px", margin:"0px auto"
        }}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid grey"

            }}>
                <div >
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                        alt=""
                        src={profile.user.pic}
                    />
                </div>
                <div>
                    <h4>{profile.user.name}</h4>
                    <h6>{profile.user.email}</h6>
                    <div style={{
                        display:"flex",
                        justifyContent:"space-around",
                        width:"108%"
                    }}>
                        <h5>{profile.posts.length} posts</h5>
                        <h5>{profile.user.followers.length} followers</h5>
                        <h5>{profile.user.following.length} following</h5>
                    </div>
                    {
                        showfollow ?
                        <button className="btn waves-effect waves-light #ffb74d orange lighten"
                                onClick={()=>followUser()}
                                style={{
                                    margin:"10px"
                                }}
                                >
                            Follow
                        </button> :
                        <button className="btn waves-effect waves-light #ffb74d orange lighten"
                                onClick={()=>unfollowUser()}
                                style={{
                                    margin:"10px"
                                }}
                                >
                            Unfollow
                        </button>
                    }
                </div>
            </div>

            <div className="gallery">
                {
                    profile.posts.map(item=>{
                        return(
                            <img className="item"key={item._id} src={item.photo} alt={item.title}/>
                        )
                    })
                }
            </div>
        </div>

        : <h2>loading...</h2>}
        
        </>
    )
}
