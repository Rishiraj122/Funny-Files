import React, { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'
import Header from '../components/Header.js'
import noticeCSS from '../notice.module.css';
import MenuDisplay from '../components/MenuDisplay.js';

const StudentDashboard = () => {
	const history = useHistory()

	const notice=()=>{
		window.location.href='/noticedisplay'
	}
	const logout=()=>{
        window.localStorage.clear();
        window.location.href='/studentlogin'
    }

	const myBill=()=>{
		window.location.href="/mybill"
	}

	const [data, setData]= useState([])
	const [phone, setPhone] = useState([])
	const [email, setEmail] = useState([])
	const [address, setAddress] = useState([])
	const [roll, setRoll] = useState([])
	const [registration, setRegistration] = useState([])
	const [clean, setClean] = useState([]);
	const[room, setRoom] = useState([]);
	const[isClean, setIsClean]=useState([]);
	const [disable, setDisable] = React.useState(false);
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
		fetch('http://localhost:1337/api/studentlogin')
        .then((response)=>response.json())
        .then((json)=>{
            for(let i=0;i<json.user.length;i=i+1){
                if(user.email==json.user[i].email){//It compares the value of 
					//logged in user and the fetched data set...
					//the matched email will find the user... 
					//as no two users can have the same email
					setData(json.user[i].name);
					setPhone(json.user[i].phone);
					setEmail(json.user[i].email);
					setAddress(json.user[i].address);
					setRoll(json.user[i].roll);
					setRegistration(json.user[i].registration);
					setRoom(json.user[i].rid);
				}
            }		
			
		})

		checkRoomCleanStatus();
		
		return {item}
    }

	async function cleanRoom(event){
		event.preventDefault();

		const response = await fetch('http://localhost:1337/api/clean',{
		method: 'POST',
		headers:{
			'Content-type':'application/json',
		},
		body: JSON.stringify({
			room,
			clean:'please Clean my room'
		}),
		})
		const data = await response.json()
		if(data.status=='ok'){
			window.location.reload(false);
		}
	}
//This will check if the request for the particular room cleaning is made previously or not
	async function checkRoomCleanStatus(){
		const token = localStorage.getItem('token')
		const user = jwt.decode(token)
		
		await fetch('http://localhost:1337/api/clean')
		.then((response)=>response.json())
		.then((json)=>{
			for(let i=0;i<json.user.length;i++){
				if(user.rid==json.user[i].room){
					console.log("What is this?"+JSON.stringify(json.user[i]));
					console.log(user.rid);
					setIsClean("Request For Room Cleaning is Made");
					setDisable(true);
					break;
				} else if(room!=json.user[i].room){
					setDisable(false);
				}
			}
		})
	}

	

	
	return (
		<div >
			<Header/>
			<MenuDisplay />
			<h1>Student Dashboard</h1>
			<div class="alert alert-secondary">
				<p><strong>Name:</strong> {data}</p>
				<p><strong>Phone Number:</strong> {phone}</p>
				<p><strong>{isClean}</strong></p>
				<p><strong>E-mail:</strong> {email}</p>
				<p><strong>Address:</strong> {address}</p>
				<p><strong>Roll Number:</strong> {roll}</p>
				<p><strong>Registration Number:</strong> {registration}</p>
				<p><strong>Room:</strong>{room}</p>
			</div>
			{/* <button  onClick={() => setDisable(true)}>Clean My Room</button>	 */}
			<button class="btn btn-dark btn-lg btn-block" disabled={disable} onClick={cleanRoom}>Clean Room</button>
			<div></div>
			<div>
				<button onClick={myBill}>My Bill</button>
			</div>
			<button class="btn btn-dark btn-lg btn-block" onClick={notice}>View Notice</button><br></br>
			<br></br>
			<button class="btn btn-dark" onClick={logout}>Logout</button>
		</div>
	)
}

export default StudentDashboard
