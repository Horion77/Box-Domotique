function updateBulbImage(state) {
  console.log('updateBulbImage called with state:', state);
  const bulb = document.getElementById('bulb');
  if (state === 1) {
    bulb.src = '/public/img/ampoule allumée.png';
  } else {
    bulb.src = '/public/img/ampoule eteinte.png';
  }
}

function updateLightStateDisplay(state) {
  console.log('updateLightStateDisplay called with state:', state);
  const lightSwitch = document.getElementById('switch-1');
  lightSwitch.checked = state === 1;
  updateBulbImage(state);
}


document.getElementById('switch-1').addEventListener('change', function (event) {
  console.log('Switch change event triggered');
  const isChecked = event.target.checked;
  const state = isChecked ? 1 : 0;
  updateBulbImage(state);

  fetch('/update-light-state', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ state: state }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Light state updated successfully', data);
    })
    .catch((error) => {
      console.error('Error updating light state:', error);
    });
});

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  console.log('About to fetch light state...');

  fetch('/get-light-state')
    .then((response) => response.json())
    .then((data) => {
      console.log('Fetched light state:', data);
      updateLightStateDisplay(data.state);
    })
    .catch((error) => {
      console.error('Error fetching light state:', error);
    });
});
