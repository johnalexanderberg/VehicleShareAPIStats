console.log("hej")

const siteUrl = "https://localhost:44323";
const svgNameSpace = "http://www.w3.org/2000/svg";

const section = document.getElementById("stats");
console.log(section);
//
// fetch(siteUrl + "/api/stats")
//     .then(response => response.json())
//     .then(data => renderString(data));
//
// function renderString({userCount, vehicleCount, firstBooking, bookingCount}) {
//     section.textContent = (userCount < 1 ? userCount + " user has shared" : userCount +" users have shared ")
//         + vehicleCount + " " + (vehicleCount < 1 ? "vehicle " : "vehicles ") + "since " + firstBooking + " and completed " + bookingCount +" rides";
// }



//select Today Svg
const svgWidth = 600;
const svgHeight = 200;
const rectOffset = 5;
const data1 = [123, 245, 532, 3, 56, 654, 43, 36, 65, 34, 56, 234, 455, 65, 45, 465, 45, 23, 64, 34];


const todaySvgContainer = document.getElementById("todaySvg");
const todaySvg = createSvg(svgWidth, svgHeight, rectOffset, data1, todaySvgContainer)


const todaySvgLabels = document.createElement("div");
todaySvgLabels.classList.add("todaySvgLabels");
todaySvgContainer.append(todaySvgLabels);

console.log(todaySvg)




function createSvg(svgWidth, svgHeight, rectOffset, data, container) {
    const dataMax = Math.max(...data);
    //create the svg
    const svg = document.createElementNS(svgNameSpace, "svg");
    svg.setAttribute("width", svgWidth);
    svg.setAttribute("height", svgHeight);

    const labelContainer = document.createElement("div");
    labelContainer.classList.add("datalabel_container");
    labelContainer.setAttribute("width", svgWidth);
    labelContainer.setAttribute("height", "auto");


    data.forEach((d, i) => {




        //scale data value to svg height
        const rectHeight = svgHeight/dataMax*d;
        // create the rect that will visualize the data
        const rectTag = document.createElementNS(svgNameSpace, "rect");

        const xPos =  ((svgWidth -(rectOffset * data.length))/data.length * i) + (rectOffset * i);

        // position rectangle, account for svgWidth and offset
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

        //create label for the rect
        const rectLabel = document.createElement("text")
        rectLabel.classList.add("rectLabel");
        rectTag.append(rectLabel);

        //add the rect to the svg and return it
        svg.append(rectTag);

        const dataLabel = document.createElement("p");
        dataLabel.textContent = i;
        dataLabel.classList.add("dataLabel");
        dataLabel.setAttribute("style", "left:" +xPos+"px")

        // "left:" +xPos+"px")

        labelContainer.append(dataLabel);

    });
    container.append(svg)
    // container.append(labelContainer)




};
function createSvgLabels(svgWidth, svgHeight, rectOffset, data) {

};

const allRects = document.querySelectorAll('rect');

allRects.forEach(r => r.addEventListener("click", function (e)
{
console.log(e);
}))




//select all of the rect tags

//change the width
