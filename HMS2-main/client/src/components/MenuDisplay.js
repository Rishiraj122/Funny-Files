import React, { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'


const MenuDisplay=()=>{
    const history=useHistory()

    const goback=()=>{
        window.location.href='/studentdashboard'
    }

    const [vegfood,setVegfood]=useState([]);
    const [nonvegfood,setNonvegfood]=useState([]);
    const item=[];

    useEffect(()=>{
        const token = localStorage.getItem('token');
        if(token){
            const user = jwt.decode(token);
            if(!user){
                localStorage.removeItem('token');
                history.replace('/studentlogin');
            }else{
                getData();                
            }
        } else{
            history.push('/studentlogin');
        }
    })
    const getData=()=>{
        const token = localStorage.getItem('token')
        const user = jwt.decode(token);
        fetch('http://localhost:1337/api/foodtoday')
        .then((response)=>response.json())
        .then((json)=>{
            for(let i=0;i<json.user.length;i=i+1){
                setVegfood(json.user[i].vegfood);
                setNonvegfood(json.user[i].nonvegfood);
            }
        })
        return {item}
    }
    return(
        <div>
            <h4>Today's Menu:</h4>
            <p>Veg Item: {vegfood}</p>
            <p>Non Veg Item: {nonvegfood}</p>
        </div>
    )
}

export default MenuDisplay