import React,{useEffect,useState} from "react";
import jwt from 'jsonwebtoken';
import { useHistory } from "react-router-dom";
import Header from "./Header";

const Vendor=()=>{
    const history = useHistory();

    const[name,setName]=useState('');
    const[phone,setPhone]=useState('');
    const[fooditem,setFooditem]=useState('');
    const[payment,setPayment]=useState('');

    const logout=()=>{
        window.localStorage.clear();
        window.location.href='/login'
    }

    async function addVendor(event){
        event.preventDefault();

        const response = await fetch('http://localhost:1337/api/vendor',{
            method: 'POST',
            headers: {
                'Content-type':'application/json'
            },
            body: JSON.stringify({
                name,
                phone,
                fooditem,
                payment,
                
            }),
        })
        const data=await response.json();
        if(data.status=='ok'){
            alert('Vendor Added')
            history.push('/staffdashboard');
        } 
    }
    return(
        <div>
            <h1>Add Vendor Data</h1>
            <form onSubmit={addVendor}>
                <label>Name:</label>
                <input value={name} onChange={(e)=>setName(e.target.value)} type="text"></input>
                <label>Phone:</label>
                <input value={phone} onChange={(e)=>setPhone(e.target.value)} type="number"></input>
                <label>FoodItem:</label>
                <input value={fooditem} onChange={(e)=>setFooditem(e.target.value)} type="text"></input>
                <div></div>
                <label>Payment:</label>
                <input value={payment} onChange={(e)=>setPayment(e.target.value)} type="number"></input>
                <div>
                </div>
                <button>Add</button>
            </form>

            <button onClick={logout}>Logout</button>
        </div>
    )
} 
export default Vendor;