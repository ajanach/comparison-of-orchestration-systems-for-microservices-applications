import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export let options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '30s', target: 200 },
    { duration: '30', target: 0 }, 
  ],
};

const BASE_URL = 'http://10.10.48.155/'; // replace with your Online Boutique URL

export default function () {
  group('Visit Homepage', function () {
    let res = http.get(`${BASE_URL}/`);
    check(res, {
      'Homepage loaded successfully': (r) => r.status === 200,
    });
    sleep(randomIntBetween(1, 3));
  });

  group('Browse Products', function () {
    let res = http.get(`${BASE_URL}/product/0PUK6V6EV0`);
    check(res, {
      'Product page loaded successfully': (r) => r.status === 200,
    });
    sleep(randomIntBetween(1, 3));

    res = http.get(`${BASE_URL}/product/9SIQT8TOJO`);
    check(res, {
      'Another product page loaded successfully': (r) => r.status === 200,
    });
    sleep(randomIntBetween(1, 3));
  });

  group('Add to Cart', function () {
    let res = http.post(`${BASE_URL}/cart`, JSON.stringify({ product_id: '0PUK6V6EV0', quantity: 1 }), {
      headers: { 'Content-Type': 'application/json' },
    });
    check(res, {
      'Product added to cart': (r) => r.status === 200,
    });
    sleep(randomIntBetween(1, 3));

    res = http.post(`${BASE_URL}/cart`, JSON.stringify({ product_id: '9SIQT8TOJO', quantity: 1 }), {
      headers: { 'Content-Type': 'application/json' },
    });
    check(res, {
      'Another product added to cart': (r) => r.status === 200,
    });
    sleep(randomIntBetween(1, 3));
  });

  group('Proceed to Checkout', function () {
    let res = http.get(`${BASE_URL}/cart`);
    check(res, {
      'Cart page loaded successfully': (r) => r.status === 200,
    });
    sleep(randomIntBetween(1, 3));

    res = http.post(`${BASE_URL}/cart`, JSON.stringify({
      email: 'user@example.com',
      street_address: '123 Main St',
      zip_code: '12345',
      city: 'Somewhere',
      state: 'CA',
      country: 'US',
      credit_card_number: '1234 5678 9012 3456',
      credit_card_expiration_month: '12',
      credit_card_expiration_year: '2030',
      credit_card_cvv: '123',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
    check(res, {
      'Checkout completed': (r) => r.status === 200,
    });
    sleep(randomIntBetween(1, 3));
  });

  group('Return to Homepage', function () {
    let res = http.get(`${BASE_URL}/`);
    check(res, {
      'Homepage loaded after checkout': (r) => r.status === 200,
    });
    sleep(randomIntBetween(1, 3));
  });
}