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

    /**
     * 2点間（自分自身とtarget）の距離を計測する
     * @param { Position } target - 距離を測る対象 
     * @returns { number }
     */
    distance(target) {
        let x = this.x - target.x;
        let y = this.y - target.y;

        return Math.sqrt(x * x + y * y);

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

        // if (this.life <= 0) {
        //     this.container.removeChild(this.sprite);
        //     return false;
        // }

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

        // 自分の弾はこれで消える
        if (this.life <= 0) {
            this.sprite.y += 1000;
        }

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
    constructor(container, x, y, w, h, life, sprite, scale, rotate, myExplosion) {

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

        this.life = 1;

        this.myExplosion = myExplosion;
        console.log("this.myExplosion:", this.myExplosion); // 

        this.myExplosion.position.x = 400;
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
    * 爆発処理（orgと違ってViperキャラクラス内で行う）
    * @param {} x 
    * @param {*} y 
    */
    setExplostion(x, y) {
        // console.log("自分爆発表示！", x, y);

        // this.myExplosion.life = 1;
        // this.myExplosion.sprite.alpha = 1;

        // this.myExplosion.position.x = x + 30;
        // this.myExplosion.position.y = y + 30;


        // this.myExplosion.position.x = 300;
        // this.myExplosion.position.y = 300;

        //     console.log("自分爆発表示！", x, y);


        //     const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));//timeはミリ秒

        //     async function eraseExplosion(e) {
        //         console.log("e:", e);
        //         await sleep(200);
        //         // e.sprite.alpha = 0;

        //         console.log("e2:", e);
        //     }
        //     eraseExplosion(this.myExplosion);

        //     console.log("自分爆発表示終了！", x, y);
        // }
    }

    /**
     * キャラクターを更新する
     */
    update() {

        if(this.life<=0){
            return false;
        }

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

                        // 中央のショットは攻撃力を 2 にする
                        this.shotArray[i].setPower(2);

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
    constructor(container, x, y, w, h, life, sprite, scale, rotate, enemyExplosion) {

        // 親クラスを呼び出す事で初期化する
        super(container, x, y, w, h, life, sprite, scale, rotate);

        this.speed = 3;

        // 敵のタイプ
        this.type = "default";

        // 自身が出現してからのフレーム数、間隔調整用
        this.frame = 0;

        // 自身が持つショットインスタンスの配列
        this.shotArray = null;

        this.scale = scale;

        this.container = container;
        this.sprite = sprite;

        this.enemyExplosion = enemyExplosion;

    }

    /**
    * 敵を配置する
    * @param {number} x 
    * @param {number} y
    * @param {number} life [=1] 
    * @param {string} type = ["default"]
    */
    set(x, y, life = 0, type = "default") {

        // 配置時に移動
        this.position.set(x, y);

        // lifeを1以上に設定
        this.life = life;

        // typeを設定
        this.type = type;

        // 敵キャラクターのフレームをリセットする
        this.frame = 0;

    }

    /**
    * ショットを設定する
    * @param {Array<Shot>} shotArray - 自身に設定するショットの配列
    */
    setShotArray(shotArray) {
        // 自身のプロパティに設定する
        this.shotArray = shotArray;
    }

    /**
     * 爆発処理（orgと違って敵キャラクラス内で行う）
     * @param {} x 
     * @param {*} y 
     */
    setExplostion(x, y) {
        console.log("爆発表示！", x, y);

        this.enemyExplosion.life = 1;
        this.enemyExplosion.sprite.alpha = 1;

        this.enemyExplosion.position.x = x + 30;
        this.enemyExplosion.position.y = y + 30;

        const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));//timeはミリ秒

        async function eraseExplosion(e) {
            console.log("e:", e);
            await sleep(200);
            e.sprite.alpha = 0;

            console.log("e2:", e);
        }
        eraseExplosion(this.enemyExplosion);

        console.log("爆発表示終了！", x, y);
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
        // if (this.position.y - this.height > 480/* this.container.height */) {
        //     console.log("画面外に出たので非生存に");
        //     this.life = 0;
        // }

        // 進行方向に移動する
        // this.vector.y = 1; // 下方向

        // this.position.x += this.vector.x * this.speed;
        // this.position.y += this.vector.y * this.speed;

        // ■タイプ別院対応
        switch (this.type) {

            case "default":
            // breakしてないので毎回今はdefaultになる
            default:

                // 配置後のフレームが50に達したら弾を撃つ
                if (this.frame === 50) {
                    this.fire();
                }

                // 進行方向にいどうする
                this.position.x += this.vector.x * this.speed;
                this.position.y += this.vector.y * this.speed;

                if (this.position.y - this.height > 480/* this.container.height */) {
                    console.log("画面外に出たので非生存に");
                    this.life = 0;
                }

                break;

        }

        // 敵キャラクターを描画する
        this.draw();

        // 自分自身のフレームをインクリメントする
        this.frame++;

    }

    /**
     * 
     * @param {*} x 
     * @param {*} y 
     */
    fire(x = 0.0, y = 1.0) {

        for (let i = 0; i < this.shotArray.length; i++) {

            if (this.shotArray[i].life <= 0) {

                this.shotArray[i].set(this.position.x - 51 / 2 + 7, this.position.y); // Shotクラスで対応してる筈？

                this.shotArray[i].setSpeed(5.0);

                this.shotArray[i].setVector(x, y);

                break;
            }
        }

    }

}


/**
 * ショット（プレイヤーの弾）クラス
 */
export class Shot extends Character {

    constructor(container, x, y, w, h, life, sprite, scale, rotate) {

        // 親クラスのコンストラクターを呼び出し
        super(container, x, y, w, h, life, sprite, scale, rotate);

        this.container = container;
        this.sprite = sprite;

        // 弾の速さ
        this.speed = 7;

        this.w = w;

        this.h = h;

        // this.scale.set(scale, scale);

        // 弾の方向（x+-, y+-）
        this.vector = new Position(0.0, -1.0); // -1は上方向

        // ■ 衝突判定用

        // 攻撃力
        this.power = 1;

        // 衝突判定を行う対象のオブジェクトを保持する配列
        // @type = Array<character>
        this.targetArray = [];

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

        // ショットと対象との衝突判定を行う
        this.targetArray.map((v) => {

            // 自信か対象のライフが0の場合は飛ばす
            if (this.life <= 0 || v.life <= 0) {
                return false;
            }

            // ★自身との対象との距離を測る
            let dist = this.position.distance(v.position);

            // 自身と対象との距離が1/4までになったら衝突とみなす
            if (dist <= (this.width + v.width) / 4) {

                if (v instanceof Viper) {
                    // 登場演出時あれば無効にする（今回は略）
                }

                console.log("■ 衝突！");
                console.log("v", v);
                // v.width = 100;
                // v.alpha = 0.5;
                // v.sprite.alpha = 0.5;

                // 対象のライフから攻撃力分を減らす
                v.life -= this.power;
                // if(v.life<=0){
                //     v.position.y = 1000;
                // }
                // v.alpha = 0;

                v.setExplostion(v.sprite.x, v.sprite.y);

                // 自分をライフを0にする（消滅する）
                this.life = 0;
                // this.sprite.y = 1000;
                // this.alpha = 0;

                // this.container.removeChild(this.sprite);

                v.sprite.y = 1000; // 敵はこれで消える

            }

        });

        // 描画する
        this.draw();
    }

    setSpeed(speed) {

        if (speed != null && speed > 0) {
            this.speed = speed;
        }

    }

    /**
     * ショットの攻撃力を設定する
     * @param { number } power - 攻撃力
     */
    setPower(power) {

        if (power != null && power > 0) {
            this.power = power;
        }
    }

    /**
     * ショットの衝突判定の対象を設定する
     */
    setTargets(targets) {
        // 配列であるか判定
        if (targets != null && Array.isArray(targets) === true && targets.length > 0) {
            this.targetArray = targets;
        }
    }

    /**
 * ショットが爆発エフェクトを発生できるよう設定する
 * @param {Array<Explosion>} [targets] - 爆発エフェクトを含む配列
 */

    // setExplosions(targets) {
    // 引数の状態を確認して有効な場合は設定する
    //     if (targets != null && Array.isArray(targets) === true && targets.length > 0) {
    //         this.explosionArray = targets;
    //     }
    // }


}



/**
 * 敵爆発エフェクトクラス
 */
export class Explosion extends Character {

    constructor(container, x, y, w, h, life, sprite, scale, rotate) {

        // 親クラスのコンストラクターを呼び出し
        super(container, x, y, w, h, life, sprite, scale, rotate);

        this.container = container;
        this.sprite = sprite;

        this.w = w;
        this.h = h;

    }

    // 描画を更新する
    update() {

        // lifeが0以下なら抜け
        if (this.life <= 0) {
            return false;
        }

        // 描画する
        this.draw();

    }

}
