# How to set up a simple Azure AKS environment

## Prerequisite

Terraform service principal account. If you don't have, create one following [this](https://learn.microsoft.com/en-us/azure/developer/terraform/authenticate-to-azure) link. 

## Setup

```shell
cp terraform.tfvars.example terraform.tfvars
```
Edit the `terraform.tfvars` with the correct credentials

Initialize terraform and apply the infrastructure
```shell
terraform init
terraform apply
```

Terraform will create following resources:
- Resource group
- Azure kubernetes cluster

## Test the cluster

First, we need to get the Kubernetes config from the Terraform state and store it in a file that kubectl can read.
```shell
echo "$(terraform output -raw kube_config)" > ~/.kube/k8s
```

We then set an environment variable so that kubectl picks up the correct config.
```shell
export KUBECONFIG=~/.kube/k8s
```

Check the health of the cluster
```shell
kubectl get nodes
```
