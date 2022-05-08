import React, { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'
import Header from '../components/Header.js'
import noticeCSS from '../notice.module.css';


const RoomStatus = () => {
	const history = useHistory()

	const [room, setRoom]= useState([])
	const [room2, setRoom2]= useState([])
	const [occupancy, setOccupancy] = useState([])
	const [occupancy2, setOccupancy2] = useState([])
	const [block, setBlock] = useState([])
	const [block2, setBlock2] = useState([])
	
    const item=[];

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			const user = jwt.decode(token)
			if (!user) {
				localStorage.removeItem('token')
				history.replace('/studentlogin')
			} 
			apiGet();
		}
		else{
			history.push('/studentlogin')
		}
	}, [])

	const apiGet = ()=>{
		const token = localStorage.getItem('token')
		const user = jwt.decode(token) //This contains the values of logged user..
		// console.log it to view
		let flag=0;
		fetch('http://localhost:1337/api/room')
        .then((response)=>response.json())
        .then((json)=>{
            for(let i=0;i<json.user.length;i=i+1){
                if(json.user[i].occupancy<=4){//It compares the value of 
					//logged in user and the fetched data set...
					//the matched email will find the user... 
					//as no two users can have the same email
					if(flag==2){
						break;
					}
					if(json.user[i].block=='A'){
						setRoom(json.user[i].room);
						setOccupancy(json.user[i].occupancy);
						setBlock(json.user[i].block);
						flag++;
					}
					else{
						setRoom2(json.user[i].room);
						setOccupancy2(json.user[i].occupancy);
						setBlock2(json.user[i].block);
						flag++;
					}
				}
            }
		})
		return {item}
    }


	
	return (
		<div >
            <h3>Available Room</h3>
			<div>
			<h3>WING A</h3>
			<p><strong>Room No:</strong> {room}</p>
			<p><strong>Occupancy:</strong> {occupancy}</p>
			<p><strong>Block:</strong> {block}</p>
			<h3>WING B</h3>
			<p><strong>Room No:</strong> {room2}</p>
			<p><strong>Occupancy:</strong> {occupancy2}</p>
			<p><strong>Block:</strong> {block2}</p>
			</div>
		</div>
	)
}

export default RoomStatus

// import React, { useEffect } from 'react';
// import { useState } from 'react'
// import { useHistory } from 'react-router-dom'

// const item=[];

// function RoomStatus(){
//     async function roomData(){
//         const url="http://localhost:1337/api/room";
//         const response = await fetch(url);
//         const data = await response.json();
//         for(let i=data.user.length-1;i>=-1;i--){
//             item.push(data.user[i]);
//             console.log(data.user[0])
//         }
//     }
//     return(
//         <div>
//             <button onClick={roomData}>Rooms</button>
//             <h1>Wow</h1>
//             <div>{item.map(i => 
//             <div>
//                 <p><strong> Occupancy: {i.occupancy}</strong></p>
//             </div>

//             )}</div>
//         </div>
//     )
// }
// export default RoomStatus;

// // export default class Fetch extends React.Component{

// //     state={
// //         loading: true,
// //         person: null,
// //     }

// //     async componentDidMount(){
// //         const url="http://localhost:1337/api/room";
// //         const response = await fetch(url);
// //         const data = await response.json();
// //         for(let i=data.user.length-1;i>=-1;i--){
// //             this.setState({person: data, loading: false})
// //             item.push(data.user[i]);
// //             console.log(data.user[0])
// //         }

// //     }

// //     render(){
// //         return <div>
// //             <center><h1>Room Status</h1></center>
// //             <div>{item.map(i => 
// //             <div>
// //                 <p><strong> Occupancy: {i.occupancy}</strong></p>
// //             </div>

// //             )}</div>
// //         </div>
// //     }
// // }