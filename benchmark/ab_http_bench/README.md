
# AB HTTP Benchmark Guide

This guide provides instructions for installing Apache Benchmark (AB) and running a specific load testing command.

## Installation

### Prerequisites

- A Kubernetes cluster
- A web service running in your cluster

### Installing Apache Benchmark

Apache Benchmark is part of the `apache2-utils` package, which can be installed on various operating systems. Here are instructions for installing it on different platforms:

#### Ubuntu/Debian
```bash
sudo apt-get install apache2-utils
```

## Running the Benchmark

Replace `http://10.10.48.155/` with the actual URL of your service.

```bash
ab -k -n 1000 -c 100 -l -H "Accept-Encoding: gzip, deflate" http://10.10.48.155/
```

**Explanation of the command:**

- `-k`: Enables HTTP Keep-Alive, which means multiple requests will be sent over the same connection.
- `-n 1000`: Specifies the total number of requests to perform.
- `-c 100`: Specifies the concurrency level (1000 multiple requests at a time).
- `-l`: Accepts response sizes larger than the internal memory buffer.
- `-H "Accept-Encoding: gzip, deflate"`: Adds a custom HTTP header to the request.
- `http://10.10.48.155/`: The URL of the service being tested.

## Viewing Results

Apache Benchmark will display the results directly in the terminal, showing metrics such as requests per second, time per request, and more.
