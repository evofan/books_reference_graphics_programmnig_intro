console.log("pixijs7 1st test!");

import * as PIXI from "pixi.js";
import { Assets, Sprite } from 'pixi.js';

import { randomInt } from "./helper/randomInt";

import { STAGES } from "./constants";
import { displayDateText } from "./helper/text";

import { Character, EnemyTemp, Viper, CharacterTemp, Shot } from "./character.js"

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
    resolution: window.devicePixelRatio || 1,
    autoResize: true
});
document.body.appendChild(app.view);

// container
let container = new PIXI.Container();

container.x = 0;
container.y = 0;
// container.pivot.x = 0.5;
// container.pivot.y = 0.5;
// container.interactive = false;
// container.interactiveChildren = true;
container.buttonMode = false;
app.stage.addChild(container);

container.width = WIDTH;
container.height = HEIGHT;
// console.log("★1st",container.width); // ★1st 0

// PixiJS Deprecation Warning: Setting interactive is deprecated, 
// use eventMode = 'none'/'passive'/'auto'/'static'/'dynamic' instead.Deprecated since v7.2.0

let temp = `PixiJS Ver:`;
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
// onsole.log(temp2); // 7.3.2
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
let image_shot = [];

// loading flag
let loadingEnd = false;


// オブジェクト呼び出し
console.log("キャラクターtest");
let char = CharacterTemp;
console.log(char); // {a: 1, b: 'かきくけこ'}
console.log(char.a);// 1
console.log(char.b);// かきくけこ

// クラスインスタンス作成＆呼び出し
let enem = new EnemyTemp();
console.log(enem.aa); // 敵名前1
enem.attack(); // 攻撃した！

// 自機クラス
let viper;

// 自機最大弾数
const SHOT_MAX_COUNT = 5;

// ショットのインスタンスを格納する配列
let shotArray = [];


// Load image and Set sprite
const LoadImg = async () => {
    console.log("LoadImg()");

    // 自機
    texture1 = await Assets.load('assets/images/pic_my_space_ship.png');
    image1 = Sprite.from(texture1);
    console.log(texture1); // Texture {_events: Events, _eventsCount: 0, noFrame: true, baseTexture: _BaseTexture, _frame: Rectangle, …}
    console.log(image1); // Sprite {_events: Events, _eventsCount: 0, tempDisplayObjectParent: null, transform: _Transform, alpha: 1, …}

    // ここで生成せずにクラスで作成に移行
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
    image2.y = HEIGHT / 2 - 90;
    image2.scale.set(0.5, 0.5);
    image2.rotation = 2;
    container.addChild(image2);

    // 自分弾

    const texture3 = await Assets.load('assets/images/pic_tama_81x61_02.png');
    for (let i = 0; i <  + SHOT_MAX_COUNT; i++) {
        image_shot[i] = Sprite.from(texture3);
        console.log(texture3);
        console.log(image_shot[i]);
        image_shot[i].anchor.set(0.5);
        image_shot[i].x = WIDTH / 2;
        image_shot[i].y = HEIGHT / 2 - 30;
        // image_shot[i].scale.set(0.5, 0.5); // Shotインスタンス作成側で（オフセット計算にも使うので）
    }

    init(); // next actions
}

// 画像読み込み
LoadImg();

// RandomInt test（helper関数）
let dice = randomInt(1, 6);
console.log("dice no: ", dice); // 1-6

// 初期化
const init = () => {
    console.log("init()");

    console.log(image1);
    console.log(container);// container2

    // 自機ヴァイパーを作成する
    console.log(image1.width, image1.height);//120,240

    let startX = WIDTH / 2; // + (image1.width / 2) * 0.5;; // 自機のoffset分はクラス側で考慮
    let startY = HEIGHT - (image1.height / 2) * 0.5; // 画面下に配置
    viper = new Viper(container, startX, startY, image1.width, image1.height, 0, image1, 0.5, 0);
    viper.draw(); // ok

    // viper.setComing();

    viper.update();

    // 弾関連
    // ショットを生成する
    for (let i = 0; i < SHOT_MAX_COUNT; i++) {
        shotArray[i] = new Shot(container, 0, 0, 81, 61, 0, image_shot[i], 0.5, 0);
    }

    // ショットを自機キャラクターに設定する
    viper.setShotArray(shotArray);

    // （キー）イベントを設定する
    eventSetting();

    // loading end flag
    loadingEnd = true;

}

let startTime = null;

// view todays date
// let today = displayDateText(app);

// 移動関連
window.isKeyDown = {};

function eventSetting() {

    console.log("eventSetting()");

    window.addEventListener("keydown", (event) => {
        console.log("keydown");
        isKeyDown[`key_${event.key}`] = true;
    }, false);

    window.addEventListener("keyup", (event) => {
        console.log("keyup");
        isKeyDown[`key_${event.key}`] = false;
    }, false);

}

// 以下自機クラスに移動
// let mv = 10;
// window.addEventListener("keydown", (event) => {
// 本だとここで登場（シーン）時はreturn
//     switch (event.key) {
//         case "ArrowLeft":
//             image1.x -= mv;
//             break;
//         case "ArrowRight":
//             image1.x += mv;
//             break;
//         case "ArrowUp":
//             image1.y -= mv;
//             break;
//         case "ArrowDown":
//             image1.y += mv;
//             break;
//         default:
//             console.log("カーソルキー以外を押した");
//             break
//     }
// });

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

        // ref err?
        // viper.update();
        // viper.update();

        // console.log("viper:", viper);
        // viper.setComing();
        viper.update();

        // ショットの状態を更新する
        shotArray.map((v) => {
            v.update();
        });

    }

});
