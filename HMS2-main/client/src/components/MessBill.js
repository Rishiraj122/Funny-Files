import React,{useEffect, useState} from "react";
import { useHistory } from "react-router-dom";
import Header from './Header'

const MessBill=()=>{
    const history = useHistory()

    const [messbill,setMessbill]=useState('');
    const [roll,setRoll]=useState('');

    async function addMess(event){
        event.preventDefault();

        const response = await fetch('http://localhost:1337/api/messbill',{
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                messbill,
                roll
            })
        })

        const data = await response.json()

        if(data.status=='ok'){
            alert("Bill Added");
            window.location.href="messbill"
        }

    }

    const goBack=()=>{
        window.location.href="/staffdashboard"
    }


    return(
        <div>
            <h1>Mess Bill</h1>
            <form onSubmit={addMess}>
                <label>Student Roll No:</label>
                <input type="number" placeholder="Roll No." value={roll} onChange={(e)=>setRoll(e.target.value)}></input>
                <div></div>
                <label>Food: </label>
                <input type="radio" name="food" value={messbill} onClick={(e)=>setMessbill(150)}></input>Veg
                <input type="radio" name="food" value={messbill} onClick={(e)=>setMessbill(200)}></input>Non-Veg
                <button>Add Amount</button>
            </form>
            <button onClick={goBack}>Go Back</button>
        </div>
    )
}

export default MessBill;