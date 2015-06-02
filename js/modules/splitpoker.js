// v1.03:
// - Remove text display of bet amount on bet circles
// - When player selects cards, they now automatically split into 2 hands
// - Animations for player's hand post-flop have been increased from 0.5s to 0.25s
// - Changed size and layout for win/lose 'notices' at the end of the end

//var scrollToTop = function() {
//        window.scrollTo(0, 0);
//}
//
//var makeScrollToTop = function() {
//    setInterval(scrollToTop, 500);
//}
//  
// var launchFullscreen = function(element) {
//    if(element.requestFullscreen)element.requestFullscreen();
//    else if(element.mozRequestFullScreen)element.mozRequestFullScreen();
//    else if(element.webkitRequestFullscreen)element.webkitRequestFullscreen();
//    else if(element.msRequestFullscreen)element.msRequestFullscreen();
//  }
//  
  
  
var mydeck;
setTimeout(function(){
        // Hide the address bar!
        window.scrollTo(0, 1);
    }, 0);


	
// Init function, called when Body has loaded
function init() {
 mydeck=deck.init();
 UI.init();
 animate.resetCards(12,UI.getDealPos());
 game.updateScore();
 game.hideButtons();
 
 // Game Interface 
 var e=document.getElementById("betarea2");
 e.onclick = game.betClick;
	 
 var e=document.getElementById("betarea1");
 //e.onclick = game.betClick;
	 
 var e=document.getElementById("betarea3");
 e.onclick = game.betClick;
 
  // Setup cards, send number of cards needed for game
 game.setupCards(12);
 
 //game.posCards(100,140,50,80);
 game.posCards(100,180,50,120);
 
 
}

// Game module
var game = (function () {

  var version="1.03";
  console.log("Split-Poker Game module "+version+" running");
  
  // CSS for button layouts
  var buttonlayout1=["left: ''; margin-left: ''; right: 0%; margin-right: 25px;"];
  var buttonlayout2=["left: ''; margin-left: ''; right: 0%; margin-right: 225px;","left: ''; margin-left: ''; right: 0%; margin-right: 25px;"];

  var pbuttonlayout1=["left: ''; margin-left: ''; right: 50%; margin-right: -87px;"];
  var pbuttonlayout2=["margin-left: '-278px';","margin-left: '122px';"];
  
  
  // Setup card positions and animation locations
  var cardPos=UI.getCardPos();
  var dealPos=UI.getDealPos();
  
  // Button details
  var buttons_on=false;
  var activeButtons=[];
  
  // Combinations etc.
  var map_dealer=new Array(0,4,5,6,7,8,9,10,11);
  var map_player=new Array(0,0,1,7,8,9,10,11);
  var map_player2=new Array(0,2,3,7,8,9,10,11);
   
  // Game variables
  var currencySymbol="$";
  var player_cash=5000;
  var bet=0;
  var bet_ante=0;
  var bet_side=0;
  var selectedChip=0;
  var buttonCount=7;
  var chipValues=new Array(0,1,2,5,25,100);
  var gameStage=0;
  var dealInProgress=false;
  var chosenCards=0;
  var playHands=0;
  
  var lastAnte=0;
  var lastSide=0;
  
  var dispScores = {cash:0, wager:0, winamount:0};
  var tweenCash=null;
  var tweenWager=null;
  var showWin=false;
  
  var bonuspay=new Array(0,0,0,0,0,2,2,3,10,40,100);
  
  var sidePay=new Array(0,2,5,40,1000);
  
  var handRankings=["HIGH CARD","1 PAIR","2 PAIR","3 OF A KIND","STRAIGHT","FLUSH","FULL HOUSE","4 OF A KIND","STRAIGHT FLUSH","ROYAL FLUSH"];
  
  // Define/load audio
 var sfx_chip = new Howl({
  src: ['audio/sfx_chip.mp3','audio/sfx_chip.ogg']
 });

 var sfx_deal1=new Howl({
  src: ['audio/deal1.mp3','audio/deal1.ogg']
 });
 
 var sfx_deal3=new Howl({
  src: ['audio/deal3.mp3','audio/deal3.ogg']
 });

 var sfx_deal4=new Howl({
  src: ['audio/deal4.mp3','audio/deal4.ogg']
 });

  var sfx_deal7=new Howl({
  src: ['audio/deal7.mp3','audio/deal7.ogg']
 });
 
 var sfx_beep=new Howl({
  src: ['audio/sfx_beep.mp3','audio/sfx_beep.ogg']
 });
 
 var sfx_click=new Howl({
  src: ['audio/sfx_click.mp3','audio/sfx_click.ogg']
 });
 
 var sfx_swish=new Howl({
  src: ['audio/fastswish.mp3','audio/fastswish.ogg']
 });
 
 var sfx_chipswin=new Howl({
  src: ['audio/sfx_chipswin.mp3','audio/sfx_chipswin.ogg']
 });
 
 var sfx_lose=new Howl({
  src: ['audio/lose.mp3','audio/lose.ogg']
 });
 
 var sfx_pop3=new Howl({
  src: ['audio/sfx_pop3.mp3','audio/sfx_pop3.ogg']
 });

  
  var portraitMode=function() {
   // Run this when we switch to portrait
    clearNotices();
	showScores();
  };
  
  var landscapeMode=function() {
   // Run this when we switch to landscape
   clearNotices();
   showScores();
  };
  
  var posCards=function(x,y,xoffs,yoffs) {
  
  var cp=[];
 // Position cards
 //var x=100; // x gap between cards
 //var y=140; // y gap between cards
 //var xoffs=50;
 //var yoffs=80;
 cp[1]=UI.setPos(document.getElementById("card1"),(-x*2)+(x/2),y,0,xoffs,yoffs);
 cp[2]=UI.setPos(document.getElementById("card2"),-x+(x/2),y,0,xoffs,yoffs);
 cp[3]=UI.setPos(document.getElementById("card3"),x-(x/2),y,0,xoffs,yoffs);
 cp[4]=UI.setPos(document.getElementById("card4"),(x*2)-(x/2),y,0,xoffs,yoffs);
 cp[5]=UI.setPos(document.getElementById("card5"),-x,-y,0,xoffs,yoffs);
 cp[6]=UI.setPos(document.getElementById("card6"),0,-y,0,xoffs,yoffs);
 cp[7]=UI.setPos(document.getElementById("card7"),x,-y,0,xoffs,yoffs);
 cp[8]=UI.setPos(document.getElementById("card8"),-x*2,0,0,xoffs,yoffs);
 cp[9]=UI.setPos(document.getElementById("card9"),-x,0,0,xoffs,yoffs);
 cp[10]=UI.setPos(document.getElementById("card10"),0,0,0,xoffs,yoffs);
 cp[11]=UI.setPos(document.getElementById("card11"),x,0,0,xoffs,yoffs);
 cp[12]=UI.setPos(document.getElementById("card12"),x*2,0,0,xoffs,yoffs);
 
 UI.setCardPos(cp); 
 cardPos=cp;
 console.log("Set card pos");
 
  };
  
  var launchFullscreen = function (element) {
    if(element.requestFullscreen)element.requestFullscreen();
    else if(element.mozRequestFullScreen)element.mozRequestFullScreen();
    else if(element.webkitRequestFullscreen)element.webkitRequestFullscreen();
    else if(element.msRequestFullscreen)element.msRequestFullscreen();
  };

  
  var toggle_visibility=function(e) {
       if(e.style.visibility == 'hidden')
          e.style.visibility = '';
       else
          e.style.visibility = 'hidden';
    };
	
	var dealHole=function() {
	 // Deal hole cards to player and dealer
	 dealInProgress=true;
	 sfx_deal7.play();
	 
	 cardPos=UI.getCardPos();
	 
	 var diff=0.25;
     for (f=1;f<=7;f++) {
	  var c=document.getElementById('card'+f);
	  var df=false;
	  var lc=false;
	  // DF - flip card, true or false
	  if (f<=4) df=true;
	  // LC - last card, true or false
	  if (f==7) lc=true;
      animate.deal(dealPos,cardPos[f],c,(f-1)*diff, df, lc);
	  //animateCard(c,f);
	 }
	};
	
	var animateCard=function(c,f) {
	 var d=0.2;
	 var t=0.4;
	 
	 var source=getPosition(c);
	 var dest=getPosition(document.getElementById('cardshoe'));
	 console.log(source.x+":"+source.y+" to "+dest.x+":"+dest.y);
	 
	 TweenLite.set(c, {x:dest.x-source.x, y:dest.y-source.y, rotation: -55});
	 TweenLite.set(c.childNodes[0], {rotationY:0});
	 TweenLite.set(c.childNodes[1], {rotationY:-180});
	 c.style.visibility='visible';
	 c.style.opacity=1;
	 TweenLite.to(c, t, { x:0, y:0,  delay:d*f, rotation: 0, ease: Power1.easeOut});
	}
	
	
	var dealFlop=function() {
	 // Deal flop and flip them plus dealer cards
	 dealInProgress=true;
	 var diff=0.25;
	 sfx_deal3.play();
     for (f=8;f<=10;f++) {
	  var c=document.getElementById('card'+f);
	  var df=true;
	  var lc=false;
	  // LC - last card, true or false
	  if (f==10) lc=true;
      animate.deal(dealPos,cardPos[f],c,(f-8)*diff, df, lc);
	 }
	};
	
	var dealTurn=function() {
	 var f=11;
	 var diff=0.25;
	 var df=true;
	 var lc=true;
	 
	 setTimeout(function() { sfx_deal1.play(); }, (f-8)*diff*1000);
	 
	 var c=document.getElementById('card'+f);
	 animate.deal(dealPos,cardPos[f],c,(f-8)*diff, df, lc);
	};
	
	var dealRiver=function() {
	 var f=12;
	 var diff=0.25;
	 var df=true;
	 var lc=true;
	 
	 setTimeout(function() { sfx_deal1.play(); }, (f-8)*diff*1000);
	 
	 var c=document.getElementById('card'+f);
	 animate.deal(dealPos,cardPos[f],c,(f-8)*diff, df, lc);
	};
	
	var flipDealer=function() {
      sfx_pop3.play();
	  animate.flip([5,6,7],0.25);
	};
	
	var resolveSideBet=function() {
	 var jackCount=0;
	 for (i=0;i<4;i++) {
	  if (mydeck[i].value==11) jackCount+=1;
	 }
	 
	 var payout=sidePay[jackCount]*bet_side;
	 
	 var rt;
	 
	 // Display notice
	 var e=document.getElementById("noticeBonusSide");
	 
	 if (jackCount>0) {
	  sfx_chipswin.play();	  
	  //rt="<img src='images/jackattacklogo.png' style='vertical-align:sub'>  Bet "+currencySymbol+bet_side+", dealt "+jackCount+" WIN "+currencySymbol+payout;
	  e.style.display="inline";
	  //e.innerHTML=rt;
	  // Return ante too
	  payout+=bet_side;
	 }
	 
	 
	 // Update cash and wager
	 player_cash+=payout;
	 bet_side=0;
	 updateScore();
	 showSideChips();
	 
  

	};
	
	var dealDone=function() {
	 var newStage=0;
	 dealInProgress=false;
	 if (gameStage==0) {
	  console.log("Ready");
      if (bet_side>0) resolveSideBet();	  
	  newStage=1;
	  showButtons([2]);
	  // Add transparency to player cards
	  for (i=1;i<=4;i++) {
	   var c=document.getElementById('card'+i);
	   c.style.opacity=0.8;
	  }
	 }
	 if (gameStage==1) {
	  newStage=2;
	  flipDealer();
	 }
	 if (gameStage==2) {
	  newStage=3;
	  dealTurn();
	 }
	 if (gameStage==3) {
	  newStage=4;
	  dealRiver();
	 }
	 if (gameStage==4) {
	  checkWinner();
	 }
	 
	 gameStage=newStage;
	 
	};
	
	var newRound=function() {
	  bet=0;
	  bet_ante=0;
	  bet_side=0;
	  selectedChip=0;
	  gameStage=0;
	  dealInProgress=false;
	  chosenCards=0;
	  playHands=0;
	  showAnteChips();
	  showSideChips();
	  showBetChips();
	  // Clear old side bets
	  var id="placedChips1";
	  var e=document.getElementById(id);
      e.innerHTML="";
	  var id="placedChips2";
	  var e=document.getElementById(id);
      e.innerHTML="";
	  var id="placedChips3";
	  var e=document.getElementById(id);
      e.innerHTML="";
	  var id="placedChips4";
	  var e=document.getElementById(id);
      e.innerHTML="";
	};
	
	var startGame=function() {
	var id=this.id;
	var fsid = id.substr(id.length - 1);
	 //if (fsid==1) launchFullscreen(document.documentElement);
	 var e=document.getElementById("startscreen");
	 e.style.display="none";
	};
	
  var buttonClick = function () {
	
	// public
	var id=this.id;
	var bn = id.substr(id.length - 1);
	
	sfx_click.play();
	
	//console.log("Game mod.Button clicked, id "+this.id+" gamestage="+gameStage);
	
	//launchFullscreen(document.documentElement);
	newStage=gameStage;
	
	// Game Stage 0
	if (bn==5 && gameStage==0 && bet_ante>0) {
	 // Deal
	 lastSide=bet_side;
	 lastAnte=bet_ante;
	 hideButtons();
	 hideChips();
	 chipGlowOff();
	 dealHole();
	 bn=0;
	}
	if (bn==7 && gameStage==0) {
	 // Clear Bet
	 player_cash+=bet_ante;
	 player_cash+=bet_side;
	 bet_ante=bet_side=0;
	 updateScore();
	 showAnteChips();
	 showSideChips();
	 hideButtons();
	 bn=0;
	}
	if (bn==3 && gameStage==0 && (lastAnte+lastSide)>0) {
	 // Rebet
	 resetLayout();
	 hideButtons();
	 newCards();
	 // Check if player has enough money to rebet
	 var allowBet=true;
	 if (lastSide+(lastAnte*3)>player_cash) allowBet=false;
	 if (allowBet==true) {
	  bet_side=lastSide;
	  bet_ante=lastAnte;
	  player_cash-=bet_side;
	  player_cash-=bet_ante;
	  showSideChips();
	  showAnteChips();
	  updateScore();
	  // Deal
	  chipGlowOff();
	  dealHole();
	 }
	 bn=0;
	}
	if (bn==4 && gameStage==0) {
	 // New game
	 resetLayout();
	 hideButtons();
	 showChips();
	 newCards();
	 bn=0;
	}
	
	// Game Stage 1
	if (bn==2 && gameStage==1) {
	 // Fold
	 // Return Side bet
	 player_cash+=bet_side;
	 
	 bet_ante=bet_side=0;
	 updateScore();
	 hideButtons();
	 if (lastSide+(lastAnte*3)<=player_cash) {
	  showButtons([3,4]);
	 } else {
	  showButtons([4]);
	 }
	 newRound();
	 resetLayout();
	 bn=0;
	}
	
	if (bn==6 && gameStage==1) {
	 // Bet
	 bet=(bet_ante*2);
	 player_cash-=(bet_ante*2);
	 updateScore();
	 showBetChips();
	 
	 for (i=1;i<=4;i++) {
	  var c=document.getElementById('card'+i);
	  c.style.opacity=1;
	 }
	 
	 playHands=1;
	 hideButtons();
	 setHand1(0.25);
	 dealFlop();
	 bn=0;
	}
	
	if (bn==1 && gameStage==1 && player_cash>=(bet_ante*4)) {
	 // Split
	 playHands=2;
	 bet=(bet_ante*4);
	 player_cash-=(bet_ante*4);
	 updateScore();
	 showBetChips();
	 
	 for (i=1;i<=4;i++) {
	  var c=document.getElementById('card'+i);
	  c.style.opacity=1;
	 }
	   
	 hideButtons();
	 setHand2(0.25);
	 dealFlop();
	 bn=0;
	}
	
	
  };
  
  var clearNotices=function() {
   setStyleDisplay("noticeBonus","none");
   setStyleDisplay("noticeBonusSide","none");
   setStyleDisplay("noticeResult","none");
   setStyleDisplay("noticePlayer","none");
   setStyleDisplay("noticeDealer","none");
   setStyleDisplay("noticePlayerH1","none");
   setStyleDisplay("noticePlayerH2","none");
   setStyleDisplay("noticeResult1","none");
   setStyleDisplay("noticeResult2","none");
  };
  
  var resetLayout=function() {
   
   clearNotices();
   var e=document.getElementById("txt_wager"); 
   e.style.backgroundImage="url(images/box-total.png)";
   dispScores.winamount=0;
   showWin=false;
   
   updateScore();
   
   animate.resetCards(12,UI.getDealPos());
   
  };
  
  var setStyleDisplay=function(e,s) {
   //console.log("Setting "+e+" to "+s);
   var e=document.getElementById(e);
   e.style.display=s;
  };
  
  var setHand1=function(sp) {
   var xpos=[-100,0];
   var ptr=0;
   for (i=1;i<=4;i++) {
	   var c=document.getElementById('card'+i);
	   var d=c.getElementsByClassName("cardGlow")[0];
	   var v=d.style.visibility;
	   if (v=='hidden') {
	    animate.muckItem(c,sp);
	   } else {
	    d.style.visibility='hidden';
	    animate.setX(c,xpos[ptr],sp);
		ptr+=1;
		map_player[ptr]=i-1;
	   }
    }
	
  };
  
  var setHand2=function(sp) {
   var xpos=[-250,-150,50,150];
   var ptr=0;
   var ptr2=0;
   
   for (i=1;i<=4;i++) {
	   var c=document.getElementById('card'+i);
	   var d=c.getElementsByClassName("cardGlow")[0];
	   var v=d.style.visibility;
	   if (v=='hidden') {
	    animate.setX(c,xpos[ptr2+2],sp);
		ptr2+=1;
		map_player2[ptr2]=i-1;
	   } else {
	    //d.style.visibility='hidden';
	    animate.setX(c,xpos[ptr],sp);
		ptr+=1;
		map_player[ptr]=i-1;
	   }
    }
	
  };
  
  var newCards=function() {
   // Check that cards are shuffled correctly
   var o="";
   for (deal=1;deal<=1000;deal++) {
   mydeck=deck.doshuffle();
   for (i=1;i<=12;i++) {
	   o+=mydeck[i-1].idx+",";
   }
   }
   console.log("100 deals:"+o);
   o="";
   
   
   setupCards(12);
  };
  
  var cardClick = function () {
    // public
	var id=this.id;
	var cn = id.substr(4,2);
	
	if (gameStage==1 && cn<=4) {
	 var d = document.getElementById(id);
	 var e = document.getElementById(id).getElementsByClassName("cardGlow")[0];
	 sfx_click.play();
	 if (e.style.visibility=='hidden') {
      if (chosenCards<2) {
	   chosenCards+=1;
	   d.style.opacity=1;
	   if (chosenCards==2) sfx_swish.play();
	   toggle_visibility(e);
	  }
	 } else {
	  chosenCards-=1;
	  d.style.opacity=0.8;
	  toggle_visibility(e);
	 }
	 
	 if (chosenCards==2) {
	  showButtons([6,1]);
	  clearNotices();
	  setHand2(0.25);
	  
	 } else {
	  showButtons([2]);
	 }
	 
	 
	 
	}

  };
  

  
  var paytableClick=function() {
   var e=document.getElementById("payTable");
   e.style.display="none";
  };
  
  var helpClick=function() {
    var e=document.getElementById("helpScreen");
    e.style.display="none";
  };
  
  var forwardClick=function() {
    var e=document.getElementById("helpScreen");
    e.style.display="none";
	var e=document.getElementById("payTable");
    e.style.display="inline";
  };
  
  var backClick=function() {
    var e=document.getElementById("helpScreen");
    e.style.display="inline";
	var e=document.getElementById("payTable");
    e.style.display="none";
  };
  
    var setupCards=function(nc) {
     var mydeck=getDeck();
	  
	  var cw=89;
	  var ch=123;
	  var padding=2;
	  // Items per row
	  var ipr=11;
	  
	  var deck=new Array();
	  for (i=1;i<=nc;i++) {
	   deck[i-1]=mydeck[i-1].idx;
	   console.log(i+":"+mydeck[i-1]);
	  }
	 

	 for (i=1;i<=nc;i++) {
	  
	  var cn=deck[i-1];
	  var col=cn%ipr;
	  var row=(cn-col)/ipr;
	  
	  var xp=col*cw+(col*padding);
	  var yp=row*ch+(row*padding);
	  
	  var id="card"+i;
	  var e=document.getElementById(id);
	  
	  var d = e.getElementsByClassName("cardGlow")[0];
	  d.style.visibility='hidden';
	  
	  e.childNodes[1].style.backgroundPosition = (-xp)+'px ' + (-yp) + 'px';
	  if (i<=4) e.className = 'playercards';
	  if (i>4 && i<=7) e.className = 'dealercards';
	  if (i>7) e.className = 'cards';
	  //e.className = 'card cardpos';
	  e.onclick = game.cardClick;
	 }
  
  };
  
  var betClick = function () {
    // public
    
	var id=this.id;
	var ba = id.substr(id.length - 1);
	
	var chipVal=chipValues[selectedChip];
	var allowBet=true;
	
	if (dealInProgress==true) allowBet=false;
	if (gameStage>0) allowBet=false;
	
	// Check that we have enough money to bet
	if (chipVal<=0) allowBet=false;
	
	var temp_ante=bet_ante;
	var temp_side=bet_side;
	if (ba==3) temp_ante+=chipVal;
	if (ba==2) temp_side+=chipVal;
	if (temp_side+(temp_ante*3)>player_cash) allowBet=false;
	
	
	if (ba==2 && gameStage==0 && allowBet==true) {
	 // Side bet
	 bet_side+=chipVal;
	 player_cash-=chipVal;	
	 animateChip(selectedChip,2);
	 sfx_chip.play();
	}
	if (ba==3 && gameStage==0 && allowBet==true) {
	 // Ante bet
	 bet_ante+=chipVal;
	 player_cash-=chipVal;
	 animateChip(selectedChip,3);
	 sfx_chip.play();
	}
	
	updateScore();
	
	// Show buttons?
	if (gameStage==0 && (bet_ante+bet_side>0) && dealInProgress!=true) showButtons([5,7]);
	
  };

  var animateChip=function(id,ba) {
  
     var chipid="chip"+id;
	 var source=getPosition(document.getElementById(chipid).childNodes[1]);
	 var dest=getPosition(document.getElementById('placedChips'+ba));
	 var t=0.25;
	 TweenLite.to(document.getElementById(chipid).childNodes[1], t, { x:dest.x-source.x, y:dest.y-source.y,  ease: Power1.easeOut, onComplete:endChipAnimation});
  
  }
  
  var endChipAnimation=function() {
   // Chip animation ended...
   var chipid="chip"+selectedChip;
   var e=document.getElementById(chipid).childNodes[1];
   TweenLite.set(e, {x:0, y:0});
   showAnteChips();
   showSideChips();
  }
  
  
  var showMinChips=function(id,bt,stacks) {
   console.log("id="+id+" bet="+bt+" ,stacks="+stacks);
   var e=document.getElementById(id);
   e.innerHTML="";
   var ih="";
   var ih2="";
   var cn=0;
   var xp=0;
   var xp2=-80;
   var yp=0;
   var cs="";
   var diff=6;
    t=bt/stacks;
    while (t>=chipValues[1]) {
	  cn=0;
	  if (t>=chipValues[5]) {
	   cn=5;
	   tt=chipValues[5];
	  }
	  if (t>=chipValues[4] && t<chipValues[5]) {
	   cn=4;
	   tt=chipValues[4];
	  }
	  if (t>=chipValues[3] && t<chipValues[4]) {
	   cn=3;
	   tt=chipValues[3];
	  }
	  if (t>=chipValues[2] && t<chipValues[3]) {
	   cn=2;
	   tt=chipValues[2];
	  }
	  if (t>=chipValues[1] && t<chipValues[2]) {
	   cn=1;
	   tt=chipValues[1];
	  }
	 
	 console.log("Total bet="+bt+" placed chip val:"+tt+" left="+t);
	 // Check size of chips
	 var chipScale=(document.getElementById('item').offsetWidth/126)/2;
	 
	 cs="left: -"+xp+"px; top: "+yp+"px; zoom: "+chipScale;
	 ih+='<img class="chipBet" src="images/chip'+cn+'.png" style="'+cs+'">';
	 // Create 2nd stack
	 if (stacks==2) {
	  var yp2=-yp;
	  cs="left: -"+xp+"px; bottom: "+yp2+"px; zoom: "+chipScale;
	  ih2+='<img class="chipBet" src="images/chip'+cn+'.png" style="'+cs+'">';
	  xp2+=(diff/2);
	  
	 }
	 t-=tt;
	 yp-=diff;
	 xp+=(diff/2);
	 }
	 
	 e.innerHTML=ih;
	 if (stacks==2) {
	  var f=document.getElementById('placedChips4');
	  f.innerHTML=ih2;
	 }
	 
  };
  
  var showBetChips=function() {
   console.log("playhands="+playHands);
   if (playHands==2) {
    showMinChips('placedChips1',bet,2);
   } else {
    showMinChips('placedChips1',bet,1);
   }
  };
  
  var showSideChips=function() {
   showMinChips('placedChips2',bet_side,1);
  };

  var showAnteChips=function() {
   showMinChips('placedChips3',bet_ante,1);
  };
  

  
  var chipGlowOff=function() {
   // Turn off chip glow
	selectedChip=0;
	for (i=1;i<=5;i++) {
	   var c=document.getElementById('chip'+i);
	   var d = c.getElementsByClassName("chipGlow")[0];
	   c.style.opacity=0.66;
	}
  };
  
  var chipClick = function () {
    chipGlowOff();
	
	var id=this.id;
	
											  
	if (gameStage==0) {
	 selectedChip = id.substr(id.length - 1);
	 sfx_click.play();
	 // Turn on item that was clicked
	 var e = document.getElementById(id).style.opacity=1;
	}
	
  };


function getPosition(element) {
    var xPosition = 0;
    var yPosition = 0;
  
    while(element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }
    return { x: xPosition, y: yPosition };
}
    
  
  var hideChips=function() {
	for (i=1;i<=5;i++) {
	   var d=document.getElementById('chip'+i);
	   d.style.visibility='hidden';
	}
  };
  
  var showChips=function() {
	chipGlowOff();
	for (i=1;i<=5;i++) {
	   var d=document.getElementById('chip'+i);
	   d.style.visibility='visible';
	   
	}
  };
  
  var hideButtonsInitial=function() {
   for (i=1;i<=buttonCount;i++) {
	    var d=document.getElementById('button'+i);
	    d.style.visibility='hidden';
		d.style.opacity=1;
	 }
  };
  
  var hideButtonsActive=function() {
    bl=activeButtons;
	for (i=1;i<=bl.length;i++) {
    var b=bl[i-1];
	var d=document.getElementById('button'+b);
	var dist=100;
	var animtime=0.1;
	  TweenLite.to(d, animtime, { y:dist, autoAlpha:0 });
	}
  };

  
  var hideButtons=function() {
	
	if (buttons_on==false) {
	 hideButtonsInitial();
	} else {
	 hideButtonsActive();
	}

	buttons_on=false;
	
  };
  
  var swapButtons=function(bl) {
   // activeButtons
   // bl
   
   console.log("swap "+bl+" with "+activeButtons);
   
   
   
  };
  
  var showButtons=function(bl) {

   if (buttons_on==true) {
    // Trying to show buttons when buttons already visible. So we need to hide those, then swap in the new ones
	if (bl.toString()!=activeButtons.toString()) {
	 hideButtons();
	 setTimeout(function() { showButtons(bl); }, 375);
	 //swapButtons(bl);
	}
   } else {

   var csst;
   if (bl.length==1) csst=buttonlayout1;
   if (bl.length==2) csst=buttonlayout2;
   
   var pmode=false;
   
   var sw=window.innerWidth;
   var sh=window.innerHeight;
   var sw=768;
   var sh=1024;
   if (sw<sh) {
    // Portrait mode
	pmode=true;
	if (bl.length==1) csst=pbuttonlayout1;
    if (bl.length==2) csst=pbuttonlayout2;
   }
	
   
   var diff=150;
   var mody=((bl.length-1)/2)*diff;
   var yp=-(65+mody);
   for (i=1;i<=bl.length;i++) {
    var b=bl[i-1];
	var d=document.getElementById('button'+b);
	d.style.visibility='visible';
	//d.style.cssText="margin-top: "+yp+"px; margin-right: 0px;";
	//d.style.cssText=csst[i-1];
	if (bl.length==1) d.className = 'buttons gamebutton1';
	if (bl.length==2 && i==1) d.className = 'buttons gamebutton1_2';
	if (bl.length==2 && i==2) d.className = 'buttons gamebutton2_2';
	yp+=diff;	
   }
   
   // Animate button appearance
   	if (buttons_on==false) {
	var dist=200;
	var animtime=1.25;
	var cf1=0.8;
	var cf2=0.3;
	if (pmode==true) dist=-dist;
	
	for (i=1;i<=bl.length;i++) {
    var b=bl[i-1];
	var d=document.getElementById('button'+b);
	if (i==1 && bl.length>1) { 
	 TweenLite.set(d, {x:dist*2, y: 0, autoAlpha: 1});
	 TweenLite.to(d, animtime, { ease: Elastic.easeOut.config(cf1, cf2), x: 0, y: 0 });
	}
	if ((i==2 && bl.length==2) || (bl.length==1)) { 
	 if (pmode==false) {
	  TweenLite.set(d, {x:dist, y: 0, autoAlpha: 1});
	 } else {
	  TweenLite.set(d, {x:-dist*2, y: 0, autoAlpha: 1});
	 }
	 TweenLite.to(d, animtime, { ease: Elastic.easeOut.config(cf1, cf2), x: 0, y: 0 });
	}

	}
	
	}
	
	buttons_on=true;
	activeButtons=bl;
	
	// end of ELSE
	}
   
  };
  
  var updateScore=function() {

   // Check to see if values have been updated
   var newCash=player_cash;
   var newWager=bet_ante+bet;
   
   var animTime=0.5;
   if (newCash!=dispScores.cash && tweenCash==null) {
    tweenCash=animate.changeCash(newCash,animTime);
   }
   if (newWager!=dispScores.wager && tweenWager==null) {
    tweenWager=animate.changeWager(newWager,animTime);
   }
   
   showScores();
   
  };
  
  var showScores=function() {

   // Check to see if box has been scaled, if so we need to change font size
   var textSize=(document.getElementById('txt_cash').offsetWidth*0.2);
   
   // Player bank
   var d=document.getElementById('txt_cash');
   var h=currencySymbol+Math.round(dispScores.cash);
   d.innerHTML = '<span id="cash">'+h+'</span>';
   document.getElementById("cash").style.fontSize=textSize+"px";
   document.getElementById("cash").style.lineHeight="normal";
   
   // Total wager
   var d=document.getElementById('txt_wager');
   var h=currencySymbol+Math.round(dispScores.wager);
   d.innerHTML = '<span id="total">'+h+'</span>';
   document.getElementById("total").style.fontSize=textSize+"px";
   document.getElementById("total").style.lineHeight="normal";
   
   
   // Win amount
   if (showWin==true) {
    var d=document.getElementById('txt_wager');
    var h=currencySymbol+Math.round(dispScores.winamount);
    d.innerHTML = '<span id="total">'+h+'</span>';
	document.getElementById("total").style.fontSize=textSize+"px";
	document.getElementById("total").style.lineHeight="normal";
   }
   
  };
  
  var endCashTween=function() {
   tweenCash=null;
   updateScore();
  };
  
  var endWagerTween=function() {
   tweenWager=null;
   updateScore();
  };
  
  var getDeck=function() {
   return mydeck;
  };
  
  var checkWinner=function() {

 // We will generate combinations and then check each one....
 // player cards: 0,1,2,3
 // dealer cards: 4,5,6
 // board: 7,8,9,10,11
 
 var cd=deck.k_combinations([1, 2, 3, 4, 5, 6, 7, 8], 5);
 
 // Dealer evaluation
 var dmax=0;
 var dhn=0;
 var dhv=0;
 var t=0;
 // Start at 10 as the first 9 combinations use all 3 dealer cards (only a max of 2 can be used)
 for (q=10;q<cd.length;q++) {
  var cc=cd[q];
  var th=new Array();
  for (z=0;z<5;z++) {
   t=map_dealer[cc[z]];
   th[z]=mydeck[t];
  }
  hv=deck.handval(th);
  t=hv[1];
  if (t>dmax) {
   dmax=t;
   dhn=q;
   dhv=hv[0];
  }
 }
 
 //console.log("Dealer Best handval is "+dmax+" ("+dhv+")");
 //console.log("Dealer Handnum "+dhn);
 cc=cd[dhn];
 //console.log("cc="+cc);
 for (z=0;z<5;z++) {
  t=map_dealer[cc[z]];
  //console.log(mydeck[t]);
 }
 
 // Display which dealer cards we used
 for (f=1;f<=3;f++) {
   var id="card"+(f+4);
   var e=document.getElementById(id);
   e.style.opacity=0.5;
 }
 
 for (i=0;i<5;i++) {
  t=map_dealer[cc[i]];
  //console.log(t);
  if (t==map_dealer[1] || t==map_dealer[2] || t==map_dealer[3]) {
   var id="card"+(t+1);
   //console.log(id);
   var e=document.getElementById(id);
   e.style.opacity=1;
  }
 }
 
 var u;
 
 // Player evaluation....
 var cp=deck.k_combinations([1, 2, 3, 4, 5, 6, 7], 5);
 var pmax=0;
 var phn=0;
 var phv=0;
 var t=0;
 for (q=0;q<cp.length;q++) {
  var cc=cp[q];
  var th=new Array();
  for (z=0;z<5;z++) {
   t=map_player[cc[z]];
   th[z]=mydeck[t];
  }
   
  hv=deck.handval(th);
  t=hv[1];
  if (t>pmax) {
   pmax=t;
   phn=q;
   phv=hv[0];
  }
 }
 //console.log("Player Best hand1 is "+pmax+" ("+phv+")");
 //console.log("Player Handnum "+phn);
 cc=cp[phn];
 //console.log("cc="+cc);
 for (z=0;z<5;z++) {
  t=map_player[cc[z]];
  //console.log(mydeck[t]);
 }
 
 var u;

 phv2=0;
 
  // Player evaluation, 2nd hand....
 if (playHands==2) {
 var pmax2=0;
 var phn2=0;
 var phv2=0;
 var t=0;
 for (q=0;q<cp.length;q++) {
  var cc=cp[q];
  var th=new Array();
  for (z=0;z<5;z++) {
   t=map_player2[cc[z]];
   th[z]=mydeck[t];
  }
   
  hv=deck.handval(th);
  t=hv[1];
  if (t>pmax2) {
   pmax2=t;
   phn2=q;
   phv2=hv[0];
  }
 }
 
 //console.log("map="+map_player);
 //console.log("map2="+map_player2);
 //console.log("Player Best hand2 is "+pmax2+" ("+phv2+")");
 //console.log("Player Handnum2 "+phn2);

 cc=cp[phn2];
 for (z=0;z<5;z++) {
   //t=map_player2[cc[z]];
   //mc=mc_cards[t];
   //var c=mydeck.cards[mc.pos];
   //console.log(c);
  }
  

}
 
  var rn;
  if (dmax>pmax) {
  rn=1;
  console.log("Dealer Wins Hand 1");
  //if (doaudio==true) playSound("sfxlose", 0);
  //resolveBet(false);
 } 
if (pmax>dmax) {
  rn=0;
  console.log("Player Wins Hand 1");
  //if (doaudio==true) playSound("sfxwin", 0);
  //player_cash+=(bet+bet_ante)*2;
  //resolveBet(true);
}
if (pmax==dmax) {
 rn=2;
 console.log("TIE Hand 1");
 var e=document.getElementById("noticeResult");
  e.innerHTML="TIED HAND";
  e.style.display="inline";
 //if (doaudio==true) playSound("sfxtie", 0);
 //player_cash+=(bet+bet_ante);
}

if (playHands==1) {

// Notices
var e=document.getElementById("noticeResult");
e.className = "notices";
e.style.display="inline";

// This calculate the Actual Width of the notice due to scaling by the device, then provides an appropriate font size
var s1=(document.getElementById('noticeResult').offsetWidth/366);
var s2=(document.getElementById('noticeResult').offsetHeight/88);
var aw=s1*366;
if (s2<s1) aw=s2*366;
var textSize=(aw*0.1);
var textSizeSmall=textSize/2;

e.style.fontSize=textSize+"px";
if (rn==0) e.innerHTML="PLAYER WINS";
if (rn==1) e.innerHTML="DEALER WINS";
if (rn==2) e.innerHTML="TIED HAND";
  
var e=document.getElementById("noticeDealer");
e.innerHTML=handRankings[dhv-1];
e.style.display="inline";
e.style.fontSize=textSize+"px";
console.log("** CHECK **");
console.log(e);
console.log(e.style);
console.log(e.style.dsiplay);
console.log(e.style.fontSize);

var e=document.getElementById("noticePlayer");
e.className = "notices";
e.innerHTML=handRankings[phv-1];
e.style.display="inline";
e.style.fontSize=textSize+"px";
 
 //show_notices(dhv,phv,rn,exportRoot.d2.y,exportRoot.p2.y,exportRoot.b1.y,true,true,true);

}

// Resolve 2nd hand
if (playHands==2) {
   //show_notices(dhv,phv,rn,exportRoot.d2.y,exportRoot.p2.y,exportRoot.b1.y,true,false,false);  
  var rn2;
  if (dmax>pmax2) {
  rn2=1;
  console.log("Dealer Wins Hand 2");
  //if (doaudio==true) playSound("sfxlose", 0);
  //resolveBet2(false);
  //resolveAnte(false);
 } 
if (pmax2>dmax) {
  rn2=0;
  console.log("Player Wins Hand 2");
  //if (doaudio==true) playSound("sfxwin", 0);
  //player_cash+=(bet2+bet_ante)*2;
  //resolveBet2(true);
  //resolveAnte(true);
}
if (pmax2==dmax) {
 rn2=2;
 console.log("TIE Hand 1");
 //if (doaudio==true) playSound("sfxtie", 0);
 //player_cash+=(bet2+bet_ante);
 //resolveAnte(true);
 //player_cash+=bet;
 //player_cash+=bet_ante;
}

// Show notices
var e=document.getElementById("noticeDealer");
e.innerHTML=handRankings[dhv-1];
e.style.display="inline";

// This calculate the Actual Width of the notice due to scaling by the device, then provides an appropriate font size
var s1=(document.getElementById('noticeDealer').offsetWidth/366);
var s2=(document.getElementById('noticeDealer').offsetHeight/88);
var aw=s1*366;
if (s2<s1) aw=s2*366;
var textSize=(aw*0.1);
var textSizeSmall=textSize/2;

e.style.fontSize=textSize+"px";

var e=document.getElementById("noticePlayerH1");
e.className = "notices noticesmall";
e.innerHTML=handRankings[phv-1];
e.style.display="inline";
e.style.fontSize=textSizeSmall+"px";

var e=document.getElementById("noticePlayerH2");
e.className = "notices noticesmall";
e.innerHTML=handRankings[phv2-1];
e.style.display="inline";
e.style.fontSize=textSizeSmall+"px";



var e=document.getElementById("noticeResult1");
e.className = "notices noticesmall";
e.style.display="inline";
e.style.fontSize=textSizeSmall+"px";

var r1="";
var r2="";
if (rn==0) r1="PLAYER WINS";
if (rn==1) r1="DEALER WINS";
if (rn==2) r1="TIED HAND";

if (rn2==0) r2="PLAYER WINS";
if (rn2==1) r2="DEALER WINS";
if (rn2==2) r2="TIED HAND";

e.innerHTML=r1;

var e=document.getElementById("noticeResult2");
e.className = "notices noticesmall";
e.innerHTML=r2;
e.style.display="inline";
e.style.fontSize=textSizeSmall+"px";

   setStyleDisplay("noticeResult","none");
   setStyleDisplay("noticePlayer","none");


}

// Payouts...

// Bonus
bonus1=bonuspay[phv]*bet_ante;
bonus2=bonuspay[phv2]*bet_ante;
bonus=bonus1+bonus2;

if (bonus>0) {
 // Show notice
 var e=document.getElementById("noticeBonus"); 
 e.style.display="inline";
 e.style.fontSize=textSize+"px";
 var rt="Bonus "+currencySymbol+bonus;
 e.innerHTML=rt;
}

var bet1=bet_ante*2;
var bet2=bet_ante*2;

// bet_ante=100
// bet1=200
// pay1=(300*2)=600

var pay1=0;
var pay2=0;

// Hand 1
if (rn==0) {
 // Player wins hand 1
 pay1=(bet1*2)+bet_ante;
 if (bonus1==0) pay1+=bet_ante;
}
if (rn==1) {
 // Dealer wins hand 1
 // No payout
 pay1=0;
}
if (rn==2) {
 // Tied hand
 pay1=(bet1+bet_ante);
}

// Hand 2
if (rn2==0) {
 // Player wins hand 2
 pay2=(bet2*2)+bet_ante;
}
if (rn2==1) {
 // Dealer wins hand 1
 // No payout
 pay2=0;
}
if (rn2==2) {
 // Tied hand
 // No ante returned on Hand 2?
 pay2=bet2;
}

// Show win box
var e=document.getElementById("txt_wager"); 
e.style.backgroundImage="url(images/box_win.png)";
showWin=true;
dispScores.winamount=pay1+pay2+bonus;


// Audio
if (pay1+pay2+bonus>0) {
 sfx_chipswin.play();
} else {
 sfx_lose.play();
}

player_cash+=pay1;
player_cash+=pay2;
player_cash+=bonus;

console.log("Payout hand1="+pay1);
console.log("Payout hand2="+pay2);
console.log("Payout bonus1="+bonus1);
console.log("Payout bonus2="+bonus2);
console.log("--------------");

// Reset for next round
 updateScore();
 hideButtons();
 if (lastSide+(lastAnte*3)<=player_cash) {
  showButtons([3,4]);
 } else {
  showButtons([4]);
 }
 newRound();
  
};



  
  return {
    buttonClick: buttonClick,
	cardClick: cardClick,
	chipClick: chipClick,
	betClick: betClick,
	updateScore: updateScore,
	showScores: showScores,
	hideButtons: hideButtons,
	dealDone: dealDone,
	getDeck: getDeck,
	paytableClick: paytableClick,
	helpClick: helpClick,
	forwardClick: forwardClick,
	backClick: backClick,
	startGame : startGame,
	dispScores: dispScores,
	endCashTween: endCashTween,
	endWagerTween: endWagerTween,
	setupCards: setupCards,
	posCards: posCards,
	portraitMode: portraitMode,
	landscapeMode: landscapeMode
  };

})();