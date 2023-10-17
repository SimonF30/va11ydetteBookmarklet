var axecore_version= '4.7.2';
var axecore_fr= '';
var objAxeVallydette = {};



var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/'+axecore_version+'/axe.min.js';
document.head.appendChild(script);

var langRequest = new XMLHttpRequest();
langRequest.open("GET", "https://raw.githubusercontent.com/dequelabs/axe-core/v"+axecore_version+"/locales/fr.json", true);
langRequest.onreadystatechange = function () {
	  if(langRequest.readyState === 4 && langRequest.status === 200) {
		axecore_fr = JSON.parse(langRequest.responseText);
	  } 
	};
	langRequest.send();


var wcagRequest = new XMLHttpRequest();
wcagRequest.open("GET", "https://la-va11ydette.orange.com/json/criteres-wcag-ease-fr.json", true);
wcagRequest.onreadystatechange = function () {
	  if(wcagRequest.readyState === 4 && wcagRequest.status === 200) {
		objVallydette = JSON.parse(wcagRequest.responseText);
		axeLauncher(objVallydette);
	  } 
	};
	wcagRequest.send();

function getNumber(string) {
	let value = string;	
	var numberPattern = /\d+/g;
	if (value.match( numberPattern )) {
		value = value.match( numberPattern ).join([]);
		return value;
	}	
}
	
function axeLauncher(objVallydette) {
	setTimeout(function(){
		axe.configure({
			locale: axecore_fr
		});
		axe.run(document, {
			runOnly: {
				type: "tag",
				values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]
			},
			resultTypes:['violations', 'inapplicable']
		}, function(err, results) {
		if (err) throw err;
		console.log(JSON.stringify(results))

		//@TODO parser en fonction des resultats qu'on veut garder

		let JsonFileData = JSON.stringify(results.violations);

		var bb = new Blob([JsonFileData], {type: 'application/json'});
		var downloadLink = document.createElement('a');
		downloadLink.setAttribute('href', window.URL.createObjectURL(bb));
		downloadLink.setAttribute('download', 'axe-va11ydette-report.json'); 
		downloadLink.style.display = 'none';
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
		return;

		axeVallydetteHTML = '';
		axeVallydetteHTML += '<!DOCTYPE html>';
		axeVallydetteHTML += '<html lang="fr">';

		axeVallydetteHTML += '<head>';
		axeVallydetteHTML += '<meta charset="UTF-8">';
		axeVallydetteHTML += '<meta name="viewport" content="width=device-width, initial-scale=1">';
		axeVallydetteHTML += '<link href="dist/fonts/HelvNeue55_W1G.woff2" rel="preload" as="font" type="font/woff2" crossorigin="anonymous">';
		axeVallydetteHTML += '<link href="dist/fonts/HelvNeue75_W1G.woff2" rel="preload" as="font" type="font/woff2" crossorigin="anonymous">';
		axeVallydetteHTML += '<link href="https://cdn.jsdelivr.net/npm/boosted@5.0.2/dist/css/orange-helvetica.min.css" rel="stylesheet" integrity="sha384-ARRzqgHDBP0PQzxQoJtvyNn7Q8QQYr0XT+RXUFEPkQqkTB6gi43ZiL035dKWdkZe" crossorigin="anonymous">';
		axeVallydetteHTML += '<link href="https://cdn.jsdelivr.net/npm/boosted@5.0.2/dist/css/boosted.min.css" rel="stylesheet" integrity="sha384-6VTsNhIHFxNglfMLfhvvJFxXZbdvT1UXhm7+wVMAda9c+2NIFu4zmlKKz/bJthi/" crossorigin="anonymous">';
		axeVallydetteHTML += '<title>aXe / Va11ydette report | '+document.title+'</title>';
		axeVallydetteHTML += '</head>';
		axeVallydetteHTML += '<body>';
		axeVallydetteHTML += '<main role="main" class="mt-4">';
		axeVallydetteHTML += '<div class="container">';
		axeVallydetteHTML += '<h1>aXe / Va11ydette report : '+ document.title+'</h1>';

		results.violations.forEach(function(issue, index){
			
			objAxeVallydette[index] = {};
			objAxeVallydette[index].id = issue.id;
			objAxeVallydette[index].description = issue.description;
			objAxeVallydette[index].vallydette = [];
			
			axeVallydetteHTML += '<h2>Critères correspondant pour : ' + escapeHtml(objAxeVallydette[index].description) + '</h2>';
			axeVallydetteHTML += '<ul>';
			issue.tags.forEach(function(tag){
				
				var tg = getNumber(tag);
				
				
				
				if (tg && tg.length === 3) {
					
					
					objVallydette.forEach(function(e){
						
							e.wcag.forEach(function(w){
							var wg = getNumber(w);
							
							if (wg === tg) {	
								objAxeVallydette[index].vallydette.push(e.title);
								axeVallydetteHTML += '<li>' + e.title + '</li>';
							}
								
						});
							
						/* e.wcag.filter(w => getNumber(w) === tg);
						
						console.log(e.wcag.length);
						if (e.wcag.length > 0) {
							console.log(tag);
						}	
							*/
						
						/* e.wcag.filter(w => getNumber(w) === getNumber (tag));
						
						if (e.wcag.length > 0) {
							console.log(e.title);
						} */
					});
					
					
				}
				
				
				
				//getNumber(tag);
				//console.log(objVallydette);
				
				
			})
			
			axeVallydetteHTML += '</ul>';
			
		});
		axeVallydetteHTML += '</div>';
		axeVallydetteHTML += '</main>';
		axeVallydetteHTML += '<script src="https://cdn.jsdelivr.net/npm/boosted@5.0.2/dist/js/boosted.bundle.min.js" integrity="sha384-a3K6jz95fJEM/VHhViODijMUDGZsk3kzR9A9te5dH5jYIoXW7scODk+TtVjLhCW2" crossorigin="anonymous"></script>'
		axeVallydetteHTML += '</body>';
		axeVallydetteHTML += '</html>';


		var bb = new Blob([axeVallydetteHTML], {type: 'text/html'});

		var downloadLink = document.createElement('a');
		downloadLink.setAttribute('href', window.URL.createObjectURL(bb));
		downloadLink.setAttribute('target', '_blank');
		//downloadLink.setAttribute('download', 'axe-va11ydette-report.html'); 
		downloadLink.style.display = 'none';
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);

		});
	}, 1000);
}

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }