import React,{useEffect, useState} from "react";
import jwt from 'jsonwebtoken'
import { useHistory } from "react-router-dom";
import Header from "./Header";
import Vendor from "./Vendor";

const item=[];

export default class Fetch extends React.Component{

    state={
        loading: true,
        person: null,
    }

    async componentDidMount(){
        const url="http://localhost:1337/api/vendor";
        const response = await fetch(url);
        const data = await response.json();
        for(let i=data.user.length-1;i>=-1;i--){
            this.setState({person: data, loading: false})
            item.push(data.user[i]);
            console.log(data.user[0])
        }

    }

    render(){
        return <div>
            <Header />
            <center><h1>Past Purchase</h1></center>
            <div >{item.map(i => 
            <div>
                <h6><strong>{i.date}</strong></h6>
                <p>Vendor Name: {i.name}</p>
                <p >Items Bought: {i.fooditem}</p>
                <p>Amount Paid: ₹<i>{i.payment}</i></p>
            </div>

            )}</div>
            <Vendor />
        </div>
    }
}