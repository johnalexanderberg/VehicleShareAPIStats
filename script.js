console.log("hej")

const siteUrl = "https://localhost:44323"

const section = document.getElementById("stats");
console.log(section);

fetch(siteUrl + "/api/stats")
    .then(response => response.json())
    .then(data => renderString(data));

function renderString({userCount, vehicleCount, firstBooking, bookingCount}) {
    section.textContent = (userCount < 1 ? userCount + " user has shared" : userCount +" users have shared ")
        + vehicleCount + " " + (vehicleCount < 1 ? "vehicle " : "vehicles ") + "since " + firstBooking + " and completed " +bookingCount +" rides";
}

