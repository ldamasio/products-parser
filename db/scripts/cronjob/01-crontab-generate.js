require('cron.config.js')
const fs = require('fs');

const content = '* * * * * root node /usr/src/app/your_job_file.js >> /var/log/cron.log 2>&1';

fs.writeFile('/app/test.txt', content, err => {
  if (err) {
    console.error(err);
  }
});

