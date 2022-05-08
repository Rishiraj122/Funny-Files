import React,{useEffect, useState} from "react";
import { useHistory } from "react-router-dom";
import Header from './Header'

const BillForAll=()=>{
    const history = useHistory()

    const [hostelbill,setHostelbill]=useState('');

    async function addHostel(event){
        event.preventDefault();

        const response = await fetch('http://localhost:1337/api/billforall',{
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                hostelbill,
            })
        })

        const data = await response.json()

        if(data.status=='ok'){
            alert("Bill Added");
            window.location.href="/wardendashboard"
        }

    }

    const goBack=()=>{
        window.location.href="/wardendashboard"
    }


    return(
        <div>
            <h1>Hostel Bill</h1>
            <form onSubmit={addHostel}>
                <div></div>
                <label>Common Bill For All </label>
                <input type="number" placeholder="Amount" value={hostelbill} onChange={(e)=>setHostelbill(e.target.value)}></input>
                <div></div>
                <button>Add Amount</button>
            </form>
            <button onClick={goBack}>Go Back</button>
        </div>
    )
}

export default BillForAll;