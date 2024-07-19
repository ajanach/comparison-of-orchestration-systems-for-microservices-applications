# Project Overview
This documentation provides a comprehensive guide to setting up and managing Kubernetes clusters using both Azure Kubernetes Service (AKS) and k3s. It includes instructions for infrastructure setup, deploying application services, and configuring system services for monitoring and management. The aim of this thesis is to conduct a detailed comparison of different orchestration tools such as Azure Kubernetes Service, K3S. The comparison is based on a case study of orchestrating a microservices application of medium complexity consisting of 5 to 20 microservices. 

The two main results will be a formal process for selecting the optimal orchestration platform and a comprehensive comparison of the studied orchestration tools for the specific microservices application. The optimal orchestration tool will be selected based on the measured data and analysis of the collected information.

## Application Overview
Online Boutique is a cloud-first microservices demo application. The application is a web-based e-commerce app where users can browse items, add them to the cart, and purchase them. This application will be deployed using the orchestration tools being compared.

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
    git clone <repository_url>
    ```

2. Navigate to the infrastructure directory:
    ```bash
    cd aks/infrastructure
    ```
    Edit the terraform.tfvars with the correct credentials for your Terraform Service Provider.

3. Copy the example Terraform variables file:
    ```bash
    cp terraform.tfvars.example terraform.tfvars
    ```

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

4. Open your favorite browser and navigate to:
    ```bash
    http://<external_IP>
    ```

## AKS - System Services
Refer to the detailed documentation for deploying the monitoring stack in your AKS infrastructure:
[aks system-services README](aks/system-services/README.md), a step-by-step guide on setting up and accessing the kube-prometheus-stack using Helm in your k3s environment. The kube-prometheus-stack is a comprehensive monitoring solution that includes Prometheus, Grafana, and other essential monitoring components.


# K3S

## k3s - Infrastructure
The following table outlines the configuration in vSphere for virtual machines for the K3s Kubernetes Cluster:
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

Note: All editings are done in `aks/infrastructure` directory.

Edit the inventory file with appropriate IP addresses of your VMs:

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
k3s_server_ip: "<IP_CONTROL_PLANE_01>"  # Change to the correct IP address for the K3s master_1 server
```

Run ping playbooks to test reachability to managed hosts:
```bash
cd k3s/infrastructure
ansible -i inventory all -m ping
```

Run Ansible playbook to install production K3s Cluster:
```bash
ansible-playbook -i inventory k3s_install.yaml
```

You can test on your workstation if the Kubernetes cluster is available by running:
```bash
kubectl get nodes -o wide
```

Example output:
```bash
$ kubectl get nodes -o wide
NAME                   STATUS   ROLES                       AGE   VERSION        INTERNAL-IP    EXTERNAL-IP   OS-IMAGE                      KERNEL-VERSION                 CONTAINER-RUNTIME
ajanach-thesis-cp-01   Ready    control-plane,etcd,master   17h   v1.29.6+k3s2   10.10.48.151   <none>        Rocky Linux 9.4 (Blue Onyx)   5.14.0-427.24.1.el9_4.x86_64   containerd://1.7.17-k3s1
ajanach-thesis-cp-02   Ready    control-plane,etcd,master   17h   v1.29.6+k3s2   10.10.48.152   <none>        Rocky Linux 9.4 (Blue Onyx)   5.14.0-427.24.1.el9_4.x86_64   containerd://1.7.17-k3s1
ajanach-thesis-cp-03   Ready    control-plane,etcd,master   17h   v1.29.6+k3s2   10.10.48.153   <none>        Rocky Linux 9.4 (Blue Onyx)   5.14.0-427.24.1.el9_4.x86_64   containerd://1.7.17-k3s1
ajanach-thesis-wn-01   Ready    <none>                      17h   v1.29.6+k3s2   10.10.48.154   <none>        Rocky Linux 9.4 (Blue Onyx)   5.14.0-427.24.1.el9_4.x86_64   containerd://1.7.17-k3s1
ajanach-thesis-wn-02   Ready    <none>                      17h   v1.29.6+k3s2   10.10.48.155   <none>        Rocky Linux 9.4 (Blue Onyx)   5.14.0-427.24.1.el9_4.x86_64   containerd://1.7.17-k3s1
```

## K3s - Application Services

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
   Note: You will get a list of IP addresses, each representing the IP address of a node. This means that the application is available through the IP addresses of all nodes.

4. Open your favorite browser and navigate to:
    ```bash
    http://<external_IP>
    ```

## K3s - System Services
Refer to the detailed documentation for deploying the monitoring stack in your K3s infrastructure:
[k3s Infrastructure README](k3s/system-services/README.md), a step-by-step guide on setting up and accessing the kube-prometheus-stack using Helm in your k3s environment. The kube-prometheus-stack is a comprehensive monitoring solution that includes Prometheus, Grafana, and other essential monitoring components.
