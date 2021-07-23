const express = require('express');
const mongoose = require('mongoose');
const Appointment = mongoose.model('Appointment');
var router = express.Router();

router.get('/',(req,res)=>{
    res.render("appointment/addOrEdit",{
        viewTitle: "ADD Appointment"
    });
});

router.post('/', (req,res)=>{
    if(req.body._id == ""){
        insertRecord(req,res);
    }
    else{
        updateRecord(req,res);
    }
});

function insertRecord(req,res){
    var appointment = new Appointment();
    appointment.fullName = req.body.fullName;
    appointment.email = req.body.email;
    appointment.mobile = req.body.mobile;
    appointment.date = req.body.date;
    // console.log(Appointment.find({date:appointment.date}));
    // var count = Appointment.find({date:appointment.date}).countDocuments();
    // console.log(count);
    // Appointment.find({date:appointment.date}, (err,res)=>{
    //     console.log(res.ducuments());
    // });
    Appointment.find({date:appointment.date},(err,docs)=>{}).count((err,no_of_rows)=>{
        if(no_of_rows == 0){
            console.log("if");
            appointment.save((err,doc) => {
                if(!err){
                    res.redirect('appointment/list');
                }
                else{
                    if(err.name == 'ValidationError' ){
                        handlevalidationError(err,req.body);
                        res.render("appointment/addOrEdit",{
                            viewTitle: "ADD Appointment",
                            appointment : req.body
                        });
                    }
                    console.log('Error during record insertion : '+err);
                }
            });
        }
        else{
            console.log("else");
            res.render("appointment/addOrEdit",{
                viewTitle: "ADD Appointment",
                appointment : req.body,
                dateError : "Please Select other date"
            });
        }
    });
}

function updateRecord(req, res) {
    Appointment.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('appointment/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("appointment/addOrEdit", {
                    viewTitle: 'Update Appointment',
                    appointment: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}

router.get('/list',(req,res)=>{
    Appointment.find((err,docs)=>{
        if(!err){
            res.render('appointment/list',{
                list:docs
            });
        }
        else{
            console.log('Errors in retrieving appointment list : ' + err);
        }
    });
});

function handlevalidationError(err,body){
    for(field in err.errors){
        switch(err.errors[field].path){
            case 'fullName' :
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email' :
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
} 

router.get('/:id',(req,res)=>{
    Appointment.findById(req.params.id, (err,doc)=>{
        if(!err){
            res.render('appointment/addOrEdit',{
                viewTitle : 'Update Data',
                appointment  : doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Appointment.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/appointment/list');
        }
        else { console.log('Error in appointment delete :' + err); }
    });
});

module.exports = router;