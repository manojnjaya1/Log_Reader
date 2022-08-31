const express = require('express');

const router = express.Router();

const detailsController = require('../controllers/details_controller');


console.log('router loaded');


router.get('/',  (req, res) => {
    res.render('forms');
});

// router.get('/show',(req,res)=>{
//     return res.send("fill the form to get details")
// });
router.post('/show',detailsController.logDetails);





module.exports = router;