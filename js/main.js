"use strict";

class Game {
    constructor(gameNumber) {
        this.gameNumber = gameNumber;
        this.cards = new Array();
        for ( let c = 0; c < 4; c++ ) {
            let newCard = new Card(this.gameNumber, c + 1);
            this.cards.push(newCard);
        }
        this.scoreCorrect = 0;
        this.scoreIncorrect = 0;
        this.isComplete = false;
    }

    createInDOM() {     //create DOM elements of this game
        let gameSection = document.createElement("SECTION");
        gameSection.id = "game"+this.gameNumber;
        gameSection.classList.add("cards");
        if(this.gameNumber == "1") gameSection.setAttribute("active", "1");
        else gameSection.setAttribute("active", "0");
        let gameContainer = document.getElementById("gameContainer");
        gameContainer.appendChild(gameSection);
        
        let titleScreen = this.initTitleScreen();
        gameSection.appendChild(titleScreen);
        document.getElementById("titleScreen" + this.gameNumber).style.left = document.body.offsetWidth / 2 - 150 + "px";

        Array.from(this.cards).forEach(function(element) {
            element.createInDOM();
        });
        //animate initial cards in place
        if(this.gameNumber == "1") {
            TweenLite.to(document.getElementById("titleScreen1"), .6, {css:{left:-3000}, delay:2.5, overwrite:false, ease:Cubic.easeOut});
            TweenLite.to(document.getElementById("card1_1"), .6, {css:{left:0}, delay:3, overwrite:false, ease:Cubic.easeOut});
            TweenLite.to(document.getElementById("card1_2"), .7, {css:{left:0}, delay:3, overwrite:false, ease:Cubic.easeOut});
            TweenLite.to(document.getElementById("card1_3"), .8, {css:{left:0}, delay:3, overwrite:false, ease:Cubic.easeOut});
            TweenLite.to(document.getElementById("card1_4"), .9, {css:{left:0}, delay:3, overwrite:false, ease:Cubic.easeOut});
         }
     }

    initTitleScreen() {
        let titleScreen = document.createElement("ARTICLE");
        titleScreen.id = "titleScreen" + this.gameNumber;
        titleScreen.classList.add("titleScreen");
        let titleScreenHeader = document.createElement("H2");
        let titleScreenBody = document.createElement("H3");
        let titleScreenHeaderText; let titleScreenBodyText;
        if(this.gameNumber == '1') {
            titleScreenHeaderText = document.createTextNode("This is a 2-part baseball quiz.");
            titleScreenBodyText = document.createTextNode("Game #1 starts now....");
        } else {
            titleScreenHeaderText = document.createTextNode("Congrats, you finished the quiz!");
            titleScreenBodyText = document.createTextNode("Final score was " + this.scoreCorrect + "correct, " + this.scoreIncorrect + " wrong");
        }
        titleScreenHeader.appendChild(titleScreenHeaderText);
        titleScreenBody.appendChild(titleScreenBodyText);
        titleScreen.appendChild(titleScreenHeader);
        titleScreen.appendChild(titleScreenBody);

        return titleScreen;    
    }

    showGame() {    //starts new game, hides old game
        if(document.getElementById("game" + this.gameNumber).getAttribute("active") == '0') {
            let otherGame = '';
            if(this.gameNumber == '1') otherGame = '2';
            else otherGame = '1';

            TweenLite.to(document.documentElement, .6, {scrollTop:0, delay:0, overwrite:false, ease:Cubic.easeOut});
            TweenLite.to(document.body, .6, {scrollTop:0, delay:0, overwrite:false, ease:Cubic.easeOut});

            document.getElementById("nav-item" + otherGame).classList.remove("active");
            document.getElementById("nav-item" + this.gameNumber).classList.add("active");

            this.animateOtherGameOut(otherGame);
            this.animateThisGameIn();
        }
    }

    animateOtherGameOut(otherGame) {
        TweenLite.to(document.getElementById("card"+otherGame+"_1"), .75, {css:{left:-3000}, delay:0, overwrite:false, ease:Cubic.easeOut});
        TweenLite.to(document.getElementById("card"+otherGame+"_2"), .85, {css:{left:-3000}, delay:0, overwrite:false, ease:Cubic.easeOut});
        TweenLite.to(document.getElementById("card"+otherGame+"_3"), .95, {css:{left:-3000}, delay:0, overwrite:false, ease:Cubic.easeOut});
        TweenLite.to(document.getElementById("card"+otherGame+"_4"), 1.05, {css:{left:-3000}, delay:0, overwrite:false, ease:Cubic.easeOut, onComplete:function(){
            document.getElementById("game" + otherGame).style.opacity = "0";
            document.getElementById("game" + otherGame).style.top = "-3000px";
            document.getElementById("game" + otherGame).setAttribute("active", "0");    
        }});
    }

    animateThisGameIn() {
        document.getElementById("game" + this.gameNumber).style.opacity = "1";
        document.getElementById("game" + this.gameNumber).setAttribute("active", "1");
        document.getElementById("game" + this.gameNumber).style.top = "0px"; 
        TweenLite.to(document.getElementById("card"+this.gameNumber+"_1"), .6, {css:{left:0}, delay:.5, overwrite:false, ease:Cubic.easeOut});
        TweenLite.to(document.getElementById("card"+this.gameNumber+"_2"), .7, {css:{left:0}, delay:.5, overwrite:false, ease:Cubic.easeOut});
        TweenLite.to(document.getElementById("card"+this.gameNumber+"_3"), .8, {css:{left:0}, delay:.5, overwrite:false, ease:Cubic.easeOut});
        TweenLite.to(document.getElementById("card"+this.gameNumber+"_4"), .9, {css:{left:0}, delay:.5, overwrite:false, ease:Cubic.easeOut});
    }
} //END class Game

/*******************************************Card CLASS **************************************/

class Card {
    constructor(gameNumber, cardNumber) {
        this.gameNumber = gameNumber;
        this.cardNumber = cardNumber;
        this.type = "text";
        this.answer = "";
        this.initialGraphic = "initGraph";
        this.finalGraphic = "finGraph";
        this.isComplete = false;
    }

    createInDOM() {    //create DOM elements of this Card
        //create article container for card
        let cardBlock = document.createElement("ARTICLE");
        cardBlock.id = "card"+this.gameNumber+"_"+this.cardNumber;
        cardBlock.setAttribute("answered", "0");
        cardBlock.classList.add("card", "card" + this.gameNumber);

        //create graphic, question and answer buttons
        let graphicRelCtr = document.createElement("DIV");
        graphicRelCtr.classList.add("graphicRelContainer");
        graphicRelCtr.id = "graphicRelContainer" + this.gameNumber + "_" + this.cardNumber;
        let graphicCtr = document.createElement("DIV");
        graphicCtr.id = "graphic" + this.gameNumber + "_" + this.cardNumber;
        graphicCtr.classList.add("graphicContainer");
        let questionCtr = document.createElement("H2");
        if( this.gameNumber == 1 ) {
            var questionNode = document.createTextNode(myObj.game1[this.cardNumber - 1].question);          
            graphicCtr.setAttribute("type", myObj.game1[this.cardNumber - 1].type);
        } else {
            var questionNode = document.createTextNode(myObj.game2[this.cardNumber - 1].question); 
            graphicCtr.setAttribute("type", myObj.game2[this.cardNumber - 1].type);
        }
        questionCtr.appendChild(questionNode);
        cardBlock.appendChild(questionCtr);
        
        this.createButtons(graphicRelCtr, this);

        graphicRelCtr.appendChild(graphicCtr);
        cardBlock.appendChild(graphicRelCtr);

        let cardContainer = document.getElementById("game" + this.gameNumber);
        cardContainer.appendChild(cardBlock);

        if( this.type == "donut" ){
            initChart(this.gameNumber, this.cardNumber, 1);
        }
    } //END createInDOM()

    updateGameScore(e, thisGame) {  
        if(e.target.getAttribute("cc") == "1") {
            if(thisGame == '1') {
                game1.scoreCorrect++;
                document.getElementById("scoreCorrect1").innerHTML = game1.scoreCorrect;
            } else {
                game2.scoreCorrect++;
                document.getElementById("scoreCorrect2").innerHTML = game2.scoreCorrect;
            }
        } else {
            if(thisGame == '1') {
                game1.scoreIncorrect++;
                document.getElementById("scoreIncorrect1").innerHTML = game1.scoreIncorrect;
            } else {
                game2.scoreIncorrect++;
                document.getElementById("scoreIncorrect2").innerHTML = game2.scoreIncorrect;
            }
        }
    }

    updateGraphicsOnAnswer(e, thisGame, thisCard) {      //update buttons and graphic based on selected answer
        let buttonsArray = document.querySelectorAll(".btn-trivia-" + thisGame + "_" + thisCard);
        buttonsArray.forEach(function(btn) {
            let isCorrect = +btn.getAttribute("cc");
            let thisCard = btn.getAttribute("place");
            let thisGraphic = document.getElementById("graphic" + thisCard);
            if(isCorrect == "1") {
                if(e.target == btn) btn.style.backgroundColor = "green";
                else btn.style.backgroundColor = "red";
                let topPos = 0; 
                if(btn.classList.contains("btn-trivia-2")) topPos = -55;
                else if(btn.classList.contains("btn-trivia-3")) topPos = -110;
                TweenLite.to(btn, .2, {css:{left:"-20%", top:topPos, width:"140%"}, delay:0, overwrite:false, ease:Linear.easeOut, delay: 0.5});
                let newXPos = document.getElementById("graphicRelContainer" + thisCard).offsetWidth;
                TweenLite.to(thisGraphic, .6, {css:{left:newXPos / 2 - 90}, delay:0, overwrite:false, ease:Linear.easeOut, delay: 0.5});
            } else {
                btn.style.backgroundColor = "gray";      
                TweenLite.to(btn, .3, {css:{left:800}, delay:0, overwrite:false, ease:Back.easeIn, delay: 0.5, onComplete: function(){
                    btn.style.top = "-3000px";
                }});                 
            }
        });
    }

    moveToNextGame(thisGame) {    //if game complete, move to next game
        let cardsArray = document.querySelectorAll(".card" + thisGame);
        let cardsDone = 0;
        cardsArray.forEach(function(card) {
            if(card.getAttribute("answered") == '1') cardsDone++;
        });
        if(cardsDone == 4) {
            if(thisGame == '1') {
                TweenLite.to(document, 0, {delay:3, overwrite:false, onComplete: function(){
                    game2.showGame();
                }});
            } 
            else {
                TweenLite.to(document, 0, {delay:3, overwrite:false, onComplete: function(){
                    game1.showGame();
                }});
            }
        }
    }

    initChartOrImage(thisGame, thisCard) {    //pass data to init functions for chart/image of this card
        let thisCardType = document.getElementById("graphic" + thisGame + "_" + thisCard).getAttribute("type");
        if(thisCardType != "text") initChart(thisGame, thisCard, 0)
        else initPic(thisGame, thisCard);
    }

    createButtons(graphicRelCtr, tgame) {     //loop and create 3 answer buttons for the card after grabbing the correct answer id from json file
        if( this.gameNumber == 1 ) { 
            this.answer = myObj.game1[this.cardNumber - 1].correctanswer;
            this.type = myObj.game1[this.cardNumber - 1].type;
        } else {
            this.answer = myObj.game2[this.cardNumber - 1].correctanswer;
            this.type = myObj.game2[this.cardNumber - 1].type;
        }
        for ( let c = 1; c <= 3; c++ ) {
            let buttonCtr = document.createElement("BUTTON");
            buttonCtr.setAttribute("type", "button");
            buttonCtr.setAttribute("place", this.gameNumber + "_" + this.cardNumber);
            if(this.answer == c) buttonCtr.setAttribute("cc", "1");
            else buttonCtr.setAttribute("cc", "0");
            buttonCtr.classList.add("btn", "btn-primary", "btn-trivia", "btn-trivia-" + this.gameNumber + "_" + this.cardNumber, "btn-trivia-" + c);
            if( this.gameNumber == 1 ) var answerNode = document.createTextNode(myObj.game1[this.cardNumber - 1].answers[c - 1]);
            else var answerNode = document.createTextNode(myObj.game2[this.cardNumber - 1].answers[c - 1]);
            buttonCtr.appendChild(answerNode);
            graphicRelCtr.appendChild(buttonCtr);

            buttonCtr.addEventListener("click", function(e) {
                if(e.target.parentElement.parentElement.getAttribute("answered") == '0') {
                    e.target.parentElement.parentElement.setAttribute("answered", "1");
                    let thisGame = this.getAttribute("place").substr(0, 1);
                    let thisCard = this.getAttribute("place").substr(2, 1);

                    tgame.updateGameScore(e, thisGame);
                    tgame.updateGraphicsOnAnswer(e, thisGame, thisCard);
                    tgame.moveToNextGame(thisGame);
                    tgame.initChartOrImage(thisGame, thisCard);
                }
            });
        }
    }
} //END class Card 

const game1 = new Game(1);
const game2 = new Game(2);

//load question/answer data from external JSON file, generate games from data
let xmlhttp = new XMLHttpRequest();
let myObj;
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        myObj = JSON.parse(this.responseText);
        game1.createInDOM();
        game2.createInDOM();
    }
};
xmlhttp.open("GET", "/deacom/data.json?v4", true);
xmlhttp.send();

