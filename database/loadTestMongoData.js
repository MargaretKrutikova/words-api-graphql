const { MongoClient } = require('mongodb');
const assert = require('assert');
const { nodeEnv } = require('../lib/util');
const mongoConfig = require('../config/mongo')[nodeEnv];

MongoClient.connect(mongoConfig.url, (err, db) => {
  assert.equal(null, err);

  db.collection('words').insertMany([
    { 
      'value': 'att få sparken från jobbet', 
      'translations': ['to get fired'] 
    },
    { 
      'value': 'knarka, knarkigt', 
      'translations': ['do drugs'] 
    },
    { 
      'value': 'att lagra, lagring', 
      'translations': ['to store, storage'] 
    },
    { 
      'value': 'att ta i som ett djur', 
      'explanations': ['t.ex. träning'] 
    },
    { 
      'value': 'synvinkel', 
      'translations': ['point of view'],
      'usages': [ 'från/ur min synvinkel' ]
    },
    { 
      'value': 'inspirerad', 
      'usages' : ['jag är inspirerad av någon'] 
    },
    { 
      'id': 7, 
      'value': 'att klumpa ihop', 
      'translations' : ['lump together', 'смешивать в кучу'] 
    },
    { 
      'value': 'ivrig, ivrigt', 
      'translations' : ['eager', 'zealous', 'усердно'] 
    },
    { 
      'value': 'flitig', 
      'translations' : ['diligent', 'hard-working'] 
    },
    { 
      'value': 'ytlig', 
      'translations' : ['external', 'superficial', 'поверхностный'] 
    },
    { 
      'value': 'petig', 
      'translations' : ['мелочный'],
      'explanations':  ['för noggrann', 'pedantisk' ] 
    },
    { 
      'value': 'kräsen', 
      'translations' : ['picky'],
      'explanations':  ['om mat t.ex.' ] 
    },
    { 
      'value': 'att glo, glor', 
      'translations' : ['stare'],
      'usages':  ['vad glor du på? varför glor du?' ] 
    },
    { 
      'value': 'att flina, flinar', 
      'translations' : ['smile', 'ухмыляться'],
      'usages':  ['vad flinar du åt?' ],
      'explanations':  ['oft negativt sammanhang' ] 
    }
  ]).then(response => {
    console.log(response);
    db.close();
  });
});
