deck = function(){
   
   var version="1.01";
   console.log("Deck module "+version+" running");
  
   cards = new Array();
   ptr=0;
   
   
   var init=function() {
    makeDeck(1);
	cards=fy_shuffle(cards);
	// Straight TEST
	//cards[1]=cards[14];
	//cards[6]=cards[19];
	
	//cards[7]=cards[38];
	//cards[8]=cards[15];
	//cards[9]=cards[29];
	//cards[10]=cards[32];
	return cards;
   };
   
   var getCards=function() {
	//unshuffle();
	return cards;
   };
   
   var doshuffle=function() {
	//unshuffle();
	cards=fy_shuffle(cards);
	return cards;
   };
   
   var unshuffle=function() {
    // Puts deck into original order
	cards.sort(
   function(a,b){
         return (a.idx-b.idx);
   });
   };
   
   var handval=function(h) {

	var nh=h;
	
	// Check for flush
	var h_flush=isFlush(nh);
	// Sort by value
	nh.sort(sortbyVal);
	var h_straight=isStraight(nh);
	// Count values
	var counts=new Array();
	ptr=0;
	var t=nh[0].value;
	counts[ptr]=1;
	for (j=1;j<5;j++) {
	 if (nh[j].value==t) {
	  counts[ptr]=counts[ptr]+1;
	 } else {
	  ptr=ptr+1;
	  counts[ptr]=1;
	  t=nh[j].value;
	 }
	}
	// Sort counts
	counts.sort(function(a, b){return b-a});
	var c=counts.toString();
	// Secondary count function to correctly sort hand by strength
	var cv=new Object();
	var h2=new Array();
	for (j=0;j<5;j++) {
	 cv=new Object();
	 cv.value=nh[j].value;
	 cv.count=1;
	 h2[j]=cv;
	}
	for (j=0;j<5;j++) {
	 for (k=0;k<5;k++) {
	  if (h2[j].value==h2[k].value && j!=k) h2[j].count=h2[j].count+1;
	 }
	}
	// Sort h2 by count and then value
	h2.sort(
   function(a,b){
      if (a.count!=b.count){
         return (b.count-a.count);
      } else {
         return (b.value-a.value);
      }
   });
   
    if (h_straight==true) 	{
	 // Make sure that A2345 is counted as LOW
	 if (h2[0].value==14 && h2[1].value==5) {
	  h2[0].value=1;
	  h2.sort(
	   function(a,b){
		  if (a.count!=b.count){
			 return (b.count-a.count);
		  } else {
			 return (b.value-a.value);
		  }
	   });
	 }
	}
	
   
	// Assign a value to the hand
	var hv=0;
	var hexv=0;
	// High card
	if (c=="1,1,1,1,1") hv=1;
	// Pair
	if (c=="2,1,1,1") hv=2;
	// 2-Pair
	if (c=="2,2,1") hv=3;
	// 3 of a kind
	if (c=="3,1,1") hv=4;
	// Straight
	if (h_straight==true) hv=5;
	// Flush
	if (h_flush==true) hv=6;
	// Full-house
	if (c=="3,2") hv=7;
	// 4 of a kind
	if (c=="4,1") hv=8;
	// Straight flush
	if (h_straight==true && h_flush==true) hv=9;
	// Royal Flush
	if (h_straight==true && h_flush==true && nh[0].value==14) hv=10;
	
	
	hexv=hv.toString(16)+h2[0].value.toString(16)+h2[1].value.toString(16)+h2[2].value.toString(16)+h2[3].value.toString(16)+h2[4].value.toString(16);
	
	return [hv, parseInt(hexv, 16)];
   };
   
   // Functions used to rank/evaluate hands
   var isStraight=function(h) {
	// Check if we have a 4 card straight
	var t=h[1].value;
	for (j=2;j<5;j++) {
	 if (t-h[j].value!=1) return false;
	 t=h[j].value;
	}
	// Check 5th card, with additional check for A low straight
	if (h[0].value==14 && h[1].value==5) return true;
	if (h[0].value-h[1].value==1) return true;
	return false;
   };
   
   var isFlush=function(h) {
    h.sort(sortbySuit);
	if (h[0].suit==h[4].suit) {
	 return true;
	} else {
	 return false;
	}
   };
   
   var sortbySuit=function(a,b) {
    return a.suit.localeCompare(b.suit);
   };
   
   var sortbyVal=function(a,b) {
    return b.value - a.value;
   };

   
   var card=function(rank, suit, value, idx) {

   this.rank = rank;
   this.suit = suit;
   this.value = value;
   this.idx = idx;
  

   this.toString   = cardToString;
 };
 


	var fy_shuffle=function(array) {
// Fisher–Yates shuffle
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
};

 
 
 var deal=function(n) {
  for (f=0;f<n;f++) {
   var c=cards[ptr];
   //console.log(c.toString());
   ptr++;
  }
 };
 
 var makeDeck=function(n) {

  var ranks = new Array("2", "3", "4", "5", "6", "7", "8", "9",
                        "10", "J", "Q", "K", "A");
  var suits = new Array("C", "D", "H", "S");
  var i, j, k;
  var m;

  m = ranks.length * suits.length;

  // Set array of cards.

  this.cards = new Array(n * m);

  // Fill the array with 'n' packs of cards.
  var p=1;
  for (i = 0; i < n; i++)
    for (j = 0; j < suits.length; j++)
      for (k = 0; k < ranks.length; k++) {
        this.cards[i * m + j * ranks.length + k] = new card(ranks[k], suits[j], (k+2), p);
		p=p+1;
		}
};

 var cardToString=function() {

  var rank, suit, value, idx;

  switch (this.rank) {
    case "A" :
      rank = "Ace";
      break;
    case "2" :
      rank = "Two";
      break;
    case "3" :
      rank = "Three";
      break;
    case "4" :
      rank = "Four";
      break;
    case "5" :
      rank = "Five";
      break;
    case "6" :
      rank = "Six";
      break;
    case "7" :
      rank = "Seven";
      break;
    case "8" :
      rank = "Eight";
      break;
    case "9" :
      rank = "Nine";
      break;
    case "10" :
      rank = "Ten";
      break;
    case "J" :
      rank = "Jack"
      break;
    case "Q" :
      rank = "Queen"
      break;
    case "K" :
      rank = "King"
      break;
    default :
      rank = null;
      break;
  }

  switch (this.suit) {
    case "C" :
      suit = "Clubs";
      break;
    case "D" :
      suit = "Diamonds"
      break;
    case "H" :
      suit = "Hearts"
      break;
    case "S" :
      suit = "Spades"
      break;
    default :
      suit = null;
      break;
  }

  if (rank == null || suit == null)
    return "";

  return this.idx+": "+rank + " of " + suit + " ("+this.value+")";
}; 

  var k_combinations=function(set,k) {

	var i, j, combs, head, tailcombs;

	
	if (k == set.length) {
		return [set];
	}
	
	if (k == 1) {
		combs = [];
		for (i = 0; i < set.length; i++) {
			combs.push([set[i]]);
		}
		return combs;
	}
	
	// Assert {1 < k < set.length}
	
	combs = [];
	for (i = 0; i < set.length - k + 1; i++) {
		head = set.slice(i, i+1);
		tailcombs = k_combinations(set.slice(i + 1), k - 1);
		for (j = 0; j < tailcombs.length; j++) {
			combs.push(head.concat(tailcombs[j]));
		}
	}
	return combs;

};



   
   return{cards:cards, init:init, deal:deal, doshuffle:doshuffle, ptr:ptr, handval:handval, k_combinations:k_combinations, getCards:getCards}
}();