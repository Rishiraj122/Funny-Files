const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/user.model')
const Notice=require('./models/notice.model')
const Student = require('./models/student.model')
const Room = require('./models/room.model');
const Mess = require('./models/mess.model');
const Vendor = require('./models/vendor.model');
const Clean = require('./models/clean.model');
const Payment = require('./models/payment.model');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs') //a hashing mechanism
const { db } = require('./models/notice.model')
let alert = require('alert');
const crypto = require("crypto");
var Razorpay = require('razorpay');
const shortid = require("shortid");


app.use(cors())
app.use(express.json())

var bodyParser = require('body-parser');
const { response } = require('express');

let date = new Date()
let day = date.getDate();
let month = date.getMonth()+1;
let year = date.getFullYear();
let hour = date.getHours();
let minute = date.getMinutes();

let today = `DATE: ${day}/${month}/${year} TIME: ${hour}:${minute}`;

app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses

mongoose.connect('mongodb+srv://hello:hello@cluster0.klx12.mongodb.net/hello?retryWrites=true&w=majority')

//To add staffs
app.post('/api/register', async (req, res) => {
	console.log(req.body)
	try {
		const newPassword = await bcrypt.hash(req.body.password, 10)
		await User.create({
			name: req.body.name,
			email: req.body.email,
			password: newPassword,
		})
		res.json({ status: 'ok' })
	} catch (err) {
		res.json({ status: 'error', error: 'Duplicate email' })
	}
})
//To register students, add students
app.post('/api/studentregister', async(req,res) =>{
	console.log(req.body)
	try{
		const newPassword = await bcrypt.hash(req.body.password, 10)
		const sid = crypto.randomBytes(7).toString("hex");
		gender=req.body.gender;
		gender=gender.toLowerCase();
		await Student.create({
			name: req.body.name,
			gender: gender,
			phone: req.body.phone,
			address: req.body.address,
			roll: req.body.roll,
			registration: req.body.registration,
			email: req.body.email,
			password: newPassword,
			sid:sid
		})
		res.json({status:'ok'})
	} catch(err){
		res.json({status:'error', error: 'Duplicate email'})
	}
})

//To fetch student details

app.get('/api/studentlogin', async(req,res) =>{
	try{
		const user=await Student.find({})
		console.warn(user)
		return res.json({user})
	}
	catch(error){
		console.log({status:'error', error:'failed again'})
	}
})

// To allot rooms to the students
//This will update the existing Student table
//and set their room.no and block.no
app.post('/api/allotroom', async(req,res) =>{
	try{
		await Student.updateOne({
			roll: req.body.roll
		},
		{
			$set:{room: req.body.room,
				block: req.body.block,
				rid: req.body.room+req.body.block,
			},
		})
		res.json({status: 'ok'})
	} catch(error){
		console.log(error)
		res.json({status: 'error', error: err})
	}
})

app.get('/api/mybill',async(req,res)=>{
	try{
		const user = await Payment.find({})
		console.warn(user);
		return res.json({user})
	} catch(error){
		console.log({status:'error',error:'Couldnt fetch student'});

	}
})

app.post('/api/billforall',async(req,res)=>{
	const {hostelbill}=req.body;
	try{
		await Payment.updateMany({},{
			$inc:{
				hostelbill
			}
		}) 
		res.json({status:'ok'})
	} catch(err){
		console.log({status:'error',error:'couldnt update for all'})
	}
})

app.post('/api/hostelbill',async(req,res)=>{
	const {roll,hostelbill}=req.body;
	try{
		const paymentchecker=await Payment.findOne({roll:roll});
		if(paymentchecker==null){
			await Payment.create({//This Works when the student is allotted a room
				roll,
				hostelbill
			})
		} else{
			await Payment.updateOne({//When the student is already allotted a room
				roll
			},{
				$inc:{//We are just adding (increasing) the amount wrt prior hostelbill
					hostelbill
				}
			})
		}
		res.json({status:'ok'})
	} catch(err){
		console.log(err);
		res.json({status:'error',error:'Couldnt create hostel bill'})
	}
})

app.post('/api/billpayed',async(req,res)=>{
	const {roll,roomFee}=req.body;
	try{
		const paymentchecker=await Payment.findOne({roll:roll});
		if(paymentchecker==null){
			await Payment.create({//This Works when the student is allotted a room
				roll,
				roomFee
			})
		} else{
			await Payment.updateOne({//When the student is already allotted a room
				roll
			},{
				$inc:{//We are just adding (increasing) the amount wrt prior hostelbill
					hostelbill:-roomFee
				}
			})
		}
		res.json({status:'ok'})
	} catch(err){
		console.log(err);
		res.json({status:'error',error:'Couldnt create hostel bill'})
	}
})

app.post('/api/paymessbill',async(req,res)=>{
	const {roll,messFee} = req.body;
	try{
		await Payment.updateOne({
			roll: roll
		},
		{
			$inc:{
				messbill:-messFee
			}
		})
		res.json({status:'ok'})
	} catch(err){
		console.log(err)
		res.json({status:'error',error:'Couldnt update the mess bill'})
	}
})


//This comes into play when everyday the mess staff adds amount to 
//To the student mess bill
app.post('/api/messbill',async(req,res)=>{
	try{
		await Payment.updateOne({
			roll: req.body.roll
		},
		{
			$inc:{
				messbill:req.body.messbill
			}
		})
		res.json({status:'ok'})
	} catch(err){
		console.log(err)
		res.json({status:'error',error:'Couldnt update the mess bill'})
	}
})

//To publish / add notices to the database
app.post('/api/notice', async(req,res) =>{

	try {
		await Notice.create({

			name: req.body.name ,
			notice: req.body.notice ,
			noticetitle: req.body.noticetitle,
			date: today,
			nid: Math.random(),
		})
		res.json({ status: 'ok' })
	} catch (err) {
		console.log(err)
		res.json({ status: 'error', error: err })
	}
})

//Room Cleaning

app.post('/api/deleteclean',async(req,res)=>{
	const {room}=req.body;
	console.log(req.body);
	try{
		await Clean.deleteMany({room})

		res.json({status:'ok'})
	} catch(err){
		res.json({status:'error',error:'room no not found'})
	}
})

app.post('/api/clean',async(req,res)=>{
	const {room,clean}=req.body;
	console.log(req.body);
	try{
		await Clean.create({room:room},{
			room,
			clean
		})
		res.json({status:'ok'})
	} catch(err){
		res.json({status:'error',error:'Room Cleaning Error'})
	}
})
//This will fetch if a room cleaning issue has been raised or not 
//by a particular room (based on room no)
app.get('/api/clean',async(req,res)=>{
	const {room} = req.body;
	try{
		const user = await Clean.find({})
		console.warn(user)
		return res.json({user})
	} catch(error){
		console.log({status:'ok',error:'Room Cleaning Status'})
	}
})

//Food Information ( Today's Menu )

app.get('/api/foodtoday',async(req,res)=>{
	try{
		const user = await Mess.find({})
		console.warn(user)
		return res.json({user})
	}
	catch(err){
		console.log({status:'error',error:'failed in fetching todays food'});
	}
})

app.post('/api/foodtoday', async(req,res)=>{
	console.log(req.body);
	try{
		await Mess.deleteMany({});
		await Mess.create({
			foodid:0,
			vegfood:req.body.vegfood,
			nonvegfood:req.body.nonvegfood,
		})
		res.json({status: 'ok'})
	} catch(err){
		res.json({status:'error', error:'Invalid Input'})
	}
})

//Vendor Details

app.get('/api/vendor',async(req,res)=>{
	try{
		const user = await Vendor.find({});
		console.warn(user)
		return res.json({user})
	}
	catch(err){
		console.log({status:'ok',error:'failed in fetching vendor details'})
	}
})

app.post('/api/vendor',async(req,res)=>{
	const{name,phone,fooditem,payment}=req.body;
	console.log(req.body);
	try{
		await Vendor.create({
			name,
			phone,
			fooditem,
			payment,
			date:today
		})
		res.json({status:'ok'})
	} catch(err){
		res.json({status:'error',error:'Invalid Input'})
	}
})





//To fetch / display notices from the database
app.get('/api/notice',async (req,res)=>{
	try{
		const user = await Notice.find({})
		console.warn(user)
		return res.json({user})
	}
	catch(error){
		console.log({status:'error', error:'failed again'})
	}
})

//To delete a notice
app.post('/api/noticedelete', async(req,res) =>{
	try {
		await Notice.deleteOne({
			nid: req.body.nid,
		})
		res.json({ status: 'ok' })
	} catch (err) {
		console.log(err)
		res.json({ status: 'error', error: err })
	}
})

app.post('/api/studentdelete', async(req,res)=>{
	try{
		await Student.deleteOne({
			roll: req.body.roll,
		})
		res.json({status: 'ok'})
	} catch(err) {
		console.log(err)
		res.json({status: 'error', error:err})
	}
})

app.post('/api/roomdeallocate',async(req,res)=>{
	try{
		await Room.updateOne({
			rid: req.body.rid,
		},
		{
			$set:{room:req.body.room},
			$set:{block:req.body.block},
			$inc:{occupancy: -1}
		}).exec();
		res.json({status: 'ok'})
		console.log(req.body.room);
	} catch(error){
		console.log(error)
		res.json({status: 'error', error: err})
	}
})

app.post('/api/room',async(req,res) => {
	try{
		await Room.updateOne({
			room: req.body.room,
			block: req.body.block
		},
		{
			$set:{"room":req.body.room},
			$set:{"block":req.body.block},
			$set:{"rid":req.body.room+req.body.block},
			$inc:{"occupancy": 1},
		})
		res.json({status: 'ok'})
	} catch(error){
		console.log(error)
		res.json({status: 'error', error: err})
	}
})


//This comes into play when a student tries to log in. It checks if the student exists
// in the database or not. It verifies the password.
app.post('/api/studentlogin', async(req,res) =>{
	const user=await Student.findOne({
		email: req.body.email
	})
	if(!user){
		alert("User not found")
		return {status: 'error', error: 'Invalid login'}
	}
	const isPasswordValid = await bcrypt.compare(
		req.body.password,
		user.password
	)

	if(isPasswordValid){
		const token=jwt.sign(
			{
				name: user.name,
				email: user.email,
				rid: user.rid,
				roll: user.roll
			},
			'secret123'
		)

		return res.json({status: 'ok', user: token})
	} else{
		alert("Incorrect Password")
		return res.json({status: 'error', user: false})
	}
})

app.post('/api/register', async (req, res) => {
	console.log(req.body)
	try {
		const newPassword = await bcrypt.hash(req.body.password, 10)
		await User.create({
			name: req.body.name,
			email: req.body.email,
			password: newPassword,
		})
		res.json({ status: 'ok' })
	} catch (err) {
		res.json({ status: 'error', error: 'Duplicate email' })
	}
})

//This comes into play when a staff tries to log in. It checks if the staff exists in
//the database or not. It verifies the password.
app.post('/api/login', async (req, res) => {
	const user = await User.findOne({
		email: req.body.email,
	})

	if (!user) {
		return { status: 'error', error: 'Invalid login' }
	}

	const isPasswordValid = await bcrypt.compare(
		req.body.password,
		user.password
	)

	if (isPasswordValid) {
		const token = jwt.sign(
			{
				name: user.name,
				email: user.email,
			},
			'secret123'
		)

		return res.json({ status: 'ok', user: token })
	} else {
		return res.json({ status: 'error', user: false })
	}
})

app.get('/api/room',async (req,res)=>{
	try{
		const user = await Room.find({})
		console.warn(user)
		return res.json({user})
	}
	catch(error){
		console.log({status:'error', error:'failed again'})
	}
})


//Update Room Details.... 

//For Order ( Using Razorpay )





var razorpay = new Razorpay({
	key_id: 'rzp_test_6KNadjemKxdEIh',
	key_secret: 'mJIQwWGDww2Rhhd8JOxYJpih',
  });
  
  app.post("/api/verification", (req, res) => {
	const secret = "razorpaysecret";
  
	console.log(req.body);
  
	const shasum = crypto.createHmac("sha256", secret);
	shasum.update(JSON.stringify(req.body));
	const digest = shasum.digest("hex");
  
	console.log(digest, req.headers["x-razorpay-signature"]);
  
	if (digest === req.headers["x-razorpay-signature"]) {
	  console.log("request is legit");
	  res.status(200).json({
		message: "OK",
	  });
	} else {
	  res.status(403).json({ message: "Invalid" });
	}
  });
  
  app.post("/api/razorpay", async (req, res) => {
	const payment_capture = 1;
	const amount = req.body.amount;
	const currency = "INR";
  
	const options = {
	  amount,
	  currency,
	  receipt: shortid.generate(),
	  payment_capture,
	};
  
	try {
	  const response = await razorpay.orders.create(options);
	  console.log(response.amount);
	  res.status(200).json({
		currency: response.currency,
		amount: response.amount,
	  });
	} catch (err) {
	  console.log(err);
	}
  });
























//Hosted in port: 3000, apis in 1337.
app.listen(process.env.PORT||1337, () => {
	console.log('Server started')
})




// app.get('api/notice', function(req, res) {
//     Notice.findByIdAndRemove(req.params.nid, (err, doc) => {
//         if (!err) {
//             res.send("Done");
//         } else {
//             console.log('Failed to Delete user Details: ' + err);
//         }
//     });
// })

//---------------------------------------------------

// app.get('/api/noticedelete',async(req,res)=>{
// 	nid=req.body.nid
// 	res.send(nid)
// 	try{
// 		await Notice.deleteOne({
// 			"nid": nid
// 		})
// 		res.send(nid);
// 		console.log(nid);
// 	}
// 	catch(err){
// 		res.send("err")
// 	}
// })

//--------------------------------------------------------

// app.get('/api/noticedelete/', function(req, res){
// 	Notice.deleteOne({nid: req.params.nid}, 
// 	function(err){
// 		if(err){
// 			res.json(err);
// 		}
// 		else 
// 			res.send(req.params.nid);
// 	});
// });
