
const last_id = 9999999999;

for (let step = 0; step < last_id; step++) {
  id = (step).toLocaleString('en-US', { minimumIntegerDigits: 10, useGrouping: false });
  console.log(id);
}



