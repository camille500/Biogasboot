# Biogasboot
Readme belonging to the interactive dashboard made for the Biogasboot, a project for Café de Ceuvel in Amsterdam.

## Description
The Biogasboot makes biogas out of organic waste. The project, created by the team of Café de Ceuvel, is in the making yet. On the boat are all kinds of sensors and other data resources that tell a lot of the proces inside. This project will focus on telling the whole story to Café de Ceuvel in a interactive way.

## Stakeholders
To deliver a well designed product, it's important to know who are the stakeholders. Here a short overview.

### The customer of Café de Ceuvel
The customers at the Ceuvel are from all different kinds. A lot of them are people who care about the planet. They mainly have a 'ecological' mindset. They are the main stakeholder in this project. After doing some research I found out that many of them are interested in the data from the Biogasboot.

### Café de Ceuvel
The second stakeholder is the Ceuvel itself. For them it's nice to give their customers insight in what the Biogasboot is exacty, and what is going on inside. In that way they can show what their contribution is to the world.

## How to use the dashboard
The dashboard is really simple in usage. It's a 'click and watch' concept where users are taken trough a story. On each screen is a text with data collected from te biogasboot. Those texts are provided with a animation to give more clarity. There are screens with relative data as well, like the amount of Kilograms CO2 that are saved.

Customers can do a check where they can see how much CO2 they saved by eating at Café de Ceuvel! By entering the amount of people they've eaten with, a personalized overview will appear! It's even possible to share it!

## Features

- Click trough the story of the Biogasboot
- Animations at each text to give more clarity
- Live data from the Biogasboot
- A special version for mobile and users without JavaScript
- Personalized check

## Data model
This is a overview of the data model for this application.

![Data model](/screenshots/datamodel.jpg "Data model")


## Featured features
This is an overview of all the interesting single features I've made for the Biogasboot dashboard, but also for the backend operator view that can be found [here](https://github.com/sjoerdbeentjes/biogasboot)

### API Endpoints
I've made these API endpoints to get the data from the database.

**Datapoints in specified range**

This endpoint is mainly used for the operator dashboard, but as well for the live data view at the customers dashboard. The endpoint is setup as below. It shows all instances, so no averages.

`/range?dateStart={timestamp}&dateEnd={timestamp}&api_key={api_key}`

```javascript
router.get('/range', (req, res, next) => {
  if (req.param('api_key') && req.param('api_key') == process.env.API_KEY) {
    const startDate = moment(Number(req.param('dateStart') * 1000));
    const endDate = moment(Number(req.param('dateEnd') * 1000));
    DataPoint.find({
      Date: {
        $gte: startDate.toDate(),
        $lt: endDate.toDate()
      }
    }).exec((err, data) => {
      res.send(data);
    });
  } else {
    res.send('No valid API key');
  }
});
```

**Average datapoints in specified range**

This endpoint uses the same data as the one above. The difference is that here you only get the average of each value within the range. So not all instances are available.

`/range/average?dateStart={timestamp}&dateEnd={timestamp}&api_key={api_key}`

```javascript
router.get('/range/average', (req, res, next) => {
  if (req.param('api_key') && req.param('api_key') == process.env.API_KEY) {
    const startDate = moment(Number(req.param('dateStart') * 1000));
    const endDate = moment(Number(req.param('dateEnd') * 1000));
    DataPoint.aggregate([{
      $match: {
          Date: {
            $gte: startDate.toDate(),
            $lt: endDate.toDate()
          }
        }
    },
    {
      $group: {
          _id: null,
          Temp_PT100_1: {
            $avg: '$Temp_PT100_1'
          },
          Temp_PT100_2: {
            $avg: '$Temp_PT100_2'
          },
          pH_Value: {
            $avg: '$pH_Value'
          },
          Bag_Height: {
            $avg: '$Bag_Height'
          },
          count: {
            $sum: 1
          }
        }
    }
    ], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  } else {
    res.send('No valid API key');
  }
});
```

**Gas status**

This endpoint is used to get the total amount of gas that has been generated by the Biogasboot, and used at the Café. I use it for the dashboard and to calculate for example the amount of kilograms CO2 that have been saved.

`/status/gas?api_key={api_key}`

```javascript
router.get('/status/gas', (req, res, next) => {
 if (req.param('api_key') && req.param('api_key') == process.env.API_KEY) {
    gasCalculation.total(req, res);
 } else {
    res.send('No valid API key');
 }
});
```

Here below the actual calculations

```javascript
// Load all datapoints
const DataPoint = require('../models/dataPoint');
// Object with methods for needed calculations
const gasCalculations = {
  total(req, res) {
    DataPoint.aggregate([
      {
        $project: {
          Bag_Height: "$Bag_Height",
        }
      },
      {
        $match: {
          Bag_Height: {
            $lte: 220,
            $gte: 20
          }
        }
      }
    ], (err, results) => {
      totalData = {
        used: 0,
        generated: 0
      }
      let last = 0;
      results.forEach(function(result) {
        totalGas = 2.82 * 2.34 * (result.Bag_Height / 100);
        if(last === 0) {
          last = totalGas;
        } else if(totalGas > last) {
          totalData.generated += totalGas - last;
        } else if(totalGas < last) {
          totalData.used += last - totalGas;
        }
        last = totalGas;
      })
      res.send(totalData)
    })

  }
}

module.exports = gasCalculations;
```

**Feed status**

This endpoint is used to get the amount of kilograms waste that has been pumped into the digester. I use this one as well for the dashboard view.

`/status/feed?api_key={api_key}`

```javascript
router.get('/status/feed/', (req, res, next) => {
  if (req.param('api_key') && req.param('api_key') == process.env.API_KEY) {
    feedCalculation.init(req, res);
  } else {
    res.send('No valid API key');
  }
});
```

Here the actual calculations

```javascript
const config = require('./config');
const StatusPoint = require('../models/statusPoint');

const feedCalculation = {
  init(req, res) {
    // Calculate the from date and the actual date
    StatusPoint.find({ }, (err, statuspoints) => {
        return feedCalculation.handleResult(statuspoints, req, res);
    });
  },
  handleResult(output, req, res) {
    let feedOn = false;
    let latestDate = false;
    let secondsOn = 0;
    output.forEach(function(data) {
      if(data['Storagetank_Feed'] == 1 && feedOn === false) {
        latestDate = new Date(data['Date']);
        feedOn = true;
      } else if(feedOn === true && data['Storagetank_Feed'] == 0) {
        let actualDate = new Date(data['Date']);
        let difference = (actualDate - latestDate) / 1000;
        /* Hack to solve the problem with false data, this if statement
           can be deleted as soon as the real data is pushed to the server */
        if(difference > 100) {
          difference = 0;
        }
        secondsOn += difference;
        feedOn = false;
      }
    });
    this.calculateAmount(secondsOn, req, res)
  },
  calculateAmount(seconds, req, res) {
    let data = {
      hours: hours = (seconds / 60) / 60,
      kilograms: hours * 256
    };
    res.send(data);
  }
}

module.exports = feedCalculation;
```

### GreenSock
For the animations in the dashboard I've used the GreenSock library. It comes in very handy when making a bit more complex animations. It makes use of timelines that makes it very scalable.

**Example of one of the animations**

```javascript
animation_2.to(elements.bucket, 2.25, {
    rotation: 160,
    ease: Power1.easeInOut
  }).staggerTo(elements.waste, 2, {
    y: -140,
    ease: Power1.easeInOut
  }, 0.25, "-=1.25")
  .to(elements.next[3], 1, {
    autoAlpha: 1
  });
```

## Testing
For testing purposes I've been to Café de Ceuvel multiple times. I've conducted a survey to get better insights of the users. Using all this data I've did multiple itterations. I've tested the application on a iPad with some customers as well.

I've been testing the application in the device lab too. Here are some images.

![Device lab](/screenshots/dl1.JPG "Device lab")

![Device lab](/screenshots/dl2.JPG "Device lab")

![Device lab](/screenshots/dl3.JPG "Device lab")

![Device lab](/screenshots/dl4.JPG "Device lab")

## Screenshots
Here some screenshots from the application

**Menu**

![Menu](/screenshots/1.png "Menu")
This is the first screen the users see when navigating to the website.

**Animation**

![Animation](/screenshots/2.png "Animation")
This is one of the animations of the app. Here below is another one.

![Animation](/screenshots/3.png "Animation")

**Check tool**
This is the tool where users can check how much CO2 they've saved by eating at Café de Ceuvel.

![Check](/screenshots/4.png "Check")

And below is the screen you see after filling in the form.

![Check result](/screenshots/5.png "Check result")

**Focus state**

![Check result](/screenshots/7.png "Check result")


## Wishlist

* [ ] Interactive view of the Biogasboot, with hover state
* [ ] Improved UI for the Check
* [ ] Actual calculations for the personalized check

## Dependecies

* [x] [`Body-parser`](https://www.npmjs.com/package/body-parser) Middleware for body parsing
* [x] [`Dotenv`](https://www.npmjs.com/package/dotenv) Load enviroment variables from .env files
* [x] [`EJS`](https://www.npmjs.com/package/ejs) Templating library (Embedded JavaScript templates)
* [x] [`Express`](https://www.npmjs.com/package/express) Web framework for NodeJS (routing)
* [x] [`Express-session`](https://www.npmjs.com/package/express-session) Middleware for creating sessions
* [x] [`Request`](https://www.npmjs.com/package/request) Client for HTTP requests
* [x] [`Socket.io`](https://www.npmjs.com/package/socket.io) Enables websockets
* [x] [`Compression`](https://www.npmjs.com/package/compression) Gzip compression

## Setup the application

### Clone the Repository
```console
git clone https://github.com/camille500/Biogasboot.git
cd Biogasboot
```

### Install all dependencies
```console
npm install
```

### Setup .env variables
Ask me for all the variables
```
SESSION_SECRET={session_secret}
API_URL=https://biogas-api.herokuapp.com/api
API_KEY={api_key}
MONGODB_URL=mongodb://{username}:{password}@ds143532.mlab.com:43532/biogasboot
```
