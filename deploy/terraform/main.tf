variable "region" {
  default = "Switzerland North"
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

# resource "azurerm_cosmosdb_account" "cosmosaccount" {
#   name     = "tfcosmosaccount"
#   location = azurerm_resource_group.wordsapp.location
#   capabilities {
#     name = "EnableServerless"
#   }
#   offer_type       = "Standard"
#   enable_free_tier = true
# }

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
    # "WEBSITE_NODE_DEFAULT_VERSION" = "12.13.0"
    "DeployDate"            = timestamp()
    "AppVersion"            = "localdeploy"
    "MONGO_DB_NAME"         = "WordsDb"
    "MONGO_COLLECTION_NAME" = "words_localtest"
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
