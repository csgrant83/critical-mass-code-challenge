const nav = document.querySelector('#nav');
const bar = document.querySelector('#bar');
const url = 'navigation.json';
const fetchData = fetch(url);

// Update bar location and width
function updateBar(element) {
  bar.style.left = element.offsetLeft+'px';
  bar.style.width = element.offsetWidth+'px';
};

// Create a new link and append to the nav element
function createLink(label) {
  let a = document.createElement('a');
  a.innerHTML = label;
  a.setAttribute('href', '#');
  nav.appendChild(a);
};

// Check if the click comes from an <a> tag and update the indicator bar
nav.addEventListener('click', (element) => {
  if (element.target && element.target.matches('a')) {
    updateBar(element.target);
  }
});

// Get link data from json and create links
fetchData.then((response) => {
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return response.json();
}).then((data) => {
  let { cities: cities } = data;
  for (const city of cities) {
    createLink(city.label);
  }
}).catch(function(error) {
  console.error(`Could not load city data: ${error}`);
});