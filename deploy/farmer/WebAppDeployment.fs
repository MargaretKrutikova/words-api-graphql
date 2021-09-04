module Deploy.WebAppDeployment

open System
open Farmer
open Farmer.Builders

type AppSettings = {
    appVersion: string
    mongoConnectionString: string
    collectionName: string
}

let deployWebApp (resourceGroupName: string) (databaseName: string) (fullWebAppName: string) (publishedAppFolder: string) (appSettings: AppSettings) =
    let webApp = webApp {
        name fullWebAppName
        zip_deploy publishedAppFolder
        runtime_stack WebApp.Runtime.NodeLts
        operating_system OS.Linux
        sku WebApp.Sku.Free
        settings [
            ("DeployDate", DateTime.UtcNow.ToString("o"))
            ("AppVersion", appSettings.appVersion)
            ("MONGO_URL", appSettings.mongoConnectionString)
            ("MONGO_DB_NAME", databaseName)
            ("MONGO_COLLECTION_NAME", appSettings.collectionName)
        ]
        add_tag "app_name" fullWebAppName
    }

    let webSiteConfig =
        $"""{{
            "name": "{fullWebAppName}/web",
            "type": "Microsoft.Web/sites/config",
            "apiVersion": "2020-12-01",
            "dependsOn": [ "Microsoft.Web/sites/{fullWebAppName}" ],
            "properties": {{
                "appCommandLine": "node build/lib/index.js"
            }}
        }}"""
        |> Resource.ofJson

    let deployment = arm {
        location Location.NorthEurope
        add_resource webApp
        add_resource webSiteConfig
    }

    deployment
    |> Deploy.execute resourceGroupName Deploy.NoParameters
    |> ignore
