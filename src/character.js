import * as PIXI from "pixi.js";

// キャラクターオブジェクト
export const Character = {
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

// 基本キャラクタークラス
class Position {

    constructor(x, y) {

        this.x = x;
        this.y = y;
    }

    /**
     * 値を設定する
     */
    set(x, y) {

    
    }

}