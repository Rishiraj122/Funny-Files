import React, { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'
import Header from '../components/Header.js'

const StaffDashboard = () =>{
    const history = useHistory();//history instance a react hook

    const [foodid,setfoodid]=useState('');
    const [vegfood,setVegfood]=useState('');
    const [nonvegfood,setNonvegfood]=useState('');

    const logout=()=>{
        window.localStorage.clear();//to clear the localstorage of the user, so when 
        //a user logsout it's login local storage is cleared
        window.location.href='/login'
    }

    const vendor=()=>{
        window.location.href='/vendordisplay'
    }

    const roomClean=()=>{
        window.location.href='/roomclean'
    }

    const messBill=()=>{
        window.location.href='/messbill'
    }

    async function publishFood(event){
        event.preventDefault();

        const response = await fetch('http://localhost:1337/api/foodtoday',{
            method: 'POST',
            headers:{
                'Content-type':'application/json'
            },
            body: JSON.stringify({
                foodid,
                vegfood,
                nonvegfood
            }),
        })

        const data = await response.json();
        if(data.status=='ok'){
            alert("Food Published")
            history.push('/staffdashboard');
        }

    }
    

    useEffect(() => { //useEffect react hook to tell React that 
        //components need to do something on render
        const token = localStorage.getItem('token');
        if(!token) {
            const user = jwt.decode(token) // for authentication
            history.push('/login'); //if authentication fails load the login page
        }
      })

    return (
        <div>
            <Header/>
            <h1>Staff Dashboard</h1>
            <form onSubmit={publishFood}>
                <label>Enter Today's Menu: </label>
                <input value={vegfood}
					onChange={(e) => setVegfood(e.target.value)} placeholder='Veg' name='vegfood'></input>
                <input value={nonvegfood}
					onChange={(e) => setNonvegfood(e.target.value)} placeholder='non-veg' name='nonvegfood'></input>
                <button>Send</button>
            </form>
            <button onClick={vendor}>Vendor Details</button>
            <button onClick={roomClean}>Room Clean Requests</button>
            <button onClick={messBill}>Mess Bill</button>
            {/* <button class="btn btn-dark btn-lg" onClick={allotRoom}>Allot Room</button><br></br>
            <button class="btn btn-light btn-lg" onClick={allotmentStatus}>View Allotment Status</button><br></br>
            <button class="btn btn-dark btn-lg" onClick={uploadNotice}>Upload Notice</button><br></br>
            <button class="btn btn-light btn-lg" onClick={deleteNotice}>Delete Notice</button><br></br>  */}
            <br></br>
            <button class="btn btn-dark" onClick={logout}>Logout</button>
        </div>
    )
}

export default StaffDashboard