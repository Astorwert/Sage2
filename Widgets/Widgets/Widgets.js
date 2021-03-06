﻿var Widgets = SAGE2_App.extend({

    init: function (data) {

        this.SAGE2Init("canvas", data);
        this.ctx = this.element.getContext("2d");

        this.resizeEvents = "continuous";

        this.size = 10;
        this.backcolor = "black";
        this.cellcolor = "lime";
        this.statement = false;

        this.UBLimit = 3;
        this.LBLimit = 3;

        this.UALimit = 3;
        this.LALimit = 2;

        this.controls.addButton({ label: "Play", identifier: "PlayButton", position: 1 });
        this.controls.addButton({ type: "play-pause", identifier: "PauseButton", position: 2 });
        this.controls.addButton({ type: "next", identifier: "NextButton", position: 6 });
        this.controls.addButton({ label: "Clear", identifier: "ClearButton", position: 7 });

        this.controls.addTextInput({ value: "lime", label: "Color",  identifier: "SetColor" });

        this.controls.addSlider({
            identifier: "LBLiveSlider",
            minimum: 0,
            maximum: 8,
            label: "LB",
            property: "this.LBLimit",
            increments: 1
        });
        this.controls.addSlider({
            identifier: "UBLiveSlider",
            minimum: 0,
            maximum: 8,
            label: "UB",
            property: "this.UBLimit",
            increments: 1
        });

        this.controls.addSlider({
            identifier: "LALiveSlider",
            minimum: 0,
            maximum: 8, 
            label: "LA",
            property: "this.LALimit",
            increments: 1
        });
        this.controls.addSlider({
            identifier: "UALiveSlider",
            minimum: 0,
            maximum: 8,
            label: "UA",
            property: "this.UALimit",
            increments: 1
        });

        this.controls.finishedAddingControls();

        
        this.board = new Array(50);

        for (var i = 0; i < 50; i++) {
            this.board[i] = new Array(50);
            for (var j = 0; j < 50; j++) {
                this.board[i][j] = false;
            }
        }
        
        //                 X  Y      X  Y      X  Y
        this.nighbors = [[-1, -1],  [0, -1],  [1, -1],
                         [-1, 0], /*[0, 0],*/ [1, 0],
                         [-1, 1],   [0, 1],   [1, 1]];

    },

    draw: function (date) {

        this.ctx.fillStyle = this.backcolor;
        this.ctx.fillRect(0, 0, this.element.width, this.element.height);

        this.ctx.fillStyle = this.cellcolor;
        for (var y = 0; y < 50; y++) {
            for (var x = 0; x < 50; x++) {
                if (this.board[y][x]) {
                    this.ctx.fillRect(x * this.size, y * this.size, this.size, this.size);
                }
            }
        }

        if (this.statement) setTimeout(this.next(), 300);
    },

    resize: function (date) {
        this.refresh(date);
    },

    next: function (date) {
        var tempboard = new Array(50);

        for (var i = 0; i < 50; i++) {
            tempboard[i] = new Array(50);
            for (var j = 0; j < 50; j++) {
                tempboard[i][j] = false;
            }
        }

        for (var i = 0; i < 50; i++) { //Y
            for (var j = 0; j < 50; j++) { //X

                var count = 0;

                for (let [a, b] of this.nighbors) {
                    let y = (i + b + 50) % 50;
                    let x = (j + a + 50) % 50;
                    if (this.board[y][x]) count++;
                }

                if ((this.board[i][j] && this.LALimit <= count && count <= this.UALimit) ||
                    (!this.board[i][j] && this.LBLimit <= count && count <= this.UBLimit))
                    tempboard[i][j] = true;
            }
        }

        this.board = tempboard.slice(0);
    },

    event: function (eventType, position, user_id, data, date) {

        if (eventType === "pointerPress" && (data.button === "left")) {

            var x = parseInt(position.x / this.size);
            var y = parseInt(position.y / this.size);
            this.board[y][x] = !this.board[y][x];

            this.refresh(date);
        }

        else if (eventType === "widgetEvent") {
            switch (data.identifier) {

                case "PlayButton":
                    if (!this.statement) {
                        this.statement = true;
                        this.refresh(date);
                    }
                    break;

                case "PauseButton":
                    if (this.statement) {
                        this.statement = false;
                        this.refresh(date);
                    }
                    break;

                case "NextButton":
                    if (!this.statement) this.next(date);
                    break;

                case "ClearButton":
                    for (var i = 0; i < 50; i++) {
                        for (var j = 0; j < 50; j++) {
                            this.board[i][j] = false;
                        }
                    }
                    this.refresh(date);
                    break;

                case "SetColor":
                    this.cellcolor = data.text;
                    this.refresh(date);
                    break;
            }
        }
    }
});