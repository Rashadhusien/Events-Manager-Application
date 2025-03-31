// console.log(new Date());
// console.log(new Date().toISOString());
// console.log(new Date().toISOString().split("T"));
// console.log(new Date().toISOString().split("T")[0]);

function setMinDate() {
  const today = new Date().toISOString().split("T")[0];
  const eventDate = document.querySelector(".eventDate");
  eventDate.setAttribute("min", today);
  // document.querySelector("eventDate").min = today;

  eventDate.addEventListener("input", () => {
    if (eventDate.value < today) {
      eventDate.value = today;
    }
  });
}

setMinDate();
function addEvent() {
  const btn = document.querySelector(".add").innerHTML;
  const eventName = document.querySelector(".eventName").value;
  const eventDate = document.querySelector(".eventDate").value;
  const eventOrganizer = document.querySelector(".organizer").value;
  const eventTimeStamp = new Date(eventDate).getTime();
  const today = new Date().toISOString().split("T")[0];

  if (!eventName || !eventDate || !eventOrganizer) {
    if (!eventName) {
      document.querySelector(".eventName").placeholder =
        "Event name is required";
      document.querySelector(".eventName").classList.add("error");
    }
    if (!eventDate) {
      document.querySelector(".eventDate").placeholder = "Select a date";
      document.querySelector(".eventDate").classList.add("error");
    }
    if (!eventOrganizer) {
      document.querySelector(".organizer").placeholder =
        "Organizer name is required";
      document.querySelector(".organizer").classList.add("error");
    }
    return;
  } else {
    document.querySelectorAll("input").forEach((input) => {
      input.classList.remove("error");
      input.placeholder = input.dataset.placeholder || "";
    });
  }

  let events = JSON.parse(localStorage.getItem("events")) || [];

  if (
    btn === "Add Event" &&
    events.some((event) => event.name.toLowerCase() === eventName.toLowerCase())
  ) {
    alert("An event with this name already exists!");
    return;
  }

  if (btn === "Add Event") {
    const event = {
      name: eventName,
      date: eventDate,
      organizer: eventOrganizer,
      timeStamp: eventTimeStamp,
    };
    events.push(event);
  } else if (btn === "Update") {
    const index = document.querySelector(".add").dataset.index;
    events[index] = {
      name: eventName,
      date: eventDate,
      organizer: eventOrganizer,
      timeStamp: eventTimeStamp,
    };
    document.querySelector(".add").innerHTML = "Add Event";
    delete document.querySelector(".add").dataset.index;
  }

  localStorage.setItem("events", JSON.stringify(events));

  document.querySelectorAll("input").forEach((input) => (input.value = ""));
  displayEvents();
}

function displayEvents() {
  const events = JSON.parse(localStorage.getItem("events")) || [];
  const eventsList = document.querySelector(".events");
  eventsList.innerHTML = "";

  events.forEach((event, index) => {
    const now = new Date().getTime();
    const timeLeft = event.timeStamp - now;

    let countDown;
    if (timeLeft <= 0) {
      countDown = `<span style="color:red;">Expired</span>`;
    } else {
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      countDown = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    eventsList.innerHTML += `
      <div class="event">
        <h3>${event.name}</h3>
        <p><span>By</span> ${event.organizer}</p>
        <p><span>On</span> ${event.date}</p>
        <p><span>Time Left</span> ${countDown}</p>
        <div class="settings">
          <button onClick="deleteEvent(${index})" class="del">Delete</button>
          <button onClick="editEvent(${index})" class="edit">Edit</button>
        </div>
      </div>
    `;
  });
}

displayEvents();
const editEvent = (index) => {
  document.querySelectorAll("input").forEach((input) => {
    input.classList.remove("error");
    input.placeholder = input.dataset.placeholder || "";
  });

  const events = JSON.parse(localStorage.getItem("events"));
  const event = events[index];

  const eventName = document.querySelector(".eventName");
  const eventDate = document.querySelector(".eventDate");
  const organizer = document.querySelector(".organizer");

  eventName.value = event.name;
  organizer.value = event.organizer;
  eventDate.value = event.date;

  document.querySelector(".add").innerHTML = "Update";

  // Store index in a hidden input
  document.querySelector(".add").dataset.index = index;
};

function deleteEvent(index) {
  const events = JSON.parse(localStorage.getItem("events"));
  events.splice(index, 1);
  localStorage.setItem("events", JSON.stringify(events));
  displayEvents();
}

setInterval(displayEvents, 1000);
