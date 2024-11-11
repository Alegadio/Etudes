/*
Concepteur: Alejandra García Diosa 
date de creation: 16/04/2024
but: Cet programme a comme but faire un simulation numerique du jeu de des YUM, ou les joeurs lancent 3 fois un set de
5 des et font des points selon les faces données a chaque lancé. 
*/

const NB_DES = 5;
const NB_FACES = 6;
const MAX_LANCES = 3;    /* constantes a usar a lo largo del programa*/ 
const MIN_JOUEURS = 1;
const MAX_JOUEURS = 6;

const FEUILLE_DE_POINTAGE = [['1', '5', '', 'sommeDesDes(0)'], //arreglo de arreglo(tabla) para imprimir 
                             ['2', '10', '', 'sommeDesDes(1)'],
	             	  	     ['3', '15', '', 'sommeDesDes(2)'],
	             		     ['4', '20', '', 'sommeDesDes(3)'],
	             		     ['5', '25', '', 'sommeDesDes(4)'],
		             	     ['6', '30', '', 'sommeDesDes(5)'],
		             	     ['Total partiel', '', '', ''],
		             	     ['Boni si 63 ou plus', '25', '', ''],
		             	     ['Total partie superieure', '', '', ''],
		             	     ['3 pareils', 'Total des 5 des', 'aNbPareils(3)', 'sommeDesDes(-1)'],
		             	     ['4 pareils', 'Total des 5 des', 'aNbPareils(4)', 'sommeDesDes(-1)'],
		             	     ['Courte sequence de 4', '15', 'aUneSequenceDe(4)', '15'],
			                 ['Longue sequence de 5', '20', 'aUneSequenceDe(5)', '20'],
			                 ['Roulement de surplus', 'Total des 5 des', '', 'sommeDesDes(-1)'],
			                 ['Main pleine', '25', 'aUneMainPleine()', '25'],
			                 ['Yum 5 pareils', '30', 'aNbPareils(5)', '30'],
			                 ['Total partie inferieure', '', '', ''],
			                 ['Total partie superieure', '', '', ''],
			                 ['Somme globale', '', '', '']];
const MIN_CHANGEMENTS = 10; //constantes para l'animacion 
const MAX_CHANGEMENTS = 25;
const DELAI = 200;

let des = [0, 0, 0, 0, 0]; //array que contiene los dados todos empiezan en 0 (de1)
let nbFoisParDes = [0, 0, 0, 0, 0]; //array para l'animacion
let nbJoueurs;
let joueurCourant = 0;
let nbLances = 1;
let joueurNoms = ['Joueur 1', 'Joueur 2', 'Joueur 3', 'Joueur 4', 'Joueur 5', 'Joueur 6'];
let simulationEstActive = false;

//Function pour generer le tableau du jeu avec le tableau de des
function genererHTML()
{
	let estValide; 
	
	do {
		nbJoueurs = parseInt(prompt('Entrez le nombre de joueurs', 3));
		estValide = nbJoueurs >= MIN_JOUEURS && nbJoueurs <= MAX_JOUEURS; //condicion para que estValide valga true 
		
		if (!estValide){
			alert('Le nombre de joueurs doit etre entre ' + MIN_JOUEURS + ' et ' + MAX_JOUEURS);
		}
	} while (!estValide);
	
	for (let i = 0; i < nbJoueurs; i++){
		joueurNoms[i] = prompt('Entrez le nom du joueur ' + (i + 1));
	}
	
	document.writeln('<form>');
	document.writeln('<table border="1">');
	document.writeln('<tr><td>&nbsp;</td><td>Jeu de des</td><td>Score maximal</td>');
	
	for (let i = 0; i < nbJoueurs; i++){
		document.write('<td>' + joueurNoms[i] +  '</td>'); //para cada jugador imprimir una columna con el nombre ingresado por el jugador 
	}
	
	document.write('</tr>');

	for (let i = 0; i < FEUILLE_DE_POINTAGE.length; i++) {
		document.write('<tr>'); //table row - linea - 
		document.write('<td>'); //table data (esto actúa como celdas-columnas)

		if (FEUILLE_DE_POINTAGE[i][3] != ''){			
			document.write('<button type="button" id="bouton'+ i +'" onclick="marquePoints('+ i +')"> Selection </button>'); 
			//si hay valor poner boton			
		}else{
			document.write('&nbsp;'); // si no, poner espacio
		}
			
		document.write('</td>');

		if (FEUILLE_DE_POINTAGE[i][1] == ''){
			document.write(`<td colspan="2">`+ FEUILLE_DE_POINTAGE[i][0] + `</td>`);			
		}else{
			document.write('<td>' + FEUILLE_DE_POINTAGE[i][0] + '</td>');
			document.write('<td>' + FEUILLE_DE_POINTAGE[i][1] + '</td>');
		}
		
		for (let j = 0; j < nbJoueurs; j++) {
			document.write('<td>');
			document.write('<input type="text" id="L' + i + 'C' + j + '" size="5" disabled/>');
			document.write('</td>');
		}
		
		document.writeln('</tr>');
	}

	document.writeln('</table>');

	for (let i = 0; i < FEUILLE_DE_POINTAGE.length; i++){
		let balise = document.getElementById('L' + i + 'C' + 0); 
		//L + i + C + 0 porque la fila cambia pero la columna no cambia
		balise.style.backgroundColor = 'cyan';		
	}
	
	document.writeln('<br/>');
	document.writeln('<table border="1">');
    document.write('<tr>');
	
	for (let i = 0; i < NB_DES; i++){
		document.write('<td id="de' + i + '" width="120" height="130"  onclick="selectionneDe(' + i + ')" selected="false">');
		
		for (let j = 0; j < NB_FACES; j++){										
			document.write(`<img src="./images/de${j+1}.jpg" id="face${j}"alt="de${j+1}" style="position:absolute; top:620px; left:${25 + 126*i}px; visibility: hidden; margin:0;">`);			
		}
								
		document.write('</td>');
	}
	
	document.writeln('<td><input type="button" id="btnRelance" value="Lancer les des" onclick="lanceLesDes()"/></td>');
	document.writeln('</tr>');
	document.writeln('</table>');
	
	document.writeln('</form>');
	
	for (let i = 0; i < NB_DES; i++){
		lanceLeDe(i); //determina las rotaciones de los dados
	}
	
	animation(); //anima los dados
}

//function pour reinitialiser le jeu et effacer tous le données
function reinitialise()
{	
	console.log(simulationEstActive);
	if (!simulationEstActive){		
		
		for(let i = 0; i < FEUILLE_DE_POINTAGE.length; i++){			
			
			for (let j = 0; j < nbJoueurs; j++){
					let pointage = document.getElementById('L' + i + 'C' + j)
					pointage.style.backgroundColor = 'lightgray';
					pointage.value = '';
					document.getElementById('L' + i + 'C' + 0).style.backgroundColor = 'cyan';		
				
				}		
				if (FEUILLE_DE_POINTAGE[i][3] != ''){
					document.getElementById('bouton'+ i).disabled = false;
							}									
		
		}	
		
		document.getElementById('btnRelance').disabled = false;					
		
		joueurCourant = 0;
		nbLances = 1;				
	}
	for (let i = 0; i < NB_DES; i++){
		lanceLeDe(i);
	}	
	animation();	
}

//addition des faces de des 
function sommeDesDes(de){ 
	let somme = 0;
	if(de === -1){ //el -1 es dado como parametro cuando llamamos la funcion
		//en ciertas casillas de la matriz
		for (let i = 0; i < NB_DES; i++){
			somme += des[i] + 1;
		}
		return somme;
	} else {
		let cpt = compteToutesFaces(); //cpt=[1,0,0,1,2,1]
		console.log("cpt :" + cpt);
		//el parametro de es el indice de cpt
		// si de es igual a 4 (dado 5), entonces cpt[4] = 2
		// 2 * (4 + 1) = 10
		return cpt[de] * (de + 1); 	
	}	
}

//compteur de nombre de faces pareils 
function aNbPareils(nombre){
	let cpt = compteToutesFaces();
	let resultat = false;
	
	for (let i = 0; i < NB_DES; i++){
		resultat = resultat || cpt[i] >= nombre;
	}
	console.log(resultat);
	console.log(nombre);
	return resultat;	
}

//compteur au cas au d'avoir un sequence de des 
function aUneSequenceDe(longueur){
	let cptTab = compteToutesFaces(); //cpt=[1,0,0,1,2,1]
	
	let cpt = 0;
	
	for (let i = 0; i < NB_FACES; i++){ 
		if (cptTab[i] >= 1){
			cpt++;
		}else{
			cpt = 0;
		}
		
		if (cpt >= longueur){
			return true;
		}
	}
	
	return false;
}

// compteur pour une main pleine
function aUneMainPleine(){
	let cpt = compteToutesFaces(); //cpt=[1,0,0,1,2,1]
	let aPaire = false;
	let aTriplet = false; alert(cpt);
	
	for (let i = 0; i < NB_FACES; i++){
		aPaire = aPaire || cpt[i] == 2;
		aTriplet = aTriplet || cpt[i] == 3;
	}
	
	return aPaire && aTriplet;
}

//compteur de nombre de faces dans chaque lance
function compteToutesFaces(){
	let cpt = [0, 0, 0, 0, 0, 0]; //arreglo con las 6 caras del dado
    
    for (let i = 0; i < NB_DES; i++) { //recorre el numero de dados
		cpt[des[i]]++;  /*aumenta cpt en el índice de des[i], 
    	cuando des[] es modificado, llega con ese valor 
		"el valor que tenga des[en la posición i], auméntelo
		cuenta cuántas veces salió el mismo número
		ex: des=[6, 1, 5, 4, 5]  cpt=[1,0,0,1,2,1]
		la ejecucion seria
			cpt=[0, 0, 0, 0, 0, 1]
			cpt=[1, 0, 0, 0, 0, 1]
			cpt=[1, 0, 0, 0, 1, 1]
			cpt=[1, 0, 0, 1, 1, 1]
			cpt=[1, 0, 0, 1, 2, 1]*/
	}
	console.log(cpt);
    return cpt;	
}		

//function pour selectioner le(s) de(s) 
function selectionneDe(de){
	let deSelectionne;	
		deSelectionne = document.getElementById('de'+ de);

	if(deSelectionne){						
		if(deSelectionne.style.backgroundColor === "black"){		
			deSelectionne.style.backgroundColor = "white";			
		}else{
			deSelectionne.style.backgroundColor = "black";					
		}
	}	
}

//function onclick pour le bouton lancer les des 
function lanceLesDes(){
	if (!simulationEstActive){
		let lancerBouton = document.getElementById('btnRelance');
		nbLances++;
		
		if (nbLances >= MAX_LANCES){
			lancerBouton.disabled = true;
		}
		for(let i = 0; i < NB_DES; i++){
			if (document.getElementById('de'+ i).style.backgroundColor === "black"){
				lanceLeDe(i); //cambio el valor de los dados
				animation(i); // hago animación
			} else {
				document.getElementById('de'+ i).style.backgroundColor= "white";
			}		
		}			
	}
}

//function pour determiner et imprimer les points selon les des choisis
function marquePoints(noLigne){
	
	console.log("noLigne" + noLigne);
	if (!simulationEstActive){
		let condition = FEUILLE_DE_POINTAGE[noLigne][2];
		let resultat = (condition == '') || eval(condition);
		//eval recibe strings que pueden ser numericos y return true si lo son y pueden ser calculados o false si no.
		//en este caso como lo que va a encontrar eval() son numeros, entonces returna el valor  
		//si no hay nada O si hay un valor que pueda ser evaluado
		let marquePoints = FEUILLE_DE_POINTAGE[noLigne][3]; 
		let points;
		console.log("eval :" + eval(marquePoints));
		if (resultat){
			points = eval(marquePoints);
		}else{
			points = 0;
		}
		console.log("points: " + points)
		document.getElementById('L' + noLigne + 'C' + joueurCourant).value = points;
	
		if (noLigne < NB_FACES){
			resultat = points + parseInt('0' + document.getElementById('L' + 6 + 'C' + joueurCourant).value);
			console.log("resultat: " + resultat);
			document.getElementById('L' + 6 + 'C' + joueurCourant).value = resultat;
			let boni = resultat >= 63 ? FEUILLE_DE_POINTAGE[7][3] : 0; 
			//si resultat es mayor o igual a 63, poner en boni el valor en la casilla FEUILLE_DE_POINTAGE[7][3]
			//si no, poner 0
			document.getElementById('L' + 7 + 'C' + joueurCourant).value = boni;
			resultat += boni;
			document.getElementById('L' + 8 + 'C' + joueurCourant).value = resultat;
			document.getElementById('L' + 17 + 'C' + joueurCourant).value = resultat;
			resultat += parseInt('0' + document.getElementById('L' + 18 + 'C' + joueurCourant).value);
			document.getElementById('L' + 18 + 'C' + joueurCourant).value = resultat;
		}else{
			let totalPartielSup = document.getElementById('L' + 17 + 'C' + joueurCourant).value || 0;
			// si hay un valor, guardarlo en memoria si no, usar 0 como valor. 
			document.getElementById('L' + 16 + 'C' + joueurCourant).value = points;
			document.getElementById('L' + 18 + 'C' + joueurCourant).value = parseInt(totalPartielSup) + points;			
		}
	
		for (let i = 0; i < NB_DES; i++){
			lanceLeDe(i);		
		}

		animation();		
		
		for(let i = 0; i < FEUILLE_DE_POINTAGE.length; i++){
			for(let j = 0; j <= nbJoueurs; j++){
				
				document.getElementById('L' + i + 'C' + joueurCourant).style.backgroundColor = "lightgray";
			}			
		}
		console.log("nbjoueurs: " + nbJoueurs);
		
		joueurCourant = ((parseInt(joueurCourant) + 1) % nbJoueurs);		
		
		nbLances = 1;
		document.getElementById("btnRelance").disabled = false;
		
		for(let i = 0; i < FEUILLE_DE_POINTAGE.length; i++){
			for(let j = 0; j < nbJoueurs; j++){
				document.getElementById('L' + i + 'C' + joueurCourant).style.backgroundColor = "cyan";
				
				if(document.getElementById('L' + i + 'C' + joueurCourant).value != ''){
					if(document.getElementById('bouton'+ i)){ //si ese elemento existe en el DOM						
						document.getElementById('bouton'+ i).disabled = true;
					} 
				}else {					
					if(document.getElementById('bouton'+ i)){
						document.getElementById('bouton'+ i).disabled = false;
					} 
				}					
			}
		}
	}
}

//function pour determiner le nombre de fois que le de va changer
function lanceLeDe(de){ //cuántas veces vamos a girar los dados
	console.log("de lanceLeDe: " + de);
	if(de >= 0) {		
		nbFoisParDes[de] = Math.floor((Math.random() * (MAX_CHANGEMENTS - MIN_CHANGEMENTS)) + MIN_CHANGEMENTS);
		return;
	} else {
		for (let i = 0; i < nbFoisParDes.length; i++){		
		nbFoisParDes[i] = Math.floor((Math.random() * (MAX_CHANGEMENTS - MIN_CHANGEMENTS)) + MIN_CHANGEMENTS);
		}
	}	
}

//function pour faire l'animation quand on lance les des
function animation(de)
{
	console.log("nbFois: " + nbFoisParDes);
	let onContinue = false;
	console.log("de animation:" + de);
	if(de >= 0){

		if (nbFoisParDes[de] > 0){
			onContinue = true;
			nbFoisParDes[de]--;
			let deCol = document.getElementById('de'+ de);
			deCol.style.backgroundColor= "white";

			let face = deCol.querySelector('#face' + de);
			face.style.visibility= "hidden";

			des[de] = (des[de]+1) % NB_FACES; //haciendo un calculo para una nueva cara del dado
			face.src = "./images/de" + (des[de] + 1) + ".jpg";
			face.style.visibility= "visible";
		}
	} else {
		for (let i = 0; i < NB_DES; i++){
			if (nbFoisParDes[i] > 0){
				onContinue = true;
				nbFoisParDes[i]--; //va disminuyendo hasta llegar a 0
				let deCol = document.getElementById('de'+ i);
				deCol.style.backgroundColor= "white";

				let face = deCol.querySelector('#face' + i);
				face.style.visibility= "hidden";

				des[i] = (des[i]+1) % NB_FACES;
				face.src = "./images/de" + (des[i] + 1) + ".jpg";
				face.style.visibility= "visible";
			}
		}
	}
	
	simulationEstActive = onContinue;
	
	if (onContinue){
		setTimeout(animation, DELAI);
	}
}