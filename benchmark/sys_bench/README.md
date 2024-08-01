
# Benchmark Operator Installation and Sysbench Benchmark Deployment Guide

This guide provides step-by-step instructions for installing the Benchmark Operator and deploying Sysbench benchmarks to stress test CPU, memory, and I/O on your Kubernetes cluster.

## Installation

### Prerequisites

- A Kubernetes cluster
- `kubectl` command-line tool installed
- `git` installed

### Steps

1. **Clone the Benchmark Operator repository:**
   ```bash
   git clone https://github.com/cloud-bulldozer/benchmark-operator
   cd benchmark-operator
   ```

2. **Deploy the operator:**
   ```bash
   make deploy
   ```

This will install the Benchmark Operator in your Kubernetes cluster.

## Adjusted Sysbench CR Configuration

The following Custom Resource (CR) configuration will run Sysbench benchmarks to test CPU, memory, and I/O on specified nodes in your cluster.

### CR YAML Configuration

Content of a file named `sysbench-cr.yaml`, replace `<worker_node_01>` and `<worker_node_02>` with actual hostname of worker nodes:

```yaml
apiVersion: ripsaw.cloudbulldozer.io/v1alpha1
kind: Benchmark
metadata:
  name: sysbench-benchmark-01
  namespace: benchmark-operator
spec:
  workload:
    name: sysbench
    args:
      enabled: true
      pin_node: "<worker_node_01>"
      tests:
      - name: cpu
        parameters:
          cpu-max-prime: 1000
      - name: memory
        parameters:
          memory-block-size: 1M
          memory-total-size: 3G
          memory-scope: global
          memory-oper: read
          memory-access-mode: rnd
      - name: fileio
        parameters:
          file-test-mode: rndrw
---
apiVersion: ripsaw.cloudbulldozer.io/v1alpha1
kind: Benchmark
metadata:
  name: sysbench-benchmark-02
  namespace: benchmark-operator
spec:
  workload:
    name: sysbench
    args:
      enabled: true
      pin_node: "<worker_node_02>"
      tests:
      - name: cpu
        parameters:
          cpu-max-prime: 1000
      - name: memory
        parameters:
          memory-block-size: 1M
          memory-total-size: 3G
          memory-scope: global
          memory-oper: read
          memory-access-mode: rnd
      - name: fileio
        parameters:
          file-test-mode: rndrw
```

## Applying the Sysbench CR

1. **Apply the CR to the cluster:**
   ```bash
   kubectl apply -f sysbench-cr.yaml
   ```

This command deploys the Sysbench benchmark configuration to your Kubernetes cluster.

## Viewing Results

1. **Get the list of pods to find the Sysbench pods:**
   ```bash
   kubectl get pods -n benchmark-operator
   ```

2. **View the logs of the Sysbench pod to see the benchmark results (replace `<sysbench-pod-name>` with the actual pod name):**
   ```bash
   kubectl logs -f <sysbench-pod-name> -n benchmark-operator
   ```

You should see output similar to the following, showing the results of the Sysbench tests:

## Cleaning Up

To clean up the resources created by the benchmarks, delete the CRs:

```bash
kubectl delete -f sysbench-cr.yaml
```

This guide helps you install the Benchmark Operator and run Sysbench benchmarks on your Kubernetes cluster to test CPU, memory, and I/O performance.
