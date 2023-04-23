let CONFIG = {
  // url for cloudLayers data: https://api.weather.gov/stations/<STATION>/observations/latest"
  url: {
    prefix: "https://api.weather.gov/stations/", // using weather.gov, no API Key required
    suffix: "/observations/latest" // latest observation path
    },
  locations: {
    station1: "KSMO" // Santa Monica Municipal Airport Station Code
  },
  // milliseconds * 1000 = seconds)
  checkInterval: 1800 * 1000
};

function weatherURL(location) { // function to assemble full URL based on location/station code
console.log("Weather URL: ", )
return (CONFIG.url.prefix + CONFIG.locations[location] + CONFIG.url.suffix);
}

function decodePage(response, location) {
      let encoded = response.body_b64;
      let decoded = atob(encoded);
      console.log(decoded);
      let firstTerm = '"' + (CONFIG.locations[location]); // finds start of rawmessage values for base station
      let secondTerm = '"'; // finds first " after base station name to get end of summary index
      let indexStart = decoded.indexOf(firstTerm); // find locaton of firstTerm defined above
      let indexEnd = decoded.indexOf(secondTerm, indexStart + 1); // find location of first Term after secondTerm
      let cloudResult = decoded.slice(indexStart, indexEnd); // crop to just the string indicating cloud cover results
      response.body = cloudResult;
}
 
 function activateSwitch(activate) {
  Shelly.call(
    "Switch.Set",
    { id: 0, on: activate },
    function (response, error_code, error_message) {}
  );
}

function getTime () {
// get shelly local time
      let time = Shelly.getComponentStatus("sys").time;
      // chop time string to hours and minutes
      let x = time.slice(0,2);
      let y = time.slice(3);
      // convert string to integer
      let h = JSON.parse(x);
      let m = JSON.parse(y);
      return ((h) + (m));
}

function ProcessWeatherSwitch (location) {
Shelly.call(
  "HTTP.REQUEST", 
  {"method": "GET", "url": weatherURL("station1"), 
    "headers":{
    "Content-Type":"application/ld+json"} // specifying ld+json for less info to parse vs. geojson.
   },
  function (response, location) {
    if (response && response.code && response.code === 200) {
      getTime(now);
      decodePage(response, location);
      let ovcCheck = (response.body.indexOf("OVC")); // any value above 0 means there are overcast conditions
      console.log("ovcCheck set to: ", ovcCheck);
      let skcCheck = (response.body.indexOf("SKC")); // any value above 0 means there are clear conditions
      console.log("skcCheck set to: ", skcCheck);
      let clrCheck = (response.body.indexOf("CLR")); // any value above 0 means there are clear conditions
      console.log("clrCheck set to: ", clrCheck);
      // check for overcast conditions
        if (ovcCheck > 0 && nowTime.h > 6 && nowTime.h < 18) {
        activateSwitch(true);
        print("Turning switch on due to overcast conditions")           
        }
          else if ((skcCheck > 0 || clrCheck > 0) && nowTime.h > 6 && nowTime.h < 18) {
          activateSwitch(false);
          print("Turning switch off due to clear conditions");         
          }
      else {
       print("Nothing to do at this time");
      }
    } // end if
  } // end sub function
); // end Shelly.call
} // end ProcessorWeatherSwitch main function

Timer.set(CONFIG.checkInterval, true, function () {
  console.log("Checking weather");
  ProcessWeatherSwitch("station1");
});
