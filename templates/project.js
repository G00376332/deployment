// Script file for Blueberry project
// Sources for some part of the script: https://www.w3schools.com/

function indexMain(){
	showSlides();
	showIdxText();
}

// This function will change the background image in the banner on the home page. It will have an animation effect.

var showIndex = 0;

function showSlides() {
  var i;
  var img = ["url(images/sli3.jpg) no-repeat center","url(images/2a.jpg) no-repeat center", "url(images/back-now.jpg) no-repeat center"];
  for (i = 0; i < img.length; i++) {
    document.getElementById("idx-banner").style.background = "none";
  }
  showIndex++;
  if (showIndex > img.length) {showIndex = 1}    
  document.getElementById("idx-banner").style.background = img[showIndex-1]; 
  // Change image every 10 seconds. Match time with banner animation time in css file for smooth effect.
  setTimeout(showSlides, 10000); 
}

// This function will change the text in the banner on the home page. It will have an animation effect.

var textIndex = 0;

function showIdxText() {
  // Create an array with text to loop through.
  var txt = ["Your partner in blueberries","Our Promise", "Your Satisfaction","Our Quality","Your Profit","38 Years of Experience","14 Blueberry Varieties","105 Days of the Season"];
  textIndex++;
  if (textIndex > txt.length) {textIndex = 1}
  document.getElementById("idx-text").innerHTML = txt[textIndex-1];
  // Change the text every 5 seconds. Make the time half of banner animation time in CSS file for the nicer swap effect.
  setTimeout(showIdxText, 5000); 
}

// Login section

// Get the modal
var modal = document.getElementById('login-box');

//When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

var count = 2;

// This function will handle login box. 

function logout() {
	alert ("You were logged out. Goodbye!");
	window.location ='\logout';
}

// Get the button
var topButton = document.getElementById("topBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    topButton.style.display = "block";
  } else {
    topButton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// This part display database section

function showCreate() {
	document.getElementById('display').style.display = "none"
	document.getElementById('update-button').style.display = "none"
	document.getElementById('create-button').style.display = "block"
	document.getElementById('create-update').style.display = "block"
	document.getElementById("create-update-title").innerHTML = "Create Harvest";

}

function showUpdate(thisElem) {
	var rowElement = thisElem.parentNode.parentNode;
	harvest = readHarvestFromRow(rowElement)
	populateForm(harvest)

	document.getElementById('display').style.display = "none"
	document.getElementById('update-button').style.display = "block"
	document.getElementById('create-button').style.display = "none"
	document.getElementById('create-update').style.display = "block"
	document.getElementById("create-update-title").innerHTML = "Update Harvest";
}


function readHarvestFromRow(rowElement) {
	harvest = {}
	harvest.id = rowElement.getAttribute("id");
	harvest.employeeName = rowElement.cells[1].firstChild.textContent
	harvest.fieldSection = rowElement.cells[2].firstChild.textContent
	harvest.variety = rowElement.cells[3].firstChild.textContent
	harvest.quantity = rowElement.cells[4].firstChild.textContent

	return harvest

}

function doCreate() {
	var form = document.getElementById('createUpdateForm')

	var harvest = {}

	harvest.id = form.querySelector('input[name="id"]').value
	harvest.employeeName = form.querySelector('input[name="employeeName"]').value
	harvest.fieldSection = form.querySelector('input[name="fieldSection"]').value
	harvest.variety = form.querySelector('input[name="variety"]').value
	harvest.quantity = form.querySelector('input[name="quantity"]').value
	createHarvestAjax(harvest)


}

function populateForm(harvest) {
	var form = document.getElementById('createUpdateForm')


	form.querySelector('input[name="id"]').value = harvest.id
	form.querySelector('input[name="id"]').disabled = true

	form.querySelector('input[name="employeeName"]').value = harvest.employeeName
	form.querySelector('input[name="fieldSection"]').value = harvest.fieldSection
	form.querySelector('input[name="variety"]').value = harvest.variety
	form.querySelector('input[name="quantity"]').value = harvest.quantity
}

function clearForm() {
	var form = document.getElementById('createUpdateForm')


	form.querySelector('input[name="id"]').value = ''
	form.querySelector('input[name="id"]').disabled = false

	form.querySelector('input[name="employeeName"]').value = ''
	form.querySelector('input[name="fieldSection"]').value = ''
	form.querySelector('input[name="variety"]').value = ''
	form.querySelector('input[name="quantity"]').value = ''
}

host = window.location.origin

function createHarvestAjax(harvest) {
	console.log(JSON.stringify(harvest));

	$.ajax({
		//"url": "http://127.0.0.1:5000/harvests",
		"url": host + "/harvests",
		"method": "POST",
		"data": JSON.stringify(harvest),
		"dataType": "JSON",
		contentType: "application/json; charset=utf-8",
		"success": function(result) {
			//console.log(result);
			harvest.id = result.id
			addHarvestToTable(harvest)
			showDisplay()
			clearForm()

		},
		"error": function(xhr, status, error) {
			console.log("error" + error)
		}
	})

}

function doUpdate() {
	harvest = getHarvestFromForm()
	updateServer(harvest)

}

function updateServer(harvest) {
	$.ajax({
		//"url": "/harvests/" + harvest.id,
		"url": host + "/harvests/" + harvest.id,
		"data": JSON.stringify(harvest),
		"method": "PUT",
		"dataType": "JSON",
		contentType: "application/json; charset=utf-8",
		"success": function(result) {
			console.log(result)
			updateTableRow(harvest)
			showDisplay()
			clearForm()

		},
		"error": function(xhr, status, error) {
			console.log("error" + error)
		}
	})
}

function doDelete(thisElem) {
	var tableElement = document.getElementById('harvestTable');
	var rowElement = thisElem.parentNode.parentNode;
	var index = rowElement.rowIndex;
	id = rowElement.getAttribute("id");

	$.ajax({
		"url": host + "/harvests/" + id,
		"method": "DELETE",
		"dateType": "JSON",
		"success": function(result) {
			tableElement.deleteRow(index);
		},
		"error": function(xhr, status, error) {
			console.log(error)
		}
	})

}

function updateTableRow(harvest) {
	rowElement = document.getElementById(harvest.id)
	rowElement.cells[1].firstChild.textContent = harvest.employeeName
	rowElement.cells[2].firstChild.textContent = harvest.fieldSection
	rowElement.cells[3].firstChild.textContent = harvest.variety
	rowElement.cells[4].firstChild.textContent = harvest.quantity
	console.log("updating table")
}

function getHarvestFromForm() {
	var form = document.getElementById('createUpdateForm')

	var harvest = {}
	harvest.id = form.querySelector('input[name="id"]').value
	harvest.employeeName = form.querySelector('input[name="employeeName"]').value
	harvest.fieldSection = form.querySelector('input[name="fieldSection"]').value
	harvest.variety = form.querySelector('input[name="variety"]').value
	harvest.quantity = form.querySelector('input[name="quantity"]').value
	console.log(harvest)
	return harvest
}

function showDisplay() {
	document.getElementById('display').style.display = "block"
	document.getElementById('create-update').style.display = "none"

}

function populateTable() {
	//ajax getAll

	$.ajax({
		//"url": 'http://127.0.0.1:5000/harvests',
		"url": host + '/harvests',
		"method": 'GET',
		"datatype": 'JSON',
		"success": function(results) {
			for (harvest of results) {
				addHarvestToTable(harvest)
			}
		},
		"error": function(xhr, status, error) {
			console.log("error " + error + " code:" + status)
		}

	})

}

function addHarvestToTable(harvest) {
	console.log("Adding harvest to Table")

	var tableElem = document.getElementById("harvestTable")
	var rowElem = tableElem.insertRow(-1)
	rowElem.setAttribute("id", harvest.id)
	var cell1 = rowElem.insertCell(0)
	cell1.innerHTML = harvest.id
	var cell2 = rowElem.insertCell(1)
	cell2.innerHTML = harvest.employeeName
	var cell3 = rowElem.insertCell(2)
	cell3.innerHTML = harvest.fieldSection
	var cell4 = rowElem.insertCell(3)
	cell4.innerHTML = harvest.variety
	var cell5 = rowElem.insertCell(4)
	cell5.innerHTML = harvest.quantity
	var cell6 = rowElem.insertCell(5)
	cell6.innerHTML = '<button onclick="showUpdate(this)">Update</button>'
	var cell7 = rowElem.insertCell(6)
	cell7.innerHTML = '<button onclick="doDelete(this)">Delete</button>'
}
populateTable()