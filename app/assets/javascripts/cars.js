$(function() {
  console.log("cars.js is loaded...")

    listenForNonAbcClick() 
    listenForAbcClick()
    listenForNewBookingFormClick()
    listenForShowClick()
});

//Render Index Page
function listenForNonAbcClick() { 
 $('#nonabc').on('click', function(event) {
   event.preventDefault()
   getCars()
  })
}

function listenForAbcClick() {
 //$("[href='/cars']").on('click', function(event) {
 $('#abc').on('click', function(event) {

   event.preventDefault()

   getAbcCars()
  })
}

function getAbcCars() {
  $.ajax({
    url: 'http://localhost:3000/cars',
    method: 'get',
    dataType: 'json'
  }).done (function(cars) {

    cars.sort(function(a, b) {
      var locationA = a.location.toUpperCase(); // ignore upper and lowercase
      var locationB = b.location.toUpperCase(); // ignore upper and lowercase
      if (locationA < locationB) {
        return -1;
      }
      if (locationA > locationB) {
        return 1;
      }
      return 0;
    });


  cars.forEach(car => {
    let mycar = new Car(car)
      let myCarhtml = mycar.carhtml()
      document.getElementById('ajax-cars').innerHTML += myCarhtml
      console.log(myCarhtml)
    })
  })
}


// Gets JSON data for all the cars
function getCars() {
  $.ajax({
    url: 'http://localhost:3000/cars',
    method: 'get',
    dataType: 'json'
  }).done (function(cars) {
  cars.forEach(car => {
    let mycar = new Car(car)
      let myCarhtml = mycar.carhtml()
      document.getElementById('ajax-cars').innerHTML += myCarhtml
      console.log(myCarhtml)
    })
  })
}


function listenForShowClick() {
 $(document).on('click', ".show_link", function(event) {
   event.preventDefault()
   var id = $(this).attr('data-id');
   getcar(id)
 })
}

function getcar(id) {
  var id = id;
   $.ajax({
     url: 'http://localhost:3000/cars',
     data: {id: id},
     method: 'get',
     dataType: 'json'
   }).done (function(car) {
     let newCar = new Car(car[id - 1])
      let carHtml = newCar.showcarhtml()
    document.querySelector('div#show-page').innerHTML = carHtml
    console.log(carHtml)
 })
}


function listenForNewBookingFormClick() {
  $(document).on('click', ".booking_link", function(event) {
    event.preventDefault()
    var car_id = event.target.attributes['data-id'].value;
  //  alert("we r hack3rz");
    bookACar(car_id)
  })
}

function bookACar(car_id) {
  let newBookingForm = Car.newBookingForm(car_id)
  document.querySelector("div#new-booking-form-div").innerHTML = newBookingForm

   $(function () {
     $('#booking-page').on('submit', function(event) {
     event.preventDefault();
     const values = $(this).serialize();
     $.post("/bookings", values).done(function(data) {
        console.log(data)
       $('#show-page').html("")

        const bookedCar = new Booking(data)
      //  debugger
        const addHTML = bookedCar.newcarbooking()
       $('#show-page').html(addHTML)
     })
    })
  })
}

// Consturctor tied to serializer
class Car {
  constructor(obj) {
    this.id = obj.id
    this.name = obj.name
    this.location = obj.location
    this.bookings = obj.bookings
    this.users = obj.users
  }

  static newBookingForm(car_id){
    return (`
    <div id="booked-car">

    <form id="booking-page" method="post" action="/bookings">
      <strong> New Car Booking Form </strong>

      <div id="bookingDescription">
        <label for="booking_Notes">Notes</label>
        <textarea name="booking[description]" id="booking_description" required></textarea>

      <div id="bookingPassengers">
        <label for="booking_Passengers">Number of Passengers (between 1 and 4): </label>
        <input type="number" name="booking[passengers]" id="booking_passengers" required></input>

      <div id="bookingPaid?">
        <label for="booking_Paid">Paid?</label>
        <input name="booking[paid]" type="hidden" value="0"><input type="checkbox" value="1" name="booking[paid]" id="booking_paid">

      <div id="carId">
      <label for="car_Id">Choose The Model</label>
        <select name="booking[car_id]" id="booking_car_id" required>
          <option value="1">F12 Berlinetta</option>
          <option value="2">McLaren 570GT</option>
          <option value="3">Chiron</option>
          <option value="4">918 Spyder</option>
          <option value="5">Aventador</option>
        </select>

      <div id="submit">
        <input type="submit"/>
        </div>
      </form>
      `)
    }
  }

// Index rendering and show display for each car
Car.prototype.carhtml = function() {
  return (`
    <div id ='show-page' ></div><br>
      <div >
        <a href ='/cars/${this.id}' data-id= '${this.id}' class='show_link'>${this.location}</a><br>
        <br>
      </div>
    `)
}


Car.prototype.showcarhtml = function() {
  let carBookings = this.bookings.map(booking => {
    let time = booking.created_at.slice(0,-14);
      if (booking.paid === 1)
        return (`
        ${time} Customer Booked ${this.location} ${this.name} <br>
        `)

      })
  return (`
    ${carBookings}<br>
    In ${this.location} the ${this.name} is available <br></br>
      <div id='new-booking-form-div' >
        <a href ="/cars/${this.id}/bookings/new" data-id="${this.id}" class='booking_link'>Book this Car</a>
      </div><br></br>
    `)
  }


  class Booking {
    constructor(obj) {
      this.id = obj.id
      this.paid = obj.paid
      this.description = obj.description
      this.passengers = obj.passengers
      this.car_id = obj.car_id
      this.created_at = obj.created_at
      this.user = obj.user
      this.car = obj.car
    }
  }

Booking.prototype.newcarbooking = function() {

  if (this.paid === 1)
    return (`
     <h3>Booking Confirmation</h3>
     <p>User: ${this.user.email}</p>
     <p>Location: ${this.car.location}</p>
     <p>Car Name: ${this.car.name}</p>
     <p>Date Booked: ${this.created_at.slice(0,-14)}</p>
     <p>Number of Passengers: ${this.passengers}</p>
    `)
  else
    return (`
     <h3>Booking not secured.  PAYMENT REQUIRED for ${this.car.location}${this.car.name}.</h3>
    `)
}
