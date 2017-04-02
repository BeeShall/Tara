var express = require('express');
var request = require('request');
var removePunctuation = require('remove-punctuation');
var sw = require('stopword')
var router = express.Router();
var activity = require('./activity.js')

var verbs = ['VBP', 'VBZ', 'VBD', 'VBG','VBN', 'VBP'];
var nouns = ['NN','NNP','NNPS','NNS'];
var shopCategory = ['buy', 'purchase', 'shop', 'redeem'];
var watchCategory = ['watch', 'view', 'see', 'follow']
var outdoorCategory = ['play', 'visit', 'travel', 'hike', 'trek', 'walk', 'run', 'climb', 'fly', 'ride', 'tour', 'trip', 'sail', 'bike']
var eatCategory = ['eat', 'dine', ]
var categories = ["shopper", "media/film geek", "Outdoory", "Meat lover or eat lover?"]



function checkVerb(verb, i, callBack) {

  var url = "http://api.ultralingua.com/api/stems/english/" + verb + "?partofspeech=verb";

  request(url, function (err, response, body) {
    if (!err && response.statusCode == 200) {
      var root = JSON.parse(response.body)[0].root
      callBack(i,root);
      return;
    } else {
      //console.log(response.body)
      callBack(i, null);
    }
  })
}

function getSpellCheckedText(text, callBack) {
  //var text = "Ha vefun triingf owt theBin gspeller by typying a sentance or clcking teh sampels bellow";
  //console.log(text);

  var requestOptions = {
    url: "https://api.cognitive.microsoft.com/bing/v5.0/spellcheck/?",
    qs: {
      // Request parameters
      "text": text,
    },
    headers: {
      "Ocp-Apim-Subscription-Key": "70f1e020fbcd466a9bbe77461b091256"
    }
  }

  request(requestOptions, function (err, response, body) {
    if (!err && response.statusCode == 200) {
      var returnText = text;
      var tokens = text.flaggedTokens;
      for (var i in tokens) {
        returnText = returnText.replace((tokens[i].token).toString(), (tokens[i].suggestions[0].suggestion).toString())
      }
      console.log(returnText);
      callBack(returnText);
      return;
    }
  })
}

function analyzeText(detect, callBack) {
  //var text = "Its a great Monday because I bought a really cool shirt with a really cool GUcci jacket";
  //var text = "it was great watching pyscho with friend. I loved being scared with them. I want this blue dress from Chanel so bad. I wish I was not poor. This pair of shoes from Kenneth Cole is the finest I have seen so far. This is the funniest thing ever. #meme I had an amazing time hiking the ramapo trails today. Thank you friends for coming along. Hiking ramapo trails again. I am very excited. Going to the rocky mountain hiking with my girlfriend."
//console.log(detect);
  //detect = detect.join(" ");
  var text = detect;
  getSpellCheckedText(text, function (returnText) {
    text = returnText;
    var text = getTokens(returnText).join(' ');
    //console.log(text);
    var requestOptions = {
      //url: "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/"+detect,
      url: "https://westus.api.cognitive.microsoft.com/linguistics/v1.0/analyze",
      method: "POST",
      json: {
        "language": "en",
        "analyzerIds": ["22a6b758-420f-4745-8a3c-46835a67c0d2"],
        "text": text
      },
      headers: {
        "Content-Type": "application/json",
        //"Ocp-Apim-Subscription-Key": "b95dcb00f99a45ea8e7b31fc9d5e0cea"
        "Ocp-Apim-Subscription-Key": "99aa200fbbc64332b28e92a1a22c26c6"
      }
    }

    request(requestOptions, function (err, response, body) {
      if (!err && response.statusCode == 200) {
        //console.log(JSON.stringify(response.body[0]['result'][0]))
        tobeParsed = response.body[0]['result'][0];
        var arr = tobeParsed.split(/[\(|\)| ]+/);
        var neededVerb = [];
        console.log("THis is the array after split")
        console.log(arr);
        var all = [];
        var lastVerbIndex = -1;

        for (var i = 0; i < arr.length; i++) {
          if (verbs.includes(arr[i])) {
            var index = getIndex(arr[i+1], all);

            if (index == -1) {
              console.log("Adding verb activity " + arr[i+1]);
              var ob = new activity(arr[i+1]);
              all.push(ob);
              lastVerbIndex = all.length - 1;
            }
            else {
              console.log("Increasing count for verb " + all[index].name)
              all[index].increaseCount();
              lastVerbIndex = index;
            }
          }
          else if (nouns.includes(arr[i])){
            if (lastVerbIndex != -1) {
              all[lastVerbIndex].addDescription(arr[i+1]);
            }
            else {
              console.log("Adding verb activity " + arr[i+1]);
              var ob = new activity(arr[i+1]);
              all.push(ob);

              // Just ignore
            }
          }

/*
            if (i + 1 < arr.length) {
              neededVerb.push(arr[i + 1]);
            }*/
          }
        


        //console.log(neededVerb.join(","));
        //callBack(neededVerb);
        callBack(all);
      }

      else {
        console.log(err, response);
      }
    });

  });




}



function getTokens(keywords) {
  var tokens = removePunctuation(keywords).split(" ");
  tokens = sw.removeStopwords(tokens)
  console.log(tokens);
  return tokens;

}

router.get('/',function (req,res, next) {

  res.render('index', {title: "Tara"});
})

/* GET home page. */
router.post('/analyze', function (req, res, next) {
  //console.log(req.body)
  
  analyzeText(req.body.data, function (x) {

    // X is the tree
    var test = x;
    var i = 0;

    
    
    var p = function (i,y) {
      
      if (i < test.length) {
        if(y) test[i-1].name=y;
        checkVerb(test[i].name,++i, p);
      } else {

        var categorizedVals = normalizeList(test);

        // sort each categories.
        for (var j in categorizedVals) {
          var category = categorizedVals[j];
          
          if (category) {
            category.sort(function (a, b) {
              return a.count > b.count;
            })
          }
        }


        // Test print
        console.log(JSON.stringify(categorizedVals));
        res.send(categorizedVals);

        
      }
    }
    checkVerb(test[i].name,++i,p);




  });
  //
  //var test = ["bought","ate"];
 
/*
  var arr1 = ["watch", "movie", "play", "hockey","watch", "horror", "watch", "horror"];
  var arr2 = ["V", "N", "V", "N", "V", "N", "V", "N"]

  var all = [];
  var lastVerbIndex = -1;

  for (var i in arr1) {
    if (arr2[i] == "V") {
        var index = getIndex(arr1[i], all);
        console.log(index);

        if (index == -1) {
            var ob = new activity(arr1[i]);
            all.push(ob);
            lastVerbIndex = all.length -1;
        }
        else {
          //console.log("increasing count to " + all[index].count + ' of ' + all[index].name);
            all[index].increaseCount();
            lastVerbIndex = index;
        }

    }
    else {
      // If not V but noun. Add it inside existing V
      console.log("Checking last verb of " + all[lastVerbIndex].name + " in " + arr1[i]);
      if (lastVerbIndex != -1) {
        all[lastVerbIndex].addDescription(arr1[i]);
      }
      else {
        // just ignore
        console.log("Ignoring")
      }
    }
  }

  var current = all;

  while (current.length > 0 ){
    var maxOne = getMax(current);
    console.log("------")
    console.log(maxOne.name);
    current = maxOne.next;
  }
  */


});

function getMax(givenList) {
  var maxi = givenList[0];
  for (var i in givenList) {
    if (givenList[i].count > maxi.count) {
      maxi = givenList[i];
    }
  }

  return maxi;
}

function getIndex(term, givenList) {
  for (var i in givenList) {
    if (givenList[i].name == term) return i;
  }
  return -1;
}

function normalizeList(verbGiven) {
  var catList = [[],[],[],[]];
  //console.log(verbGiven);


  for (var index in verbGiven) {
    var item = verbGiven[index];
    var itemName = item.name;
    //console.log("Item name normalization: " + itemName);

    if (shopCategory.includes(itemName)) {
      catList[0].push(item);
    } else if (watchCategory.includes(itemName)) {
      catList[1].push(item);
    } else if (outdoorCategory.includes(itemName)) {
      catList[2].push(item);
    } else if (eatCategory.includes(itemName)){
      catList[3].push(item);
    }

  }
/*
  for (var index in verbGiven) {
    var item = verbGiven[index];
    console.log(item);
    if (shopCategory.includes(item)) {
      catList[0].push(item);
    } else if (watchCategory.includes(item)) {
      catList[1].push(item);
    } else if (outdoorCategory.includes(item)) {
      catList[2].push(item);
    } else if (eatCategory.includes(item)){
      catList[3].push(item);
    }
  }
  console.log(catList.join(","))
  */
  return catList;
}

module.exports = router;