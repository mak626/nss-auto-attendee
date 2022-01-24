const { getEventParticipants } = require("./events");
const fs = require("fs");

const parseAttendance = async (events, years, participants) => {
  let index = 1;
  const total = Object.keys(events).length;
  for (const event of events) {
    const count = `${index}/${total}`;
    console.log(`${count}: Fetching attendees for ${event.name}`.blue.bold);
    let attendance = {};
    await Promise.all(
      years.map(async (year) => {
        const res = await getEventParticipants({
          action: 3,
          act_unit_no: process.env.UNITNO,
          act_year: year,
          act_volunteers: "",
          activity_id: event.id,
        });
        attendance = { ...attendance, ...res };
      })
    );

    Object.keys(participants).forEach((e) => {
      participants[e]["events"].push({
        ...event,
        hours: attendance[e] === true ? event.hours : 0,
      });
    });
    console.log(
      `${count}: Done Fetching attendees for ${event.name}`.green.bold
    );
    fs.writeFileSync(
      "./temp/attendees.json",
      JSON.stringify(participants, null, 4)
    );
    index += 1;
  }

  return participants;
};

module.exports = { parseAttendance };
