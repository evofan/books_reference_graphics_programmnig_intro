console.log("pixijs7 1st test!");

import * as PIXI from "pixi.js";
import { Assets, Sprite } from 'pixi.js';

import { randomInt } from "./helper/randomInt";

import { STAGES } from "./constants";
import { displayDateText } from "./helper/text";

import { Character, EnemyTemp, Viper, CharacterTemp, Shot, Enemy, Explosion } from "./character.js";

import { SceneManager } from "./scene.js";

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



let temp3 = `Game Over`;
let text3 = new PIXI.Text(temp3, {
    fontSize: 30,
    fill: 0xfefefe,
    lineJoin: "round"
});
container.addChild(text3);
text3.anchor.set(0.5);
text3.x = WIDTH / 2; // - text3.width; アンカーを0.5にしたので自分の幅を引かなくてOK
text3.y = HEIGHT / 2; // - text3.height;
text3.alpha = 0.0;

// ゲームスコア
window.gameScore = 0;
let temp4;
let text4;
function addScore() {

    if (text4 != undefined) {
        container.removeChild(text4);
    }

    temp4 = `Score ${gameScore}`;
    text4 = new PIXI.Text(temp4, {
        fontSize: 30,
        fill: 0xfefefe,
        lineJoin: "round"
    });

    container.addChild(text4);
    text4.anchor.set(0.5);
    text4.x = WIDTH - text4.width;
    text4.y = text4.height;
    text4.alpha = 1.0;

}
addScore();



let texture1;
let image1;
let image2;
let image_shot = [];
let image_shot_single = [];
let image_shot_single_left = [];
let image_enemy = [];

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

// 敵キャラクターの最大４数
const ENEMY_MAX_COUNT = 1;

// 敵キャラクターの弾の最大数
const ENEMY_SHOT_MAX_COUNT = 10;

// 敵キャラクターのインスタンスを格納する配列
let enemyArray = [];

// ショットのインスタンスを格納する配列
let shotArray = [];
// ショット（シングル＝斜め用）のインスタンスを格納する配列
let shotArray_single = [];

// 敵弾スプライト
let enemy_shot = [];

// 自分爆発
const MY_EXPLOSION_MAX_COUNT = 3;
let my_explosion = [];
let myExplosionArray = [];

// ショット（敵）のインスタンスを格納する配列
let enemyShotArray = [];

// 敵爆発エフェクトの数
const ENEMY_EXPLOSION_MAX_COUNT = 3;
// 敵爆発エフェクトスプライト
let enemy_explosion = [];
// 敵爆発エフェクト格納用
let enemyExplosionArray = [];


/**
 * 爆発エフェクトの最大個数
 * @type {number}
 */
// const EXPLOSION_MAX_COUNT = 10;

/**
 * 爆発エフェクトのインスタンスを格納する配列
 * @type {Array<Explosion>}
 */
// let explosionArray = [];


// シーンマネージャー
let scene = null;

// リスタートフラグ
let restart = false;




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
    for (let i = 0; i < ENEMY_MAX_COUNT; i++) {
        image_enemy[i] = Sprite.from(texture2);
        console.log(texture2);
        console.log(image_enemy[i]);
        image_enemy[i].anchor.set(0.5);
        image_enemy[i].x = WIDTH / 2;
        image_enemy[i].y = HEIGHT / 2 - 30;
        // image_shot_single[i].rotation = 2;
        // container.addChild(image_shot_single[i]);
        // image_shot[i].scale.set(0.5, 0.5); // Shotインスタンス作成側で（オフセット計算にも使うので）

    }
    // image2 = Sprite.from(texture2);
    // console.log(texture2);
    // console.log(image2);
    // image2.anchor.set(0.5);
    // image2.x = WIDTH / 2;
    // image2.y = HEIGHT / 2 - 90;
    // image2.scale.set(0.5, 0.5);
    // image2.rotation = 2;
    // container.addChild(image2);

    // 自分弾
    const texture3 = await Assets.load('assets/images/pic_tama_81x61_02.png');
    for (let i = 0; i < SHOT_MAX_COUNT; i++) {
        image_shot[i] = Sprite.from(texture3);
        console.log(texture3);
        console.log(image_shot[i]);
        image_shot[i].anchor.set(0.5);
        image_shot[i].x = WIDTH / 2;
        image_shot[i].y = HEIGHT / 2 - 30;
        // container.addChild(image_shot[i]); // 確認用
        // image_shot[i].scale.set(0.5, 0.5); // Shotインスタンス作成側で（オフセット計算にも使うので）
    }

    // 自分弾（シングルショット＝斜め発射用）右用
    const texture4 = await Assets.load('assets/images/pic_tama_81x61_02_single.png');
    for (let i = 0; i < SHOT_MAX_COUNT; i++) {
        image_shot_single[i] = Sprite.from(texture4);
        console.log(texture4);
        console.log(image_shot_single[i]);
        image_shot_single[i].anchor.set(0.5);
        image_shot_single[i].x = WIDTH / 2;
        image_shot_single[i].y = HEIGHT / 2 - 30;
        // image_shot_single[i].rotation = 2;
        // container.addChild(image_shot_single[i]);
        // image_shot[i].scale.set(0.5, 0.5); // Shotインスタンス作成側で（オフセット計算にも使うので）

    }

    // 自分弾（シングルショット＝斜め発射用）左用
    const texture5 = await Assets.load('assets/images/pic_tama_81x61_02_single.png');
    for (let i = 0; i < SHOT_MAX_COUNT; i++) {
        image_shot_single_left[i] = Sprite.from(texture5);
        console.log(texture5);
        console.log(image_shot_single_left[i]);
        image_shot_single_left[i].anchor.set(0.5);
        image_shot_single_left[i].x = WIDTH / 2;
        image_shot_single_left[i].y = HEIGHT / 2 - 30;
        // image_shot_single[i].rotation = 2;
        // container.addChild(image_shot_single[i]);
        // image_shot[i].scale.set(0.5, 0.5); // Shotインスタンス作成側で（オフセット計算にも使うので）

    }

    // 敵弾
    const texture6 = await Assets.load('assets/images/pic_enemy_tama_51_61.png');
    for (let i = 0; i < ENEMY_SHOT_MAX_COUNT; i++) {
        enemy_shot[i] = Sprite.from(texture6);
        console.log(texture6);
        console.log(enemy_shot[i]);
        enemy_shot[i].anchor.set(0.5);
        // enemy_shot[i].x = WIDTH / 2;
        // enemy_shot[i].y = HEIGHT / 2 - 30;
        // container.addChild(image_shot[i]); // 確認用
        // image_shot[i].scale.set(0.5, 0.5); // Shotインスタンス作成側で（オフセット計算にも使うので）
    }

    // 敵爆発エフェクト
    const texture7 = await Assets.load('assets/images/25341713_60x61.png');
    for (let i = 0; i < ENEMY_EXPLOSION_MAX_COUNT; i++) {
        enemy_explosion[i] = Sprite.from(texture7);
        console.log(texture7);
        console.log(enemy_explosion[i]);
        enemy_explosion[i].anchor.set(0.5);
        // enemy_shot[i].x = WIDTH / 2;
        // enemy_shot[i].y = HEIGHT / 2 - 30;
        // container.addChild(image_shot[i]); // 確認用
        // image_shot[i].scale.set(0.5, 0.5); // Shotインスタンス作成側で（オフセット計算にも使うので）
    }

    // 自分爆発エフェクト
    const texture8 = await Assets.load('assets/images/25341713_02_80x83.png');
    for (let i = 0; i < MY_EXPLOSION_MAX_COUNT; i++) {
        my_explosion[i] = Sprite.from(texture8);
        console.log(texture8);
        console.log(my_explosion[i]);
        my_explosion[i].anchor.set(0.5);
        // enemy_shot[i].x = WIDTH / 2;
        // enemy_shot[i].y = HEIGHT / 2 - 30;
        container.addChild(my_explosion[0]); // 確認用
        my_explosion[0].x = -1000;
        my_explosion[0].y = -1000;
        // image_shot[i].scale.set(0.5, 0.5); // Shotインスタンス作成側で（オフセット計算にも使うので）
    }

    init(); // next actions
}

// 画像読み込み
LoadImg();

// RandomInt test（helper関数）
let dice = randomInt(1, 6);
console.log("dice no: ", dice); // 1-6

let startX;
let startY;

// 初期化
const init = () => {
    console.log("init()");

    console.log(image1);
    console.log(container);// container2

    // 自分爆発エフェクトを生成する
    for (let i = 0; i < MY_EXPLOSION_MAX_COUNT; i++) {
        console.log("★i:", i);
        myExplosionArray[i] = new Explosion(container, 200, 200, 80, 83, 1, my_explosion[i], 1, 0);
        console.log(myExplosionArray[0]);

        // for (let i = 0; i < ENEMY_EXPLOSION_MAX_COUNT; i++) {
        //     enemyExplosionArray[i] = new Explosion(container, 200, 200, 60, 61, 0, enemy_explosion[i], 1, 0);
        // life = 0で無いとこのタイミングで表示までされてしまうので注意

        // }
        // life = 0で無いとこのタイミングで表示までされてしまうので注意

    }

    // 自機ヴァイパーを作成する
    console.log(image1.width, image1.height);//120,240

    startX = WIDTH / 2; // + (image1.width / 2) * 0.5;; // 自機のoffset分はクラス側で考慮
    startY = HEIGHT - (image1.height / 2) * 0.5; // 画面下に配置
    viper = new Viper(container, startX, startY, image1.width, image1.height, 1, image1, 0.5, 0, myExplosionArray[0]); // 敵爆発を応用
    viper.draw(); // ok

    // viper.setComing();

    viper.update();

    // 弾関連
    // ショットを生成する
    for (let i = 0; i < SHOT_MAX_COUNT; i++) {
        shotArray[i] = new Shot(container, 0, 0, 81, 61, 0, image_shot[i], 0.5, 0);
        // シングルショット（斜め用）
        shotArray_single[i * 2] = new Shot(container, 0, 0, 81, 61, 0, image_shot_single[i], 0.5, 0);
        shotArray_single[i * 2 + 1] = new Shot(container, 0, 0, 81, 61, 0, image_shot_single_left[i], 0.5, 0); // 生成でなくスプライトでやってるので別配列で
    }

    // ショットを自機キャラクターに設定する
    // viper.setShotArray(shotArray);
    viper.setShotArray(shotArray, shotArray_single); // 斜め用の弾を追加

    // （キー）イベントを設定する
    eventSetting();

    // シーンを初期化する
    scene = new SceneManager();

    // シーンを定義する
    sceneSetting();


    // 敵キャラクターのショットを初期化する
    for (let i = 0; i < ENEMY_SHOT_MAX_COUNT; i++) {
        enemyShotArray[i] = new Shot(container, 0, 0, 51, 61, 0, enemy_shot[i], 0.5, 0);
        // 018で追加
        enemyShotArray[i].setTargets([viper]); // 引数は配列なので注意

        // enemyShotArray[i].setExplosions(explosionArray);

    }

    // 敵爆発エフェクトを生成する
    for (let i = 0; i < ENEMY_EXPLOSION_MAX_COUNT; i++) {
        enemyExplosionArray[i] = new Explosion(container, 200, 200, 60, 61, 0, enemy_explosion[i], 1, 0);
        // life = 0で無いとこのタイミングで表示までされてしまうので注意
        console.log("★enes");
        console.log(enemyExplosionArray[i]);
    }

    // 敵キャラクターを作成する
    for (let i = 0; i < ENEMY_MAX_COUNT; i++) {
        enemyArray[i] = new Enemy(container, 340, 0, 69, 107, 0, image_enemy[i], 0.5, 0, enemyExplosionArray[i]);
        // life = 0で無いとこのタイミングで表示までされてしまうので注意

        // 敵キャラクターは全て同じショットを共有するのでここで与えておく
        enemyArray[i].setShotArray(enemyShotArray);
    }

    // 衝突判定を行うために対象を設定する
    for (let i = 0; i < SHOT_MAX_COUNT; ++i) {
        shotArray[i].setTargets(enemyArray);
        shotArray_single[i * 2].setTargets(enemyArray);
        shotArray_single[i * 2 + 1].setTargets(enemyArray);

        // org
        // shotArray[i].setExplosions(explosionArray);
        // shotArray_single[i * 2].setExplosions(explosionArray);
        // shotArray_single[i * 2 + 1].setExplosions(explosionArray);
    }



    // 爆発エフェクトを初期化する
    // for (let i = 0; i < EXPLOSION_MAX_COUNT; ++i) {
    //     explosionArray[i] = new Explosion(container, 50.0, 15, 30.0, 0.25);
    // }

    // loading end flag
    loadingEnd = true;

    // リスタート用処理
    window.addEventListener("keydown", (event) => {

        isKeyDown[`key_${event.key}`] = true;

        if (event.key === "Enter") {
            if (viper.life <= 0) {
                restart = true;
            }
        }

    }, false);

    window.addEventListener("keyup", (event) => {

        isKeyDown[`key_${event.key}`] = false;

    }, false);

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

/**
 * シーンを設定する
 */
function sceneSetting() {

    // イントロシーン
    scene.add("intro", (time) => {
        if (time > 2.0) {
            scene.use("invade");
        }
    });

    // invadeシーン
    scene.add("invade", (time) => {
        // シーンのフレームが0以外の時は終了
        // if (scene.frame !== 0) {
        //     return;
        // }

        if (scene.frame === 0) {
            // ライフが0のキャラクターが見つかったら配置する
            for (let i = 0; i < ENEMY_MAX_COUNT; i++) {
                if (enemyArray[i].life <= 0) {
                    let e = enemyArray[i];
                    // 出現場所
                    // e.set(640 / 2 + i * 10, -e.height, 1, "default"); // 中央
                    e.set(640 / 2 + i * 10, -e.height, 2, "default"); // 中央
                    // 進行方向は真下に向かうように設定アする
                    e.setVector(0.0, 1.0);
                    break;
                }
            }
        }

        if (scene.frame === 100) {
            scene.use("invade");
        }

        if (viper.life <= 0) {
            scene.use('gameover');
        }

        // GameOverシーン
        scene.add("gameover", (time) => {

            // temp
            // alert("GameOver");

            // Game Over表示
            text3.alpha = 1.0;

            if (restart === true) {

                restart = false;

                // 
                window.gameScore = 0;

                // Game Over表示
                text3.alpha = 0.0;

                viper.life = 1;
                viper.position.x = startX;
                viper.position.y = startY;

                // intorは略
                scene.use("intro");

            }

        });

    });

    // 最初のシーンにはintroを設定する
    scene.use("intro");

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
        let flag = 1;
        if (viper.life <= 0 && flag === 1) {

            flag = 0;

            console.log("自分爆発表示！");
            //alert("0!");
            myExplosionArray[0].sprite.x = viper.position.x;
            myExplosionArray[0].sprite.y = viper.position.y;


            const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));//timeはミリ秒

            async function eraseExplosion(e) {
                console.log("e:", e);
                await sleep(200);
                e.sprite.alpha = 0;
                // myExplosionArray[0].y = 1000;

                console.log("e2:", e);
            }
            eraseExplosion(myExplosionArray[0]);

            console.log("自分爆発表示終了！");
        }




        // ショットの状態を更新する
        shotArray.map((v) => {
            v.update();
        });

        // 斜めのショット
        shotArray_single.map((v) => {
            v.update();
        });

        // 敵の状態を更新する
        enemyArray.map((v) => {
            v.update();
        });

        // 敵キャラの状態を更新する
        enemyShotArray.map((v) => {
            v.update();
        });

        // // 爆発エフェクトの状態を更新する
        // explosionArray.map((v) => {
        //     v.update();
        // });

        // 敵爆発エフェクトの状態を更新する
        enemyExplosionArray.map((v) => {
            v.update();
        });

        // 爆発エフェクト表示
        // for (let i = 0; i < ENEMY_MAX_COUNT; i++) {
        //     if(enemyArray[i].life <=0){
        //         console.log("爆発表示！");
        //     }
        // }

        // シーンを更新する
        scene.update();

        addScore();

    }

});


// ■■■■■ p209～p217
// キャンバスを回転させて弾の向きを変えるのは省略
// 直接canvasを制御してないので(PIXI.JSのAPI使用)
// 
