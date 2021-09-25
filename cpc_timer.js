class Timer {
    /**
     * タイマー
     * @param {number} remainingTime
     * @param {*} countCallBack 0.1秒ごと呼び出される
     * @param {*} endCallback 終了時に呼び出される
     */
    constructor(remainingTime, countCallBack, endCallback) {
        this.originalRemainingTime = remainingTime;
        this.lastRemainingTime = remainingTime;
        this.countCallBack = countCallBack;
        this.endCallback = endCallback;
        this.startTime = 0;
        this.counting = false;
    }
    start() {
        if (!this.counting) {
            this.startTime = new Date().getTime();
            this.counterID = window.setInterval(() => {
                if (this.getRemainingTime() <= 0) {
                    this.stop();
                    this.lastRemainingTime = 0;
                    this.endCallback();
                }
                this.countCallBack(this.getRemainingTime());
            }, 100);
            this.counting = true;
        }
    }
    _getElapsedTime() {
        let now = new Date().getTime();
        return now - this.startTime;
    }
    stop() {
        if (this.counting) {
            this.lastRemainingTime -= this._getElapsedTime();
            window.clearInterval(this.counterID);
            this.counting = false;
        }
    }
    getRemainingTime() {
        if (this.counting) {
            return this.lastRemainingTime - this._getElapsedTime();
        } else {
            return this.lastRemainingTime;
        }
    }
    reset() {
        this.stop();
        this.lastRemainingTime = this.originalRemainingTime;
    }
}

function ms2string(ms) {
    return Math.abs(ms / 1000).toFixed(1).padStart(5, "0");
}

function updatePoint() {
    const pointEles = document.querySelectorAll(".point");
    let point = 0;
    pointEles.forEach(pointEle => {
        point += parseInt(pointEle.innerText, 10)
    })
    document.getElementById("point").innerText = point;
}

window.addEventListener("load", () => {
    const MATCH_TIME = 3 * 60 * 1000;
    const bigMsg = document.getElementById("h1-msg");
    const timeArea = document.getElementById("timer-time");

    const startButton = document.getElementById("start-button");
    const stopButton = document.getElementById("stop-button");
    const resetButton = document.getElementById("reset-button");

    timeArea.innerText = ms2string(MATCH_TIME);

    bigMsg.innerText = "試合開始前";

    const timer = new Timer(
        MATCH_TIME,
        (rt) => {
            timeArea.innerText = ms2string(rt);
        },
        () => {
            bigMsg.innerText = "試合終了";
        }
    );

    startButton.disabled = false;
    stopButton.disabled = true;

    startButton.onclick = () => {
        timer.start();
        bigMsg.innerText = "試合中";
        startButton.disabled = true;
        stopButton.disabled = false;
    };
    stopButton.onclick = () => {
        timer.stop();
        timeArea.innerText = ms2string(timer.getRemainingTime());
        startButton.disabled = false;
        stopButton.disabled = true;
    };
    resetButton.onclick = () => {
        timer.reset();
        timeArea.innerText = ms2string(timer.getRemainingTime());
        bigMsg.innerText = "試合開始前";
    };

    achivementIds = [
        "achv-bombA",
        "achv-center",
        "achv-soft",
        "achv-east",
        "achv-bombB",
        "achv-soko",
    ]

    achivementIds.forEach(id => {
        const a = document.getElementById(id);

        a.addEventListener("click", function () {
            const point = this.querySelector(".point");
            let p = parseInt(point.innerText, 10) + 10;
            console.log("p = " + p);
            this.classList.add("fill");
            point.innerText = String(p);
            updatePoint();
        });

        a.addEventListener("contextmenu", function (e) {
            const point = this.querySelector(".point");
            let p = parseInt(point.innerText, 10) - 10;
            console.log("p = " + p);
            if (p <= 0) {
                this.classList.remove("fill");
                point.innerText = '00';
            } else {
                point.innerText = String(p);
            }
            updatePoint();
            e.preventDefault();
        }, false);
    });
});
