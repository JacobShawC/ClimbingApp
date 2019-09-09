var username;
var password;
var personalName;
var poolData;

function addStyle() {
    pendString = '<style type="text/css">\
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">\
\
* {\
    margin: 0;\
    padding: 0;\
    overflow: hidden;\
    position:fixed;\
    overflow: hidden;\
  }\
  html, body {\
    overflow: hidden;\
  }\
    // .btn-group > button {\
    //     font-size: 2vw;\
    // }\
\
    .container{\
        max-width: 800px;\
        font-size: "11";\
    }\
    table {\
        style="border:1px solid #ccc;font: 2vw Georgia, Garamond, Serif;"\
    }\
@media screen and (max-width: 800px) {\
    .container {\
        max-width: 100%;\
        font-size: 3vw;\
  }\
    table {\
        style="border:1px solid #ccc;font: 2vw Georgia, Garamond, Serif;"\
    }\
}\
        \
    div.scrollbar {\
        // width: 400px;\
        height: 75vh;\
        overflow: scroll;\
    }\
        ::-webkit-scrollbar {\
        width: 6px;\
        }\
\
        ::-webkit-scrollbar-track {\
        background: #f1f1f1; \
        }	\
        \
        ::-webkit-scrollbar-thumb {\
        background: rgb(38, 12, 153); \
        }\
        ::-webkit-scrollbar-thumb:hover {\
        background: rgb(54, 47, 116); \
        }\
        .header-fixed {\
            width: 100% \
        }\
\
        .tableFixHead          { overflow-y: auto; height: 100px; }\
        .tableFixHead thead th { position: sticky; top: 0; }\
\
        /* Just common table stuff. Really. */\
        table  { border-collapse: collapse; width: 100%; }\
        //th, td { padding: 8px 16px; }\
        th     { background:#eee; }\
\
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
        <div class="col-4">\
            <button id="competitions" class="btn btn btn-primary btn-block" type="button" onclick="window.location.href = ' + "'competitions.html'" + ';" ><i class="material-icons">home</i></button> \
        </div>\
        <div class="col-4">\
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
      }
      window.location.href = 'index.html';

}
function loginButton() {
    delete localStorage.myUserID;
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

            var urlVar = "https://bljo2x1b0h.execute-api.eu-west-2.amazonaws.com/IncrementOne/users?usersEmailParameter=" + userData.Username;
            console.log(result);

            $.ajax({
                type: "GET",
                url: urlVar,
                crossDomain: true,
                dataType: "text",

                contentType: "application/json",
                success: function(data, status) {
                    console.log("data: " + data);
                    console.log("status: " + status);

                    if (data != null && data != undefined)
                    {
                        console.log("My id: " + JSON.parse(data)[0].id);
                        localStorage.myUserID = JSON.parse(data)[0].id;
                        window.location.href = 'competitions.html';
                    }
                }
            });

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
    var competitionHasZones = false;
    competitionHasZones = document.getElementById("competitionHasZones").checked;
    var competitionDateVar = document.getElementById("competitionDateInput").value;
    var competitionInfo = new Array();
    competitionInfo.push(competitionNameVar);
    competitionInfo.push(competitionDescriptionVar);
    competitionInfo.push(competitionNumberOfProblemsVar);
    competitionInfo.push(competitionHasZones);
    competitionInfo.push(competitionDateVar);
    var currentDate = new Date();
    var compDate = new Date(competitionDateVar);
    currentDate.setHours(0,0,0,0);
    console.log(competitionDateVar + " " + compDate + " " + currentDate);
    if (currentDate > compDate)
    {
        alert("Please enter a future date");
        return;
    }
    if (competitionNameVar.length == 0 || competitionDescriptionVar.length == 0 || competitionLocationVar.length == 0 || competitionNumberOfProblemsVar.length == 0 || compDate == 'Invalid Date')
    {
        alert("Please fill in all of the data.");
        return;
    }
    
    var urlVar = "https://bljo2x1b0h.execute-api.eu-west-2.amazonaws.com/IncrementOne/competitions?competitionName=" + competitionNameVar 
    + "&competitionDescription=" + competitionDescriptionVar + "&competitionLocation=" + competitionLocationVar + "&competitionNumberOfProblems=" + competitionNumberOfProblemsVar 
    + "&competitionHasZones=" + competitionHasZones + "&competitionDate=" + competitionDateVar + "&competitionsUsersIDParameter=" + localStorage.myUserID;
    console.log("Data: " + competitionNameVar + ", " + competitionDescriptionVar + ", " + competitionLocationVar + ", " + competitionNumberOfProblemsVar + ", " + competitionHasZones + ", " + competitionDateVar + ", " + localStorage.myUserID)

	console.log("urlVAR: " + urlVar);

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
                window.location.href = 'competitions.html#created';
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(errorThrown);
            }
    });
}

function searchButton() {
    var table = document.getElementById("searchResultsTable");

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
        success: function(searchData, status) {
            console.log("test2");
            //console.log(data);
            console.log(status);

            if (searchData != null && searchData != undefined)
            {
                console.log(JSON.stringify(searchData));
                for (var i = 2; i < table.rows.length; i++) 
                {
                    table.rows[i].remove();
                }
                for (var i = 0; i < searchData.length; i++) 
                {
                    var row = table.insertRow(-1);
                    row.setAttribute('onclick', 'selectCompetition(\'' + searchData[i].competitionName + '\')');
                    row.setAttribute('style', "cursor: pointer;");


                    var cell1 = row.insertCell(-1);
                    cell1.innerHTML =  searchData[i].competitionName;

                    var cell2 = row.insertCell(-1);
                    cell2.innerHTML =  searchData[i].location;
                    var cell3 = row.insertCell(-1);
                    var date = new Date(searchData[i].endDate);
                    cell3.innerHTML = getJSDateFromSQL(date);
                    //cell3.innerHTML = date;

                }
            }
            table.rows[1].remove();

        }
    });
}

function getJSDateFromSQL(aDate) {
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
        ];

        var day = aDate.getDate();
        var monthIndex = aDate.getMonth();
        var year = aDate.getFullYear();

        var date = day + ' ' + monthNames[monthIndex] + ' ' + year;

    return date;
}

function enteredCompetitionsRefresh() {
    var enteredCompetitionsTable = document.getElementById("enteredCompetitionsTable");

    console.log("localStorage.myUserID: " + localStorage.myUserID);

    $.ajax({
        type: "GET",
        url: "https://bljo2x1b0h.execute-api.eu-west-2.amazonaws.com/IncrementOne/scores",
        crossDomain: true,
        data: {
            "usersIDParameter": String(localStorage.myUserID),
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

                            data2.sort(function(a, b) {
                                var dateA = new Date(a.endDate), dateB = new Date(b.endDate);
                                return dateA - dateB;  
                            });
                            for (var i = 0; i < data2.length; i++)
                            {
                                var row = enteredCompetitionsTable.insertRow(i + 1);
								row.setAttribute('onclick', 'selectCompetition(\'' + data2[i].competitionName + '\')');
                                row.setAttribute('style', "cursor: pointer;");
                                //row.setAttribute('scope' = 'row');
                                var cell1 = row.insertCell(0);
                                var cell2 = row.insertCell(1);
                                var cell3 = row.insertCell(2);
                                cell1.innerHTML = String(data2[i].competitionName);
                                cell2.innerHTML = String(data2[i].location);
                                var date = new Date(data2[i].endDate);
                                date = getJSDateFromSQL(date);

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

    console.log(localStorage.myUserID);

    $.ajax({
        type: "GET",
        url: "https://bljo2x1b0h.execute-api.eu-west-2.amazonaws.com/IncrementOne/competitions",
        crossDomain: true,
        data: {
            "competitionsUsersIDParameter": String(localStorage.myUserID),
        },
        contentType: "application/json",
        dataType: "json",
        success: function(data, status) {
            console.log(status);
            console.log(data, "All competitions: " + JSON.stringify(data));

            if (data != null && data != undefined)
            {
                console.log("organisedCompetitionsTable competitionsList: " + JSON.stringify(data));

                data.sort(function(a, b) {
                    var dateA = new Date(a.endDate), dateB = new Date(b.endDate);
                    return dateA - dateB;  
                });

                for (var i = 0; i < data.length; i++)
                {
                    var row = organisedCompetitionsTable.insertRow(i + 1);
                    row.setAttribute('onclick', 'selectCompetition(\'' + data[i].competitionName + '\')');

                    row.setAttribute('style', "cursor: pointer;")

                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    //var cell4 = row.insertCell(3);

                    //var date = getJSDateFromSQL(new Date(data2[i].endDate));
                    var date = new Date(data[i].endDate);
                    date = getJSDateFromSQL(date);

                    cell1.innerHTML = String(data[i].competitionName);
                    cell2.innerHTML = String(data[i].location);
                    cell3.innerHTML = String(date);
                }
            }

        }
    });
}

function selectCompetition(competitionName)
{
    //var results = JSON.parse(localStorage.searchResult);

    localStorage.selectedCompetitionName = competitionName;
    window.location.href = 'competitionInformation.html';
}

function refreshScores()
{
    var table = document.getElementById("scoresTable");

    $.ajax({
        type: "GET",
        url: "https://bljo2x1b0h.execute-api.eu-west-2.amazonaws.com/IncrementOne/competitions",
        crossDomain: true,
        data: {
            "competitionsNameParameter": String(localStorage.selectedCompetitionName),
        },
        contentType: "application/json",
        dataType: "json",
        success: function(compData, status) {
            var urlVar = "https://bljo2x1b0h.execute-api.eu-west-2.amazonaws.com/IncrementOne/scores?scoresCompParameter=" + localStorage.selectedCompetitionName 
            + "&usersIDParameter=" + localStorage.myUserID;
        
            console.log("urlVar: " + urlVar);
            $.ajax({
                type: "GET",
                url: urlVar,
                crossDomain: true,
                dataType: "text",
                success: function(scoresData, status) {
                var parsedScoresData = JSON.parse(scoresData);
                console.log("compData: " + JSON.stringify(compData));
                console.log("scoresData: " + scoresData);
                var parsedTopped = JSON.parse(parsedScoresData[0].problemsTopped);
                var parsedZones = JSON.parse(parsedScoresData[0].problemsZones);
                var parsedTries = JSON.parse(parsedScoresData[0].problemsTries);
                    if (compData[0].hasZones == 0)
                    {
                        table.tHead.rows[0].cells[2].remove();
                    }
                    for (var i = 0; i < compData[0].numberOfProblems; i++)
                    {
                        var row = table.insertRow(-1);
                        var cell1 = row.insertCell(-1);
                        cell1.innerHTML = i + 1;

                        var cell2 = row.insertCell(-1);
                        cell2.innerHTML =  '<input id="triesInput" type="number" value="' + parsedTries[i] + '">';

                        if (compData[0].hasZones == 1)
                        {
                            var cell3 = row.insertCell(-1);
                            var Checked = "unchecked";
                            if (parsedZones[i] > 0) {
                                Checked = "checked";
                            }
                            cell3.innerHTML = '<input type="checkbox" id="scales" name="scales" value="check" ' + Checked + '>';
                        }

                        var cell4 = row.insertCell(-1);
                            var Checked = "unchecked";
                            if (parsedTopped[i] > 0) {
                                Checked = "checked";
                            }
                            cell4.innerHTML = '<input type="checkbox" id="scales" name="scales" value="check" ' + Checked + '>';

                    }
                    
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    console.log("Error");
                    document.getElementById("enterCompetitionButton").style.display = "none";
                    
                }
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Error");
            document.getElementById("enterCompetitionButton").style.display = "none";
            
        }
    });
}

function confirmScores()
{
    var enteredCompetitionsTable = document.getElementById("scoresTable");

    var rows = enteredCompetitionsTable.rows;
    var columnCount = document.getElementById('scoresTable').rows[0].cells.length;
    var Tries = [];
    var Zones = [];
    var Topped = [];
    for (var i = 2; i < rows.length; i++)
    {
        console.log(rows[i]);
        var hasTopped = rows[i].cells[columnCount -1].children[0].checked*1;
        var hasZone = rows[i].cells[columnCount -2].children[0].checked*1;
        Topped.push(hasTopped);
        if (columnCount > 3)
        {
            if (hasTopped)
            {
                Zones.push(1);
            }
            else{
                Zones.push(parseInt(rows[i].cells[columnCount -2].children[0].checked*1));
            }
            
        }
        if (parseInt(rows[i].cells[1].children[0].value) == 0 && (hasTopped || hasZone)) {
            Tries.push(1);
        }
        else{
            Tries.push(parseInt(rows[i].cells[1].children[0].value));
        }

    }
    

    updateScore(localStorage.selectedCompetitionName, localStorage.myUserID, Tries, Zones, Topped);

}

function refreshCompetitionInformation(CompetitionName)
{
    var table = document.getElementById("competitionInformationTable");

    console.log("refreshCompetitionInformation CompetitionName: " + CompetitionName);

    var Header = document.getElementById("titleheader");
    var competitionDescription = document.getElementById("competitionDescription");
    var competitionLocation = document.getElementById("competitionLocation");
    var competitionEndDate = document.getElementById("competitionEndDate");

    //First we get the competition data for this competition to work out of the logged in user created the competition and other information such as name and description 
    $.ajax({
        type: "GET",
        url: "https://bljo2x1b0h.execute-api.eu-west-2.amazonaws.com/IncrementOne/competitions",
        crossDomain: true,
        data: {
            "competitionsNameParameter": String(CompetitionName),
        },
        contentType: "application/json",
        dataType: "json",
        success: function(compData, status) {
            console.log("competitions data: " + JSON.stringify(compData));

            if (compData[0].userID == localStorage.myUserID)
            {
                console.log("Comp was created by the current user.");
                document.getElementById("deleteCompetitionButton").style.display = "block";
            }
            else{
                console.log("Comp was not created by the current user.");
                document.getElementById("deleteCompetitionButton").style.display = "none";
            }



            if (!(compData === undefined || compData.length == 0))
            {
                console.log("Get Competitions: " + compData[0].userID == localStorage.myUserID);

                if (compData === undefined)
                {                
                    document.getElementById("enterCompetitionButton").style.display = "none";
                    return;
                }
                localStorage.CompetitionInformation = JSON.stringify(compData[0]);
                //console.log(JSON.parse(localStorage.CompetitionInformation));

                var Information = JSON.parse(localStorage.CompetitionInformation);
                console.log(Information.description);

                Header.innerHTML = "Name: " + compData[0].competitionName;
                competitionDescription.innerHTML = "Description: " + String(compData[0].description);
                competitionLocation.innerHTML = "Location: " + compData[0].location;
                competitionEndDate.innerHTML = "End Date: " + Date(compData[0].endDate);
            }
            else{
                document.getElementById("enterCompetitionButton").style.display = "none";
            }
            if (compData[0].hasZones == false) {
                table.tHead.rows[0].cells[3].remove();
            }
            if (table.rows.length > 1) {
                table.rows[1].remove();
            }

            //Then we get the score information for the compeititon in order find out if the user is entered and to show out each users' scores.



            var urlVar2 = "https://bljo2x1b0h.execute-api.eu-west-2.amazonaws.com/IncrementOne/scores";

            console.log("urlVar2: " + urlVar2);
            $.ajax({
                type: "GET",
                url: urlVar2,
                crossDomain: true,
                dataType: "text",
                data: {
                    "scoresCompParameter": String(localStorage.selectedCompetitionName),
                },
                contentType: "application/json",
                success: function(scoresData, status) {
                    //get all the ID who are entered in the competition
                    var parsedScoresData = JSON.parse(scoresData);

                    console.log("scores scoresData: " + parsedScoresData.length + scoresData);
                    var IDArray = new Array();
                    for (var i = 0; i < parsedScoresData.length; i++) {
                        IDArray.push(parsedScoresData[i].scores_userID);
                    }
                    console.log("IDArray: " + IDArray.toString());

                    var urlVar3 = "https://bljo2x1b0h.execute-api.eu-west-2.amazonaws.com/IncrementOne/users?usersIDParameter=" + JSON.stringify(IDArray);

                    //Here we are getting the competitors full names from the ID on each score.
                    console.log("urlVar3: " + urlVar3);
                    $.ajax({
                        type: "GET",
                        url: urlVar3,
                        crossDomain: true,
                        dataType: "text",

                        contentType: "application/json",
                        success: function(usersData, status) {
                            console.log("usersData: " + usersData);

                            var parsedUsersData;
                            if (usersData)
                            {
                                parsedUsersData = JSON.parse(usersData);
                            }
                            console.log("scoresData: " + scoresData);
                            console.log("usersData: " + usersData);

                            var isEntered = false;
                            //check if the current user is entered.
                            for (var i = 0; i < parsedScoresData.length; i++) {
                                console.log("parsedScoresData[i].scores_userID + localStorage.myUserID: "+ parsedScoresData[i].scores_userID + ", " + localStorage.myUserID);
                                if (parsedScoresData[i].scores_userID == localStorage.myUserID)
                                {
                                    isEntered = true;
                                }
                            }

                            if (isEntered)
                            {
                                console.log("Current user has entered this competition");
                                document.getElementById("enterCompetitionButton").style.display = "none";
                                document.getElementById("leaveCompetitionButton").style.display = "block";
                                document.getElementById("enterScoreButton").style.display = "block";

                            }
                            else{
                                

                                document.getElementById("enterCompetitionButton").style.display = "block";
                                document.getElementById("leaveCompetitionButton").style.display = "none";
                                document.getElementById("enterScoreButton").style.display = "none";
                                if (!usersData)
                                {
                                    return;
                                }
                            }

                            for (var i = 0; i < parsedUsersData.length; i++) {
                                var tries = 0;
                                var zones = 0;
                                var tops = 0;
                                var score = 0;
                                for (var j = 0; j < JSON.parse(parsedScoresData[i].problemsTries).length; j++) {
                                    tries += JSON.parse(parsedScoresData[i].problemsTries)[j];
                                }
                                for (var j = 0; j < JSON.parse(parsedScoresData[i].problemsZones).length; j++) {
                                    zones += JSON.parse(parsedScoresData[i].problemsZones)[j];
                                }
                                for (var j = 0; j < JSON.parse(parsedScoresData[i].problemsTopped).length; j++) {
                                    tops += JSON.parse(parsedScoresData[i].problemsTopped)[j];
                                }
                                console.log("tries zones tops score: " + tries + ", " + zones + ", " + tops + ", " + score);

                                score = tops * 100 + zones * 20;
                                var hasAddedRow = false;
                                console.log("table.rows.length: " + table.rows.length);
                                for (var k = 1; k < table.rows.length; k++) {
                                    console.log("score > table: " + score + ", " + table.rows[k].cells[table.rows[k].cells.length - 1].innerHTML);

                                    if (score > table.rows[k].cells[table.rows[k].cells.length - 1].innerHTML)
                                    {
                                        hasAddedRow = true;
                                        var row = table.insertRow(k);
                                        var cell1 = row.insertCell(-1);
                                        var cell2 = row.insertCell(-1);
                                        cell2.innerHTML =  parsedUsersData[i].firstName + " " + parsedUsersData[i].lastName;
                                        
                                        console.log("JSON.parse(parsedScoresData[i].problemsTries): " + parsedScoresData[i].problemsTries);
                                        
                                        var cell3 = row.insertCell(-1);
                                        cell3.innerHTML = tries;

                                        if (compData[0].hasZones == true) {
                                            var cell4 = row.insertCell(-1);
                                            cell4.innerHTML = zones;

                                        }
                                        var cell5 = row.insertCell(-1);
                                        cell5.innerHTML = tops;
                                        var cell6 = row.insertCell(-1);
                                        cell6.innerHTML = score;
                                        break;
                                    }
                                }
                                if (hasAddedRow == false)
                                {
                                    var row = table.insertRow(-1);
                                    var cell1 = row.insertCell(-1);
                                    var cell2 = row.insertCell(-1);
                                    cell2.innerHTML =  parsedUsersData[i].firstName + " " + parsedUsersData[i].lastName;
                                    
                                    console.log("JSON.parse(parsedScoresData[i].problemsTries): " + parsedScoresData[i].problemsTries);
                                    
                                    var cell3 = row.insertCell(-1);
                                    cell3.innerHTML = tries;

                                    if (compData[0].hasZones == true) {
                                        var cell4 = row.insertCell(-1);
                                        cell4.innerHTML = zones;

                                    }
                                    var cell5 = row.insertCell(-1);
                                    cell5.innerHTML = tops;
                                    var cell6 = row.insertCell(-1);
                                    cell6.innerHTML = score;
                                }
                            }

                            for (var i = 1; i < table.rows.length; i++) {
                                table.rows[i].cells[0].innerHTML = i;
                            }


                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) { 
                            console.log("Error");
                            document.getElementById("enterCompetitionButton").style.display = "none";
            
                        }
                    });
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    document.getElementById("leaveCompetitionButton").style.display = "none";
                        console.log("error none: " + errorThrown);
                }
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("errorerrorerrorerror");
            document.getElementById("enterCompetitionButton").style.display = "none";

        }
    });
}

function leaveCompetitionButton() {
    console.log("leaveCompetitionButton2: " + localStorage.myUserID + ", " + localStorage.selectedCompetitionName);
    var urlVar = "https://bljo2x1b0h.execute-api.eu-west-2.amazonaws.com/IncrementOne/scores?usersIDParameter=" + localStorage.myUserID 
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
    console.log("localStorage.CompetitionInformation: " + localStorage.CompetitionInformation);
    var currentCompInfo = JSON.parse(localStorage.CompetitionInformation);
    var problemsTries = [];
    var problemsZones = [];
    var problemsTopped = [];

    for (var i = 0; i < currentCompInfo.numberOfProblems; i++) {
        problemsTries.push(0);
        problemsTopped.push(0);
        if (currentCompInfo.hasZones > 0) {
            problemsZones.push(0);
        }
    }




    updateScore(currentCompInfo.competitionName, localStorage.myUserID, problemsTries, problemsZones, problemsTopped);

}



function updateScore(scores_competitionName, usersIDParameter, problemsTries, problemsZones, problemsTopped)
{
    var urlVar = "https://bljo2x1b0h.execute-api.eu-west-2.amazonaws.com/IncrementOne/scores?scores_competitionName=" + scores_competitionName 
    + "&usersIDParameter=" + usersIDParameter + "&problemsTries=" + JSON.stringify(problemsTries) + "&problemsZones=" + JSON.stringify(problemsZones)
    + "&problemsTopped=" + JSON.stringify(problemsTopped);
    console.log("urlVar: " + urlVar);
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

    console.log("updateScore: ", scores_competitionName + " . " + usersIDParameter + " . " + problemsTries + " . " + problemsZones + " . " + problemsTopped);
}