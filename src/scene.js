
/**
 * シーンを管理するためのクラス
 */
export class SceneManager {

    constructor() {

        // シーン格納用
        this.scene = {};

        // 現在アクティブなシーン
        this.activeScene = null;

        // 現在のシーンの開始時
        this.startTime = null;

        // 現在のシーンの経過フレーム
        this.frame = null;

    }

    /**
     * シーンを追加する
     * @param { string } name
     * @param { function } updateFunction
     */
    add(name, updateFunction) {
        this.scene[name] = updateFunction;
        console.log("add()", this.scene[name]);
    }

    /**
     * アクティブなシーンを設定する
     * @param {string} name active scene
     * @returns 
     */
    use(name) {

        // 指定されたシーンがあるか確認する
        if (this.scene.hasOwnProperty(name) !== true) {
            // 無ければ抜ける
            return;
        }

        // 名前を元にアクティブなシーンを設定する
        this.activeScene = this.scene[name];

        // シーンをアクティブにした瞬間のタイムスタンプを設定する
        this.startTime = Date.now();

        // シーンをアクティブにしたのでカウンターをリセットする
        this.frame = -1;

    }

    /**
     * シーンを更新する
     */
    update() {

        // シーンがアクティブになってからの経過時間
        let activeTime = (Date.now() - this.startTime) / 1000;

        // 経過時間を引数に与えてupdateFunction()を呼び出す
        this.activeScene(activeTime);

        // シーンを更新したのでインクリメントする
        this.frame++;
    }



}