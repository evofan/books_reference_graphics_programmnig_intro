import * as PIXI from "pixi.js";

// キャラクターオブジェクト
export const CharacterTemp = {
    a: 1,
    b: "かきくけこ"
}

// 敵クラス
export class EnemyTemp {
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

        this.angle = 270 * Math.PI / 180;

        this.position = new Position(x, y);
        /**
         * @type {Position}
         */
        this.vector = new Position(0.0, -1.0);

        //this.container.addChild(sprite); // 画面に追加 -> drawで

    }

    /**
     * 進行方向を角度を元に設定する
     * @param { number } angle - 回転（ラジアン）
     */
    setVectorFromAngle(angle) {

        // 自身の回転量を元に設定する
        this.angle = angle;

        // ラジアンからサインとコサインを求める
        let sin = Math.sin(angle);
        let cos = Math.cos(angle);

        // 自身のvectorプロパティを設定する
        this.vector.set(cos, sin);

    }

    // 方向を設定する → characterクラスのsetVectorFromAngle()に移行
    setVector(x, y) {
        this.vector.set(x, y);
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

        // 画面に追加（配置）する
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
        // 斜め弾
        this.shotArray_single = null;

        // Shot一定間隔で発射するための管理値
        this.shotCheckCounter = 0;
        this.shotInterval = 10;

    }

    /**
     * 登場演出を行う（略）
     */
    setComing() {
        console.log("setComing()");
        // 登場処理
    }

    /**
     * ショットを設定する（外部から呼ばれる）
     * @param {*} shotArray 
     */
    setShotArray(shotArray, shotArray_single) {
        // 自機の弾配列に引数で貰った値を割り当てる
        this.shotArray = shotArray;
        // 斜め弾
        this.shotArray_single = shotArray_single;
    }

    /**
     * キャラクターを更新する
     */
    update() {

        // console.log("update()");

        // ★TODO: タッチ対応

        // カーソルキー入力に応じた移動処理
        // ←
        if (window.isKeyDown.key_ArrowLeft === true) {
            this.position.x -= this.speed;
        }
        // →
        if (window.isKeyDown.key_ArrowRight === true) {
            this.position.x += this.speed;

        }
        // ↑
        if (window.isKeyDown.key_ArrowUp === true) {
            this.position.y -= this.speed;
        }
        // ↓
        if (window.isKeyDown.key_ArrowDown === true) {
            this.position.y += this.speed;
        }

        // 移動後の位置が画面外へ出ていないか確認して修正する
        /// let canvasWidth = WIDTH; // WIDTH is not defined
        // let canvasHeight = HEIGHT;
        // let canvasWidth = this.container.width;
        // console.log(this.container.width)

        // TODO: do not use hardcode（コンテナのサイズが小さくなってるのでそれを直す）
        let tx = Math.min(Math.max(this.position.x, 0), 640 /*this.container.width*/);
        let ty = Math.min(Math.max(this.position.y, 0), 480 /*this.container.height*/);
        this.position.set(tx, ty);


        // キーの押下を調べてショットを生成する
        if (window.isKeyDown.key_z === true) {

            // カウンターが0未満の間は弾を発射しない
            if (this.shotCheckCounter >= 0) {

                // 通常弾
                for (let i = 0; i < this.shotArray.length; i++) {

                    // 非生存であれば生成する
                    if (this.shotArray[i].life <= 0) {

                        // 自機キャラと同じバ場所にショットを生成する
                        this.shotArray[i].set(this.position.x, this.position.y);

                        // -10を設定（時間貯める用）
                        this.shotCheckCounter = -this.shotInterval;

                        // 抜ける
                        break;
                    }

                }

                // 斜め弾
                for (let i = 0; i < this.shotArray_single.length; i += 2) {

                    // 非生存であれば生成する
                    if (this.shotArray_single[i].life <= 0 && this.shotArray_single[i + 1].life <= 0) {

                        // 自機キャラと同じバ場所にショットを生成する
                        // this.shotArray_single[i].set(this.position.x, this.position.y);
                        // this.shotArray_single[i].setVector(0.2, -0.9); // やや右に向かう
                        // this.shotArray_single[i + 1].set(this.position.x, this.position.y);
                        // this.shotArray_single[i + 1].setVector(-0.2, -0.9); // やや左に向かう

                        // 真上の方向から左右10度ずつ開いたラジアン
                        let radCW = 280 * Math.PI / 180; // 時計回りに10°
                        let radCCW = 260 * Math.PI / 180; // 半時計周りに10°

                        // 自機キャラと同じバ場所にショットを生成する
                        this.shotArray_single[i].set(this.position.x, this.position.y);
                        this.shotArray_single[i].setVectorFromAngle(radCW); // やや右に向かう
                        this.shotArray_single[i + 1].set(this.position.x, this.position.y);
                        this.shotArray_single[i + 1].setVectorFromAngle(radCCW); // やや左に向かう

                        // -10を設定（時間貯める用）
                        this.shotCheckCounter = -this.shotInterval;

                        // 抜ける
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
 * 敵キャラクタークラス
 */
export class Enemy extends Character {

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

        this.speed = 3;

    }

    /**
    * 敵を配置する
    * @param {number} x 
    * @param {number} y
    * @param {number} life [=1] 
    */
    set(x, y, life = 1) {

        // 配置時に移動
        this.position.set(x, y);

        // lifeを1以上に設定
        this.life = life;

    }

    /**
    * キャラクターを更新する
    */
    update() {

        if (this.life <= 0) {
            console.log("抜け");
            return false;
        }

        // もし敵キャラクターが画面外（画面下）に移動していたらライフを0（非生存）の状態にする
        if (this.position.y - this.height > 480/* this.container.height */) {
            console.log("画面外に出たので非生存に");
            this.life = 0;
        }

        // 進行方向に移動する
        this.vector.y = 1; // 下方向
        
        this.position.x += this.vector.x * this.speed;
        this.position.y += this.vector.y * this.speed;

        // 敵キャラクターを描画する
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

        // 弾の方向（x+-, y+-）
        this.vector = new Position(0.0, -1.0); // -1は上方向

    }

    // ショットを配置する
    set(x, y) {
        this.position.set(x + this.w / 2 * this.scale, y + this.h / 2 * this.scale);

        // 生存期間を設定
        this.life = 1;
    }

    // 方向を設定する → characterクラスのsetVectorFromAngle()に移行
    // setVector(x, y) {
    //     this.vector.set(x, y);
    // }

    // 描画を更新する
    update() {

        // lifeが0以下なら抜け
        if (this.life <= 0) {
            return false;
        }

        // 弾が画面上外ならlifeを0にする（消去）
        if (this.position.y + this.height < 0) {
            this.life = 0;
        }

        // 弾を上に移動する
        // this.position.y -= this.speed;
        // ↓進行方向の概念を追加
        this.position.x += this.vector.x * this.speed;
        this.position.y += this.vector.y * this.speed;

        // 描画する
        this.draw();
    }


}
