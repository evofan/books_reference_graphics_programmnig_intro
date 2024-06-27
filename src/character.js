import * as PIXI from "pixi.js";

// キャラクターオブジェクト
export const CharacterTemp = {
    a: 1,
    b: "かきくけこ"
}

// stage settings
// export const STAGES = {
//     WIDTH: 480,
//     HEIGHT: 320,
//     BG_COLOR: 0x000000,
// };

// 敵クラス
export class Enemy {
    aa = "敵名前1";

    attack() {
        console.log("攻撃した！");
    }
}

// xy座標を持たせる（管理する）クラス
export class Position {

    /**
     * @constructor
     * @param {number} x x座標
     * @param {number} y y座標
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * 値を設定する
     * @param {number} x
     * @param {number} y
     */
    set(x, y) {
        // != でnullとundefinedを複数判別
        if (x != null) {
            this.x = x;
        }
        if (y != null) {
            this.y = y;
        }

    }

}

/**
 * キャラクター管理用クラス
 */
export class Character {

    /**
     * @constructor
     * @param { PIXI.DisplayObject } container 
     * @param { number } x 
     * @param { number } x 
     * @param { number } w 
     * @param { number } h
     * @param { number } life 生存秒数
     * @param {PIXI.Sprite} sprite 
     * @param {number} scale 縮尺
     */
    constructor(container, x, y, w, h, life, sprite, scale = 1, rotate) {

        this.container = container; // 表示用コンテナ
        this.position = new Position(x, y); // x, y座標
        // this.x = x;
        // this.y = y;
        this.width = w;
        this.height = h;
        this.life = life; // 生存期間
        this.sprite = sprite; // 表示用スプライト
        this.scale = scale; // 縮尺
        console.log(this.scale);
        this.rotate = rotate;


        //this.container.addChild(sprite); // 画面に追加

    }

    /**
     * キャラクターを画面に配置する
     */
    draw() {

        let offsetX = this.width / 2 * this.scale; // 縮尺も考慮
        let offsetY = this.height / 2 * this.scale;
        // console.log(offsetX, offsetY);//60,120 → 30,60

        // must、soriteの座標をpositionのx,yに合わせる
        this.sprite.x = this.position.x - offsetX;
        this.sprite.y = this.position.y - offsetY;

        // 
        this.container.addChild(this.sprite);

        this.sprite.scale.set(this.scale);
        this.sprite.rotation = this.rotate;

        // console.log(this.sprite.x, this.sprite.y); // 0,0
        // console.log(this.position.x, this.position.y);//-120,100…呼び出し時の引数

        // this.sprite.x = this.position.x - offsetX;
        // this.sprite.y = this.position.y - offsetY;

    }


}


/**
 * Viper（自機）クラス
 */
export class Viper extends Character {

    /**
     * @constructor
     * @param { PIXI.DisplayObject } container 
     * @param { number } x 
     * @param { number } y 
     * @param { number } w 
     * @param { number } h
     * @param { PIXI.Sprite} sprite 
     * @param {number} scale 縮尺
     */
    constructor(container, x, y, w, h, life, sprite, scale, rotate) {

        // 親クラスを呼び出す事で初期化する
        super(container, x, y, w, h, life, sprite, scale, rotate);

        // 元ではViperが登場演出中かどうかのフラグ
        // this.isComing = false;

        // 登場演出の開始時のタイムスタンプをリセット
        // this.comingStart = null;

        // 登場演出完了のポジションをリセット
        // this.comingEndPosition = null;

        // 求めた Y 座標を自機に設定する
        // viper.position.set(viper.position.x, y);

        this.speed = 3;

        // 自機の弾管理用
        // @type{Array<shot>}
        this.shotArray = null;

        this.shotCheckCounter = 0;

        this.shotInterval = 10;

    }

    /**
     * 登場演出を行う（略）
     */
    setComing() {
        console.log("setComing()");
    }

    /**
     * ショットを設定する（外部から呼ばれる）
     * @param {*} shotArray 
     */
    setShotArray(shotArray) {
        this.shotArray = shotArray;
    }


    update() {

        // console.log("update()");

        // ★TODO: タッチ対応

        if (window.isKeyDown.key_ArrowLeft === true) {
            this.position.x -= this.speed;
        }

        if (window.isKeyDown.key_ArrowRight === true) {
            this.position.x += this.speed;

        }

        if (window.isKeyDown.key_ArrowUp === true) {
            this.position.y -= this.speed;

        }

        if (window.isKeyDown.key_ArrowDown === true) {
            this.position.y += this.speed;

        }

        // 移動後の位置が画面外へ出ていないか確認して修正する
        /// let canvasWidth = WIDTH; // WIDTH is not defined
        // let canvasHeight = HEIGHT;
        // let canvasWidth = this.container.width;
        // console.log(this.container.width)

        // TODO: not hardcode（コンテナのサイズが小さくなってるのでそれを直す）
        let tx = Math.min(Math.max(this.position.x, 0), 640/*this.container.width*/);
        let ty = Math.min(Math.max(this.position.y, 0), 480/*this.container.height*/);
        this.position.set(tx, ty);


        // キーの押下を調べてショットを生成する
        if (window.isKeyDown.key_z === true) {

            if (this.shotCheckCounter >= 0) {

                for (let i = 0; i < this.shotArray.length; i++) {

                    // 非生存であれば生成する
                    if (this.shotArray[i].life <= 0) {

                        // 自機キャラと同じバ場所にショットを生成する
                        this.shotArray[i].set(this.position.x, this.position.y);

                        this.shotCheckCounter = -this.shotInterval;

                        break;
                    }

                }
            }
        }

        this.shotCheckCounter++;




        // 自機キャラクターを描画する
        this.draw();

    }
}

/**
 * ショット（プレイヤーの弾）クラス
 */
export class Shot extends Character {

    constructor(container, x, y, w, h, life, sprite, scale, rotate) {

        // 親クラスのコンストラクターを呼び出し
        super(container, x, y, w, h, life, sprite, scale, rotate);

        // 弾の速さ
        this.speed = 7;

        this.w = w;

        this.h = h;


        // this.scale.set(scale, scale);

    }

    // ショットを配置する
    set(x, y) {
        this.position.set(x + this.w / 2, y + this.h / 2);

        // 生存期間を設定
        this.life = 1;
    }

    // 描画を更新する
    update() {

        // lifeが0以下なら抜け
        if (this.life <= 0) {
            return;
        }

        // 弾が画面上外ならlifeを0にする（消去）
        if (this.position.y + this.height < 0) {
            this.life = 0;
        }

        // 弾を上に移動する
        this.position.y -= this.speed;

        // 描画する
        this.draw();
    }


}
