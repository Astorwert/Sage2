var Board = SAGE2_App.extend({

    init: function (data) {

        this.SAGE2Init("canvas", data);
        this.ctx = this.element.getContext("2d");

        this.resizeEvents = "continuous";

        this.size = 30;

        this.backcolor = "cyan";
        this.color = "black";

        this.presetboard = new Array(10);
        this.gameboard = new Array(10);

        for (var i = 0; i < 10; i++) {
            this.presetboard[i] = new Array(10);
            this.gameboard[i] = new Array(10);
            for (var j = 0; j < 10; j++) {
                this.presetboard[i][j] = false;
                this.gameboard[i][j] = 0;
            }
        }

        //                 X  Y      X  Y      X  Y
        this.nighbors = [[-1, -1],  [0, -1],  [1, -1],
                         [-1, 0], /*[0, 0],*/ [1, 0],
                         [-1, 1],   [0, 1],   [1, 1]];

        this.statement = "waiting";
    },

    clean: function () {
        this.ctx.fillStyle = this.backcolor;
        this.ctx.fillRect(0, 0, this.element.width, this.element.height);
    },

    drawLine: function (x0, y0, x1, y1) {
        // Otevírá blok. Všechno, co bude nakresleno uvnítř bloku stane současti jedné figury
        this.ctx.beginPath();
        // Přenesé pero na pozici (x0, y0)
        this.ctx.moveTo(x0, y0);
        // Nakreslí čáru od současné pozici pera do bodu (x1, y1)
        this.ctx.lineTo(x1, y1);
        // Obárví vysledek a uzavřé blok
        this.ctx.stroke();
    },

    drawgrid: function () {

        this.ctx.fillStyle = "black";

        for (var i = 0; i < 11; i++) {
            this.drawLine(i * 30, 0, i * 30, 300);
            this.drawLine(0, i * 30, 300, i * 30);
        }
    },

    drawpreset: function () {

        this.ctx.fillStyle = this.color;

        for (var y = 0; y < 10; y++) {
            for (var x = 0; x < 10; x++) {
                if (this.presetboard[y][x]) {
                    this.ctx.fillRect(x * this.size, y * this.size, this.size, this.size);
                }
            }
        }

        this.drawgrid();
    },

    drawmap: function () {

        for (var y = 0; y < 10; y++) {
            for (var x = 0; x < 10; x++) {
                if (this.gameboard[y][x] === 1) {
                    this.ctx.fillStyle = "grey";
                    this.ctx.fillRect(x * this.size, y * this.size, this.size, this.size);
                }
                else if (this.gameboard[y][x] === 2) {
                    this.ctx.fillStyle = "green";
                    this.ctx.fillRect(x * this.size, y * this.size, this.size, this.size);
                }
            }
        }

        this.drawgrid();
    },

    draw: function (date) {

        this.clean();

        switch (this.statement) {

            case "waiting":
                this.ctx.fillStyle = "black";
                this.ctx.fillRect(0, 0, this.element.width, this.element.height);
                break;

            case "preparation":
                this.drawpreset();
                break;

            case "turn":
                this.drawmap();
                break;
        }
    },

    resize: function (date) {
        this.refresh(date);
    },

    setState: function (val) {
        this.statement = val;
    },

    setNum: function (num) {
        if (num.val === 1) this.serverDataSubscribeToValue("FirstPlayerState", this.setState);
        if (num.val === 2) this.serverDataSubscribeToValue("SecondPlayerState", this.setState);
    },

    contain: function (tmp, [y, x]) {
        for (let [b, a] of tmp) {
            if (x == a && y == b) return false;
        }
        return true;
    },

    bfsfill: function (ty, tx) {
        let queue = [[ty, tx]];
        let tmp = new Set();

        while (queue.length != 0) {
            let [y, x] = queue.shift();

            if (this.contain(tmp, [y, x])) {
                tmp.add([y, x]);

                for (let [a, b] of this.nighbors) {
                    a += x;
                    b += y;

                    if (b >= 0 && b <= 9 && a >= 0 && a <= 9) {

                        if (this.presetboard[b][a]) {
                            queue.push([b, a]);
                            if (this.gameboard[b][a] == 0) return;
                        }
                    }
                }
            }
        }

        for (let [y, x] of tmp) {
            for (let [a, b] of this.nighbors) {
                a += x;
                b += y;

                if (b >= 0 && b <= 9 && a >= 0 && a <= 9) {
                    if (!this.presetboard[b][a]) {
                        this.gameboard[b][a] = 1;
                    }
                }
            }
        }
    },

    event: function (eventType, position, user_id, data, date) {

        if (eventType === "pointerPress" && (data.button === "left")) {

            var x = parseInt(position.x / this.size);
            var y = parseInt(position.y / this.size);

            if (this.statement === "preparation") this.presetboard[y][x] = !this.presetboard[y][x];
            if (this.statement === "turn") {
                if (this.presetboard[y][x]) {
                    this.gameboard[y][x] = 2;
                    this.bfsfill(y, x);
                }
                else {
                    this.gameboard[y][x] = 1;
                    this.sendDataToParentApp("nextstate", date);
                }
            }
        }

        else if (eventType === "keyboard") {

            if (data.character === "r") {
                this.sendDataToParentApp("nextstate", date);
            }
        }
    }
});