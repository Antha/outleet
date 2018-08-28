/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 function getPosition() {
   var options = {
      enableHighAccuracy: true,
      maximumAge: 3600000
   }

   $("#loading").html("<img src='img/loading.gif' />");
   var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

   function onSuccess(position) {
     $("#loading").html("");
     var lat = position.coords.latitude;         
     var lang = position.coords.longitude; 
     app.viewOutlet(lat,lang);
   };

   function onError(error) {
      //alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
      $("#loading").html("");
      var lat = -8.617200227 ;
      var lang = 115.1690177 ;
      app.viewOutlet(lat,lang);
   }

}

function getMyPosition(){
  var options = {
      enableHighAccuracy: true,
      maximumAge: 3600000
   }

   $("#loading").html("<img src='img/loading.gif' />");
   var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

   function onSuccess(position) {
     $("#loading").html("");
     var lat = position.coords.latitude;         
     var lang = position.coords.longitude; 
     goto(lat,lang);
   };

   function onError(error) {
      //alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
      $("#loading").html("");
      var lat = -8.617200227 ;
      var lang = 115.1690177 ;
      goto(lat,lang);
   }
}

function googleMap(lat,lang){
        myLatlng = new google.maps.LatLng(lat,lang);
        mapOptions = {zoom: 8,center: myLatlng}
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

function googleMapPos(lat,lang,iconurl){
        var icon = {
            url: "http://maps.google.com/mapfiles/ms/icons/"+iconurl,
            labelOrigin: new google.maps.Point(0, 0),
            size: new google.maps.Size(32,32),
            anchor: new google.maps.Point(0,0)
        };

        //Google Maps
        myLatlng = new google.maps.LatLng(lat,lang);
        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            animation: google.maps.Animation.DROP,
            icon: icon
        });
}

function goto(lat,long){
  googleMapPos(lat,long,"orange-dot.png");
  map.setZoom(17);      // This will trigger a zoom_changed on the map
  map.setCenter(new google.maps.LatLng(lat, long));
}

function insertMap(lat,lang,people){
        //fetch data
        $.ajax({
             type: "POST",
             url:"https://zennagames.000webhostapp.com/android_data/fivefoot/insert.php",
             data: {LAT:lat,LONG:lang,PEOPLE:people},
             crossDomain: true,
             cache: false,
             success: function(data){
                 dataParsed = JSON.parse(data);
                 //alert(dataParsed["PEOPLE"]);

                 /*for (var i = 0; i < LONG.length; i++) {
                    googleMapPos(LAT[i],LONG[i],"red.png");
                 }*/
             }
        });
}

function viewOutlet(lat,lang){
        //fetch data satellite outlet
        $.ajax({
             type: "POST",
             url:"http://10.67.98.98/mapsbligusto/branch/outleet/bali_v2.php",
             data: {LAT:lat,LANG:lang},
             crossDomain: true,
             cache: false,
             beforeSend: function(){
               $("#loading").html("<img src='img/loading.gif' />");
             },
             success: function(data){
                 dataParsed = JSON.parse(data);
                 RESULT = dataParsed.result;

                 for (var i = 0; i < RESULT.length; i++) {
                    googleMapPos(RESULT[i]["LAT"],RESULT[i]["LONG"],"blue-dot.png");
                 }

                 $("#loading").html("");
             }
        });
}

var myLatlng ;
var mapOptions ;
var map ;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        googleMap(-8.673826,115.222807);
        getMyPosition();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //document.getElementById("getPosition").addEventListener("click", getPosition);
        //document.getElementById("watchPosition").addEventListener("click", watchPosition);
        
        //fetch data satellite revenue
        $.ajax({
             type: "POST",
             url:"http://10.67.98.98/mapsbligusto/branch/bali.php",
             data: {},
             crossDomain: true,
             cache: false,
             beforeSend: function(){
               $("#loading").html("<img src='img/loading.gif' />");
             },
             success: function(data){
                 dataParsed = JSON.parse(data);
                 RESULT = dataParsed.result;

                 for (var i = 0; i < RESULT.length; i++) {
                    googleMapPos(RESULT[i]["LAT"],RESULT[i]["LONG"],"red-dot.png");
                 }

                 $("#loading").html("");
             }
        });


    },
    doInsert: function(lat,lang,people){
      //alert("Test");
      document.addEventListener('deviceready', insertMap(lat,lang,people), false);
    },
    viewOutlet :function(lat,lang){
      document.addEventListener('deviceready', viewOutlet(lat,lang), false);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        /*var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);*/
    }
};


$("#search").click(function(){
  getPosition();
});
