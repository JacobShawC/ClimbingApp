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



 /**
 * Gets the entered or default OUCU
 * @returns formatted username and password string for use with URLs
 */

// FR1.1: check oucu is inputted correctly
function getUserAndPass() {
    var returnString = "?OUCU=";

    returnString += getOUCU();

    returnString += "&password=sObb8Tik";
    
    return returnString;
}

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}
    function isNumber(str) {
    return str.length === 1 && str.match(/[0-9]/);
}

// FR1.1: check oucu is inputted correctly
function getOUCU() {
    var defaultValue = "zy677689"
    var value = document.getElementById("Salesperson").value;
    
    if (value == "") {
      value = defaultValue;
    }
    
    console.log('value:', value);
    if (
        !(isLetter(value.charAt(0)) && isNumber(value.charAt(value.length - 1)))
    ) {
        alert("Please enter a value starting with a letter and ending with a number.");
        return "";
    }
    return value;
}


/**
 * Main class
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
    //Current selected Widget
    var selectedWidgetID = null;
    var selectedOrderID = null;
    var selectedOrderObj = null;

     
    /**
     *  Simple fucntion to set the widget info.
     * @param {type} widgetObj, the widget object.
     */
    function setWidgetInfo(widgetObj) {
        selectedWidgetID = widgetObj.id;
        document.getElementById("WidgetImage").src = widgetObj.url;
        document.getElementById("WidgetDescription").innerHTML = widgetObj.description;
        document.getElementById("WidgetPrice").innerHTML = widgetObj.pence_price;
    }

    function validateOUCU() {

    }

    
    /**
     *  FR1.4 Displaying the sum of ordered items and adding VAT to the agreed price of each of the order items at 20%.
     * @param {type} orderObj, the widget object.
     */
    function setOrderInfo(orderObj) {


        var orderString;
        // Get order items first
        var orderItems = null;
        var client = null;
        var locationInfo = null;
        //Get the order items

        var URL = "http://137.108.92.9/openstack/api/order_items" + getUserAndPass() + "&order_id=" + orderObj.id;

        $.get(
            URL,
           
            function(data) {
                var obj = $.parseJSON(data);
            if (obj.status == "success") {
                orderItems = obj.data;
            }
    
                //Get the Client
                var URL2 = "http://137.108.92.9/openstack/api/clients/" + orderObj.client_id + getUserAndPass();

                $.get(
                    URL2,
                    function(data) {
                        var obj2 = $.parseJSON(data);
                        if (obj2.status == "success") {
                            client = obj2.data[0];

                        }


                        //Get the point of interest data from Nominatim in order to get the name of where the sale was made
                        var URL3 = "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" + orderObj.latitude + "&lon=" + orderObj.longitude;
                        $.get(
                            URL3,
                            function(data) {
                                locationInfo = data;

                                //we now should have all the information necessary to create the order information.
                                // Now we construct the string of information.

                                orderString = "Dear " + client.name + ", <br>";

                                var LocationText = "";

                                if (locationInfo != null && locationInfo.name != null)
                                {
                                    LocationText = locationInfo.name;
                                }

                                orderString += "Your order at " + LocationText + " " + orderObj.date + "<br>";

                                var totalPrice = 0;

                                // Order items
                                if (orderItems != null)
                                {
                                    for (var i = 0; i < orderItems.length; i++) {
                                        var multipliedPrice = orderItems[i].pence_price * orderItems[i].number;
                                        orderString += orderItems[i].number + " (widget " + orderItems[i].widget_id + ") x " + (orderItems[i].pence_price / 100) + "GBP = " + (multipliedPrice / 100) + "GBP <br>";
                                        totalPrice += multipliedPrice;
                                    }
                                }
                                var VAT = (Math.ceil(totalPrice * 0.2)) / 100;
                                var finalTotal = (totalPrice / 100) + VAT;

                                orderString += "Subtotal: " + (totalPrice / 100) + " GBP" + "<br>";
                                orderString += "VAT: " + VAT + " GBP" + "<br>";
                                orderString += "Total is: " + finalTotal + " GBP" + "<br>";
                                
                                
                                orderString += "Latitude: " + orderObj.latitude + "<br>";
                                orderString += "Longitude: " + orderObj.longitude + "<br>";

                                document.getElementById("OrderDetails").innerHTML = orderString;

                                selectedOrderID = orderObj.id;
                                selectedOrderObj = orderObj;

                            }
                        )
                    }
                )
            }
        )

        if (orderItems != null) {

        }

        var orderString;
        document.getElementById("WidgetImage").src = widgetObj.url;
        document.getElementById("WidgetDescription").innerHTML = widgetObj.description;
        document.getElementById("WidgetPrice").innerHTML = widgetObj.pence_price;
    }



    function MegaMax() {
        
        // initialize the platform object:
        var platform = new H.service.Platform({
            'app_id': 'qPcY5BgfnSxG1a0YmWCB',
            'app_code': 'hPjg1k2jLWARErXvvFlMlg'
        });
        

        // Obtain the default map types from the platform object
        var maptypes = platform.createDefaultLayers();

        // Instantiate (and display) a map object:
        var map = new H.Map(
            document.getElementById('MapContainer'),
            maptypes.normal.map,
            {
                zoom: 15,
                center: { lng: 13.4, lat: 52.51 }
            }
        );

        var ui = H.ui.UI.createDefault(map, maptypes);

        // optional: change the default settings of UI


        var mapSettings = ui.getControl("mapsettings");
        var zoom = ui.getControl("zoom");
        var scalebar = ui.getControl("scalebar");
        var panorama = ui.getControl("panorama");
        panorama.setAlignment("top-left");
        mapSettings.setAlignment("top-left");
        zoom.setAlignment("top-left");
        scalebar.setAlignment("top-left");
        var mapEvents = new H.mapevents.MapEvents(map);

        var behavior = new H.mapevents.Behavior(mapEvents);

        function geoLocationMap(position)
        {
            map.setCenter({lat: position.coords.latitude, lng:position.coords.longitude});
        }

        /**
         *  FR2.1 Displaying a Map for the area around the current location of the salesperson when at the client's premises and placing or viewing an order.
         *
         *  FR2.2 Displaying the orders along the day’s journey with markers, where the location of client’s addresses are used to place the markers.
         */
        function refreshMap()
        {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(geoLocationMap);
            }

            // remove all the makers first before we add the up to date markers.
            map.removeObjects(map.getObjects());


            var ordersMadeToday = new Array();
            var today = new Date();



            

            function setMarker(order) {

                var URL = "http://137.108.92.9/openstack/api/clients/" + order.client_id + getUserAndPass();

                $.get(
                    URL,
                    function(data) {
                        var obj = $.parseJSON(data);

                        // Create an array of orders for our client
                        if (obj.status == "success") {
                            var client = obj.data[0];
                            

                            
                            

                            var destination = new H.ui.InfoBubble({lng: -0.34857, lat: 51.432393});
                            // centre the map at the current geolocation

                            //Get the point of interest data from Nominatim in order to get the name of where the sale was made
                            var URL3 = 'http://nominatim.openstreetmap.org/search/"' + client.address + '"?format=json&countrycodes=gb';

                            $.get(
                                URL3,
                                function(data) {

                                    locationInfo = data;

                                   

                                    var svgMarkup = '<svg width="90" height="24" ' +
                                    'xmlns="http://www.w3.org/2000/svg">' +
                                    '<rect stroke="white" fill="#1b468d" x="1" y="1" width="90" ' +
                                    'height="22" /><text x="12" y="18" font-size="11pt" ' +
                                    'font-family="Arial" font-weight="bold" text-anchor="right" ' +
                                    'fill="white">' + "ID: " + order.id + '</text></svg>';
        
                                    var icon = new H.map.Icon(svgMarkup),
                                    coords = {lng: locationInfo[0].lon, lat: locationInfo[0].lat},
                                    marker = new H.map.Marker(coords, {icon: icon});
        
                                    map.addObject(marker);
                                }
                            )



                            
                        }
                        else{

                        }
                    }
                )
            }

            var URL = "http://137.108.92.9/openstack/api/orders/" + getUserAndPass();
            var previousOrder = null;
            var setNextFound = false;
            var increment = 0;

            $.get(
                URL,
                function(data) {
                    var obj = $.parseJSON(data);

                    // Create an array of orders for our client
                    if (obj.status == "success") {
                        var orderArr = new Array();
                        var clientArray = new Array();

                        $.each(obj.data, function(index, value) {
                            var tempDate = new Date(value.date);
                            

                            //FR2.2 Check each order to see if it was made today.
                            if (today.getFullYear() === tempDate.getFullYear() &&
                            today.getMonth() === tempDate.getMonth() &&
                            today.getDate() === tempDate.getDate())
                            {
                                

                                setMarker(value);
                                

                               


                            }
                        });


                    }
                }

            );
        }


        /**
         *  FR1.2 Function that selects the previous or next widget
         * @param {type} nextOrPrevious, wether to select the previous or next widget.
         */
        this.selectNextWidget = function(nextOrPrevious) {
            var URL = "http://137.108.92.9/openstack/api/widgets/" + getUserAndPass();
            
            $.get(
                URL,
               
                function(data) {
                    var obj = $.parseJSON(data);
                    if (obj.status == "success") {
                        $.each(obj.data, function(index, value) {
                            // If selectedWidgetid is null then we havent yet set a widget so we just 
                            // set it to the first widget available.
                            if (selectedWidgetID == null) {
                                setWidgetInfo(value);
                                return false;
                            }
                            // Otherwise we try to set it to the next or previous available widget
                            else if (value.id == selectedWidgetID){
                                var tempIndex = index;

                                //we do this to make it so we can have one function for both the previous and next buttons.
                                if (nextOrPrevious) {
                                    tempIndex++;
                                }
                                else {
                                    tempIndex--;
                                }

                                if (tempIndex >= 0 && tempIndex < obj.data.length)
                                {
                                    setWidgetInfo(obj.data[tempIndex]);
                                    return false;
                                }
                            }
                        });
                        } else {
                        }
                    }
                );
        };


        /**
         *  Function that selects the previous or next order
         * @param {type} nextOrPrevious, wether to select the previous or next order.
         */
        this.selectNextOrder = function(nextOrPrevious) {
            var URL = "http://137.108.92.9/openstack/api/orders/" + getUserAndPass();
            var clientID = document.getElementById("ClientID").value;
            if (clientID.length == 0)
            {
                alert("Please Input a Client ID");
                return;
            } 
            var previousOrder = null;
            var setNextFound = false;

            $.get(
                URL,
                function(data) {
                    var obj = $.parseJSON(data);

                    // Create an array of orders for our client
                    if (obj.status == "success") {
                        var orderArr = new Array();

                        $.each(obj.data, function(index, value) {

                            if (value.client_id == clientID)
                            {
                                orderArr.push(value);
                                
                            }
                        });



                        // Find the position of the currently selected order
                        var position = null;
                        for (var i = 0; i < orderArr.length; i++) {
                            if (selectedOrderID == orderArr[i].id) {
                                position = i;

                            }
                        }


                        // Set the info for the next or previous order in the list.
                        if (position != null) {
                            if (nextOrPrevious && (position + 1) < orderArr.length) {
                                setOrderInfo(orderArr[position + 1]);
                            }
                            else if (!nextOrPrevious && (position - 1) >= 0)
                            {
                                setOrderInfo(orderArr[position - 1]);
                            }
                        }
                        // if we havent yet selected an order yet it simply selects the first valid order.
                        else if (orderArr.length > 0) {

                            setOrderInfo(orderArr[0]);
                        }

                    } else {
                        alert(obj.status + " " + obj.data);
                    }
                }
            );
        };

        /**
         *  FR1.3 Adding the currently displayed widget to the order items, including the amount and the agreed price.
         */        
        this.addToOrder = function() {

            var agreedPrice = document.getElementById("AgreedPrice").value;
            var widgetNumber = document.getElementById("WidgetNumber").value;
            
            //return if any information is missing
            if (agreedPrice.length == 0 || widgetNumber.length == 0 || selectedWidgetID == null || selectedOrderID == null) return;

            var URL = "http://137.108.92.9/openstack/api/order_items";

            $.post(
                URL,
                {
                    password: "sObb8Tik",
                    OUCU: "zy677689",
                    order_id: selectedOrderID,
                    widget_id: selectedWidgetID,
                    number: widgetNumber,
                    pence_price: agreedPrice
                },
                function(data) {
                    var obj = $.parseJSON(data);
                    if (obj.status == "success") {
                        if (selectedOrderObj != null)
                        {
                            alert(widgetNumber + " widgets with id " + selectedWidgetID + " added at to orderID " + selectedOrderID + " at " + agreedPrice + " pence each.");




                            setOrderInfo(selectedOrderObj);
                        }
                        else{
                            alert("Please input valid order item information");

                        }
                    }

                }
            )



        };

        

        /**
         *  FR2.2 When clicking on Place NEW Order to start an empty order.
         */  
        this.placeNewOrder = function() {


            function geoLocationSuccess(position) {
            

                var clientID2 = document.getElementById("ClientID").value;
                 //return if any information is missing
                 if (clientID2.length == 0) return;
    
    
                var URL = "http://137.108.92.9/openstack/api/orders";
                $.post(
                    URL,
                    {
                        password: "sObb8Tik",
                        OUCU: "zy677689",
                        client_id: clientID2,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    },
                    function(data) {
                        var obj = $.parseJSON(data);
                        if (obj.status == "success") {
                            alert("New order placed for client " + clientID2 + " at coordinates " + position.coords.latitude + ", " + position.coords.longitude);
                            refreshMap();
    
                        }
                        else
                        {
                            alert("New order failed, could be invalid client or Salesperson");
    
                        }
    
                    }
                )
    
            }

            // Here I will wait until I have gotten the current position before adding the order,
            // meaning the actually adding of the order is done in the geoLocationSuccess function!
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(geoLocationSuccess);
              } else {

                
            }

        };
        refreshMap();
    }
     
    this.megaMax = new MegaMax();
    }
};

app.initialize();