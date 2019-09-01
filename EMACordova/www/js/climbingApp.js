var username;
var password;
var personalName;
var poolData;

function addStyle() {
    pendString = '<style type="text/css">\
    .btn-group > button {\
        font-size: 2vw;\
    }\
        .container{\
            max-width:700px;\
        }\
    div.organisedCompetitions {\
        background-color: lightblue;\
        // width: 400px;\
        height: 400px;\
        overflow: scroll;\
    }\
    div.scrollbar {\
        background-color: lightblue;\
        // width: 400px;\
        height: 400px;\
        overflow: scroll;\
    }\
    </style>'
    $("head").append( pendString );
}

function addSources() {
    pendString = '<script src="js/amazon-cognito-auth.min.js"></script> \
    <script src="https://sdk.amazonaws.com/js/aws-sdk-2.7.16.min.js"></script> \
    <script src="js/amazon-cognito-identity.min.js"></script>\
    <script src="js/config.js"></script>\
    <script src="js/bootstrap.min.js"></script>\
    <link rel="stylesheet" href="css/bootstrap.min.css">\
    <script src="js/popper.min.js"></script>\
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons"\
    rel="stylesheet">'
    $("head").append( pendString );
}
function addHeaderHTML() {

    pendString = '<div class="row">\
        <div class="col">\
            <button id="competitions" class="btn btn btn-primary btn-block" type="button" onclick="window.location.href = ' + "'competitions.html'" + ';" ><i class="material-icons">home</i></button> \
        </div>\
        <div class="col">\
            <button id="newCompetition" class="btn btn btn-primary btn-block" type="button" onclick="window.location.href = '+ "'searchResults.html'" +';" ><i class="material-icons">search</i></button> \
        </div>\
        <div class="col-1">\
                <button class="btn btn-primary " type="button" data-toggle="dropdown"><i class="material-icons">menu</i></button>\
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">\
                    <a class="dropdown-item" href="competitionCreation.html">Create Competition</a>\
                    <a class="dropdown-item" href="javascript:logoutButton()">Log Out</a>\
                </div>\
            </div>\
    </div>'


    $($( "#mainContainer" )).prepend( pendString );
}

function registerButton() {
    console.log("registerbutton");
    firstName =  document.getElementById("firstNameInput").value;	
    lastName =  document.getElementById("lastNameInput").value;	
    email = document.getElementById("emailInput").value;
    password = document.getElementById("passwordInput").value,
    console.log('Register info: ', firstName, lastName, email, password);

    poolData = {
            UserPoolId : _config.cognito.userPoolId, // Your user pool id here
            ClientId : _config.cognito.clientId // Your client id here
        };		
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var attributeList = [];

    var dataEmail = {
        Name : 'email',
        Value : username, //get from form field
    };

    var dataFirstName = {
        Name : 'given_name', 
        Value : firstName, //get from form field
    };
    
    var dataLastName = {
        Name : 'family_name', 
        Value : lastName, //get from form field
    };

    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    var attributeGivenName = new AmazonCognitoIdentity.CognitoUserAttribute(dataFirstName);
    var attributeFamilyName = new AmazonCognitoIdentity.CognitoUserAttribute(dataLastName);


    attributeList.push(attributeEmail);
    attributeList.push(attributeGivenName);
    attributeList.push(attributeFamilyName);
    userPool.signUp(email, password, attributeList, null, function(err, result){
        if (err) {
            console.log(JSON.stringify(err));
             alert(err.message || JSON.stringify(err));
            //return;
        }
        cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());
        //change elements of page
        document.getElementById("checkEmail").innerHTML = "Check your email for a verification link";
        
});
}

function logoutButton() {
    var poolData = {
        UserPoolId : _config.cognito.userPoolId, // Your user pool id here
        ClientId : _config.cognito.clientId, // Your client id here
    };

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var cognitoUser = userPool.getCurrentUser();
    if (cognitoUser != null) {
        cognitoUser.signOut();
        window.location.href = 'index.html';

      }
}

function loginButton() {
    delete localStorage.myUserName;
	var loginData = {
        Username : document.getElementById("emailInput").value,
        Password : document.getElementById("passwordInput").value,
    };
	
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(loginData);
    
	var poolData = {
        UserPoolId : _config.cognito.userPoolId, // Your user pool id here
        ClientId : _config.cognito.clientId, // Your client id here
    };
	
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
	
    var userData = {
        Username : document.getElementById("emailInput").value,
        Pool : userPool,
    };
	
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    
	cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
			var accessToken = result.getAccessToken().getJwtToken();
            console.log(accessToken);	
            
            localStorage.myUserName = userData.Username;

            window.location.href = 'competitions.html';
        },

        onFailure: function(err) {
            alert(err.message || JSON.stringify(err));
        },
        
    });
}

function newCompetitionButton() {
    window.location.href = 'competionCreation.html';
}

function confirmCreateCompetitionButton() {
    var competitionNameVar =  document.getElementById("competitionNameInput").value;	
    var competitionDescriptionVar =  document.getElementById("competitionDescriptionInput").value;	
    var competitionLocationVar =  document.getElementById("competitionLocationInput").value;	
    var competitionNumberOfProblemsVar = document.getElementById("competitionNumberOfProblemsInput").value;
    var competitionNumberOfZonesVar = document.getElementById("competitionNumberOfZonesInput").value;
    var competitionDateVar = document.getElementById("competitionDateInput").value;

    var competitionInfo = new Array();
    competitionInfo.push(competitionNameVar);
    competitionInfo.push(competitionDescriptionVar);
    competitionInfo.push(competitionNumberOfProblemsVar);
    competitionInfo.push(competitionNumberOfZonesVar);
    competitionInfo.push(competitionDateVar);

    if (competitionNameVar.length == 0 || competitionDescriptionVar.length == 0 || competitionLocationVar.length == 0 || competitionNumberOfProblemsVar.length == 0 || competitionNumberOfZonesVar.length == 0 || competitionDateVar.length == 0)
    {
        alert("Please fill in all of the data.");
        return;
    }

    var urlVar = "https://bljo2x1b0h.execute-api.eu-west-2.amazonaws.com/IncrementOne/competitions?competitionName=" + competitionNameVar 
    + "&competitionDescription=" + competitionDescriptionVar + "&competitionLocation=" + competitionLocationVar + "&competitionNumberOfProblems=" + competitionNumberOfProblemsVar 
    + "&competitionNumberOfZones=" + competitionNumberOfZonesVar + "&competitionDate=" + competitionDateVar + "&competitionUsername=" + localStorage.myUserName;
    console.log("Data: " + competitionNameVar + ", " + competitionDescriptionVar + ", " + competitionLocationVar + ", " + competitionNumberOfProblemsVar + ", " + competitionNumberOfZonesVar + ", " + competitionDateVar + ", " + localStorage.myUserName)



    $.ajax({
        type: "PUT",
        url: urlVar,
        crossDomain: true,
        dataType: "text",

        contentType: "application/json",
        success: function(data, status) {
            console.log("test2");
            console.log("data: " + data);
            console.log(status);

            if (data != null && data != undefined)
            {
                window.location.href = 'competitions.html';
            }
        }
    });
}

function searchButton() {
    console.log("test");

    delete localStorage.searchResult;

    searchInput = document.getElementById("searchTextInput").value;

    $.ajax({
        type: "GET",
        url: "https://bljo2x1b0h.execute-api.eu-west-2.amazonaws.com/IncrementOne/competitions",
        crossDomain: true,
        data: {
            "competitionsSearchParameter": String(searchInput),
        },
        contentType: "application/json",
        dataType: "json",
        success: function(data, status) {
            console.log("test2");
            //console.log(data);
            console.log(status);

            if (data != null && data != undefined)
            {
                localStorage.searchResult = JSON.stringify(data);
                console.log("ajax: " + localStorage.searchResult);
                if(!document.URL.includes("searchResults.html")){
                    window.location.href = 'searchResults.html';
                }
                else
                {
                    searchResultsRefresh();
                }  
            }

        }
    });
}

function enteredCompetitionsRefresh() {
    var enteredCompetitionsTable = document.getElementById("enteredCompetitionsTable");

    console.log(localStorage.myUserName);

    $.ajax({
        type: "GET",
        url: "https://bljo2x1b0h.execute-api.eu-west-2.amazonaws.com/IncrementOne/scores",
        crossDomain: true,
        data: {
            "scoresUsernameParameter": String(localStorage.myUserName),
        },
        contentType: "application/json",
        dataType: "json",
        success: function(data, status) {
            console.log(status);

            if (data != null && data != undefined)
            {
                searchList = [];
                for (var i = 0; i < data.length; i++)
                {
                    searchList.push(data[i].scores_competitionName);
                }
                console.log(JSON.stringify("searchList: " + searchList));
                $.ajax({
                    type: "GET",
                    url: "https://bljo2x1b0h.execute-api.eu-west-2.amazonaws.com/IncrementOne/competitions",
                    crossDomain: true,
                    data: {
                        "competitionsList": JSON.stringify(searchList),
                    },
                    contentType: "application/json",
                    dataType: "json",
                    success: function(data2, status) {
                        console.log(status);
            
                        if (data2 != null && data2 != undefined)
                        {
                            console.log("competitionsList: " + JSON.stringify(data2));

                            for (var i = 0; i < data2.length; i++)
                            {
                                var row = enteredCompetitionsTable.insertRow(i + 1);
								row.setAttribute('onclick', 'selectCompetition(\'' + data2[i].competitionName + '\')');
								row.setAttribute('style', "cursor: pointer;")
                                var cell1 = row.insertCell(0);
                                var cell2 = row.insertCell(1);
                                var cell3 = row.insertCell(2);
                                cell1.innerHTML = String(data2[i].competitionName);
                                cell2.innerHTML = String(data2[i].location);
								var date = new Date(data2[i].endDate);

								var monthNames = [
								"January", "February", "March",
								"April", "May", "June", "July",
								"August", "September", "October",
								"November", "December"
								];

								var day = date.getDate();
								var monthIndex = date.getMonth();
								var year = date.getFullYear();

								var date = day + ' ' + monthNames[monthIndex] + ' ' + year;

								cell3.innerHTML = String(date);
                            }
                        }
            
                    }
                });
            }
        }
    });
}

function organisedCompetitionsRefresh() {
    var organisedCompetitionsTable = document.getElementById("organisedCompetitionsTable");

    console.log(localStorage.myUserName);

    $.ajax({
        type: "GET",
        url: "https://bljo2x1b0h.execute-api.eu-west-2.amazonaws.com/IncrementOne/competitions",
        crossDomain: true,
        data: {
            "competitionsUsernameParameter": String(localStorage.myUserName),
        },
        contentType: "application/json",
        dataType: "json",
        success: function(data, status) {
            console.log(status);

            if (data != null && data != undefined)
            {
                console.log("organisedCompetitionsTable competitionsList: " + JSON.stringify(data));

                for (var i = 0; i < data.length; i++)
                {
                    var row = organisedCompetitionsTable.insertRow(i + 1);

                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    var cell4 = row.insertCell(3);
                    cell1.innerHTML = String(data[i].competitionName);
                    cell2.innerHTML = String(data[i].location);
                    cell3.innerHTML = String(data[i].endDate);

                    cell4.innerHTML =  '<input id="Button" type="button" value="ClickHere" onclick="selectCompetition(\'' + data[i].competitionName + '\')">';
                }
            }

        }
    });
}

function searchResultsRefresh() {
    if (localStorage.searchResult == undefined)
    {
        console.log("searchResultsRefresh undefined");
        return;
    }

    var results = JSON.parse(localStorage.searchResult);
    console.log(results);
    var table = document.getElementById("searchResultsTable");

    //or use :  var table = document.all.tableid;
    for(var i = table.rows.length - 1; i > 0; i--)
    {
        table.deleteRow(i);
    }

    if (results != null && results != undefined)
    {
        for (var i = 0; i < results.length; i++)
        {
            var row = table.insertRow(i + 1);

            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            cell1.innerHTML = String(results[i].competitionName);
            cell2.innerHTML = String(results[i].location);
            cell3.innerHTML = String(results[i].endDate);

           

            cell4.innerHTML =  '<input id="Button" type="button" value="ClickHere" onclick="selectCompetition(\'' + results[i].competitionName + '\')">';
        }
    }
}

function selectCompetition(competitionName)
{
    //var results = JSON.parse(localStorage.searchResult);

    localStorage.selectedCompetitionName = competitionName;
    window.location.href = 'competitionInformation.html';
}

function refreshScores()
{

    var urlVar = "https://bljo2x1b0h.execute-api.eu-west-2.amazonaws.com/IncrementOne/scores?scoresCompParameter=" + localStorage.selectedCompetitionName 
    + "&scoresUsernameParameter=" + localStorage.myUserName;

    

    $.ajax({
        type: "GET",
        url: urlVar,
        crossDomain: true,
        dataType: "text",

        contentType: "application/json",
        success: function(data, status) {
            console.log("data: " + data);
            console.log(status);

            if (data != null && data != undefined)
            {
                var table = document.getElementById("scoresTable");

                var parsedData = JSON.parse(data)[0];
                var parsedTopped = JSON.parse(parsedData.problemsTopped);
                var parsedZones = JSON.parse(parsedData.problemsZones);
                var parsedTries = JSON.parse(parsedData.problemsTries);
                
                var row = table.insertRow(i);
                var cell1 = row.insertCell(-1);
                var cell2 = row.insertCell(-1);
                cell1.innerHTML =  "Problem";
                cell2.innerHTML =  "Tries";


                for (var i = 0; i < parsedZones[0].length; i++) {
                    var cell = row.insertCell(-1);
                    cell.innerHTML =  "Zone " + (i + 1);

                }
                var cell3 = row.insertCell(-1);
                cell3.innerHTML =  "Topped";

                for (var i = 0; i < parsedTries.length; i++) {
                    var row = table.insertRow(i + 1);
                    var cell1 = row.insertCell(-1);
                    var cell2 = row.insertCell(-1);
                    //cell1.innerHTML = String("Tries: " + parsedTries[i]);

                    cell1.innerHTML = String(i + 1);

                    cell2.innerHTML =  '<input id="Text" type="text" value="' + parsedTries[i] + '">';



                    for (var j = 0; j < parsedZones[i].length; j++) {
                        var cell = row.insertCell(-1);
                        var Checked = "unchecked";
                        if (parsedZones[i][j] == 1)
                        {
                            Checked = "checked";
                        }
                        cell.innerHTML = '<input type="checkbox" id="scales" name="scales" value="check" ' + Checked + '>';
                    }

                    var cell3 = row.insertCell(-1);

                    var Checked = "unchecked";
                    if (parsedTopped[i] == 1)
                    {
                        Checked = "checked";
                    }
                    cell3.innerHTML = '<input type="checkbox" id="scales" name="scales" value="check" ' + Checked + '>';

                }
            }
        }
    });

   
}

function confirmScores()
{
    
    var rows = document.getElementById('scoresTable').rows;
    var rowCount = rows.length;
    var columnCount = document.getElementById('scoresTable').rows[0].cells.length;
    var Tries = [];
    var Zones = [];
    var Topped = [];
    for (var i = 1; i < rowCount; i++)
    {
        Tries.push(rows[i].cells[1].children[0].value);

        var Zones2d = [];
        for (var j = 0; j < (columnCount - 3); j++)
        {
            //Zones2d.push(rows[i].cells[j + 2]);
            Zones2d.push(rows[i].cells[j + 2].children[0].checked*1);
        }
        Zones[i - 1] = Zones2d;

        Topped.push(rows[i].cells[columnCount -1].children[0].checked*1);

    }
    console.log(" Tries: " + Tries + " Zones: " + JSON.stringify(Zones) + " Topped: " + Topped);

    updateScore(localStorage.selectedCompetitionName, localStorage.myUserName, Tries, Zones, Topped);

}

function refreshCompetitionInformation(CompetitionName)
{

    console.log("refreshCompetitionInformation CompetitionName: " + CompetitionName);

    var Header = document.getElementById("titleheader");
    var competitionDescription = document.getElementById("competitionDescription");
    var competitionLocation = document.getElementById("competitionLocation");
    var competitionNumberOfProblems = document.getElementById("competitionNumberOfProblems");
    var competitionNumberOfZones = document.getElementById("competitionNumberOfZones");
    var competitionEndDate = document.getElementById("competitionEndDate");

    

    var urlVar2 = "https://bljo2x1b0h.execute-api.eu-west-2.amazonaws.com/IncrementOne/scores?scoresCompParameter=" + localStorage.selectedCompetitionName;
    //this is to get whether the user is currently entered in this competition.
    $.ajax({
        type: "GET",
        url: urlVar2,
        crossDomain: true,
        dataType: "text",

        contentType: "application/json",
        success: function(data, status) {
            console.log("scores data: " + data);
            //if (data[0] != null && data[0] != undefined && data.length > 0)
            
            var isEntered = false;
            //check if the current user is entered.
            for (var i = 0; i < JSON.parse(data).length; i++) {
                if (JSON.parse(data)[i].scores_username == localStorage.myUserName)
                {
                    isEntered = true;
                }
            }
            if (data != null && data != undefined && JSON.parse(data).length > 0)
            {
                var table = document.getElementById("scoresTable");

                var parsedData = JSON.parse(data)[0];
                console.log("parsedData: " + parsedData + ", " + localStorage.selectedCompetitionName + ", " + status + ", " + isEntered)
                var parsedTopped = JSON.parse(parsedData.problemsTopped);
                var parsedZones = JSON.parse(parsedData.problemsZones);
                var parsedTries = JSON.parse(parsedData.problemsTries);
                
                var row = table.insertRow(-1);
                var cell1 = row.insertCell(-1);
                var cell2 = row.insertCell(-1);
                var cell3 = row.insertCell(-1);
                cell1.innerHTML =  "Problem";
                cell2.innerHTML =  "Name";
                cell3.innerHTML =  "Tries";


                for (var i = 0; i < parsedZones[0].length; i++) {
                    var cell = row.insertCell(-1);
                    cell.innerHTML =  "Zone " + (i + 1);

                }
                var cell3 = row.insertCell(-1);
                cell3.innerHTML =  "Topped";
            }

            if (isEntered)
            {
                console.log("Current user has entered this competition");
                document.getElementById("enterCompetitionButton").style.display = "none";
                document.getElementById("leaveCompetitionButton").style.display = "block";
                document.getElementById("enterScoreButton").style.display = "block";

            }
            else{
                console.log("Current user has NOT entered this competition");

                document.getElementById("enterCompetitionButton").style.display = "block";
                document.getElementById("leaveCompetitionButton").style.display = "none";
                document.getElementById("enterScoreButton").style.display = "none";

            }
            
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            document.getElementById("leaveCompetitionButton").style.display = "none";
                console.log("error none: " + errorThrown);
        }
    });



    $.ajax({
        type: "GET",
        url: "https://bljo2x1b0h.execute-api.eu-west-2.amazonaws.com/IncrementOne/competitions",
        crossDomain: true,
        data: {
            "competitionsNameParameter": String(CompetitionName),
        },
        contentType: "application/json",
        dataType: "json",
        success: function(data, status) {
            console.log("competitions data: " + data);

            if (data[0].competitionUsername == localStorage.myUserName)
            {
                console.log("Comp was created by the current user.");
                document.getElementById("deleteCompetitionButton").style.display = "block";
            }
            else{
                console.log("Comp was not created by the current user.");
                document.getElementById("deleteCompetitionButton").style.display = "none";
            }



            if (!(data === undefined || data.length == 0))
            {
                console.log("Get Competitions: " + data[0].competitionUsername == localStorage.myUserName);

                if (data === undefined)
                {                
                    document.getElementById("enterCompetitionButton").style.display = "none";

                    return;
                }
                localStorage.CompetitionInformation = JSON.stringify(data[0]);
                //console.log(JSON.parse(localStorage.CompetitionInformation));

                var Information = JSON.parse(localStorage.CompetitionInformation);
                console.log(Information.description);

                Header.innerHTML = "Name: " + data[0].competitionName;
                competitionDescription.innerHTML = "Description: " + String(data[0].description);
                competitionLocation.innerHTML = "Location: " + data[0].location;
                competitionNumberOfProblems.innerHTML = "Problems: " + data[0].numberOfProblems;
                competitionNumberOfZones.innerHTML = "Zones: " + data[0].numberOfZones;
                competitionEndDate.innerHTML = "End Date: " + data[0].endDate;

                
            }
            else{
                console.log("elseelseelseelseelse");
                document.getElementById("enterCompetitionButton").style.display = "none";

            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("errorerrorerrorerror");
            document.getElementById("enterCompetitionButton").style.display = "none";

        }
    });



}

function leaveCompetitionButton() {
    console.log("leaveCompetitionButton2: " + localStorage.myUserName + ", " + localStorage.selectedCompetitionName);
    var urlVar = "https://bljo2x1b0h.execute-api.eu-west-2.amazonaws.com/IncrementOne/scores?scoresUsernameParameter=" + localStorage.myUserName 
    + "&scoresCompParameter=" + localStorage.selectedCompetitionName;

    $.ajax({
        type: "DELETE",
        url: urlVar,
        crossDomain: true,
        data: {
        },
        contentType: "application/json",
        dataType: "json",
        success: function(data, status) {
            console.log("test2");
            //console.log(data);
            console.log("status:" + status);

            if (data != null && data != undefined)
            {
                location.reload();
            }

        }
    });
}

function deleteCompetitionButton() {
    var urlVar = "https://bljo2x1b0h.execute-api.eu-west-2.amazonaws.com/IncrementOne/competitions?competitionsNameParameter=" + localStorage.selectedCompetitionName;

    $.ajax({
        type: "DELETE",
        url: urlVar,
        crossDomain: true,
        data: {
        },
        contentType: "application/json",
        dataType: "json",
        success: function(data, status) {
            console.log("test2");
            //console.log(data);
            console.log("status:" + status);

            if (data != null && data != undefined)
            {
                window.location.href = 'competitions.html';
            }

        }
    });
}

function testFunction() {

}

function enterCompetitionButton() {
    var currentCompInfo = JSON.parse(localStorage.CompetitionInformation);
    var problemsTries = [];
    var problemsZones = [];
    var problemsTopped = [];

    for (var i = 0; i < currentCompInfo.numberOfProblems; i++) {
        problemsTries.push(0);
        problemsTopped.push(0);
    }



    for (var i = 0; i < currentCompInfo.numberOfProblems; i++) {
        var innerArray = [];
        for (var j = 0; j < currentCompInfo.numberOfZones; j++) {
            innerArray.push(0);
        }
        problemsZones.push(innerArray);
    }


    updateScore(currentCompInfo.competitionName, localStorage.myUserName, problemsTries, problemsZones, problemsTopped);

}



function updateScore(scores_competitionName, scores_username, problemsTries, problemsZones, problemsTopped)
{
    var urlVar = "https://bljo2x1b0h.execute-api.eu-west-2.amazonaws.com/IncrementOne/scores?scores_competitionName=" + scores_competitionName 
    + "&scores_username=" + scores_username + "&problemsTries=" + JSON.stringify(problemsTries) + "&problemsZones=" + JSON.stringify(problemsZones)
    + "&problemsTopped=" + JSON.stringify(problemsTopped);

    $.ajax({
        type: "PUT",
        url: urlVar,
        crossDomain: true,
        dataType: "text",

        contentType: "application/json",
        success: function(data, status) {
            console.log("test2");
            console.log("data: " + data);
            console.log(status);

            if (data != null && data != undefined)
            {
                window.location.href = 'competitionInformation.html';

            }
        }
    });

    console.log("updateScore: ", scores_competitionName + " . " + scores_username + " . " + problemsTries + " . " + problemsZones + " . " + problemsTopped);
}