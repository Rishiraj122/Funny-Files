import React from "react";
import { useHistory } from "react-router-dom";
import Header from './Header'
import axios from 'axios';

const item=[];

export default class Fetch extends React.Component{

    state={
        loading: true,
        person: null,
    }

    async componentDidMount(){
        const url="http://localhost:1337/api/clean";
        const response = await fetch(url);
        const data = await response.json();
        for(let i=0;i<data.user.length;i=i+1){
            this.setState({person: data, loading: false})
            item.push(data.user[i]);
            console.log(data.user[0]);
        }
    }

    async delete(value){
        const room={room: value}
        const response = await axios.post('http://localhost:1337/api/deleteclean',room);
        window.location.reload(false);
    }

    goBack(){
        window.location.href="/staffdashboard"
    }

    render(){
        return(
            <div>
                <h1>Room Clean Requests</h1>
                <div>
                    {item.map(i=>
                    <div>
                         <p><strong>Room:</strong> {i.room}, <strong>Message:</strong> {i.clean}</p> 
                         <button onClick={()=>this.delete(i.room)}>Room Cleaned</button>
                    </div>   
                    )}
                </div>
                <button onClick={()=>this.goBack()}>Go Back</button>
            </div>
        )
    }

}

    // async handleClick(value){
        // try{
        //     const response=await axios.post('/deleteclean',{room});
        //     console.log(response);
        // } catch(err){
        //     console.log(err);
        // }
        // alert(room)
        // const room = {room:value};
        // alert(room);
        // const response = await axios.post('http://localhost:1337/deleteclean',room);
        // window.location.reload(false);


        // let url = "http://localhost:1337/api/delete";
        // let room = value;

        // fetch(url,{
        //     method:'POST',
        //     headers: {
        //         "Content-type": "application/json; charset=UTF-8"
        //     },
        //     body:JSON.stringify(room)
        // }).then((result)=>{
        //     result.json().then((res)=>{
        //         console.warn('res',res)
        //     })
        // })

    // }