import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 250 },  // ramp-up to 250 VUs
    { duration: '1m', target: 500 },  // ramp-up to 500  VUs
    { duration: '30s', target: 0 },   // ramp-down to 0 VUs
  ],
};

export default function () {
  let res = http.get('http://10.10.48.155');
  check(res, {
    'is status 200': (r) => r.status === 200,
  });
  sleep(1);
}