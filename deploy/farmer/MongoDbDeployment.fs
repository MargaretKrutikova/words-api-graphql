module Deploy.MongoDbDeployment

open Farmer
open Farmer.Arm.DocumentDb
open Farmer.Builders
open Farmer.CosmosDb

let [<Literal>] ConnectionStringOutputKey = "connection_string"

let deployMongoDb (databaseName: string) (collectionName: string) =
    let accountName = "kyacosmosdbaccount"
    let cosmosDb = cosmosDb {
        name databaseName
        account_name accountName
        free_tier
        consistency_policy ConsistencyPolicy.Session
        throughput 400<CosmosDb.RU>
        kind DatabaseKind.Mongo
    }

    let wordsCollection =
        $"""{{
            "name": "{accountName}/{databaseName}/{collectionName}",
            "type": "Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections",
            "apiVersion": "2021-06-15",
            "dependsOn": [
                "[resourceId('Microsoft.DocumentDB/databaseAccounts', '{accountName}')]"
            ],
            "properties": {{
                "resource": {{
                    "id": "{collectionName}",
                    "indexes": [
                        {{ "key": {{ "keys": [ "_id" ] }} }},
                        {{ "key": {{ "keys": [ "createdDate" ] }} }}
                    ]
                }}
            }}
        }}"""
        |> Resource.ofJson

    let mongoDeployment = arm {
        location Location.NorwayEast
        add_resource cosmosDb
    }

    let resourceGroupName = "KyaCosmosDbTest"
    mongoDeployment
    |> Deploy.execute resourceGroupName Deploy.NoParameters
    |> ignore

    // Azure sometimes crashes with InternalServerError when deploying in one step, thus this split "2-step" deployment
    let mongoDeploymentWithCollection = arm {
        location Location.NorwayEast
        add_resource wordsCollection
        add_resource cosmosDb
        output ConnectionStringOutputKey cosmosDb.PrimaryConnectionString
    }

    let mongoDeploymentOutputs =
        mongoDeploymentWithCollection
        |> Deploy.execute resourceGroupName Deploy.NoParameters

    mongoDeploymentOutputs.[ConnectionStringOutputKey]
