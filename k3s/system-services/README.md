# k3s - System Services
This documentation provides a step-by-step guide on setting up and accessing the `kube-prometheus-stack` using Helm in your k3s environment. The `kube-prometheus-stack` is a comprehensive monitoring solution that includes Prometheus, Grafana, and other essential monitoring components.

## Prerequisites
- k3s cluster
- Helm installed and configured
- kubectl configured to interact with your cluster

## Installation

### Step 1: Add Prometheus Community Helm Repository
Add the `prometheus-community` Helm repository to your Helm client:
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```

### Step 2: Install kube-prometheus-stack
Install the `kube-prometheus-stack` Helm chart:
```bash
helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack --version 61.3.1
```

### Step 3: Verify Installation
Check the status of the installed pods:
```bash
kubectl --namespace default get pods -l "release=kube-prometheus-stack"
```

## Accessing Grafana

### Step 4: Port Forward to Access Grafana GUI
To access the Grafana GUI, set up port forwarding:
```bash
kubectl port-forward svc/kube-prometheus-stack-grafana 3000:80 &
```
**Note:** It may take a few minutes for the `kube-prometheus-stack` to be online.

After setting up port forwarding, open your favorite browser and navigate to http://localhost:3000.

You will be prompted for a username and password:

**Username**: `admin`  
**Password**: `prom-operator`

## Importing Dashboards
Grafana dashboards allow you to visualize metrics and monitor your AKS environment effectively. Follow these steps to import the necessary dashboards:

### Step 5: Import Dashboards
1. Access Grafana:
    - Open http://localhost:3000 in your browser.

2. Navigate to Import Dashboard:

    - Click Dashboards in the primary menu.
    - Click New and select Import from the drop-down menu.

3. Import Dashboard:
- Perform one of the following steps:
    - Upload a Dashboard JSON File: Upload the JSON file of the dashboard.
    - Paste a Grafana.com Dashboard URL or ID: Use the IDs provided below:
        - Dashboard ID:
            - 1860
            - 14282
    - Paste Dashboard JSON Text: Directly paste the JSON text of the dashboard.
4. Configure Dashboard:

    - (Optional) Change the dashboard name, folder, or UID.
    - Specify metric prefixes, if the dashboard uses any.

5. Select Data Source:

    - If required, select the appropriate data source.

6. Finalize Import:

    - Click Import.
    - Save the dashboard.

By following these steps, you can successfully monitor and manage your AKS environment using the kube-prometheus-stack and Grafana.