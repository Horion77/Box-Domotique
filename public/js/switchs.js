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
  const lightSwitch = document.getElementById('switch-1').querySelector('input');
  
  if (state === 1) {
    lightSwitch.setAttribute('checked', '');
  } else {
    lightSwitch.removeAttribute('checked');
  }
  
  updateBulbImage(state);
}



document.getElementById('switch-1').addEventListener('change', function (event) {
  console.log('Switch change event triggered');
  const isChecked = event.target.checked;
  console.log('Switch isChecked:', isChecked);
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




function updateOutletImage(state) {
  console.log('updateOutletImage called with state:', state);
  const outlet = document.getElementById('outlet');
  if (state === 1) {
    outlet.src = '/public/img/prise-electrique on.png';
  } else {
    outlet.src = '/public/img/prise-electrique off.png';
  }
}


function updateOutletStateDisplay(state) {
  console.log('updateOutletStateDisplay called with state:', state);
  const outletSwitch = document.getElementById('switch-2').querySelector('input');
  
  if (state === 1) {
    outletSwitch.setAttribute('checked', '');
  } else {
    outletSwitch.removeAttribute('checked');
  }
  
  updateOutletImage(state);
}


document.getElementById('switch-2').addEventListener('change', function (event) {
  console.log('Outlet switch change event triggered');
  const isChecked = event.target.checked;
  console.log('Outlet switch isChecked:', isChecked);
  const state = isChecked ? 1 : 0;
  updateOutletImage(state);

  fetch('/update-outlet-state', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ state: state }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Outlet state updated successfully', data);
    })
    .catch((error) => {
      console.error('Error updating outlet state:', error);
    });
});


document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  console.log('About to fetch outlet state...');

  fetch('/get-outlet-state')
    .then((response) => response.json())
    .then((data) => {
      console.log('Fetched outlet state:', data);
      updateOutletStateDisplay(data.state);
    })
    .catch((error) => {
      console.error('Error fetching outlet state:', error);
    });
});



function sendLedStateToArduino(state) {
  if (state === 1) {
    serialport.write('ON\n');
  } else {
    serialport.write('OFF\n');
  }
}
