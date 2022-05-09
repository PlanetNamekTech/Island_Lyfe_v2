const mon = require('mongoose');
const islands = require('./islands');
const { places, descriptors } = require('./seedHelpers');
const Island = require('../models/island');

mon.connect('mongodb://localhost:27017/island-lyfe');

const db = mon.connection;
db.on('error', console.error.bind(console, "Connection Error"));
db.once("open", () => {
  console.log("Database Connected");
});

const sample = (array) => array[Math.floor(Math.random()*array.length)];

const seedDB = async() => {
  await Island.deleteMany({});
  for(let i = 0; i < 50; i++){
    const rand1000 = Math.floor(Math.random()*1000);
    const island = new Island ({
      location: `${islands[rand1000].city}, ${islands[rand1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`
    })
    await island.save();
  }

}

seedDB().then(() =>{
  mon.connection.close();
})