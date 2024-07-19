output "kube_config" {
  description = "Kube configuration of AKS Cluster"
  value       = azurerm_kubernetes_cluster.aks.kube_config_raw
  sensitive   = true
}