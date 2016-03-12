/// <reference path="../../typings/tsd.d.ts" />
class Card {
    frontPath: string;
    backPath: string;
    scale : number;
    image: Phaser.Sprite;
    isFaceDown: boolean;
    constructor(game : Phaser.Game,
                public num : string, 
                public suite : string){
                    this.isFaceDown = true;
                    this.frontPath = 'card' + this.suite + this.num + '.png';
                    this.backPath = 'cardBack_blue1.png';
                    this.scale = .8, .8;
                    this.image = new Phaser.Sprite(game,0, 0, "cardsBack" );
                    this.image.frameName = this.backPath;
                    this.image.scale = new Phaser.Point(this.scale, this.scale);
                     this.image.inputEnabled = true;
                     this.image.input.enabled = true;
                     this.image.input.enableDrag();
                     this.image.events.onInputDown.add(this.onClick, this);
                     
                }                    
    update(){
        //this.image.update();
    }
    
    onClick(isDoub){    
        console.log(this.isFaceDown);    
        this.isFaceDown = !this.isFaceDown;
        if(this.isFaceDown){
            this.image.loadTexture('cardsBack');
            this.image.frameName = this.backPath;
            //console.log('displaying ' + this.backPath)
         } else {
            this.image.loadTexture('cardsFront');
            this.image.frameName = this.frontPath;
            //console.log('displaying ' + this.frontPath)
         }
    }    
}   


class Deck {
    suites : string[];
    values : string[];
    cards : Card[];
    game : Phaser.Game;
        
    constructor(game: Phaser.Game){
        this.game = game;
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
                this.cards.push(new Card(this.game, v, s));
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
        this.deck = new Deck(this.game); 
        this.deck.init();
        console.log('loaded deck');
        this.deck.shuffle();
        var xCounter = 0;
        var yCounter = 0;       
        for(var c of this.deck.cards){
            c.image.x = xCounter * 180;
            c.image.y = yCounter * 220;
            this.game.add.existing(c.image);
            xCounter++;
            if(xCounter > 8){
                xCounter = 0;
                yCounter++;
            }
            c.update();
        }
    }
}


window.onload = () => {
    var game = new SimpleGame(window.document)
}