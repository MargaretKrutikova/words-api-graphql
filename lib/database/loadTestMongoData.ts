import assert from "assert"
import "../env"

import { MongoClient, MongoError } from "mongodb"

import config from "../config/mongo"
import { WordDbModel } from "../types"
import { nodeEnv } from "../util"

const mongoConfig = config[nodeEnv]
assert.notEqual(mongoConfig.url, undefined)

MongoClient.connect(
  mongoConfig.url!,
  { useNewUrlParser: true },
  (err: MongoError, mPool: MongoClient) => {
    assert.equal(null, err)

    mPool
      .db()
      .collection<WordDbModel>("words")
      .insertMany([
        {
          value: "att få sparken från jobbet",
          translations: ["to get fired"],
          createdDate: new Date()
        },
        {
          value: "knarka, knarkigt",
          translations: ["do drugs"],
          createdDate: new Date()
        },
        {
          value: "att lagra, lagring",
          translations: ["to store, storage"],
          createdDate: new Date()
        },
        {
          value: "att ta i som ett djur",
          explanations: ["t.ex. träning"],
          createdDate: new Date()
        },
        {
          value: "synvinkel",
          translations: ["point of view"],
          usages: ["från/ur min synvinkel"],
          createdDate: new Date()
        },
        {
          value: "inspirerad",
          usages: ["jag är inspirerad av någon"],
          createdDate: new Date()
        },
        {
          value: "att klumpa ihop",
          translations: ["lump together", "смешивать в кучу"],
          createdDate: new Date()
        },
        {
          value: "ivrig, ivrigt",
          translations: ["eager", "zealous", "усердно"],
          createdDate: new Date()
        },
        {
          value: "flitig",
          translations: ["diligent", "hard-working"],
          createdDate: new Date()
        },
        {
          value: "ytlig",
          translations: ["external", "superficial", "поверхностный"],
          createdDate: new Date()
        },
        {
          value: "petig",
          translations: ["мелочный"],
          explanations: ["för noggrann", "pedantisk"],
          createdDate: new Date()
        },
        {
          value: "kräsen",
          translations: ["picky"],
          explanations: ["om mat t.ex."],
          createdDate: new Date()
        },
        {
          value: "att glo, glor",
          translations: ["stare"],
          usages: ["vad glor du på? varför glor du?"],
          createdDate: new Date()
        },
        {
          value: "att flina, flinar",
          translations: ["smile", "ухмыляться"],
          usages: ["vad flinar du åt?"],
          explanations: ["oft negativt sammanhang"],
          createdDate: new Date()
        },
        {
          value: "fylla upp tomrum ",
          explanations: ["Säga någonting för att det inte ska bli tyst"],
          createdDate: new Date()
        },
        {
          value: "en fälla",
          translations: ["trap"],
          usages: ["musfälla - mouse trap"],
          createdDate: new Date()
        },
        {
          value: "fjäder",
          translations: ["spring, пружина"],
          createdDate: new Date()
        },
        {
          value: "föredömligt",
          translations: ["Образцовый, показательный "],
          createdDate: new Date()
        },
        {
          value: "skidskytte",
          translations: ["Biathlon"],
          createdDate: new Date()
        },
        {
          value: "förnedrande ",
          translations: ["Nedsättande, унизительно "],
          createdDate: new Date()
        },
        {
          value: "ångestladdad dag",
          createdDate: new Date()
        },
        {
          value: "giggig",
          translations: ["Липкий, слякотный "],
          createdDate: new Date()
        }
      ])
      .then(response => {
        console.log(response)
        mPool.close()
      })
  }
)
