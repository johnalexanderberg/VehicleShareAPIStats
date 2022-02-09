//API Endpoint
const siteUrl = "https://localhost:44323";

const svgNameSpace = "http://www.w3.org/2000/svg";

const todayText = document.getElementById("todayText");

//Size of svg and offset between bars
const svgWidth = 600;
const svgHeight = 200;
const rectOffset = 1;

function calculateTodayData(bookings){

    let vehicles = {
        Car : 0,
        Bike: 0,
        Boat: 0,
        Airplane: 0,
        SpaceShip: 0,
        FlyingBroom: 0,
        FlyingCarpet: 0,
        TimeMachine: 0,
    }

    let bookingsHours = [
        ["00", 0],
        ["01", 0],
        ["02", 0],
        ["03", 0],
        ["04", 0],
        ["05", 0],
        ["06", 0],
        ["07", 0],
        ["08", 0],
        ["09", 0],
        ["10", 0],
        ["11", 0],
        ["12", 0],
        ["13", 0],
        ["14", 0],
        ["15", 0],
        ["16", 0],
        ["17", 0],
        ["18", 0],
        ["19", 0],
        ["20", 0],
        ["21", 0],
        ["22", 0],
        ["23", 0],
    ];

    bookings.forEach(function ({startTime, endTime, vehicleType}){
        let bookingStartHr = startTime.slice(11, 13);
        if (bookingStartHr[0] === 0){
            bookingStartHr = bookingStartHr[1]
        }
        let bookingEndHr = endTime.slice(11, 13);
        if (bookingEndHr[0] === 0){
            bookingEndHr = bookingStartHr[1]
        }
        for(let i = 0; i < 24; i++){
            if (bookingStartHr <= i && bookingEndHr >= i){
                bookingsHours[i][1] += 1;
            }
        }
        vehicles[vehicleType] ++;
    })

    console.log(vehicles);

    const data = [bookingsHours, [
        ["Car", vehicles.Car],
        ["Bike", vehicles.Bike],
        ["Boat", vehicles.Boat],
        ["Airplane", vehicles.Airplane],
        ["Car", vehicles.SpaceShip],
        ["Flying Broom", vehicles.FlyingBroom],
        ["Flying Carpet", vehicles.FlyingCarpet],
        ["Time Machine", vehicles.TimeMachine],
        ]]
    return data;
}

//This function gets statistics from server and create svg graphics from the data.
async function runTodayStats(){
    const todayResponse = await fetch(siteUrl + "/api/lastTwentyFourHours");
    const todayJson = await todayResponse.json();

    const data = calculateTodayData(todayJson);
    const bookingsHours = data[0];
    const todaySvgContainer = document.getElementById("todaySvg");
    createSvg(svgWidth, svgHeight, rectOffset, bookingsHours, todaySvgContainer)

    const vehiclesSvgContainer = document.getElementById("vehiclesSvg");
    createSvg(svgWidth, svgHeight, rectOffset, data[1], vehiclesSvgContainer)

    const allrect = document.querySelectorAll('rect');
//show popup label on mouse enter, and add text stored in rect
    allrect.forEach(r => r.addEventListener('mouseenter', function(e){
        popup.classList.add("visible");
        popup.textContent = e.target.textContent;
    }))

    allrect.forEach(r => r.addEventListener('mouseout', function(e){
        popup.classList.remove("visible");
    }))
}

function renderString({userCount, vehicleCount, firstBooking, bookingCount}) {

    todayText.textContent = (userCount < 1 ? userCount + " user has shared" : userCount +" users have shared ")
        + vehicleCount + " " + (vehicleCount < 1 ? "vehicle " : "vehicles ") + "since " + firstBooking.slice(0, 10) + " and completed " + bookingCount +" rides";
}

async function runGeneralStats(){
    const statsResponse = await fetch(siteUrl + "/api/stats");
    const statsJson = await statsResponse.json();
    renderString(statsJson);
}

function createSvg(svgWidth, svgHeight, rectOffset, data, container) {
    let dataMax = 0;
    for (let i = 0; i < data.length; i++){
        if (data[i][1] > dataMax)
        dataMax = data[i][1];
    }
    console.log(dataMax)
    //create the svg
    const svg = document.createElementNS(svgNameSpace, "svg");
    svg.setAttribute("width", svgWidth);
    svg.setAttribute("height", svgHeight);

    const labelContainer = document.createElement("div");
    labelContainer.classList.add("datalabel_container");
    labelContainer.setAttribute("width", svgWidth);
    labelContainer.setAttribute("height", "auto");

    data.forEach((d, i) => {

        const label = d[0];
        const value = d[1];

        console.log("label: " +label + " value: " +value + " dataMax: " +dataMax);

        //scale data value to svg height
        const rectHeight = svgHeight/dataMax*value;
        // create the rect that will visualize the data
        const rectTag = document.createElementNS(svgNameSpace, "rect");

        // store position of rectangle, account for svgWidth and offset
        const xPos =  ((svgWidth -(rectOffset * data.length))/data.length * i) + (rectOffset * i);

        rectTag.setAttribute("x", xPos);
        // because 0 is the top of the svg and not the bottom, we need to push the rect down its own height
        rectTag.setAttribute("y", svgHeight-rectHeight);
        //set width to available space inside svg, account for offset
        rectTag.setAttribute("width", (svgWidth / data.length) - rectOffset);
        //finally set the height, which will reprecent the actual data value
        rectTag.setAttribute("height", rectHeight);
        rectTag.setAttribute("id", i);

        //make rounded corner
        rectTag.setAttribute("rx", "10");

        //create label showing the data value
        const rectLabel = document.createElement("text")
        rectLabel.textContent = value;
        rectLabel.classList.add("rectLabel");
        rectTag.append(rectLabel);

        //add the rect to the svg
        svg.append(rectTag);

        //create the label showing the title
        const labelElement = document.createElement("div");
        labelElement.classList.add("labelName");
        labelElement.style.width = (svgWidth / data.length) + "px";
        labelElement.style.overflow = "hidden";
        labelElement.textContent = label;
        labelContainer.append(labelElement);

    });
    container.append(svg)
    container.append(labelContainer)

};

//popup label
const popup = document.getElementById('popup');

//make popup follow mouse movement
window.addEventListener('mousemove', function(e) {
    const left = e.clientX;
    const top = e.clientY + 25;
    popup.style.left = left + 'px';
    popup.style.transform = "translate(-50%, 0)"
    popup.style.top = top + 'px';
});

runTodayStats();
runGeneralStats();