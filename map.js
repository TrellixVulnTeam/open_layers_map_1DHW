import 'ol/ol.css';
import MapboxVector from 'ol/layer/MapboxVector';
import {Circle, Fill, Style, Icon, Stroke} from 'ol/style';
import {Feature, Map, Overlay, View} from 'ol/index';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Point} from 'ol/geom';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {useGeographic} from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import {easeIn, easeOut} from 'ol/easing';
import {fromLonLat} from 'ol/proj';
import {defaults as defaultInteractions} from 'ol/interaction.js';
useGeographic();


// center map location
var center_map = [115.832409,-32.004244];
var center_map_point = new Point(center_map);
// button filters

var view = new View({
  center: center_map,
  zoom: 10,
});


function getStuff(){
  var request = new XMLHttpRequest();
    request.open('GET', 'https://revofitness.com.au/wp-json/acf/v3/options/options/map', true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var data = JSON.parse(request.responseText);
        var map_data = data['map'];
      
        var locations = [


        ];
        map_data.forEach(function(data){
         var long = parseFloat(data.longitude);
         var lat = parseFloat(data.latitude);
         var gym_url = data.gym_name.replace("'","");
          locations.push(
            {
              "Popup" : "popup_"+data.popup+"",
              "longLat": [long,-lat],
              "Point": new Point([long,-lat]),
              "Gym_name": "<a href='/gyms/"+gym_url+"' target='_blank' rel='nofollow'>"+data.gym_name+"</a>",
              "Byline": ""+data.byline+"",
              "Email": ""+data.email+"",
              "Google_direction": ""+data.google_direction+"",
              "Address": ""+data.address+"",
              "youtube": ""+data.youtube+""

            }

            );


        })
      console.log(locations);
      // HELPER FUNCTIONS --->

      // create vectors
      function create_vectors(){

        locations.forEach((salon) => {
          var pointers = new VectorLayer({
              className:'pointerTing',
              opacity:1,
              source: new VectorSource({
                features: [new Feature(salon.Point)],
              }),
              style: new Style({
                image: new Icon({
                  anchor: [0.5, 0.9],
                  anchorXUnits: 'fraction',
                  anchorYUnits: 'pixels',
                  src: 'https://revofitness.com.au/wp-content/uploads/2020/01/Revo-Location-Pin.png',
                }),
              }),
            })
           map.addLayer(pointers);

        });
       
      }
      var popup;
      /* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
      /* GET ALL POPUP IDS */
      /*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/


      function createPopUpIds(){
        var i;
        for (i = 0; i < locations.length; i++) {
          // get div id's
          var number = i.toString();
          var el = "popup_";
          var div_id = el + number;
          //create variables based on div id's
          var element_id = "element_";
          element_id = element_id + number;

          var element_id = document.getElementById(div_id);
          //console.log(element_id);
        }
      }

      createPopUpIds();


      // center the map
      function CenterMap(longlat, zoom) {
        view.animate({
          center:longlat,
          duration:500,
          zoom:zoom
        })
      }
      // create an overlay for popup
      function createOverlay(element){
          popup = new Overlay({
              element: element,
              positioning: 'bottom-center',
              stopEvent: true,
              animation:false,
              offset: [0, -10],
            });
        // add popup
        map.addOverlay(popup);
        
      }
      // remove all popups besides current
      function removePops(removed_element){
       var elements;
        locations.forEach((salon) => {
          elements = document.getElementById(salon.Popup);
          if(elements != removed_element){
            $(elements).popover('dispose');
          }
          else {
            $(removed_element).popover('show');
          }
         
        });
      }
      // create popovers
      function popUpOverlay(element, type){
        $(element).popover({
          container: element.parentElement,
          html: true,
          sanitize: false,
          content: "\n <div style='width:470px;'><div class='column col-1'><div style='margin-bottom:15px;'>"+ type.youtube + "</div></div><div class='column col-2'><strong><span class='pop-heading'>" + type.Gym_name + "</span></strong><span class='by-line'>" + type.Byline+ "</span><span class='address'>" + type.Address + "</span><div class='button-wrapper'><a href='" + type.Google_direction + "' target='_blank' class='directions' id='directions'>Get directions</a><a href='mailto:"+type.Email+"' target='_blank' class='directions'>Contact us</></a></div></div></div>",
          placement: 'top',
        });
      }

      // check location pin 
      function checkLocationPin(point){
        coordinate.toString() == locations[point].longLat.toString()
      }
      // create popups 
      function create_popups(){

         map.on('click', function (event) {

          var feature = map.getFeaturesAtPixel(event.pixel)[0];
            //console.log(feature);
            // northbridge
            if(!feature){
                var i;
                for (i = 0; i < locations.length; i++) {
                  var number = i.toString();
                  var el = "popup_";
                  var div_id = el + number;
                  //create variables based on div id's
                  var element_id = "element_";
                  element_id = element_id + number;

                  var element_id = document.getElementById(div_id);
                  $(element_id).popover('dispose');
                }

             CenterMap(center_map, 10);
            }

            else {
              // get current coordinate clicked on
              var coordinate = feature.getGeometry().getCoordinates();
      /* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
      /* POPSTREET 
      /*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
            for (i = 0; i < locations.length; i++) {
              if(coordinate.toString() == locations[i].longLat.toString()){
                var number = i.toString();
                var el = "popup_";
                var div_id = el + number;
                //create variables based on div id's
                var element_id = "element_";
                element_id = element_id + number;

                var element_id = document.getElementById(div_id);
               // step 1 - create overlay for element
               createOverlay(element_id);
               // step 2 - set position of overlay based on coordinate
               popup.setPosition(coordinate)
               // step 3 - configure current pop up
               popUpOverlay(element_id, locations[i]);
               // step 4 - remove all other popups
               removePops(element_id);
               // center the map and zoom to current popup
               CenterMap(locations[i].longLat, 9);
              }
              }
            }
         
          });
          
      }



      // create the map
      var map = new Map({
        target: 'map',
        // empty array so no mouse interations / remove if you want them
        interactions: defaultInteractions({
          doubleClickZoom: false,
          dragAndDrop: false,
          dragPan: true,
          keyboardPan: false,
          keyboardZoom: false,
          mouseWheelZoom: false,
          pointer: false,
          select: false
        }),
        view: view,
        layers: [
        
            new MapboxVector({
              styleUrl: 'mapbox://styles/okmg-web/ckgj03fkd0pq519ru6pk9gx1x',
              accessToken:
                'pk.eyJ1IjoibWF0aGV3Ym93eWVyIiwiYSI6ImNrZjNtOHAyZzA0aXEycHMweGZkdzgwM2kifQ.mtuqEjOwZYW4G-T2zpTAsg',
            }),

              // map theme 
              new VectorLayer({
                  className:'map-theme',
                  opacity:1,
                  source: new VectorSource({
                    features: [new Feature(center_map_point)],

                  }),
                  style: new Style({
                    image: new Circle({
                      
                    }),
                  }),
              }),

          ],
      });


      // create pins
      create_vectors();
      // create popups
      create_popups();





      // pop up information
      map.on('moveend', function () {

        var view = map.getView();
        var center = view.getCenter();

      });

      map.on('pointermove', function (event) {
        if (map.hasFeatureAtPixel(event.pixel)) {
          map.getViewport().style.cursor = 'pointer';
        } else {
          map.getViewport().style.cursor = 'inherit';
        }
      });

      } else {
        // We reached our target server, but it returned an error
        console.log('error');
      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
    };

    request.send();


}

getStuff();


