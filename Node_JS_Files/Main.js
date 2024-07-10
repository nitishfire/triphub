const express = require("express");
const path = require("path");
const app = express();
require("./db/conndb");
const router = express.Router();


const registration = require("./db/UserRegistration.js");
const admin = require("./db/AdminCredentials.js");
const hotelregistration = require("./db/HotelRegistration.js");
const hotelpublish = require("./db/HotelPublish.js");
const booking = require("./db/UserBooking.js");

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended:false}));
const static_path = path.join(__dirname, "..")

app.use(express.static(static_path))





//To Show The Output To Html
app.set('view engine', 'ejs');
app.get('/UserProfilePage', async (req, res) => {
   await res.render('UserProfilePage', {fullname, usname, mail, phone});
  });

app.get('/HotelProfilePage', async (req, res) => {
    await res.render('HotelProfilePage', {hid, name, add, no});
});




//User All Variables For Profile Page
var fullname;
var usname;
var mail;
var phone;
var amount='';


//Hotel All Variables For Profile Page
var hid;
var name;
var add;
var no;
var hamount='';


//Hotel-Publish Variables
var hid1;
var name1;
var add1;
var phone1;
var rno;
var rtype;
var rcap;
var hppn;
var havail;

//Variables For Admin
var adminname;



//User Registration-Part
app.post("/Register", async (req, res) => {
    const fullname = req.body.fullname;
    const usrname = req.body.username;
    const mail = req.body.email;
    const phone = req.body.phone;
    const pswd = req.body.pswd;

    if(await registration.findOne({username:usrname})){
        res.end("<script>alert('This Username Already Exist Please Log-In'); window.location.assign('../LogInPage.html');</script>");
    }else{
        if(phone.length>10){
            res.end("<script>alert('Phone-No Only Contain 10 Digits!!!'); history.back();</script>");
        }else{
            if(pswd.length<8){
                res.end("<script>alert('Password Contain More Than 8 Characters/Numbers!!!'); history.back();</script>");
            }else{
                const userregisters = new registration({
                    name: fullname,
                    username: usrname,
                    email: mail,
                    phoneno: phone,
                    password: pswd,
                    amount: 50000
                })
                const registered = await userregisters.save();
                res.redirect("../LogInPage.html");
            }
        }
    }
})




















//Admin And User Log-In Part
app.post("/Login", async (req, res) => {
    const usrname = req.body.usrname;
    const pswd =  req.body.pswd;
    const admin_db_usrname = await admin.findOne({username:usrname});
    const user_db_usrname = await registration.findOne({username:usrname});

    if(await registration.findOne({username:usrname})){
            if(await registration.findOne({username:usrname})){
            if(user_db_usrname.password == pswd){
                 fullname = user_db_usrname.name;
                 usname = usrname;
                 mail = user_db_usrname.email;
                 phone = user_db_usrname.phoneno;
                res.redirect("../AfterLogInUserHomePage");
            }else{
                res.end("<script>alert('Please Enter The Password Correctly!!!'); history.back();</script>");  
            }
        }else{
            res.end("<script>alert('Please Enter The UserName Correctly!!!'); history.back();</script>");
        }
    }else{
        if(await admin.findOne({username:usrname})){
            if(admin_db_usrname.password == pswd){
                adminname=usrname;
                res.redirect("../AdminHomePage");
            }else{
                res.end("<script>alert('Please Enter The Password Correctly!!!'); history.back();</script>");  
            }
        }else{
            res.end("<script>alert('Please Enter The UserName Correctly!!!'); history.back();</script>");
        }
    }
})




















//Hotel Registration-Part
app.post("/HotelRegister", async (req, res) => {
    const id = req.body.id;
    const hname = req.body.hname;
    const adrs = req.body.adrs;
    const phone = req.body.phone;
    const pswd = req.body.pswd;

    if(await hotelregistration.findOne({hotelid:id})){
        res.end("<script>alert('This Hotel-ID Already Exist Please Log-In'); window.location.assign('../HotelLogInPage.html');</script>");
    }else{
        if(phone.length>10){
            res.end("<script>alert('Phone-No Only Contain 10 Digits!!!'); history.back();</script>");
        }else{
            if(pswd.length<8){
                res.end("<script>alert('Password Contain More Than 8 Characters/Numbers!!!'); history.back();</script>");
            }else{
                const hotelregisters = new hotelregistration({
                    hotelid: id,
                    name: hname,
                    address: adrs,
                    phoneno: phone,
                    password: pswd,
                    hamount: 0
                })
                const hotelregistered = await hotelregisters.save();

                const hotelpubreg = new hotelpublish({
                    hotelid: id,
                    name: hname,
                    address: adrs,
                    phoneno: phone,
                    roomno: 0,
                    roomtype: 0,
                    capacity: 0,
                    pricepernight: 0,
                    avail: 0
                })
                const hotelpublishregistered = await hotelpubreg.save();
                res.redirect("../HotelLogInPage.html");
            }
        }
    }
})


















//Hotel Log-In Part
app.post("/HotelLogin", async (req, res) => {
    const id = req.body.id;
    const pswd =  req.body.pswd;
    const hotel_db_hotelid = await hotelregistration.findOne({hotelid:id});
    const hotelpublish_db = await hotelpublish.find({hotelid:id});

    if(await hotelregistration.findOne({hotelid:id})){
            if(hotel_db_hotelid.password == pswd){
                hid = id;
                name = hotel_db_hotelid.name;
                add = hotel_db_hotelid.address;
                no = hotel_db_hotelid.phoneno;

                hoteldatashow();

                res.redirect("./HotelHomePage");   
            }else{
                res.end("<script>alert('Please Enter The Password Correctly!!!'); history.back();</script>");  
            }
        }else{
            res.end("<script>alert('Please Enter The UserName Correctly!!!'); history.back();</script>");
        }
    })














    

//Hotel-Publish Part
app.post("/HotelPage", async (req, res) => {
    const hid3 = req.body.id;
    const no = req.body.no;
    const type = req.body.type;
    const cap = req.body.cap;
    const ppn = req.body.ppn;
    const availability = req.body.avail;
    const hotelreg_db = await hotelregistration.findOne({hotelid:hid3});
    const hotelreg_db1 = await hotelregistration.findOne({hotelid:hid});
    const hotelpublish_db = await hotelpublish.findOne({hotelid:hid});
    
  if(await booking.findOne({name:hotelreg_db1.name, roomno:no})){
    hoteldatashow();
    res.end("<script>alert('Room-No Already Exist In Your Bookings Please Add New Room Number!!!'); window.location.assign('./HotelHomePage');</script>");
  }else{
    if(await hotelpublish.findOne({hotelid:hid, roomno:no})){
        hoteldatashow();
            res.end("<script>alert('Room-No Already Exist Please Add New Room No!!!'); window.location.assign('./HotelHomePage');</script>");
    }else{

if(await hotelregistration.findOne({hotelid:hid})){
    if(hid3==hid){
        if(no.length<3){
            const hotelpubreg = new hotelpublish({
                hotelid: hid3,
                name: hotelreg_db.name,
                address: hotelreg_db.address,
                phoneno: hotelreg_db.phoneno,
                roomno: no,
                roomtype: type,
                capacity: cap,
                pricepernight: ppn,
                avail: availability
            })
                hid1 = hid3;
                name1 = hotelreg_db.username;
                aad1= hotelreg_db.address,
                phone1= hotelreg_db.phoneno,
                rno = no;
                rtype = type;
                rcap = cap;
                hppn = ppn;
                havail = availability;

            const hotelpublishregistered = await hotelpubreg.save();   
            hoteldatashow(); 
            res.end("<script>alert('Hotel Is Published'); window.location.assign('./HotelHomePage');</script>");  
        }else{
            hoteldatashow();
            res.end("<script>alert('Room-No Should Be Less Than 3!!!'); window.location.assign('./HotelHomePage');</script>");
        }
    }
    else{
        hoteldatashow();
            res.end("<script>alert('Your Hotel-ID Doesnt Match With Our DataBase!!!'); window.location.assign('./HotelHomePage');</script>");
    }
}else{
    hoteldatashow();
    res.end("<script>alert('Your Hotel-ID Doesnt Match With Our DataBase!!!'); window.location.assign('./HotelHomePage');</script>"); 
}
    }
}
})















//Hotel-Data Show
function hoteldatashow(){
app.get('/HotelHomePage', async (req, res) => {

    const hregroom=await hotelregistration.findOne({hotelid:hid});
    if(await hotelregistration.findOne({hotelid:hid})){
        hamount=hregroom.hamount;
    }


    hotelpublish.find({hotelid:hid})
        .then((data)=>{
                if(data!=null){                
                            res.render('HotelHomePage', {data:data, hid, hamount});
                }       
    })
});
}








//User-Rooms Show
function userroomshow(){
app.get('/AfterLogInUserHomePage', async (req, res) => {

    const regroom=await registration.findOne({username:usname});
    if(await registration.findOne({username:usname})){
        amount=regroom.amount;
    }
    
    const hregroom=await hotelregistration.findOne({hotelid:hid});
    if(await hotelregistration.findOne({hotelid:hid})){
        hamount=hregroom.hamount;
    }

    hotelpublish.find()
        .then(async (data)=>{
                if(data!=null){                
                            res.render('AfterLogInUserHomePage', {data:data, fullname, amount});
                }     
    })
});
}
userroomshow();





//Room Booked Details
function userbooking(){
    app.get('/UserBookedListPage', async (req, res) => {

        const regroom=await registration.findOne({username:usname});
        if(await registration.findOne({username:usname})){
            amount=regroom.amount;
        }

        const hregroom=await hotelregistration.findOne({hotelid:hid});
        if(await hotelregistration.findOne({hotelid:hid})){
            hamount=hregroom.hamount;
        }

            booking.find({username:fullname})
            .then(async (data)=>{
                    if(data!=null){                
                                res.render('UserBookedListPage', {data:data, fullname});
                    }     
             })
  
    });
    }
    userbooking();

    






    

//Hotel Manage User Bookings
function hseeuserbooking(){
    app.get('/HotelManageUserBookings', async (req, res) => {

        const regroom=await registration.findOne({username:usname});
        if(await registration.findOne({username:usname})){
            amount=regroom.amount;
        }

        const hregroom=await hotelregistration.findOne({hotelid:hid});
        if(await hotelregistration.findOne({hotelid:hid})){
            hamount=hregroom.hamount;
        }

            booking.find({name:name})
            .then(async (data)=>{
                    if(data!=null){                
                                res.render('HotelManageUserBookings', {data:data, name});
                    }     
             })
  
    });
    }
    hseeuserbooking();


//Hotel Cancel user Bookinggs
app.post('/HotelCancelUserRoom/:username/:bookingid/:pricepernight/:phoneno/:name', async (req, res) => {
    let cancelusrname = req.params.username;
    let cancelbookid = req.params.bookingid;
    let cancelppn = req.params.pricepernight;
    let puphotel = req.params.phoneno;
    let hnameuphotel = req.params.name;

    hotelregistration.findOneAndUpdate({phoneno:puphotel, name:hnameuphotel},{
        hamount: hamount-cancelppn,
        upsert:true
    }, (err, result)=>{
        hamount=result.hamount;
        if(err){
            console.log(err);
        }
    })


    let finalam=((amount-0)+(cancelppn-0));
    registration.findOneAndUpdate({username:usname},{
        amount:finalam,
        upsert:true
    }, (err, result)=>{
        amount=result.amount;
        if(err){
            console.log(err);
        }
    })

       
    booking.findOneAndDelete({username:cancelusrname, bookingid:cancelbookid}, (err, result) => {
        if(err){
            console.log(err);
        }
        hoteldatashow();  
        res.end("<script>alert('Booking ID: "+cancelbookid+" Is Cancelled Sucessfully And Amount Deducted "+cancelppn+" And Transferred Sucessfully To "+usname+"'); window.location.assign('/HotelHomePage'); </script>");
    })
});


    






//Room-Book
app.post('/BookRoom/:hotelid/:name/:address/:phoneno/:roomno/:roomtype/:capacity/:pricepernight/:avail', async (req, res) => {
    let rmno = req.params.roomno;
    let hidupuser1 = req.params.hotelid;
    let roomtype1 = req.params.roomtype;
    let capa1 = req.params.capacity;
    let ava1 = req.params.avail;
    let ppn1 = req.params.pricepernight;
    let name6 = req.params.name;
    let addr = req.params.address;
    let phoneno = req.params.phoneno;

    registration.findOneAndUpdate({username:usname},{
        amount: amount-ppn1,
        upsert:true
    }, (err, result)=>{
        amount=result.amount;
        if(err){
            console.log(err);
        }
    })

    hotelregistration.findOneAndUpdate({hotelid:hidupuser1, name:name6},{
        hamount: (hamount-0)+(ppn1-0),
        upsert:true
    }, (err, result)=>{
        hamount=result.hamount;
        if(err){
            console.log(err);
        }
    })
    

    const bookinginput = new booking({
        username: fullname,
        paymentid: Math.random(),
        bookingid: Math.random(),
        name: name6,
        address: addr,
        phoneno: phoneno,
        capacity: capa1,
        roomtype: roomtype1,
        avail: ava1,
        roomno: rmno,
        pricepernight: ppn1,
        paymentstatus: "Accepeted"
    })
    const bookingdone = await bookinginput.save();

    hotelpublish.findOneAndDelete({hotelid:hidupuser1, roomno:rmno, pricepernight:ppn1}, (err, result) => {
         
        userbooking();
        res.end("<script>alert('Hotel Is Booked Now See Your Bookings'); window.location.assign('/UserBookedListPage'); </script>");
    })

})




//Cancel Bookings By User
app.post('/CancelRoom/:username/:bookingid/:pricepernight/:phoneno/:name', async (req, res) => {
        let cancelusrname = req.params.username;
        let cancelbookid = req.params.bookingid;
        let cancelppn = req.params.pricepernight;
        let puphotel = req.params.phoneno;
        let hnameuphotel = req.params.name;

        registration.findOneAndUpdate({username:usname},{
            amount:(amount-0)+(cancelppn-0),
            upsert:true
        }, (err, result)=>{
            amount=result.amount;
            if(err){
                console.log(err);
            }
        })

        hotelregistration.findOneAndUpdate({phoneno:puphotel, name:hnameuphotel},{
            hamount: hamount-cancelppn,
            upsert:true
        }, (err, result)=>{
            hamount=result.hamount;
            if(err){
                console.log(err);
            }
        })
           
        booking.findOneAndDelete({username:cancelusrname, bookingid:cancelbookid}, (err, result) => {
            if(err){
                console.log(err);
            }    
            userbooking();  
            res.end("<script>alert('Booking ID: "+cancelbookid+" Is Cancelled Sucessfully'); window.location.assign('/AfterLogInUserHomePage'); </script>");
        })
});
  






//Hotel-Delete Data
app.post('/DeleteRoomData/:hotelid/:roomno', async (req, res) => {
    let rmno = req.params.roomno;
    let hiddel = req.params.hotelid;
    hotelpublish.findOneAndDelete({hotelid:hiddel, roomno:rmno}, (err, result) => {
        if(err){
            console.log(err);
        }      
        hoteldatashow();
    res.redirect('/HotelHomePage');
    })
})













//Hotel-Update Part
app.post("/HUpdatePage/:hotelid/:roomno", async (req, res) => {
    let rmno = req.params.roomno;
    let hidup = req.params.hotelid;
    hotelpublish.findOne({hotelid:hidup, roomno:rmno})
        .then((user)=>{
                if(user!=null){
                    res.render("HotelUpdatePage", {user:user});
                }       
    })
 
})
app.post("/UpPage/:hotelid/:roomno", async (req, res) => {
    let rmno1 = req.params.roomno;
    let hidup1 = req.params.hotelid;
    hotelpublish.findOneAndUpdate({hotelid:hidup1, roomno:rmno1},{
        roomno: req.body.no,
        roomtype: req.body.type,
        capacity: req.body.cap,
        pricepernight: req.body.ppn,
        avail: req.body.avail,
        upsert:true
    }, (err, result)=>{
        if(err){
            console.log(err);
        }
        res.redirect("/HotelHomePage");
    })
})














//Admin Part
function adminth(){
app.get('/AdminHomePage', async (req, res) => {
    const data1=await registration.find();
    hotelregistration.find()
        .then(async (data)=>{
                if(data!=null){           
                            res.render('AdminHomePage', {data:data, adminname, data1});     
                }     
    })  
});
}
adminth();

app.post('/DeclineHotel/:hotelid/:name/:address/:phoneno', async (req, res) => {
    let ahid = req.params.hotelid;
    let aname = req.params.name;
    let aaddr = req.params.address;
    let aphoneno = req.params.phoneno;

    
    hotelregistration.findOneAndDelete({hotelid:ahid, name:aname}, (err, result) => {
        if(err){
            console.log(err);
        }      
        adminth();
    res.redirect('/AdminHomePage');
    })
})
app.post('/ShowBookings/:name/:username', async (req, res) => {
    let auname = req.params.name;
    let au_usrname = req.params.username;
    var username3=auname;
    const data=await booking.find({username:username3});
                if(data!=null){           
                            res.render('AdminSeeUserBookings', {data, username3});     
                }     
})











//Search Part
app.get('/HomePage', async (req, res)=>{

    var data1 = await hotelpublish.find({avail:formavail, address:cityname, roomtype:rtform, capacity:formcapa});

    hotelpublish.find()
        .then(async (data)=>{
                if(data!=null){           
                            res.render('HomePage', {data:data, data1});     
                }     
    })  
})
let cityname;
let formcapa;
let rtform;
let formavail;
app.post('/SearchDataFromForm', async (req, res)=> {
    formavail = req.body.avail;
    cityname = req.body.cityname;
    formcapa = req.body.formcapa;
    rtform = req.body.rtform; 
    res.redirect("/HomePage");
})

app.get('/UserSearchResult', async (req, res)=>{

    hotelpublish.find({avail:formavail, address:cityname, roomtype:rtform, capacity:formcapa})
        .then(async (data)=>{
                if(data!=null){           
                            res.render('UserSearchResult', {data:data});     
                }     
    })  
})
app.post('/SearchDataFromFormUser', async (req, res)=> {
    formavail = req.body.avail;
    cityname = req.body.cityname;
    formcapa = req.body.formcapa;
    rtform = req.body.rtform; 
    res.redirect("/UserSearchResult");
})








app.listen(port, () => {
    console.log(`Server Is Running In Port No ${port}`)
});
