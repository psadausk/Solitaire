/// <reference path="../../typings/tsd.d.ts" />
class Card {
    frontPath: string;
    backPath: string;
    scale : number;
    image: Phaser.Sprite;
    isFaceDown: boolean;
    game: Phaser.Game
    constructor(game : Phaser.Game,
                public num : string, 
                public suite : string){
                    this.isFaceDown = true;
                    this.frontPath = 'card' + this.suite + this.num + '.png';
                    this.backPath = 'cardBack_blue1.png';
                    this.scale = .8, .8;
                    this.image = new Phaser.Sprite(game,0, 0, "cardsFront" );
                    //this.image.frameName = this.backPath;
                    this.image.frameName = this.frontPath;
                    this.image.scale = new Phaser.Point(this.scale, this.scale);
                     this.image.inputEnabled = true;
                     this.image.input.enabled = true;
                     //this.image.input.enableDrag();
                     //this.image.events.onInputDown.add(this.onClick, this);
                     this.game = game;
                     this.image.z = 0;
                     
                     
                }                    
    update(){
        //this.image.update();
    }
    
    onClick(){    
        // console.log(this.isFaceDown);    
        // this.isFaceDown = !this.isFaceDown;
        // if(this.isFaceDown){
        //     this.image.loadTexture('cardsBack');
        //     this.image.frameName = this.backPath;
        //  } else {
        //     this.image.loadTexture('cardsFront');
        //     this.image.frameName = this.frontPath;
        //     //this.game.debug.rectangle(new Phaser.Rectangle(this.image.x, this.image.y, this.image.width, this.image.height), "#FF0000", false);
        //  }
    }
    
    toString(){
        return this.num + ' of ' + this.suite + ' with z index of' + this.image.z;        
    }
    
    
}   


class Deck {
    suites : string[];
    values : string[];
    cards : Card[];
    selectedCard : Card;
    game : Phaser.Game;
    group : Phaser.Group; 
    constructor(game: Phaser.Game, group :Phaser.Group){
        this.game = game;
        this.group = group;
    }
    
    init(){
        console.log("In initting");
        this.cards = [];
        this.suites = ["Hearts", "Diamonds", "Clubs", "Spades"];
        this.values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        var counter:number = 0;
        for(var v of this.values){
            for(var s of this.suites){
                //TODO: Get the image from somewhere
                var c = new Card(this.game, v, s);
                var func = this.makeOnClickFunc(c);
                c.image.events.onInputDown.add(func);                
                this.cards.push(c);
            }
        }               
    }   
        
    makeOnClickFunc(card :Card){
        var g = this.game;
        var gr = this.group;
        console.log('make func called');
        return function(){
            console.log('clicked ' + card.toString());
            if(this.selectedCard != null){
                if(this.selectedCard.suite == "Hearts" || this.selectedCard.suite == "Diamonds"){
                    if(card.suite == "Clubs" || card.suite == "Spades"){
                        this.selectedCard.image.x = card.image.x;
                        this.selectedCard.image.y = card.image.y + 20;
                        this.selectedCard.image.z = card.image.z + 2;
                        gr.sort('y', Phaser.Group.SORT_ASCENDING);
                        console.log('selected z index is ' + this.selectedCard.image.z + ' card z index is ' + card.image.z);
                    }
                } else {
                    if(card.suite == "Hearts" || card.suite == "Diamonds") {
                        this.selectedCard.image.x = card.image.x;
                        this.selectedCard.image.y = card.image.y + 20;                                                
                        this.selectedCard.image.z = card.image.z + 2;
                        
                        console.log('selected z index is ' + this.selectedCard.image.z + ' card z index is ' + card.image.z);
                        gr.sort('y', Phaser.Group.SORT_ASCENDING);
                        
                    }
                }
                this.selectedCard = null;
            } else {
                this.selectedCard = card;
                g.debug.rectangle(new Phaser.Rectangle(this.selectedCard.image.x, this.selectedCard.image.y, this.selectedCard.image.width, this.selectedCard.image.height), "#FF0000", false);
                
            }        
        }
    }       
    
    shuffle(){
        var cur:number = this.cards.length;
        var rand:number;
        var temp:Card;
        
        while(cur != 0){
            //Find random  
            rand = Math.floor(Math.random() * cur);
            cur -= 1;
            
            //Swap
            temp = this.cards[cur];
            this.cards[cur] = this.cards[rand];
            this.cards[rand] = temp;            
        }
    }
}

class SimpleGame {
    game : Phaser.Game;
    deck : Deck;
    group: Phaser.Group;
    constructor(document: Document) {
        this.game = new Phaser.Game(document.body.clientWidth, document.body.clientHeight, Phaser.AUTO, 'content', {preload:this.preload, create:this.create});        
    }
    
    preload(){
        this.game.stage.backgroundColor = '#404040';
        //this.game.load.spritesheet('cards', 'assets/playingCards.png', 140, 190, 55);
        this.game.load.atlasXML('cardsFront', 'assets/playingCards.png', 'assets/playingCards.xml');
        this.game.load.atlasXML('cardsBack', 'assets/playingCardBacks.png', 'assets/playingCardBacks.xml');
        console.log('loaded atlas');                       
    }
    
    create(){        
        this.group = this.game.add.group();
        this.deck = new Deck(this.game, this.group); 
        this.deck.init();
        console.log('loaded deck');
        this.deck.shuffle();
        var xCounter = 0;
        var yCounter = 0;               
        for(var c of this.deck.cards){
            c.image.x = xCounter * 180;
            c.image.y = yCounter * 220;
            //this.game.add.existing(c.image);
            this.group.add(c.image);
            
            
            xCounter++;
            if(xCounter > 8){
                xCounter = 0;
                yCounter++;
            }
            c.update();
        }
    }
}

class Pile {
    cards : Card[];
    
    constructor(){
        this.cards = []; 
    }
    
    //Adds an individual card to a pile
    addCard(c : Card){
        this.cards.push(c);
    }
    
    //adds an array of cards to the pile
    //Note that this is reversed becase 
    addCards(cardsToAdd : Card[]){
        cardsToAdd.reverse;
        for(var c of cardsToAdd ){
           this.cards.push(c); 
        }
    }
}


window.onload = () => {
    var game = new SimpleGame(window.document)
}


