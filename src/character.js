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
     * @param { number } y 
     * @param { number } life 生存秒数
     * @param {PIXI.Sprite} sprite 
     * @param {number} scale 縮尺
     */
    constructor(container, x, y, life, sprite, scale, rotate) {

        this.container = container; // 表示用コンテナ
        this.position = new Position(x, y); // x, y座標
        this.life = life; // 生存期間
        this.sprite = sprite; // 表示用スプライト
        this.scale = scale; // 縮尺
        this.rotate = rotate;
        // this.x = x;

        //this.container.addChild(sprite); // 画面に追加

    }

    /**
     * キャラクターを画面に配置する
     */
    draw() {
        // console.log("★draw()");
        this.container.addChild(this.sprite);
        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;
        this.sprite.scale.set(this.scale);
        this.sprite.rotation = this.rotate;

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
     * @param { PIXI.Sprite} sprite 
     * @param {number} scale 縮尺
     */
    constructor(container, x, y, life, sprite, scale, rotate) {

        // 親クラスを呼び出す事で初期化する
        super(container, x, y, life, sprite, scale, rotate);

        // 元ではViperが登場演出中かどうかのフラグ
        // this.isComing = false;

        // 登場演出の開始時のタイムスタンプをリセット
        // this.comingStart = null;

        // 登場演出完了のポジションをリセット
        // this.comingEndPosition = null;

        // 求めた Y 座標を自機に設定する
        // viper.position.set(viper.position.x, y);
    }

    /**
     * 登場演出を行う（略）
     */
    setComing() {
        //
    }
}
