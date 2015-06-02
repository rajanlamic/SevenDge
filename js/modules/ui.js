var UI = (function () {
  
  var version="2.01";
  console.log("UI module "+version+" running");

  var doaudio=true;
  
   var sfx_click=new Howl({
  src: ['audio/sfx_click.mp3','audio/sfx_click.ogg']
 });
  
  // Defines the default size of the game, this is used to determine scale to fit current device resolution
  
  var cardPos=new Array();
  var dealPos={css:{marginTop:""}};
  
  // Prevent IOS overscrolling
  document.addEventListener("touchmove", preventBehavior, false);

   var preventBehavior=function(e) {
    e.preventDefault(); 
   };
   
   var doneScroll=false;
   
   // Scroll to get into full-screen
   onScrollHandler = function() {
  var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  if (scrollTop > 60 && doneScroll==false) {
     
	 doneScroll=true;
	 setScale();

	 
  }
  
  console.log(scrollTop);
  
};
document.addEventListener ("scroll", onScrollHandler);

var pauseScale=function() {
 setScale();
}


  // Scale
  var setScale=function() {
    var landscapemode=false;
	
	zoom("cards",1);
	
	// Allows us to check if game is in landscape or portrait
	  var myid = document.getElementById('holder');
	  var gw=myid.offsetWidth;
	  var gh=myid.offsetHeight;
	  var gr=gw/gh;
	  
	
	 var id2=document.getElementById('holder');
	 var id1=document.getElementById('startScreen');
	 var t=0;
	 var h=window.screen.height-20;
	 if (Math.abs(window.orientation) === 90) {
	  id2.style.height='100%';
	  id2.style.width='100%';
	 } else {
	  //TweenLite.to(id1, t, { height:0 });
	  TweenLite.to(id2, t, { height:h});
	 }
	 
	  
	  
	
	if (gw>gh) landscapemode=true;
	
	if (landscapemode==true) {
	 game.landscapeMode();
	} else {
	 game.portraitMode();
	}
	
	// Some items cannot be easily resized via CSS alone, they are scaled here
	// Scale the cards (they use a CSS sprite) and changing the zoom is the easiest method
	 cardScale1=document.getElementById('card0').offsetWidth/87;
	 cardScale2=document.getElementById('card0').offsetHeight/121;
	 
	 
	 cardScale=cardScale1;
	 if (cardScale2<cardScale1) cardScale=cardScale2;
	 
	 if (cardScale>1) cardScale=1;
	 

	 zoom("cards",cardScale);
	 
	 
	 
	};
	
	// Zoom
	var zoom=function(el,sc) {
     el2=document.getElementById(el);
     el2.style.zoom = sc;
     el2.style.MozTransform = 'scale('+sc+')';
     //el2.style.WebkitTransform = 'scale('+sc+')';
    };
	
	// Add DIV, set background image
	var addDiv=function addDiv(pid,id,cls,img,st,cnt) {
    
	var div=document.createElement('div');

	div.className = cls;
    div.id=id;
	if (img!="") {
	 div.style.cssText="background-image: url('"+img+"');"+st;
	} else {
	 div.style.cssText=st;
	}
	
	if (cnt!="") div.innerHTML = cnt;
	
    document.getElementById(pid).appendChild(div);
    
    };
	
	// Set CSS Position using Left/Top
	var setPos=function(e,l,t,r, xoffs, yoffs) {
	 // Add an offset, to center cards on screen
	 //l-=50;
	 //t-=80;
	 l-=xoffs;
	 t-=yoffs;
	 
	 e.style.marginLeft = l+"px";
	 //e.style.marginTop = t+"px";
	 e.style.rotate = r;
	 
	 
	 //var s={css:{left:"50%", marginLeft: l+"px", marginTop: t+"px", rotation:0}};
	 var s={css:{left:"50%", top:"", marginLeft: l+"px", rotation:0, opacity: 1}};
	 return s;
	};

	
	// Public methods here (remember to add them to the return)
	
  var init = function () {
      CSSPlugin.defaultTransformPerspective = 1000;
      window.addEventListener("resize", pauseScale);
	  window.addEventListener("orientationchange", pauseScale);
      
	  // Scale game and UI
	  setScale();
	  
	  // We can do a check here and make different layouts for landscape/portrait
	  
	  // Place chips
	  var diff=120;
	  var xp=-(70+(diff*2));
	  for (i=1;i<=5;i++) {
	   var c=document.getElementById('chip'+i);


	   // Add click event
	   document.getElementById('chip'+i).onclick = game.chipClick;
	   xp+=diff;
	  }
	  
	  // Place Buttons
	   var diff=150;
	   var yp=-(65+diff);
	  for (i=1;i<=7;i++) {
	   var c=document.getElementById('button'+i);
	   c.className = 'buttons';
	   c.style.cssText="margin-top: "+yp+"px; margin-right: 0px;";

	   // Add click event
	   document.getElementById('button'+i).onclick = game.buttonClick;
	    yp+=diff;
	  }

	 
	 // UI buttons
	 for (i=3;i<=4;i++) {
	   var e=document.getElementById('uibutton'+i);
	   e.onclick = uiClick;
	 }
	 
	 var e=document.getElementById("paySection");
	 e.onclick = game.paytableClick;
	 
	 var e=document.getElementById("helpSection");
	 e.onclick = game.helpClick;
	 
	 var e=document.getElementById("start1");
	 //e.onclick = game.startGame;

	 var e=document.getElementById("forwardButton");
	 e.onclick = game.forwardClick;	 
	 
	 var e=document.getElementById("backButton");
	 e.onclick = game.backClick;	 
		
  };
  
  
    var uiClick = function () {
    var id=this.id;
	var uib = id.substr(id.length - 1);
    console.log(uib);
	
	sfx_click.play();
	
	// Sound toggle
	if (uib==1) {
	 if (doaudio==true) {
	  document.getElementById("uibutton1").style.backgroundImage = "url('images/button_soundoff.png')";
	  doaudio=false;
	  Howler.mute(true);
	 } else {
	  document.getElementById("uibutton1").style.backgroundImage = "url('images/button_soundon.png')";
	  doaudio=true;
	  Howler.mute(false);
	 }
	}
	// Exit
	if (uib==2) {
	}
	// Paytable
	if (uib==4) {
	 var e=document.getElementById("payTable");
     e.style.display="inline";
	}
	// Help
	if (uib==3) {
	 var e=document.getElementById("helpScreen");
     e.style.display="inline";
	}
  };
  
  


  var getScale = function () {
    return gameScale;
  };
  
  var getCardPos = function () {
    return cardPos;
  };
  
  var setCardPos=function(p) {
   cardPos=p;
  };
  
  var getDealPos = function () {
    return dealPos;
  };
  
  var playSound=function(e) {
   if (doaudio==true) document.getElementById(e).play();
  };
  
  
  
  return {
    init: init,
    getScale: getScale,
	getCardPos : getCardPos,
	setCardPos: setCardPos,
	getDealPos : getDealPos,
	addDiv : addDiv,
	setPos: setPos,
	playSound: playSound,
	setScale: setScale
  };

})();