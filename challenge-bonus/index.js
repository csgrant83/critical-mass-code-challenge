const nav = document.querySelector('#nav');
const bar = document.querySelector('#bar');
const timeDisplay = document.querySelector('#time');
const url = 'navigation.json';
const key = '60a314970d1ae45c9dc68d6b1098e2bc';
const fetchData = fetch(url);

// Update bar location and width
function updateBar(element) {
  bar.style.left = element.offsetLeft+'px'; // Positions the bar under the right element
  bar.style.width = element.offsetWidth+'px'; // Resizes the bar to the width of the element
};

// Create a new link and append to the nav element
function createLink(label, offset) {
  let a = document.createElement('a');
  a.innerHTML = label;
  a.setAttribute('href', '#');
  a.dataset.offset = offset; // Add the timezone offset value as an attribute
  nav.appendChild(a);
};

// Fetch timezone offset value
function getOffset(city) {
  let location = city.replace(/-/g, '+'); // Replace - with + for compatibility with API
  return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${key}`);
};

// Generate the local time based on timezone offset
function getTime(offset) {
  let date = new Date();
  let utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  let newDate = new Date(utc + (1000 * offset));
  return newDate;
}

// Display city name and local time within the timeDisplay element
function displayTime(city, offset) {
  // Hide the time display element
  timeDisplay.style.opacity = 0;
  timeDisplay.style.transition = 'none';

  // Get a new local time based on the offset value
  let newDate = getTime(offset);
  
  // Update the time display with the new time and city values in 12 hour format
  timeDisplay.innerHTML = `The local time in ${city} is ${newDate.toLocaleString(navigator.language, {
    hour: '2-digit',
    minute:'2-digit',
    hour12: true
  })}`;

  // Fade in the time display
  setTimeout(()=> {
    timeDisplay.style.transition = '.5s';
    timeDisplay.style.opacity = 1;
  }, 350);
};

// Check if the click comes from an <a> tag and update the indicator bar and display time
nav.addEventListener('click', (element) => {
  if (element.target && element.target.matches('a')) {
    updateBar(element.target); // Update bar location and width
    displayTime(element.target.innerHTML, element.target.dataset.offset); // Display location and time from data attributes
  }
});

// Get city location info from inital promise
fetchData.then((response) => {
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return response.json();
}).then((data) => {
  let { cities: cities } = data; // Creates an array of objects
  for (const city of cities) {
    // Initiate a new promise to collect the timezone offset value from the openweather api
    getOffset(city.section).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    }).then((data) => {
      // Create a new link with the city name and timezone offset
      createLink(city.label, data.timezone);
    }).catch(function(error) {
      console.error(`Could not load offset data: ${error}`);
    });
  }
}).catch(function(error) {
  console.error(`Could not load city data: ${error}`);
});