const express = require('express');

const router = express.Router();
const homeController = require('../controllers/home_controller');
const detailsController = require('../controllers/details_controller');


console.log('router loaded');


router.get('/',  (req, res) => {
    res.render('forms');
});

// router.get('/show',(req,res)=>{
//     return res.send("fill the form to get details")
// });
router.post('/show',detailsController.logDetails);


//
// router.use('/details',require('./details'));

//router.use('/users', require('./users'));
//router.use('/professional', require('./professionals'));

// for any further routes, access from here
// router.use('/routerName', require('./routerfile));


module.exports = router;