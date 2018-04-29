process.env.NODE_ENV = 'test';

var Mongoose = require('mongoose').Mongoose;
var mongoose = new Mongoose();
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
Encryption = require('../api/utils/encryption');
var Tags = require('../api/models/Tag.model');
var Users = require('../api/models/user.model');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
let User1;
chai.use(chaiHttp);
let v;
let Tag ;
let User;
let Userblocked;
let usedForUser;
let usedForExpert;
let usedForAdmin;
let Expert;
//describe('...', function() {
//	it("...", function(done) {
		// ...
//		done();
//	});
//});




const base = process.env.PWDF;
var app = require('../app');

before(function(done) {
  this.timeout(2800000);
	mockgoose.prepareStorage().then(function() {
		mongoose.connect('mongodb://localhost:27017/StartUp-Connect-Database-test', function(err) {
//s      connection.name = connection.db.databaseNam
            
    done(err);
    });
    mongoose.connection.on('connected', () => {  
      console.log('db connection is now open');
    });
  });
});

// beforeEach(function(done) { 
//   mockgoose.helper.reset().then(() => {
//     done()
//   });
// });
//when getting the the path used below for ease of use the frontend to get do the 
// request and get the path
describe('Admin tests: ', () =>  {
  before(function(done) {
   
    Tag = new Tags({name: "Tarek" ,status:"Pending" ,blocked: false,});
    Tag.save((err, Tag) => {
    });

    User = new Users({username: "Jimmy" ,email:"Mahmoud@gmail.com" ,password: "9194591945" });
    User.save((err, User) => {
    });
    User.blocked = true;

    Userblocked = new Users({username: "Jimmy2" ,email:"Mahmoud2@gmail.com" ,password: "9194591945",blocked:true });
    Userblocked.save((err, User) => {
    });
    Userblocked.blocked = false;


    usedForUser = new Users({username: "1" ,email:"1@gmail.com" ,password: "9194591945",role: "expert" });
    usedForUser.save((err, User) => {
    });
    usedForUser.role = 'user';

    usedForExpert = new Users({username: "2" ,email:"2@gmail.com" ,password: "9194591945" });
    usedForExpert.save((err, User) => {
    });
    usedForExpert.role= 'expert';

    usedForAdmin = new Users({username: "3" ,email:"3@gmail.com" ,password: "9194591945" });
    usedForAdmin.save((err, User) => {
    });
    usedForAdmin.role= 'admin';


    Expert = new Users({username: "Mahmoud" ,email:"mahmoudgamal@gmail.com" ,password: "9194591945" ,role: "expert" ,});
    User.save((err, User) => {
    });
    v = "tarek123";
   Encryption.hashPassword(v, function(err, hash){ 
     User1 = new Users({username: "Tarek" ,email:"tarek@abdocience.com" ,password: hash,});
    User1.save((err, User1) => {
    });
   });
    done();
    
  }),
  
  //describe('/GET /api/Tags/getTags', () => {
  it('it should GET all the Tags', (done) => {
 
   chai.request(app)
   .get('/api/Tags/getTags')
   .end((err, res) => {
   res.should.have.status(200);
   //.body.data is used because we return the result of our api request in the data
   // structure we made where it returns err,msg and data where data in this case is
   // the array of tags
   res.body.data.should.be.a('array');
//   res.body.data.should.have.property('_id');
// this takes the array and checks that every single tag has the correct data
// structure 
for (var i = 0 ; i < res.body.data ; i++ ){
   res.body.data[i].should.have.property('name');
   res.body.data[i].should.have.property('status');
   res.body.data[i].should.have.property('blocked');
}
   //res.body.length.should.be.eql(0);
   done();
   });
   }).timeout(3000);
   // });
  it('it should UPDATE a Tag given the id on /api//Tag/editTags/ PATCH' , (done) => {
     chai.request(app).patch('/api//Tag/editTags/' + Tag.id)
     .send({name: "ana" , status: "Pending", blocked:false,}).end((err, res) => {
      res.should.have.status(200);     
        res.body.data.should.have.property('name');
        res.body.data.should.have.property('status');
        res.body.data.should.have.property('blocked');
   
        res.body.data.should.have.property('name').eql('ana');
        res.body.data.should.have.property('status').eql('Pending');
        res.body.data.should.have.property('blocked').eql(false);   

     done();    
  });
});
it('it should add a Tag POST /api/Tags/AddTag' , (done) => {
     chai.request(app).post('/api/Tags/AddTag')
     .send({name: "Mohamed" , status: "Accepted", blocked:false,}).end((err, res) => {
      res.should.have.status(201);     
        res.body.data.should.have.property('name');
        res.body.data.should.have.property('status');
        res.body.data.should.have.property('blocked');
   
        res.body.data.should.have.property('name').eql('Mohamed');
        res.body.data.should.have.property('status').eql('Accepted');
        res.body.data.should.have.property('blocked').eql(false);   
        
     done();    
  });
});
it('it should delete a Tag DELETE /api//Tags/deleteTags/' , (done) => {
  chai.request(app).delete('/api//Tags/deleteTags/' + Tag.id).end((err, res) => {
   res.should.have.status(200);     
      done();    
});
});

it('it should GET all the Users with their ratings', (done) => {
  chai.request(app)
  .get('/api//User/getUsers')
  .end((err, res) => {
  res.should.have.status(200);
  //.body.data is used because we return the result of our api request in the data
  // structure we made where it returns err,msg and data where data in this case is
  // the array of tags
  res.body.data.should.be.a('array');
//   res.body.data.should.have.property('_id');
// this takes the array and checks that every single tag has the correct data
// structure 
for (var i = 0 ; i < res.body.data ; i++ ){
  res.body.data[i].should.have.property('rating');
}
  
  done();
  });
  });
  
it('it should Block a User given the User_id on /User/BlockAndUnblock/ PATCH' , (done) => {
     chai.request(app).patch('/api//User/BlockAndUnblock/' + User.id)
     .end((err, res) => {
       res.should.have.status(200);     
        res.body.data.should.have.property('username');
        res.body.data.should.have.property('email');
        //res.body.data.should.have.property('password');
   
        res.body.data.should.have.property('username').eql('Jimmy');
        res.body.data.should.have.property('email').eql('mahmoud@gmail.com');
        res.body.data.should.have.property('blocked').eql(true);   

     done();    
  });
});

it('it should UnBlock a User given the User_id on /User/BlockAndUnblock/ PATCH' , (done) => {
  chai.request(app).patch('/api//User/BlockAndUnblock/' + Userblocked.id)
  .end((err, res) => {
    res.should.have.status(200);     
     res.body.data.should.have.property('username');
     res.body.data.should.have.property('email');
     //res.body.data.should.have.property('password');

     res.body.data.should.have.property('username').eql('Jimmy2');
     res.body.data.should.have.property('email').eql('mahmoud2@gmail.com');
     res.body.data.should.have.property('blocked').eql(false);   

  done();    
});
});


  
   it('it should change the role of the given user to an expert /api/User/ChangeRole/ PATCH' , (done) => {
    chai.request(app).patch('/api/User/ChangeRole/' + usedForExpert.id)
    .end((err, res) => {
       res.should.have.status(200);     
       res.body.data.should.have.property('role').eql('expert'); 
    done();    
  });
  });

  it('it should change the role of the given user to an admin /api/User/ChangeRole/ PATCH' , (done) => {
    chai.request(app).patch('/api/User/ChangeRole/' + usedForAdmin.id)
    .end((err, res) => {
       res.should.have.status(200);     
       res.body.data.should.have.property('username');
    done();    
  });
  });

  it('it should change the role of the given user to a user /api/User/ChangeRole/ PATCH' , (done) => {
    chai.request(app).patch('/api/User/ChangeRole/' + usedForUser.id)
    .end((err, res) => {
       res.should.have.status(200);     
       res.body.data.should.have.property('role').eql('user'); 
    done();    
  });
  });

   });

describe('Auth tests: ', () =>  {
  //this tests if a user can login successfully
   it('it should login a user', (done) => {
    

    chai.request(app).post('/api/auth/login')
   .send({email: "tarek@abdocience.com" , password: "tarek123",}).end((err, res) => {
           res.should.have.status(200);
           res.body.should.have.property("msg");
           res.body.msg.should.be.eql("Welcome");
           res.body.should.have.property("data");
           done();
   });
   });
   //this tests if a user will not be logged in if he entered a wrong password
   it('it should not login a user', (done) => {
    

    chai.request(app).post('/api/auth/login')
   .send({email: "tarek@abdocience.com" , password: "tarek1223",}).end((err, res) => {
           res.should.have.status(401);
           res.body.should.have.property("msg");
           res.body.msg.should.be.eql("Password is incorrect.");
           
           done();
   });
   });
   it('it should add a user', (done) => {
    chai.request(app).post('/api/auth/signup')
   .send({ username: "tarekk",email:"tarek@gmail.com" , password: "tarek12356",}).end((err, res) => {
           res.should.have.status(201);
           res.body.should.have.property('msg');
           res.body.msg.should.be.eql('Registration successful, you can now login to your account.');

           res.body.data.should.have.property('username');
           res.body.data.should.have.property('email');
           res.body.data.should.have.property('username').eql('tarekk');
           res.body.data.should.have.property('email').eql('tarek@gmail.com');
   done();
   });
   });
   //this checks if signup will fail if user tried to add a profile that already exists
   it('it should not add a user', (done) => {
    chai.request(app).post('/api/auth/signup')
   .send({ username: "tarekk",email:"tarek@abdoscience.com" , password: "tarek123",}).end((err, res) => {
           res.should.have.status(209);
           res.body.should.have.property('msg');
           res.body.msg.should.be.eql('Registration Failed');
           
   done();
   });
   });

});

describe('User tests: ', () =>  {

});
    

after(function(done) {
  Tags.remove({}, (err) => {
  });
  Users.remove({}, (err) => {
 });
 // mockgoose.helper.reset().then(() => {
 // });
    
 // mongoose.disconnect(done);
done();
});
