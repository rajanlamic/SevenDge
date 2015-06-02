<?php
    if ($_POST['userName'] == "ali999$" && $_POST['password'] == "rajan111$") {
?>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta id="viewport" name="viewport" content="width=device-width, user-scalable=0, minimal-ui">
<meta name="mobile-web-app-capable" content="yes">
<title>Split-Poker</title>

<link href='http://fonts.googleapis.com/css?family=Open+Sans:700' rel='stylesheet' type='text/css'>

<!-- Dev version has separate CSS files -->
<link rel="stylesheet" type="text/css" href="css/ipad_p.css">
<link rel="stylesheet" type="text/css" href="css/ipad_l.css">


<!-- For production version, pack all CSS into single file -->
<xlink rel="stylesheet" type="text/css" href="css/main.css">


<!-- Greensock GSAP animation libraries -->
<xscript src="http://cdnjs.cloudflare.com/ajax/libs/gsap/latest/plugins/CSSPlugin.min.js"></script>
<xscript src="http://cdnjs.cloudflare.com/ajax/libs/gsap/latest/easing/EasePack.min.js"></script>
<xscript src="http://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenLite.min.js"></script>
<xscript src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.16.1/TimelineLite.min.js"></script>

<script src="js/plugins/CSSPlugin.min.js"></script>
<script src="js/easing/EasePack.min.js"></script>
<script src="js/TweenLite.min.js"></script>
<script src="js/TimelineLite.min.js"></script>

<!-- Remove touch delay -->
<script type="application/javascript" src="js/fastclick.js"></script> 
<script type="application/javascript">
	window.addEventListener('load', function () {
		FastClick.attach(document.body);
	}, false);
</script> 

<!-- Added HOWLER to handle audio -->
<script type="application/javascript" src="js/howler.core.min.js"></script> 

<!-- Modules for game code -->
<script src="js/modules/cards.js"></script>
<script src="js/modules/ui.js"></script>
<script src="js/modules/animate.js"></script>
<script src="js/modules/splitpoker.js"></script>
<!--<script src="js/modules/check.js"></script>-->

<!-- For release version, modules are combined and packed into 1 file -->
<xscript src="js/splitpoker.104.min.js"></script>

</head>

<body onload="init();" onscroll="scrollToTop();" ondblclick="launchFullscreen(document.documentElement);" style="background-color:#000000">

<div id="holder" style="background-color:#000050; ">
 
 <div id="tablelogo" class="centerDiv backImg"></div>
 <div id="cardshoe" class="backImg"></div>
 <div id="chiprack" class="centerDiv backImg"></div>

 <div id="newshade"></div>
 
 <div id="betarea2" class="backImg">
  <div id="placedChips2"></div>
 </div>
 
 <div id="betarea3" class="backImg">
  <div class="notices" id="noticeBonusSide"></div>
  <div id="placedChips1"></div>
  <div id="placedChips3"></div>
  <div id="placedChips4"></div>
 </div>
 
 
 
 
 
 
 <div id="cards" style="zoom:1;">
  <div class="cardpos playercards" id="card0" style="pointer-events:none;"></div>
 
	 <div class="cardpos playercards" id="card1"><div class="cardFront"></div><div class="cardBack"></div><div class="cardGlow"></div></div>
	 <div class="cardpos playercards" id="card2"><div class="cardFront"></div><div class="cardBack"></div><div class="cardGlow"></div></div>
	 <div class="cardpos playercards" id="card3"><div class="cardFront"></div><div class="cardBack"></div><div class="cardGlow"></div></div>
	 <div class="cardpos playercards" id="card4"><div class="cardFront"></div><div class="cardBack"></div><div class="cardGlow"></div></div>
	 <div class="cardpos dealercards" id="card5"><div class="cardFront"></div><div class="cardBack"></div><div class="cardGlow"></div></div>
	 <div class="cardpos dealercards" id="card6"><div class="cardFront"></div><div class="cardBack"></div><div class="cardGlow"></div></div>
	 <div class="cardpos dealercards" id="card7"><div class="cardFront"></div><div class="cardBack"></div><div class="cardGlow"></div></div>
	 <div class="cardpos cards" id="card8"><div class="cardFront"></div><div class="cardBack"></div><div class="cardGlow"></div></div>
	 <div class="cardpos cards" id="card9"><div class="cardFront"></div><div class="cardBack"></div><div class="cardGlow"></div></div>
	 <div class="cardpos cards" id="card10"><div class="cardFront"></div><div class="cardBack"></div><div class="cardGlow"></div></div>
	 <div class="cardpos cards" id="card11"><div class="cardFront"></div><div class="cardBack"></div><div class="cardGlow"></div></div>
	 <div class="cardpos cards" id="card12"><div class="cardFront"></div><div class="cardBack"></div><div class="cardGlow"></div></div>
 </div>
 
	<div id="chips">
	 <div id="chip1">
	  <div class="chips" id="item"></div>
	  <div class="chipGlow"></div>
	 </div>
	 <div id="chip2">
	  <div class="chips" id="item"></div>
	  <div class="chipGlow"></div>
	 </div>
	 <div id="chip3">
	  <div class="chips" id="item"></div>
	  <div class="chipGlow"></div>
	 </div>
	 <div id="chip4">
	  <div class="chips" id="item"></div>
	  <div class="chipGlow"></div>
	 </div>
	 <div id="chip5">
	  <div class="chips" id="item"></div>
	  <div class="chipGlow"></div>
	 </div>
	</div>
	
	<div class="uibutton" id="uibutton3"></div>
    <div class="uibutton" id="uibutton4"></div>
	
	<div id="button1"></div>
	 <div id="button2"></div>
	 <div id="button3"></div>
	 <div id="button4"></div>
	 <div id="button5"></div>
	 <div id="button6"></div>
	 <div id="button7"></div>
	 
	 <div id="txt_cash"><span>$5000</span></div>
	 <div id="txt_wager"><span>$4999</span></div>
 
	<div id="payTable">
	  
		<section id="paySection">
			<div id="one">Ante pays</div><div id="two">1:1</div>
			<div id="one">Bet pays</div><div id="two">1:1</div>
			<div id="one"></div><div id="two"></div>
			<hr>Ante Bonus Paytable<hr>
			<div id="one">Straight</div><div id="two">2:1</div>
			<div id="one">Flush</div><div id="two">2:1</div>
			<div id="one">Full House</div><div id="two">3:1</div>
			<div id="one">Four of a Kind</div><div id="two">10:1</div>
			<div id="one">Straight Flush</div><div id="two">40:1</div>
			<div id="one">Royal Flush</div><div id="two">100:1</div>
			<hr><img src="images/jackattacklogo.png"><hr>
			<div id="one">1 x Jack</div><div id="two">2:1</div>
			<div id="one">2 x Jack</div><div id="two">5:1</div>
			<div id="one">3 x Jack</div><div id="two">40:1</div>
			<div id="one">4 x Jack</div><div id="two">1000:1</div>
		</section>
		
		<img id="backButton" src="images/back-button.png">

	</div>
	
	<div id="helpScreen">
	 <section id="helpSection">
	  <hr>GAME RULES<hr>
	  <div id="helpText">
	   <p>All-in Poker Split is a Hold'em based poker game played with a single 52-card deck</p>
       <p>To start, select a chip, place it in the ante box and press DEAL</p>
	   <p>You'll now receive four cards and the dealer will receive three</p>
	   <p>The dealer can use a max of two of their hole cards at showdown</p>
	   <p>You now have three options: FOLD, BET or SPLIT</p>
	   <p>Click FOLD to lose your ante and start a new hand</p>
	   <p>If you decide to play, select a two card hand - to deselect click on a highlighted card</p>
	   <p>To play this hand only click BET - a bet 2x your ante will be placed</p>
	   <p>To play both 2-card hands click SPLIT - two bets 2x your ante will be placed</p>
	   <p>Now the community cards are dealt and the dealer's cards exposed - best 5-card hand wins</p>
	   <p>An ante bonus is available for making a straight or better regardless of beating the dealer</p>
	   <p>For bonus payouts see paytable</p>
	  </div>
	  <hr>SIDE BET<hr>
	  <div id="helpText">
	   <p>To place a <img src="images/jackattacklogo_small.png" style="vertical-align:sub"> sidebet select a chip at the start of a hand and place in the <img src="images/jackbox_small.png" style="vertical-align:sub"> box</p>
       <p>Win between 2:1 and 1000:1 based on the number of Jacks you are dealt - click paytable for details</p>
	  </div>
	 </section>
	 <img id="forwardButton" src="images/forward-button.png">
	 
	</div>
	
	<div class="notices" id="noticeDealer">FULL HOUSE</div>
	<div class="notices" id="noticePlayer">STRAIGHT</div>
	<div class="notices" id="noticeResult">DEALER WINS</div>
	<div class="notices" id="noticeBonus"></div>
	
	<div class="noticesmall" id="noticePlayerH1">STRAIGHT</div>
	<div class="noticesmall" id="noticePlayerH2">FULL HOUSE</div>
	
	<div class="noticesmall" id="noticeResult1">DEALER WINS</div>
	<div class="noticemalls" id="noticeResult2">STRAIGHT FLUSH</div>
	
	
</div>


 
</body>
</html>


<?php
    } else {
?>
<form method="post">
    Username : <input type="text" id="userName" name="userName" value="" > <br>
    Password : <input type="password" id="password" name="password" value="" > <br>
    <input type="submit" id="submit" name="submit" value="Submit" > <br>
</form>

    <?php } ?>
