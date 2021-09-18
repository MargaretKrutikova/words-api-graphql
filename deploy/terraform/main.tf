variable "region" {
  default = "Switzerland North"
}

variable "db_name" {
  default = "WordsDbTf"
}

variable "collection_name" {
  default = "WordsCollection"
}

# providers
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>2.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "wordsapp" {
  name     = "WordsGroup"
  location = var.region
}

resource "azurerm_cosmosdb_account" "cosmosaccount" {
  name                 = "tfcosmosaccount"
  location             = azurerm_resource_group.wordsapp.location
  resource_group_name  = azurerm_resource_group.wordsapp.name
  kind                 = "MongoDB"
  mongo_server_version = "4.0"

  consistency_policy {
    consistency_level = "Session"
  }

  capabilities {
    name = "EnableServerless"
  }

  capabilities {
    name = "EnableMongo"
  }

  geo_location {
    location          = azurerm_resource_group.wordsapp.location
    failover_priority = 0
  }

  backup {
    type                = "Periodic"
    interval_in_minutes = 1440
    retention_in_hours  = 48
  }

  offer_type = "Standard"
  # enable_free_tier = true
}

resource "azurerm_cosmosdb_mongo_database" "cosmosdb" {
  name                = var.db_name
  resource_group_name = azurerm_resource_group.wordsapp.name
  account_name        = azurerm_cosmosdb_account.cosmosaccount.name
}

output "cosmosdb_connectionstrings" {
  value     = azurerm_cosmosdb_account.cosmosaccount.connection_strings
  sensitive = true
}

resource "azurerm_cosmosdb_mongo_collection" "cosmoscollection" {
  name                = var.collection_name
  resource_group_name = azurerm_resource_group.wordsapp.name
  account_name        = azurerm_cosmosdb_account.cosmosaccount.name
  database_name       = azurerm_cosmosdb_mongo_database.cosmosdb.name
  index {
    keys = ["createdDate"]
  }
  index {
    keys   = ["_id"]
    unique = true
  }
}

resource "azurerm_app_service_plan" "wordsapp" {
  name                = "wordsapi-plan"
  location            = azurerm_resource_group.wordsapp.location
  resource_group_name = azurerm_resource_group.wordsapp.name
  kind                = "Linux"
  reserved            = true

  sku {
    tier = "Free"
    size = "F1"
  }
}

resource "azurerm_app_service" "wordsapp" {
  name                = "wordsapitf"
  location            = azurerm_resource_group.wordsapp.location
  resource_group_name = azurerm_resource_group.wordsapp.name
  app_service_plan_id = azurerm_app_service_plan.wordsapp.id

  app_settings = {
    "DeployDate"            = timestamp()
    "AppVersion"            = "localdeploy"
    "MONGO_URL"             = azurerm_cosmosdb_account.cosmosaccount.connection_strings[0]
    "MONGO_DB_NAME"         = var.db_name
    "MONGO_COLLECTION_NAME" = var.collection_name
  }

  site_config {
    linux_fx_version          = "NODE|12-lts"
    use_32_bit_worker_process = true
    app_command_line          = "node ./build/lib/index.js"
  }
}

output "webAppLink" {
  value = azurerm_app_service.wordsapp.name
}
