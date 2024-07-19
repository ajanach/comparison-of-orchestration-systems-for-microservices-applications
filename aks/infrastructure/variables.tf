variable "azure_subscription_id" {
  type        = string
  description = "Azure subscription id under which resources will be provisioned"
}

variable "azure_client_id" {
  type        = string
  description = "Azure client id used to create resources"
}

variable "azure_client_secret" {
  type        = string
  description = "Client secret used to authenticate with Azure apis"
}

variable "azure_tenant_id" {
  type        = string
  description = "Azure tenant id used to create resources"
}

variable "azure_location" {
  type        = string
  description = "Azure location used for all resources"
  default     = "westeurope"
}

variable "prefix" {
  type        = string
  description = "Prefix added to names of all resources"
  default     = "example"
}