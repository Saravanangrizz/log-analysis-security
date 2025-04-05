import axios from 'axios';

axios.get('http://127.0.0.1:5000/api/logs')
  .then(res => {
    console.log(res.data);
  })
  .catch(err => {
    console.error('API Error:', err);
  });
