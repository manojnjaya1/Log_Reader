const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { generatePrimeSync } = require('crypto');
let directoryPath;
let ddate;
let dmonth;
let dyear;
let dhour;

let syear;
let smonth;
let sdate;
let shour;
let smin;
let ssec;

let eyear;
let emonth;
let edate;
let ehour;
let emin;
let esec;

let severity;


module.exports.logDetails = async function (req, res) {
  // console.log(req.body);
  try {
    //getting user input
    let startDate = JSON.stringify(req.body.start_date);
    let startTime = JSON.stringify(req.body.start_time);
    syear = parseInt(startDate.substring(1, 5));
    smonth = parseInt(startDate.substring(6, 8));
    sdate = parseInt(startDate.substring(9, 11));
    shour = parseInt(startTime.substring(1, 3));
    smin = parseInt(startTime.substring(4, 6));
    ssec = parseInt(startTime.substring(7, 9));

    let endDate = JSON.stringify(req.body.end_date);
    let endTime = JSON.stringify(req.body.end_time);
    eyear = parseInt(endDate.substring(1, 5));
    emonth = parseInt(endDate.substring(6, 8));
    edate = parseInt(endDate.substring(9, 11));
    ehour = parseInt(endTime.substring(1, 3));
    emin = parseInt(endTime.substring(4, 6));
    esec = parseInt(endTime.substring(7, 9));

    
    let Severity = JSON.stringify(req.body.severity);
    severity = Severity.substring(1, Severity.length - 1);

   //finding directory and files in the directory
    directoryPath = path.join('', req.body.directory);
    

    let files = fs.readdirSync(directoryPath);
    
    let messages = await getFile(files);
    //   getFile(Files);
    //console.log("Message", messages)
   
//rendering all the messages of the input severity
    return res.render('../messages.ejs', { messages });
  }
  catch (e) {
    console.log(e)
  }
}



async function getFile(Files) {
  let message = []
  for (let file of Files) {
    
    const f1 = JSON.stringify(file);
    console.log("1 inside 1st forach");

  //getting details from file name
    let i = 0;
    let count = 0;
    while (i < f1.length && count < 2) {
      if (f1.charAt(i) == '-') count++;

      i++;
    }
    let s = "";
    let c = 13;
    while (c >= 0) {
      s += f1.charAt(i++);
      c--;
    }
    ddate = parseInt(s.substring(0, 2));
    dmonth = parseInt(s.substring(3, 5));
    dyear = parseInt(s.substring(6, 10));
    dhour = parseInt(s.substring(11, 13));
    console.log(dyear, dmonth, ddate, dhour,);
    //  console.log(f1);
    //checking if the file is in between the start time
    if (dyear >= syear && dyear <= eyear) {
      if (dyear == syear && dmonth < smonth) continue
      if (dyear == eyear && dmonth > emonth) continue;
      if (dyear == syear && dmonth == smonth && ddate < sdate) continue;
      if (dyear == eyear && dmonth == emonth && ddate > edate) continue;

      if (dyear == syear && dmonth == smonth && ddate == sdate && dhour < shour) {

        continue;
      }
      if (dyear == eyear && dmonth == emonth && ddate == edate && dhour > ehour) {

        continue;
      }


      console.log("inside if");
      console.log(file);
      let abc = path.join(directoryPath + '/' + file)
      // calling this function to cheack the file line by line
      let ans = await processLineByLine(abc);
      for (let val of ans) {
        message.push(val);
      }


    }

  };
  return message;

}
async function processLineByLine(file) {
  console.log("inside fun");
  let message = []
  const fileStream = fs.createReadStream(file);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  let count = 0;
  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    //console.log("inside 2nd for each");

    let str = JSON.stringify(line);
    let min = parseInt(str.substring(15, 17));
    let sec = parseInt(str.substring(18, 20));
    let sev = str.substring(21, 28);
    let myArray = sev.split(",");

    let msg;

    if (dyear == syear && dmonth == smonth && ddate == sdate && dhour == shour) {

      if (min < smin) {
        continue;
      }
      if (min == smin && sec < ssec) continue;

    }
    else if (dyear == eyear && dmonth == emonth && ddate == edate && dhour == ehour) {
      if (min > emin) {
        continue;
      }
      if (min == emin && sec > esec) continue;
    }
    else if (severity === myArray[0]) {
      //console.log("yes");
      count++;
      switch (severity) {
        case "Debug":
          msg = str.substring(27, str.length - 1);
          break;
        case "Warning":
          msg = str.substring(29, str.length - 1);
          break;
        case "Error":
          msg = str.substring(27, str.length - 1);
          break;
        case "Info":
          msg = str.substring(26, str.length - 1);
          break;
      }
      message.push(msg);
      

    }


  }
  // console.log(count);
  // console.log(messages);
  return message;
}
