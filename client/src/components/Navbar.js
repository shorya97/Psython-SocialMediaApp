/* eslint-disable jsx-a11y/anchor-is-valid */
import React,{useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../App'

const Navbar = () => {
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    const renderList = () =>{
        if(state){
            return[
                <li><Link to="/profile">Profile</Link></li>,
                <li><Link to="/create">Create Post</Link></li>,
                <li><Link to="/myfollowingpost">Private Posts</Link></li>,
                <li style={{paddingRight:"8px"}}>
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
                <li><Link to="/signin">Signin</Link></li>,
                <li><Link to="/signup">SignUp</Link></li>
            ]
        }
    }
    return (
        <nav>
            <div className="nav-wrapper #ffb74d orange lighten-2">
                <Link to={state?"/":"/signin"} className="brand-logo ">Psython</Link>
                    <ul id="nav-mobile" className="right">
                        {renderList()}
                    </ul>
            </div>
        </nav>
    )
}

export default Navbar

      