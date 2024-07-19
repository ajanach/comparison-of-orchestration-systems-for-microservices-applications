# Resource group containing all resources
resource "azurerm_resource_group" "resource_group" {
  name     = "${var.prefix}-rg"
  location = var.azure_location
}

resource "azurerm_kubernetes_cluster" "aks" {
  name                    = "${var.prefix}-aks"
  location                = azurerm_resource_group.resource_group.location
  resource_group_name     = azurerm_resource_group.resource_group.name
  dns_prefix              = "${var.prefix}-aks"
  sku_tier                = "Standard"


  default_node_pool {
    name                = "a2v2"
    node_count          = 2
    vm_size             = "Standard_A2_v2"
    type                = "VirtualMachineScaleSets"
    os_disk_size_gb     = 50
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin    = "kubenet"
    network_policy    = "calico"
    load_balancer_sku = "standard"
  }
}