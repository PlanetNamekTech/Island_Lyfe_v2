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
    const rand2 = Math.floor(Math.random()*2);
    const hemis = ['Northern', 'Southern'];
    const island = new Island ({
      location: `${islands[rand1000].city}, ${islands[rand1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: 'https://source.unsplash.com/random/300x300/?beach',
      description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusantium ab labore aliquam iste, dolorum culpa fugiat similique laborum repudiandae dolore?',
      hemisphere: `${hemis[rand2]}`
    })
    await island.save();
  }

}

seedDB().then(() =>{
  mon.connection.close();
})