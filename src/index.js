console.log("pixijs7 1st test!");

import * as PIXI from "pixi.js";
import { Assets, Sprite } from 'pixi.js';

import { randomInt } from "./helper/randomInt";

import { STAGES } from "./constants";
import { displayDateText } from "./helper/text";

import { Character, Enemy, Viper, CharacterTemp } from "./character.js"

// PIXI.useDeprecated();

const WIDTH = STAGES.WIDTH;
const HEIGHT = STAGES.HEIGHT;
const BG_COLOR = STAGES.BG_COLOR;

console.log("window.devicePixelRatio: ", window.devicePixelRatio); // window.devicePixelRatio:  2


// init
let app = new PIXI.Application({
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: BG_COLOR,
    // resolution: window.devicePixelRatio || 1,
    autoResize: true
});
document.body.appendChild(app.view);

// container
let container = new PIXI.Container();
container.width = WIDTH;
container.height = HEIGHT;
container.x = 0;
container.y = 0;
container.pivot.x = 0.5;
container.pivot.y = 0.5;
// container.interactive = false;
// container.interactiveChildren = true;
container.buttonMode = false;
app.stage.addChild(container);

// PixiJS Deprecation Warning: Setting interactive is deprecated, use eventMode = 'none'/'passive'/'auto'/'static'/'dynamic' instead.Deprecated since v7.2.0

let temp = `PixiJS Ver:`;
console.log(temp);
let text1 = new PIXI.Text(temp, {
    fontSize: 20,
    fill: 0xfefefe,
    lineJoin: "round"
});
container.addChild(text1);
text1.anchor.set(0.5);
// text1.x = WIDTH / 2 - 40;
// text1.y = HEIGHT / 2 - 10;
text1.x = WIDTH - 110;
text1.y = HEIGHT - 10;

let temp2 = `${PIXI.VERSION}`;
console.log(temp2);
let text2 = new PIXI.Text(temp2, {
    fontSize: 20,
    fill: 0xff0033,
    lineJoin: "round"
});
container.addChild(text2);
text2.anchor.set(0.5);
// text2.x = WIDTH / 2 + text1.width - 50;
text2.x = WIDTH - 30;
// text2.y = HEIGHT / 2 - 10;
text2.y = HEIGHT - 10;

let texture1;
let image1;
let image2;
let loadingEnd = false;


// オブジェクト呼び出し
console.log("キャラクターtest");
let char = CharacterTemp;
console.log(char);
// (app) => {
//     a = 1;
// } 関数
// {a: 1} オブジェクト
// クラス？
console.log(char.a);// 1
console.log(char.b);// かきくけこ

// クラスインスタンス作成＆呼び出し
let enem = new Enemy();
console.log(enem.aa); // 敵名前1
enem.attack(); // 攻撃した！

let viper;

// Load image and Set sprite
const LoadImg = async () => {
    console.log("LoadImg()");

    // 自機
    texture1 = await Assets.load('assets/images/pic_my_space_ship.png');
    image1 = Sprite.from(texture1);
    console.log(texture1); // Texture {_events: Events, _eventsCount: 0, noFrame: true, baseTexture: _BaseTexture, _frame: Rectangle, …}
    console.log(image1); // Sprite {_events: Events, _eventsCount: 0, tempDisplayObjectParent: null, transform: _Transform, alpha: 1, …}

    // image1.anchor.set(0.5);
    // image1.x = WIDTH / 2;
    // image1.y = HEIGHT / 2 + 90;

    // image1.width = image1.width / 2;
    // image1.height = image1.height / 2;

    // image1.scale.set(0.5, 0.5);

    // 右向きに
    // image1.rotation = 1.5;
    // container.addChild(image1);


    // 敵機
    const texture2 = await Assets.load('assets/images/pic_enemy_space_ship.png');
    image2 = Sprite.from(texture2);
    console.log(texture2);
    console.log(image2);
    image2.anchor.set(0.5);
    image2.x = WIDTH / 2;
    image2.y = HEIGHT / 2 + 90;
    image2.scale.set(0.5, 0.5);
    container.addChild(image2);

    // ここでアセット分繰り返して連番で取得する？

    init(); // next actions
}

// 画像読み込み
LoadImg();

// RandomInt test（helper関数）
let dice = randomInt(1, 6);
console.log("dice no: ", dice);

const init = () => {
    console.log("init()");
    // loading end flag
    loadingEnd = true;

    console.log(image1);
    console.log(container);

    // 自機ヴァイパーを作成する
    console.log(image1.width, image1.height);//120,240
    viper = new Viper(container, 0, 0, image1.width, image1.height, 0, image1, 0.5, 0);
    viper.draw();

}

let startTime = null;

// view todays date
// let today = displayDateText(app);

let mv = 10;

window.addEventListener("keydown", (event) => {

    // 本だとここで登場（シーン）時はreturn

    switch (event.key) {
        case "ArrowLeft":
            image1.x -= mv;
            break;
        case "ArrowRight":
            image1.x += mv;
            break;
        case "ArrowUp":
            image1.y -= mv;
            break;
        case "ArrowDown":
            image1.y += mv;
            break;
        default:
            console.log("カーソルキー以外を押した");
            break
    }
});

// 本のrenderに相当
startTime = Date.now();
// Ticler
app.ticker.add(() => {

    // console.log("tick...");

    if (loadingEnd) {

        // 自機を右に移動（端まで移動でループ）
        // image1.x = image1.x + 1;
        // if (image1.x >= WIDTH + image1.width / 2) {
        //     image1.x = -image1.width / 2;
        // }

        // 本のrender()での処理をここに書く

        let nowTime = Math.floor((Date.now() - startTime) / 1000);
        // console.log(nowTime);
        // ok


    }

});



