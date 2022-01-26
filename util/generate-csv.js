const fs = require("fs");
require("colors");

function generateCsv(time, attendees) {
  const header = [
    "ID",
    "Name",
    "Registration Id",
    "EnrollmentID",
    "Total Hours",
  ];

  let flag = false;

  const data = Object.keys(attendees)
    .map((id) => {
      const array = [];
      array.push(id);
      let totalHours = 0;
      const { name, registrationId, enrollmentId, events } = attendees[id];
      attendees[id].events.forEach((e) => (totalHours += e.hours));
      array.push(...[name, registrationId, enrollmentId, totalHours]);
      events.forEach((e) => array.push(e.hours));

      if (!flag) {
        events.forEach((e) => header.push(e.name.replace(/,/g, " ")));
        flag = true;
      }
      return array.join(",");
    })
    .join("\n");

  const finalData = [header, data].join("\n");

  fs.writeFileSync(`./out/${time}.csv`, finalData);
  console.log(`Generated result at out/${time}.csv`.yellow.bold);
}

module.exports = { generateCsv };
