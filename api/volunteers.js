const { parse } = require("node-html-parser");
const fs = require("fs");
const { api } = require(".");

const getVolunteers = async () => {
  console.log("Getting volunteers....".blue.bold);
  const res = await api.post(
    "/volunteer/officer_change",
    new URLSearchParams({ per_page_count: "500" })
  );

  const root = parse(res.data);
  const table = root.querySelectorAll("#myTable > tbody > tr").map((e) => {
    const values = e.querySelectorAll("td");
    return {
      id: Number.parseInt(values[2].getAttribute("id").trim(), 10),
      name: values[2].childNodes[4].innerText.trim(),
      registrationId: values[6].innerText.trim(),
      enrollmentId: Number.parseInt(values[7].innerText.trim()),
    };
  });

  const parsedData = {};
  table.forEach((e) => {
    const { name, registrationId, enrollmentId, id } = e;
    parsedData[id] = {
      name,
      registrationId,
      enrollmentId,
      events: [],
    };
  });

  fs.writeFileSync(
    "./temp/participants.json",
    JSON.stringify(parsedData, null, 5)
  );
  return parsedData;
};

module.exports = { getVolunteers };
