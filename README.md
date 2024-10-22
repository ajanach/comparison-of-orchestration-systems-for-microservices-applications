# Project Overview

This repository is part of a case study that compares different orchestration tools, specifically Azure Kubernetes Service (AKS) and K3S. The study provides a detailed guide for deploying infrastructure, application services, and system services in both AKS and K3S Kubernetes clusters.

The primary objective is to orchestrate a medium-complexity microservices application (consisting of 15 microservices) and evaluate the performance, cost-effectiveness, and ease of use of these orchestration tools.

In this repository, you can find:
- **Key factors** to consider when selecting an orchestration system.
- Guidelines on **when to use AKS vs K3S**, highlighting their strengths in different scenarios.
- How to **benchmark the performance** of orchestration systems.
- How to **estimate the costs** of running microservices applications in the cloud versus on-premise.
- **Basic knowledge** about Kubernetes, AKS, and K3S.
- How to use **Terraform** to deploy infrastructure in Azure.
- How to use **Ansible** to automate the configuration and deployment of a K3S cluster.
- How to use **YAML manifests** to configure Kubernetes resources.
- How to use **Helm** to deploy **Prometheus** and **Grafana** for monitoring.

## Master's Thesis Defense Video
For a more in-depth explanation of the project, you can watch my Master's thesis defense video (in Croatian): [YouTube: Master's Thesis Defense](https://youtu.be/kA0KqmDsE-o?si=t1cm3dUOhIdhaBtB)

## Application Overview
For testing purposes, the Online Boutique application is deployed using the orchestration tools being compared. Online Boutique is a web-based e-commerce app where users can browse items, add them to the cart, and purchase them.

URL of GitHub repo to microservices-demo application: [microservices-demo](https://github.com/GoogleCloudPlatform/microservices-demo)

# AKS

## AKS - Infrastructure

### Requirements

- terraform
- kubectl
- helm

### Steps

1. Clone the GitHub repository:
    ```bash
    git clone https://github.com/ajanach/comparison-of-orchestration-systems-for-microservices-applications.git
    ```

2. Navigate to the infrastructure directory:
    ```bash
    cd aks/infrastructure
    ```
3. Copy the example Terraform variables file:
    ```bash
    cp terraform.tfvars.example terraform.tfvars
    ```
   **NOTE:** The terraform.tfvars file should be edited with the correct credentials for the Terraform service provider on Azure.

4. Initialize Terraform:
    ```bash
    terraform init
    ```

5. Plan the Terraform deployment:
    ```bash
    terraform plan
    ```

6. Apply the Terraform plan:
    ```bash
    terraform apply
    ```

7. Configure kubectl:
    ```bash
    mkdir ~/.kube
    terraform output -raw kube_config > ~/.kube/config
    ```

8. Verify the nodes:
    ```bash
    kubectl get nodes
    ```
   Output as a reference:
    ```bash
    NAME                           STATUS   ROLES   AGE     VERSION
    aks-a2v2-96764596-vmss000000   Ready    agent   3m36s   v1.28.10
    aks-a2v2-96764596-vmss000001   Ready    agent   3m41s   v1.28.10
    ```

## AKS - Application Services

Deploy the microservices demo application:

1. Navigate to the application services directory:
    ```bash
    cd aks/application-services
    ```

2. Apply the Kubernetes manifests:
    ```bash
    kubectl apply -f kubernetes-manifests.yaml
    ```

3. Retrieve the external IP address to access the web GUI:
    ```bash
    kubectl get service frontend-external | awk '{print $4}'
    ```

4. Open favorite browser and navigate to:
    ```bash
    http://<external_IP>
    ```
   **Note:** It may take a few minutes for the platform to be online.

## AKS - System Services
Refer to the detailed documentation for deploying the monitoring stack in the AKS infrastructure:
[aks system-services README](aks/system-services/README.md).This step-by-step guide covers setting up and accessing the kube-prometheus-stack using Helm in a K3S environment. The kube-prometheus-stack is a comprehensive monitoring solution that includes Prometheus, Grafana, and other essential monitoring components.


# K3S

## K3S - Infrastructure
The following table outlines the configuration in vSphere for virtual machines for the K3S Kubernetes Cluster:
| Host                    | CPUs | Total RAM (GB) | OS Disk Size (GB) |
|-------------------------|------|----------------|--------------------|
| ajanach-thesis-cp-01    | 2    | 4.06           | 50.00              |
| ajanach-thesis-cp-02    | 2    | 4.06           | 50.00              |
| ajanach-thesis-cp-03    | 2    | 4.06           | 50.00              |
| ajanach-thesis-wn-01    | 2    | 4.06           | 50.00              |
| ajanach-thesis-wn-02    | 2    | 4.06           | 50.00              |

### **Ansible:**

Requirements:

- ansible
- kubectl
- helm

1. Clone the GitHub repository:
    ```bash
    git clone https://github.com/ajanach/comparison-of-orchestration-systems-for-microservices-applications.git
    ```

2. Navigate to the infrastructure directory:
    ```bash
    cd k3s/infrastructure
    ```

**Note:** All editings are done in `k3s/infrastructure` directory.

Edit the inventory file with appropriate IP addresses of VMs:

```ini
[master_1]
ajanach-thesis-cp-01 ansible_host=<IP_CONTROL_PLANE_01>

[master_2]
ajanach-thesis-cp-02 ansible_host=<IP_CONTROL_PLANE_01>
ajanach-thesis-cp-03 ansible_host=<IP_CONTROL_PLANE_01>

[worker]
ajanach-thesis-wn-01 ansible_host=<IP_CONTROL_PLANE_01>
ajanach-thesis-wn-02 ansible_host=<IP_CONTROL_PLANE_01>

[production:children]
master_1
master_2
worker
```

Edit ansible.cfg with the appropriate username:
```ini
[defaults]
inventory = inventory
remote_user = <USERNAME> ; change user if needed
ask_pass = false

[privilege_escalation]
become = true
become_user = root
become_method = sudo
become_ask_pass = false
```

Edit vars.yaml:
```yaml
k3s_server_ip: "<IP_CONTROL_PLANE_01>"  # Change to the correct IP address for the K3S master_1 server
```

Run ping playbooks to test reachability to managed hosts:
```bash
ansible -i inventory all -m ping
```

Run Ansible playbook to install production K3S Cluster:
```bash
ansible-playbook -i inventory k3s_install.yaml
```

The availability of the Kubernetes cluster can be tested on the workstation by running:
```bash
kubectl get nodes -o wide
```

Example output:
```bash
NAME                   STATUS   ROLES                       AGE   VERSION        INTERNAL-IP    EXTERNAL-IP   OS-IMAGE                      KERNEL-VERSION                 CONTAINER-RUNTIME
ajanach-thesis-cp-01   Ready    control-plane,etcd,master   17h   v1.29.6+k3s2   10.10.48.151   <none>        Rocky Linux 9.4 (Blue Onyx)   5.14.0-427.24.1.el9_4.x86_64   containerd://1.7.17-k3s1
ajanach-thesis-cp-02   Ready    control-plane,etcd,master   17h   v1.29.6+k3s2   10.10.48.152   <none>        Rocky Linux 9.4 (Blue Onyx)   5.14.0-427.24.1.el9_4.x86_64   containerd://1.7.17-k3s1
ajanach-thesis-cp-03   Ready    control-plane,etcd,master   17h   v1.29.6+k3s2   10.10.48.153   <none>        Rocky Linux 9.4 (Blue Onyx)   5.14.0-427.24.1.el9_4.x86_64   containerd://1.7.17-k3s1
ajanach-thesis-wn-01   Ready    <none>                      17h   v1.29.6+k3s2   10.10.48.154   <none>        Rocky Linux 9.4 (Blue Onyx)   5.14.0-427.24.1.el9_4.x86_64   containerd://1.7.17-k3s1
ajanach-thesis-wn-02   Ready    <none>                      17h   v1.29.6+k3s2   10.10.48.155   <none>        Rocky Linux 9.4 (Blue Onyx)   5.14.0-427.24.1.el9_4.x86_64   containerd://1.7.17-k3s1
```

## K3S - Application Services

Deploy the microservices demo application:

1. Navigate to the application services directory:
    ```bash
    cd k3s/application-services
    ```

2. Apply the Kubernetes manifests:
    ```bash
    kubectl apply -f kubernetes-manifests.yaml
    ```

3. Retrieve the external IP address to access the web GUI:
    ```bash
    kubectl get service frontend-external | awk '{print $4}'
    ```
   **Note:** A list of IP addresses will be provided, each representing the IP address of a node. This means that the application is available through the IP addresses of all nodes.

4. Open favorite browser and navigate to:
    ```bash
    http://<external_IP>
    ```
   **Note:** It may take a few minutes for the platform to be online.

## K3S - System Services
Refer to the detailed documentation for deploying the monitoring stack in the K3S system-services:
[K3S system-services README](k3s/system-services/README.md). This step-by-step guide covers setting up and accessing the kube-prometheus-stack using Helm in a K3S environment. The kube-prometheus-stack is a comprehensive monitoring solution that includes Prometheus, Grafana, and other essential monitoring components.

# Benchmarking Worker Nodes

## Benchmarking Guides
[Sysbench Benchmark Guide](benchmark/sys_bench/README.md): This guide provides instructions for running Sysbench to test CPU, memory, and I/O performance on your Kubernetes cluster.

[AB HTTP Benchmark Guide](benchmark/ab_http_bench/README.md): This guide covers the installation and execution of Apache Benchmark (AB) for HTTP load testing.

[K6 HTTP Benchmark Guide](benchmark/k6_http_bench/README.md): This guide explains how to install and run K6 for performance testing with a script.