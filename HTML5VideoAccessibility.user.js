// ==UserScript==
// @name        HTML5 video accessibility
// @description make web videos accessible for blind people
// @namespace   mailtoloco
// @author      Yannick Youale mailtoloco2011@gmail.com
// @copyright   Copyright 2017 Yannick Youale
// @license     BSD
// @include     *
// @version     0.5
// @grant       none
// ==/UserScript==

// at the 30 june 2k018
// customizations are made for (in alphabetical order):
// sokrostream.biz
// vimeo.com
// xnxx.com
// xvideo.com
// youtube.com

// some global variables
var VideoFlag = false;
var VideoIndex = 0;
var CurrentTitle = "";
var CurrentTitleObject = null;

function onPageLoad(){
// after the loading of the html page
// we initialize the sayString function
saystring("");

// we try to handle flash videos
	killWindowlessFlash(document);

// we wait a little time

// is there any video on this page ?
VideoFlag = isVideoOnTheCurrentPage();
// if at least one video on this page
if(VideoFlag == true){
// we add the event of pressed keys
window.addEventListener('keydown', document_onKeyDown, true);
// we move the focus on the first video object
document.getElementsByTagName("video")[VideoIndex].focus();
// we trigger the timer to check page title's change
// every 2 seconds
window.setInterval(checkPageTitleChange, 2000);
} // end if at least one video

// to make some initial treatment on certain web sites
// for example automatically start the video
url = window.location.href;
// if we are on xvideos.com
// or we are on xnxx.com
if(url.indexOf("xvideos.com") > -1 || url.indexOf("xnxx.com") > -1){
// we will find and click on the graphic play
elm = document.getElementsByTagName("img");
s = "";
for(i=0; i<elm.length; i++){
if(elm[i].title == "Jouer" || elm[i].title == "Play"){
// we simulate a left mouse click on this element
var evt = document.createEvent("MouseEvents");
evt.initMouseEvent("click", true, true, window,0, 0, 0, 0, 0, false, false, false, false, 0, null);
elm[i].dispatchEvent(evt);
return;
} // end if
} // End For
} // End If on xvideos.com and xnxx.com
// any way, if there is a video on the current page
if(VideoFlag == true){
// and if the video is not playing yet
if(document.getElementsByTagName("video")[VideoIndex].paused == true){
document.getElementsByTagName("video")[VideoIndex].play();
} // end if
} // End If there is a video on the current page
} // End Function

function isVideoOnTheCurrentPage(){
// check if we are on a video page
var flag = false;
var elm = document.getElementsByTagName("video");
flag = (elm.length > 0);
// si aucune vidéo trouvée
if(flag == false){
// mais si on est sur certains site particuliers
var url = window.location.href;
if(url.indexOf("/sokrostream.") > -1){
return true;
} // end if comparaison d'url
} // End If flag == false
return flag;
} // end function

function isFocusNotInInputText(){
// return true if the focus is not on an input text
var cur_type = document.activeElement.type;
if(cur_type=="text" || cur_type=="textarea" || cur_type=="password"){
return false;
} // end if
return true;
} // end function

function ConvertDuration(d, iFormat){
// convert duration into a humanly readable one
var i;
var s = "";
var dRest = 0;

// if at least one hour
if(d >= (60 * 60)){
// the max number of hours
i = parseInt(d / (60 * 60));
if(iFormat == 1){
s = s + convertFigure(i) + ":";
} else if(iFormat == 2){
s = s + i + " heures";
} // end if iFormat
d = d - (i * 60 * 60);
} else {
if(iFormat == 1){
s = "00:";
} // End If
} // end if at least one hour or not

// if at least one minut
if(d >= 60){
// the max number of minuts
i = parseInt(d / (60));
if(iFormat == 1){
s = s + convertFigure(i) + ":";
} else if(iFormat == 2){
s = s + " " + i + " minutes";
} // end if iFormat
d = d - (i * 60);
} else {
if(iFormat == 1){
s = s + "00:";
} // End If
} // end if at least one minut or not

// if it remains some seconds
if(d > 1){
if(iFormat == 1){
s = s + convertFigure(parseInt(d));
} else if(iFormat == 2){
s = s + " " + parseInt(d) + " secondes";
} // end if iFormat
} else { // no secondes remaining
if(iFormat == 1){
s = s + " 0 secondes";
} else if(iFormat == 2){
s = s + "00";
} // end if iFormat
} // end if

// the result
return s;
} // end function

function convertFigure(i){
// convert figure for sweetable time format
var s = "" + i;
if(s.length == 1){
s = "0" + s;
} // End If
return s;
} // End Function

function getVideoDuration(){
// get, convert and return the total duration of the selected video
var elm = document.getElementsByTagName("video")[VideoIndex];
var s = "";
s = elm.duration;
// if it is a number
if(isFinite(s) == true){
var i = parseInt(s);
return ConvertDuration(i, 2);
} // end if the duration is a number
return "";
} // End Function

function checkPageTitleChange(){
// regularly check if the page title have changed
// and announce the new title if it is the case
var i = 0;
var s = "";
var elm;
// if the title object is not yet known
if(CurrentTitleObject == null){
elm = document.getElementsByTagName("title");
if(elm.length > 0){
CurrentTitleObject = elm[0];
} // end if
} // end if
// if it's still not known
if(CurrentTitleObject == null){
return;
} // end if
// if the title has change mean while
if(CurrentTitleObject.innerText != CurrentTitle){
// we record the title change
CurrentTitle = CurrentTitleObject.innerText;
var sText = CurrentTitle;
// we wille also get the video duration
s = getVideoDuration();
if(s != ""){
sText = sText + ", duration: " + s;
} // end if
// reading by the vocal synthesis
saystring(sText);
} // end if the page title has change
} // end function

function escapeKey(){
// when the escape key is pressed
// the behavior could be different according to the current web site
var i;
var s = "";
var d;
var dd;
var ddd;
var elm;
var url;
//
url = window.location.href;
// sur sokrostream
if(url.indexOf("/sokrostream.") > -1){
// on cherche les liens a
elm = document.getElementsByTagName("a");
if(elm.length > 0){
for(i=0; i<elm.length; i++){
if(elm[i].innerText == "Signaler un Problème"){
saystring("Sélection du lien avant la vidéo");
elm[i].focus();
return;
} // End If
} // End For
} // End If si des iframe
} // End If on sokrostream
// sur youtube
if(window.location.href.indexOf("youtube.com") > -1){
// on recherche un éventuel bouton "Ignorer l'annonce"
// pour clicker dessus
elm = document.getElementsByTagName("button");
s = "";
for(i=0; i<elm.length; i++){
s = elm[i].innerText;
if(s.indexOf("Ignorer l'annonce") > -1){
// on va simuler un click de la souris sur cet élément
saystring("Ignorer l'annonce");
// elm[i].focus();
var evt = document.createEvent("MouseEvents");
evt.initMouseEvent("click", true, true, window,0, 0, 0, 0, 0, false, false, false, false, 0, null);
elm[i].dispatchEvent(evt);
// on sort de la boucle
return;
} // End If texte trouvé
} // End For
} // end if sur youtube
// on déplace le focus à l'objet video
document.getElementsByTagName("video")[VideoIndex].focus();
saystring("Déplacement à l'objet vidéo");
} // End Function

function videoTogglePlayPause(){
// toggle between play and pause for the selected video
if(document.getElementsByTagName("video")[VideoIndex].paused == true){
document.getElementsByTagName("video")[VideoIndex].play();
saystring("Play");
} else {
document.getElementsByTagName("video")[VideoIndex].pause();
saystring("Pause");
} // end if
} // End Function

function videoToggleMute(){
// toggle between and mute and not mute for the selected video
var elm;
elm = document.getElementsByTagName("video")[VideoIndex];
elm.muted = not(elm.muted);
if(elm.muted == true){
saystring("muet activé");
} else {
saystring("muet désactivé")
} // end if
} // End Function

function videoMove10SecLeft(){
// move 10 seconds backward for the selected video
var i;
var s = "";
var d;
var dd;
var ddd;
var elm;
var url;
//
elm = document.getElementsByTagName("video")[VideoIndex];
// la position courante
d = elm.currentTime;
// recul de 10 secondes
d = d - 10;
if(d < 0){ d = 0; }
elm.currentTime = d;
saystring("Recul de 10 secondes");
} // End Function

function videoMove10SecRight(){
// move 10 seconds ahead for the selected video
var i;
var s = "";
var d;
var dd;
var ddd;
var elm;
var url;
//
elm = document.getElementsByTagName("video")[VideoIndex];
// la position courante
d = elm.currentTime;
// la durée totale
dd = elm.duration;
// avance de 10 secondes
d = d + 10;
if(d > dd){ d = dd; }
elm.currentTime = d;
saystring("Avance de 10 secondes")
} // End Function

function videoMove60SecLeft(){
// move 60 seconds backward for the selected video
var i;
var s = "";
var d;
var dd;
var ddd;
var elm;
var url;
//
elm = document.getElementsByTagName("video")[VideoIndex];
// la position courante
d = elm.currentTime;
// recul de 60 secondes
d = d - 60;
if(d < 0){ d = 0; }
elm.currentTime = d;
saystring("Recul de 60 secondes");
} // End Function

function videoMove60SecRight(){
// move 60 seconds ahead for the selected video
var i;
var s = "";
var d;
var dd;
var ddd;
var elm;
var url;
//
elm = document.getElementsByTagName("video")[VideoIndex];
// la position courante
d = elm.currentTime;
// la durée totale
dd = elm.duration;
// Avance de 60 secondes
d = d + 60;
if(d > dd){ d = dd; }
elm.currentTime = d;
saystring("Avance de 60 secondes");
} // End Function

function videoMove5MinLeft(){
// move 5 minuts backward for the selected video
var i;
var s = "";
var d;
var dd;
var ddd;
var elm;
var url;
//
elm = document.getElementsByTagName("video")[VideoIndex];
// la position courante
d = elm.currentTime;
// recul de 5 minutes  
d = d - (60 * 5);
if(d < 0){ d = 0; }
elm.currentTime = d;
saystring("Recul de 5 minutes");
} // End Function

function videoMove5MinRight(){
// move 5 minuts ahead for the selected video
var i;
var s = "";
var d;
var dd;
var ddd;
var elm;
var url;
//
elm = document.getElementsByTagName("video")[VideoIndex];
// la position courante
d = elm.currentTime;
// la durée totale
dd = elm.duration;
// Avance de 5 minutes  
d = d + (60 * 5);
if(d > dd){ d = dd; }
elm.currentTime = d;
saystring("Avance de 5 minutes");
} // End Function

function videoOrigin(){
// go to the begining of the selected video
var elm;
elm = document.getElementsByTagName("video")[VideoIndex];
elm.currentTime = 0;
saystring("Vidéo au début");
} // End Function

function videoEnd(){
// go to the end of the selected video
var elm;
elm = document.getElementsByTagName("video")[VideoIndex];
d = elm.duration;
elm.currentTime = parseInt(d);
saystring("Vidéo à la fin");
} // End Function

function videoReach(){
// prompt the user to type the time of the video he wants to reach
var d;
var t;
var elm;
//
elm = document.getElementsByTagName("video")[VideoIndex];
if(elm == null){
return;
} // End If
// we get the current position
d = elm.currentTime;
// we convert in hours, minutes, and secondes
t = ConvertDuration(d, 1);
// we ask for the new position
t = prompt("Type the new position to reach", t);
// checking
if(t.length != 8 || t.indexOf(":") < 0){
alert("Error");
return;
} // End If
// we reconvert into secondes
d = 0;
var tbl = t.split(":");
d = parseInt(tbl[0]) * 60 * 60;
d = d + (parseInt(tbl[1]) * 60);
d = d + parseInt(tbl[2]);
// we apply
elm.currentTime = d;
saystring("déplacement à " + t);
} // End Function

function videoVolumeUp(){
// increase the volume of the selected video
var s = "";
var d;
var elm;
//
elm = document.getElementsByTagName("video")[VideoIndex];
d = elm.volume;
d = d + 0.05;
if(d > 1){ d = 1; }
elm.volume = d;
s = "Volume " + Math.round(d * 100);
saystring(s);
} // End Function

function videoVolumeDown(){
// decrease the volume of the selected video
var s = "";
var d;
var elm;
//
elm = document.getElementsByTagName("video")[VideoIndex];
d = elm.volume;
d = d - 0.05;
if(d < 0){ d = 0; }
elm.volume = d;
s = "Volume " + Math.round(d * 100);
saystring(s);
} // End Function

function videoSpeedUp(){
// increase the speed of the selected video
var d;
var elm;
//
elm = document.getElementsByTagName("video")[VideoIndex];
d = 0.0;
d = elm.playbackRate;
// augmentation de la vitesse
if(d < 2){
elm.playbackRate = d + 0.1;
d = Math.round(d * 100);
saystring("Vitesse " + d + "%");
} // end if
} // End Function

function videoSpeedDown(){
var d;
var elm;
//
elm = document.getElementsByTagName("video")[VideoIndex];
d = 0.0;
d = elm.playbackRate;
// diminution de la vitesse
if(d > 0){
elm.playbackRate = d - 0.1;
d = Math.round(d * 100);
saystring("Vitesse " + d + "%");
} // end if
} // End Function

function videoSayStatus(){
// say informations on the current selected video reader
var i;
var s = "";
var d;
var dd;
var ddd;
var elm;
var url;
//
elm = document.getElementsByTagName("video")[VideoIndex];
s = "";
s = elm.duration;
// if it is a number
if(isFinite(s) == true){
i = parseInt(s);
s = " on " + ConvertDuration(i, 2);
d = parseInt(elm.currentTime);
s = ConvertDuration(d, 2) + s;
// convertion en pourcentage
s = s + " " + Math.round(d * 100 / i) + "%";
// if in pause
if(elm.paused == true){
s = s + "\r\n" + "paused" ;
} else {
s = s + "\r\n" + "playing";
} // end if
// si muet activé
if(elm.muted == true){
s = s + "\r\n" + " on muted" ;
} // end if
// la vitesse
d = elm.playbackRate;
s = s + "\r\n" + "speed=" + Math.round(d * 100) + "%";
// reading by the vocal synthesis
saystring(s);
} else {
saystring("failure");;
} // end if
} // End Function

function videoNext(){
// go to the next video
// usually click on the next video button
var i;
var s = "";
var d;
var dd;
var ddd;
var elm;
var url;
//
// si on est sur youtube
if(window.location.href.indexOf("youtube.com") > -1){
// on va clicker sur le lien nommé suivant
// tagName=A, className=ytp-next-button ytp-button, title=Suivante
elm = document.getElementsByTagName("a");
for(i=0; i<elm.length; i++){
if(elm[i].title == "Suivante"){
saystring("next video");
// on effectue le click
var evt = document.createEvent("MouseEvents");
evt.initMouseEvent("click", true, true, window,0, 0, 0, 0, 0, false, false, false, false, 0, null);
elm[i].dispatchEvent(evt);
return;
} // End If end if est le bon lien
} // End For
} // end if sur youtube
} // End Function

function videoBeforeOnSamePage(){
// select the previous video on the same page
// changement d'index de vidéo
var i;
i = 1;
i = document.getElementsByTagName("video").length;
VideoIndex = VideoIndex - 1;
if(VideoIndex <= 0){ VideoIndex = i - 1; }
saystring("Video " + (VideoIndex + 1) + "/" + i);
} // End Function

function videoAfterOnSamePage(){
// select the next video on the same page
var i;
// changement d'index de vidéo
i = 1;
i = document.getElementsByTagName("video").length;
VideoIndex = VideoIndex + 1;
if(VideoIndex >= i){ VideoIndex = 0; }
saystring("Video " + (VideoIndex + 1) + "/" + i);
} // End Function

function videoURL(){
// Display the url source of the current video in an input box
// in order to be copied
var url = document.getElementsByTagName("video")[VideoIndex].currentSrc;
prompt("URL of the video #"+(VideoIndex + 1), url);
} // End Function

function document_onKeyDown(e){
// à when keyboard keys are pressed
// var intKeyCode = window.event.keyCode;
var i;
var s = "";
var d;
var dd;
var ddd;
var KeyCode = e.keyCode;
var elm;
var url;
// saystring(KeyCode); // pour les tests de touche

// for testings
if(1 == 0){
// if(KeyCode == 82){ // touche r
elm = document.activeElement;
s = "tagName=" + elm.tagName + ", innerText=" + elm.innerText + ", name=" + elm.name + ", id=" + elm.id + ", className=" + elm.className + ", title=" + elm.title;
prompt("élement=", s);
prompt("code=", elm.parentNode.innerHTML);
// return;
var searched = prompt("texte à rechercher:", "Suivant");
s = prompt("type de balise", "button");
elm = document.getElementsByTagName(s);
s = "";
for(i=0; i<elm.length; i++){
if(elm[i].title.indexOf(searched) > -1 || elm[i].alt.indexOf(searched) > -1){
s = elm[i].parentNode.innerHTML + "|\r\n";
prompt(i, s);
} // end if
} // End For
prompt(elm.length, "fin");
s = "";
for(i=0; i<elm.length; i++){
s = s + elm[i].innerHTML + "|\r\n";
} // End For
prompt(elm.length + " innerHTML", s);
return;
} // end if touche

// 27 = escape
if(KeyCode == 27){
escapeKey();
return;
} // end if

// pagedown
if(KeyCode == 34){
if(e.shiftKey){
videoNext();
return;
} // end if shift
} // end if pagedown

// origin key
if(KeyCode == 36){
if(e.shiftKey){
videoOrigin();
return;
} // end if shift
} // End If origin

// end key
if(KeyCode == 35){
if(e.shiftKey){
videoEnd();
return;
} // end if shift
} // End If origine

// if we are not on a input text zone
if(isFocusNotInInputText()){

// 32 = escape for pause/play
if(KeyCode == 32){
if(e.shiftKey){
videoTogglePlayPause();
return;
} // end if shift
} // end if space

// 37 = left arrow  for displacements
if(KeyCode == 37){
if(e.shiftKey && e.ctrlKey){ // ctrl+shift
videoMove5MinLeft();
return;
} else if(e.shiftKey){ // e.shiftKey
videoMove10SecLeft();
return;
} else if(e.ctrlKey){ // ctrl
videoMove60SecLeft();
return;
} // end if
} // end if left key

// 39 = right arrow for displacements
if(KeyCode == 39){
if(e.shiftKey && e.ctrlKey){ // ctrl+e.shiftKey
videoMove5MinRight();
return;
} else if(e.shiftKey){ // e.shiftKey
videoMove10SecRight();
return;
} else if(e.ctrlKey){ // ctrl
videoMove60SecRight();
return;
} // end if
} // end if right key

// 38 = up arrow for volume and toggle between videos
if(KeyCode == 38){
if(e.shiftKey){
videoVolumeUp();
return;
} else if(e.ctrlKey){ // ctrl
videoBeforeOnSamePage();
return;
} // end if
} // end if

// 40 = flèche bas for volume and toggle between videos
if(KeyCode == 40){
if(e.shiftKey){
videoVolumeDown();
return;
} else if(e.ctrlKey){ // ctrl
videoAfterOnSamePage();
return;
} // end if
} // end if

// 71 = g to reach a position
if(KeyCode == 71){
if(e.shiftKey == true && e.ctrlKey == false && e.altKey == false){
videoReach();
return;
} // end if
} // end if 

// 68 = d to say status
if(KeyCode == 68){
if(e.shiftKey == false && e.ctrlKey == false && e.altKey == false){
videoSayStatus();
return;
} // end if
} // end if

// 77 = m to toggle mute
if(KeyCode == 77){
if(e.shiftKey == false && e.ctrlKey == false && e.altKey == false){
videoToggleMute();
return;
} // end if ' e.shiftKey
} // end if

// 82 = r for speed
if(KeyCode == 82){
if(e.shiftKey == false && e.ctrlKey == false && e.altKey == false){
videoSpeedUp();
return;
} else if(e.shiftKey){
videoSpeedDown();
return;
} // end if
} // end if

// 85 = u for URL display
if(KeyCode == 85){
if(e.shiftKey == false && e.ctrlKey == false && e.altKey == false){
videoURL();
return;
} // end if
} // end if

} // end if isFocusNotInInputText

} // end function

// variables globales nécessaires à la fonction
// de lecture par la synthèse vocale
var compteur_yyd = 0;
var message_yyd = "";

function saystring(s){
// say a text by the rulling vocal synthesis
// using aria accessibility tags
var elm;
var difference = "";
// we search for our customized text zone
elm = document.getElementById("message_to_say_yyd");
if(elm == null){ // not yet existing
// we create that area
elm = document.createElement("div");
elm.setAttribute("id", "message_to_say_yyd");
elm.setAttribute("aria-live", "assertive");
elm.setAttribute("aria-atomic", "true");
elm.setAttribute("style", "width: 0%;height: 0%;");
// we add it at the end of the body tag
document.getElementsByTagName("body")[0].appendChild(elm);
} // end if customized text area not yet exists
// if the zone is known
if(elm != null){
// if the new message is identical to the formal one
if(s == message_yyd){
// we will add something different
compteur_yyd = compteur_yyd + 1;
difference = " " + "-".repeat(compteur_yyd);
} else { // it's really a new message
compteur_yyd = 0; // réinitialisation
} // end if
elm.innerText = "";
elm.innerText = s + difference;
} // end if elm not null
// we record the message in memory
message_yyd = s
} // end function

function reloadFlash(elm) {
	// We need to remove the node from the document and add it again to reload Flash.
	// In some cases, it's not sufficient to simply replace with the same node,
	// as this seems to get optimised and does nothing.
	// Therefore, use a clone of the node.
	elm.parentNode.replaceChild(elm.cloneNode(), elm);
} // end function

function killWindowlessFlash(target) {
	// First, deal with embed elements.
	var elms = target.getElementsByTagName("embed");
	for (var i = 0; i < elms.length; ++i) {
		var elm = elms[i];
		if (elm.getAttribute("type") != "application/x-shockwave-flash")
			continue;
		if (elm.getAttribute("wmode") == "window")
			continue;
		elm.setAttribute("wmode", "window");
		// Parameters are only read when Flash is loaded.
		reloadFlash(elm);
	}

	// Now, deal with object elements.
	var elms = target.getElementsByTagName("object");
	for (var i = 0; i < elms.length; ++i) {
		var elm = elms[i];
		if (elm.getAttribute("type") != "application/x-shockwave-flash")
			continue;
		var params = elm.getElementsByTagName("param");
		for (var j = 0; j < params.length; ++j) {
			var param = params[j];
			if (param.getAttribute("name") != "wmode")
				continue;
			if (param.getAttribute("value") == "window")
				continue;
			param.setAttribute("value", "window");
			// Parameters are only read when Flash is loaded.
			reloadFlash(elm);
			break;
		}
	}
} // end function

	function sleep(milliseconds){
// sleep in javascript
var start = new Date().getTime();
for (var i = 0; i < 1e7; i  ) {
if ((new Date().getTime() - start) > milliseconds){
break;
} // end if
} // end for
} // end function

// we create the event on page load
// onPageLoad();
window.addEventListener("load", onPageLoad);

// some features for flash video
var observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		killWindowlessFlash(mutation.target);
	});
});
observer.observe(document, {childList: true, subtree: true});

// test
// alert("The code is OK");
