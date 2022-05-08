//This is JUST TO SAVE FILES OF ROOM ALLOTMENT

import React from "react";
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import Header from './Header.js'
import RoomStatus from './RoomStatus'


//name phone address roll registration email password
function RoomAllotment() {
	const history = useHistory()
 //the first value is current state and second value is function used to update our state
	const [roll, setRoll] = useState('')
    const [room, setRoom] = useState('')
	const [block, setBlock] = useState('')
	const item=[];

	// async function checkStudents(event){
	// 	const response2 = await fetch('http://localhost:1337/api/studentdetails')
    //     const data = await response2.json();
	// 	const count=0;
    //     for(let i=data.user.length-1;i>=-1;i--){
    //        if(data.user[i].block==block){
	// 			count++;
	// 	   }
    //     }
	// 	for(let i=0;i<10;i=i+1){
	// 		if(4*i>=count){
	// 			room=4*i;
	// 			setRoom(room);
	// 		}
	// 		i=11;
	// 		registerUser(event);
	// 	}
	// }


	async function registerUser(event) {
		event.preventDefault()

		// const response2 = await fetch('http://localhost:1337/api/studentlogin');
		// const dataSize = await response2.json();

		// console.log(dataSize.user.length);
		// alert(dataSize.user.length);

		const response = await fetch('http://localhost:1337/api/allotroom', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
                roll,
				room,
				block
			}),
		})

		const data = await response.json()

		if (data.status === 'ok') {
			window.location.reload() // if registration is successfull 
		}
	}
	

	return (
		<div>
		<Header/>
			<h1>Room Allotment</h1>
			<RoomStatus></RoomStatus>
			<form onSubmit={registerUser}>
                <input
					value={roll}
					onChange={(e) => setRoll(e.target.value)}
					type="number"
					placeholder="Roll Number"
					class="input-control" 
				/>
				<br />
                <input
					value={room}
					onChange={(e) => setRoom(e.target.value)}
					type="number"
					placeholder="Room"
					class="input-control" 
				/>
				<br />
				<input
					value={block}
					onChange={(e) => setBlock(e.target.value)}
					type="text"
					placeholder="Block"
					class="input-control" 
				/>
				<br />
				<input class="input-control btn btn-dark" type="submit" value="Allot"/>
			</form>
		</div>
	)
}

export default RoomAllotment
