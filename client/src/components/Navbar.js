/* eslint-disable jsx-a11y/anchor-is-valid */
import React,{useContext,useRef,useEffect,useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'

const Navbar = () => {
    const searchModal = useRef(null)
    const [search,setSearch] = useState('')
    const [userDetails,setUserDetails] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    useEffect(()=>{
        M.Modal.init(searchModal.current)
    },[])

    //Render list for a user
    const renderList = () =>{
        if(state){
            return[
                <li key="1"><i className="material-icons modal-trigger" data-target="modal1" style={{color:'black'}}>search</i></li>,
                <li key="2"><Link to="/profile">Profile</Link></li>,
                <li key="3"><Link to="/create">Create Post</Link></li>,
                <li key="4"><Link to="/myfollowingpost">Private Posts</Link></li>,
                <li key="5" style={{paddingRight:"8px",paddingTop: "4px",paddingBottom: "4px",margin: "-3px 5px 0px 11px"}}>
                    <button className="btn waves-effect waves-light #ffb74d orange lighten"
                            onClick={()=>{
                                localStorage.clear()
                                dispatch({type:"CLEAR"})
                                history.push('/signin')
                            }}
                            >
                        Logout
                    </button>
                </li>
            ]
        }else{
            return [
                <li key="6"><Link to="/signin">Signin</Link></li>,
                <li key="7"><Link to="/signup">SignUp</Link></li>
            ]
        }
    }

    //Fetch users in search
    const fetchUsers = (query) =>{
        setSearch(query)
        fetch('/search-users',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                query
            })
        }).then(res=>res.json())
            .then(results=>{
                setUserDetails(results.user)
            })
    }



    return (
        <nav>
            <div className="nav-wrapper #ffb74d orange lighten-2">
                <Link to={state?"/":"/signin"} className="brand-logo ">Psython</Link>
                    <ul id="nav-mobile" className="right">
                        {renderList()}
                    </ul>
            </div>
            <div id="modal1" class="modal" ref={searchModal} style={{color:"black"}}>
                <div className="modal-content">
                    <input
                            type="text"
                            placeholder="search users"
                            value={search}
                            onChange={(e)=>fetchUsers(e.target.value)}
                            />
                    <ul className="collection">
                        {userDetails.map(item=>{
                            return <Link to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={()=>{M.Modal.getInstance(searchModal.current).close() ;setSearch('')}}>
                                <li className="collection-item">{item.name}</li></Link>
                        })}
                    </ul>
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>Close</button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar

      