const fs = require("fs");
require("colors");
const { parse } = require("node-html-parser");
const { api, pageLimit } = require(".");

const getEvent = async (year) => {
  const res = await api.post(
    "/activity/o_change",
    new URLSearchParams({
      act_year_s: year,
      per_page_count: pageLimit,
    })
  );

  const root = parse(res.data);
  const table = root.querySelectorAll("#myTable > tbody > tr").map((e) => {
    const values = e.querySelectorAll("td");
    const id = Number.parseInt(
      values[11]
        .querySelector("a")
        .getAttribute("href")
        .replace("https://www.apjaktunsscell.org/activity/o_edit/", ""),
      10
    );
    return {
      id,
      name: values[1].textContent.trim(),
      hours: Number.parseInt(values[8].textContent.trim(), 10),
      date: values[9].textContent.trim(),
    };
  });

  return table;
};

const getEventParticipants = async (payload) => {
  const res = await api.post(
    "/activity/show_participants",
    new URLSearchParams(payload)
  );
  const result = parse(res.data)
    .querySelectorAll(`input[name="act_volunteers[]"]`)
    .map((e) => {
      return {
        id: Number.parseInt(e.getAttribute("value"), 10),
        attended: e.getAttribute("checked") === undefined ? false : true,
      };
    });

  const parsedData = {};
  result.forEach((e) => {
    parsedData[e.id] = e.attended;
  });

  return parsedData;
};

const getEvents = async (years) => {
  console.log("Getting Events....".blue.bold);
  const total = [];
  await Promise.all(
    years.map(
      (e) =>
        new Promise(async (resolve) => {
          const data = await getEvent(e);
          total.push(...data);
          return resolve(data);
        })
    )
  );

  fs.writeFileSync("./temp/events.json", JSON.stringify(total, null, 5));
  return total;
};

module.exports = { getEvents, getEventParticipants };
