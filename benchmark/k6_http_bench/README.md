
# K6 Load Testing Guide

This guide provides instructions for installing K6, configuring the load test script, and running it to perform load testing.

## Installation

### Installing K6

#### Ubuntu/Debian

To install K6 on Ubuntu or Debian, use the following commands:

```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

## Configuring the Load Test Script

1. **Edit the `load_test.js` Script**: 
   - Navigate to the directory containing the `load_test.js` script in GitHub folder.
   - Open the `load_test.js` file in a text editor.
   - Replace the `const BASE_URL = 'http://10.10.48.155/';` line with the actual URL of your service.

```javascript
const BASE_URL = 'http://<your_service_url>/';
```

2. Save the changes.

## Running the Load Test

To run the K6 load test, execute the following command:

```bash
k6 run load_test.js
```

### Explanation of the Script:

- **Stages**: The script defines three stages to simulate different phases of user activity:
  - `{ duration: '30s', target: 100 }`: Ramp-up to 100 virtual users (VUs) over 30 seconds.
  - `{ duration: '30s', target: 200 }`: Ramp-up to 200 VUs over the next 30 seconds.
  - `{ duration: '30', target: 0 }`: Ramp-down to 0 VUs, simulating the end of the load.

- **User Actions**: The script simulates a typical user journey:
  - **Visit Homepage**: Simulates a user visiting the homepage of the application.
  - **Browse Products**: Simulates browsing through product pages.
  - **Add to Cart**: Adds selected products to the shopping cart.
  - **Proceed to Checkout**: Simulates the checkout process, including entering payment and shipping information.
  - **Return to Homepage**: After completing the purchase, the user returns to the homepage.

- **Checks**: The script includes checks after each HTTP request to verify that the operation was successful by checking for a `200 OK` status.

- **Randomized Sleep**: The `sleep(randomIntBetween(1, 3))` function adds a randomized delay between actions to better simulate real user behavior.

## Viewing Results

K6 will display the results directly in the terminal, showing metrics such as response time, request rate, and error rates. This output provides insights into how well the application performs under the simulated load.
