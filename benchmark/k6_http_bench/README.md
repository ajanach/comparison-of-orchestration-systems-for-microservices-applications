
# K6 Load Testing Guide

This guide provides instructions for installing K6, creating a load test script, and running it to perform load testing on your web service.

## Installation

### Prerequisites

- A Kubernetes cluster
- `kubectl` command-line tool installed

### Installing K6

#### Ubuntu/Debian
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

## Creating the Load Test Script

Create a file named `load_test.js` with the following content:

Replace `http://10.10.48.155/` with the actual URL of your service.

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 250 },  // ramp-up to 250 VUs
    { duration: '1m', target: 500 },  // ramp-up to 500 VUs
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
```

## Running the Load Test

Run the K6 load test with the following command:

```bash
k6 run load_test.js
```

### Explanation of the Script:

- **Stages**: Defines the different phases of the test.
  - `{ duration: '30s', target: 250 }`: Ramp-up to 250 virtual users (VUs) over 30 seconds.
  - `{ duration: '1m', target: 500 }`: Ramp-up to 500 VUs over 1 minute.
  - `{ duration: '30s', target: 0 }`: Ramp-down to 0 VUs over 30 seconds.
- **HTTP Request**: The script performs a GET request to `http://10.10.48.155`.
- **Checks**: Verifies that the response status is 200.
- **Sleep**: Adds a sleep of 1 second between each iteration.

## Viewing Results

K6 will display the results directly in the terminal, showing metrics such as response time, request rate, and more.

## Cleaning Up

To clean up, simply delete the `load_test.js` file if it is no longer needed.
