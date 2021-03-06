﻿var Events = SAGE2_App.extend({

    init: function (data) {

        this.SAGE2Init("canvas", data);

        this.ctx = this.element.getContext("2d");

        this.resizeEvents = "continuous";

        this.Xpos = this.element.width / 2;
        this.Ypos = this.element.height / 2;

        this.speed = 10;
        this.size = 40;
        this.color = "red";
        this.grab = false;

        this.deltaX = 0;
        this.deltaY = 0;
    },

    draw: function (date) {

        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.element.width, this.element.height);

        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.Xpos, this.Ypos, this.size, this.size);
    },

    resize: function (date) {
        this.refresh(date);
    },

    event: function (eventType, position, user_id, data, date) {

        if (eventType === "pointerPress" && (data.button === "left")) {

            if (position.x >= this.Xpos && position.x <= this.Xpos + this.size &&
                position.y >= this.Ypos && position.y <= this.Ypos + this.size) {

                this.grab = true;
                this.color = "green";

                this.deltaX = position.x - this.Xpos;
                this.deltaY = position.y - this.Ypos;

                this.refresh(date);
            }
        }

        else if (eventType === "pointerMove") {

            if (this.grab) {

                this.Xpos = position.x - this.deltaX;
                this.Ypos = position.y - this.deltaY;

                this.refresh(date);
            }
        }

        else if (eventType === "pointerRelease" && (data.button === "left")) {
            if (this.grab) {
                this.grab = false;
                this.color = "red";
                this.refresh(date);
            }
        }

        else if (eventType === "pointerScroll") {
            if (this.grab) {

                let kx = this.deltaX / this.size;
                let ky = this.deltaY / this.size;

                let newSize = this.size - data.wheelDelta * 0.2;
                this.size = newSize > 10 ? newSize : 10;

                this.deltaX = kx * this.size;
                this.deltaY = ky * this.size;

                this.Xpos = position.x - this.deltaX;
                this.Ypos = position.y - this.deltaY;

                this.refresh(date);

            }
        }

        else if (eventType === "widgetEvent") {
            this.refresh(date);
        }

        else if (eventType === "keyboard") {
            if (data.character === "r") {
                this.size = 40;
                this.refresh(date);
            }
        }
        else if (eventType === "specialKey") {
            if (data.code === 37 && data.state === "down") {//left
                this.Xpos -= this.speed;
                this.refresh(date);
            }
            else if (data.code === 38 && data.state === "down") {//up
                this.Ypos -= this.speed;
                this.refresh(date);
            }
            else if (data.code === 39 && data.state === "down") {//right
                this.Xpos += this.speed;
                this.refresh(date);
            }
            else if (data.code === 40 && data.state === "down") {//down
                this.Ypos += this.speed;
                this.refresh(date);
            }
        }
    }
});