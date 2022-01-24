const { parseAttendance } = require("./api/attendance");
const { getEvents } = require("./api/events");
const { getVolunteers } = require("./api/volunteers");
const { generateCsv } = require("./util/generate-csv");

const years = [2021, 2022];

const init = async () => {
  const participants = await getVolunteers();
  const events = await getEvents(years);
  const attendees = await parseAttendance(events, years, participants);
  generateCsv(years.join(","), attendees);
};

init();
