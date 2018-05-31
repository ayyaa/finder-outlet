// const config = require('../src/config/config');
 	//-------------------------------SELECT CASCADING-------------------------//
   var currentCities=[];
   var BATTUTA_KEY='26a8db34fb906dfecf949d17dcbb9761';
      $("#state").on("change",function() {
        countryCode=$("#country").val();
        // Populate country select box from battuta API
        url="https://battuta.medunes.net/api/region/"
        +countryCode
        +"/all/?key="+BATTUTA_KEY+"&callback=?";
        $.getJSON(url,function(regions) {
          $("#region option").remove();
          //loop through regions..
          $.each(regions,function(key,region) {
            $("<option></option>").attr("value",region.region).append(region.region).appendTo($("#region"));
          });
          // trigger "change" to fire the #state section update process
          $("#region").material_select('update');
          $("#region").trigger("change");
          
        }); 
        
      });

      $("#region").on("change",function() {
        countryCode=$("#country").val();
        region=$("#region").val();
        url="https://battuta.medunes.net/api/city/"
        +countryCode
        +"/search/?region="
        +region
        +"&key="
        +BATTUTA_KEY
        +"&callback=?";
        
        $.getJSON(url,function(cities) {
          currentCities=cities;
            var i=0;
            $("#city option").remove();
          //loop through regions..
          $.each(cities,function(key,city) {
            $("<option></option>").attr("value",i++).append(city.city).appendTo($("#city"));
          });
          // trigger "change" to fire the #state section update process
          $("#city").material_select('update');
          $("#city").trigger("change");
        }); 
      });	