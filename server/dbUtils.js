if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}
const DB_URL = process.env.DB_URL;
const nano = require('nano')(DB_URL);

class db {
  constructor(db_name) {
    if (!!db.instance) {
      return db.instance;
    }

    this.db_name = db_name;
    db.instance = this.initDatabase(this.db_name);
    return this;
  }

  initDatabase(db_name) {
    nano.db.list()
      .then((dbList) => {
        if (dbList.indexOf(db_name) > -1) {
          this.setInstance();
        } else {
          nano.db.create(db_name).then(() => {
            this.setInstance();
            seedUsers(db_name);
          })
          .catch((err) => console.log('db create failed', err));
        }
      })
      .catch((e) => console.log('nano db list failed', e));
  }

  setInstance() {
    db.instance = nano.db.use(this.db_name);
    // console.log('db instance is now with', this.db_name);
  }

  getInstance() {
    // console.log('calling get an returning');
    return db.instance;
  }
}

const DB_NAME = 'fasebook';
const facebookDB = new db(DB_NAME);

const seedUsers = function(dbName) {
  const db = nano.use(dbName);
  const users = [
    {
      username: 'ivy',
      password: 'ivy'
    },
    {
      username: 'ladyGaga',
      password: 'lab'
    }
  ];
  db.bulk( { docs: users }).then((body) => {
    console.log('users added to db', body);
  });
}

const findDocs = function(q) {
  const db = facebookDB.getInstance();
  return db.find(q)
    .then((res) => res.docs)
    .catch((err) => {
      console.log(err);
      return [];
    });
};

const updateDoc = async function(q, update) {
  const db = facebookDB.getInstance();
  console.log("qquery", q);
  try {
    const result = await db.find(q);
    const updatedDoc = Object.assign(result.docs[0], update);
    db.insert(updatedDoc, (res) => {
      console.log('return from updated doc', res);
      return res;
    }).catch((err) => {
      console.log('error inserting update', updatedDoc);
    });
  } catch(err) {
    console.log('error finding and updating', err);
    return;
  }
}

module.exports = {
  findDocs,
  updateDoc,
  getDatabaseInstance: facebookDB.getInstance
};
