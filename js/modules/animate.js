// v1.02
// - Animate cash and wager display

var animate = (function () {

  var version="1.02";
  console.log("Animate module "+version+" running");
 
  var privateMethod = function () {
    // private
	console.log("Private method");
  };

  var someMethod = function (x) {
    // public
	console.log("Some method "+x);
  };

  var changeCash=function(nv, t) {
   var t=TweenLite.to(game.dispScores, t, {cash:nv, onUpdate:game.showScores, ease:Linear.easeNone, onComplete:game.endCashTween});
   return t;
  };
  
  var changeWager=function(nv, t) {
   var t=TweenLite.to(game.dispScores, t, {wager:nv, onUpdate:game.showScores, ease:Linear.easeNone, onComplete:game.endWagerTween});
   return t;
  };
  
  
  
  var resetCards = function (l,dp) {
	// public
	for (f=1;f<=l;f++) {
	 var c=document.getElementById('card'+f);
	 c.style.opacity=0;
	 c.style.visibility='hidden';
	 var d = c.getElementsByClassName("cardGlow")[0];
	 d.style.visibility='hidden';
	 
	 TweenLite.set(c, dp);
	 TweenLite.set(c.childNodes[0], {rotationY:0});
	 TweenLite.set(c.childNodes[1], {rotationY:-180});
	}

  };
  
  var muckItem=function(e,t) {
   TweenLite.to(e, t, {css:{left:"50%", top: "-120px", marginLeft: 0, marginTop: 0}});
  };
  
  var setX=function(e,xp,t) {
   TweenLite.to(e, t, {css:{marginLeft: xp}});
  };
  
  var setXY=function(id,xp,yp, t) {
   var e=document.getElementById(id);
   TweenLite.to(e, t, {x: xp, y: yp});
  };
  
  var flip=function(cl,delay) {
   var t=0.25;
   for (i=1;i<=cl.length;i++) {
    var dl=(i-1)*delay;
	var f=cl[i-1];
    var d=document.getElementById('card'+f);
	 TweenLite.to(d, t, {delay: dl, z:100});
	 TweenLite.to(d, t, {delay: dl+(t/2), z:0});
	 TweenLite.to(d.childNodes[0],t, {delay: dl, rotationY:180}, delay);
	 if (i<cl.length) {
	  TweenLite.to(d.childNodes[1],t, {delay: dl, rotationY:0}, delay);
	 } else {
	  TweenLite.to(d.childNodes[1],t, {delay: dl, rotationY:0, onComplete: game.dealDone}, delay);
	 }
   }
  };
  
  var deal=function(startpos, endpos, c, d, doflip, lastCard) {
	 c.style.visibility='visible';
	 c.style.opacity=1;
	 
	 TweenLite.set(c, startpos);
	 TweenLite.set(c.childNodes[0], {rotationY:0});
	 TweenLite.set(c.childNodes[1], {rotationY:-180});
	 
	 
	 // 0=front, 1=back
	 var t=0.2;
	 
	 if (doflip==true) {
	 
	 var t2 = new TimelineLite();
	 t2
	  .to(c.childNodes[0],t, {rotationY:180}, t/2)
	  .to(c.childNodes[1],t, {rotationY:0}, t/2);
	  
	  }
	  
	  var t3 = new TimelineLite();
	 t3
	  .to(c, t, {z:100})
	  .to(c, t, {z:0});
	 
	 var t4=new TimelineLite();
	 if (lastCard==false) {
	  t4.to(c,(t*1.5), endpos);
	 } else {
	  var endpos2=endpos;
	  endpos2.onComplete=game.dealDone;
	  t4.to(c,(t*1.5), endpos2);
	 }
	 
	 if (doflip==true) t2.delay(d).play();
	 t3.delay(d).play();
	 t4.delay(d).play();
 
	};

  
  return {
    deal: deal,
    resetCards : resetCards,
	flip: flip, 
	muckItem : muckItem,
	setX : setX,
	setXY : setXY,
	changeCash: changeCash,
	changeWager: changeWager
  };

})();