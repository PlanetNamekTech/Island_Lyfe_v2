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
      author: '62859a652fbde3c4449a20f0', // Sam for setting up author (Authorization)
      location: `${islands[rand1000].city}, ${islands[rand1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusantium ab labore aliquam iste, dolorum culpa fugiat similique laborum repudiandae dolore?',
      hemisphere: `${hemis[rand2]}`,
      geometry: {
        type: "Point",
        coordinates: [-81.0481, -4.1031]
      },
      images: [
        {
          url: 'https://res.cloudinary.com/siracha/image/upload/v1653169033/YelpCamp/ucwmhbo7yrhcxbvwtjgm.jpg',
          filename: 'YelpCamp/ucwmhbo7yrhcxbvwtjgm'
        },
        {
          url: 'https://res.cloudinary.com/siracha/image/upload/v1653169041/YelpCamp/abvgdovv68ekir2mzzto.jpg',
          filename: 'YelpCamp/abvgdovv68ekir2mzzto'
        }
      ]
    })
    await island.save();
  }

}

seedDB().then(() =>{
  mon.connection.close();
})