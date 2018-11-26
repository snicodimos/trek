
const BaseURL = 'https://trektravel.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
};


//Loading all trips
const loadTrips = () => {
  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(BaseURL)
  .then((response) => {

    title = $(`<h1>List of trips</h1>`);
    tripList.append(title);

    response.data.forEach((trip) => {
      const singleTrip = $(`<li class="${trip.id}">${trip.name}</li>`)
      tripList.append(singleTrip);

      // call the load one trip function to pass in the trip id so that at a click it will show the trip detail and the form to reserve it
      singleTrip.on('click', () => {
        loadOneTrip(`${trip.id}`);
        generateForm(trip);
      });
    });
  })

  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
  });
};

// function to load one trip details
const loadOneTrip = (id) => {

    const oneTrip = $('#one-trip');
    oneTrip.empty();

    axios.get(BaseURL + '/'+ id)
    .then((response) => {

      oneTrip.append(`<h1>Trip Details</h1>
        <h3>Name: ${response.data.name}</h3>
        <p>ID: ${response.data.id}</p>
        <p>Continent: ${response.data.continent}</p>
        <p>About: ${response.data.about}</p>
        <p>Category: ${response.data.category}</p>
        <p>Duration: ${response.data.weeks}</p>
        <p>Cost: ${response.data.cost}</p>`);
  });
};

// function to display a form to get info to reserve trip
const generateForm = (trip) => {
  const form = $('#displayForm');
    form.empty();

    form.append(`
      <h2>Reserve your spot for ${trip.name} trip</h2>
      <form id="trip-form">
      <div>
        <label for="name">Your Name</label>
        <input type="text" name="name" />
      </div>

      <div>
        <label for="email">Email Address</label>
        <input type="text" name="email" />
      </div>

      <input type="submit" name="reserve" value="Reserve" />
      </form>`);

      const reserve = (event) => {
        event.preventDefault();
        createReservation(trip.id);
      };
      $('#trip-form').submit(reserve);
};

// function to clear the form ones reserve button is pressed
const clearForm = () => {
    $(`#trip-form input[name="name"]`).val('');
    $(`#trip-form input[name="email"]`).val('');
}

// function to parse the AJAX data
const readFormData = () => {
    const parsedFormData = {};

    const nameFromForm = $(`#trip-form input[name="name"]`).val();
    parsedFormData['name'] = nameFromForm ? nameFromForm : undefined;
    const emailFromForm = $(`#trip-form input[name="email"]`).val();
    parsedFormData['email'] = emailFromForm ? emailFromForm : undefined;

    return parsedFormData;
  };


// function to send a post request to reserve the trip
const createReservation = (id) => {

    const reserveData = readFormData();

    const resURL = BaseURL + "/" + id + "/reservations";

    axios.post(resURL, reserveData)
      .then((response) => {
        console.log(response);
          clearForm();
        console.log('I have sent a post request')
      })

      .catch((error) => {

      });

};


$(document).ready(()=> {
  $('#load-all').click(loadTrips);
});
