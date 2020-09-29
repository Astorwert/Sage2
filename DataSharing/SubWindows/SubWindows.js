var SubWindows = SAGE2_App.extend({

    init: function (data) {

        this.SAGE2Init("canvas", data);
        this.ctx = this.element.getContext("2d");
        this.resizeEvents = "continuous";

        var num1 = new Object();
        var num2 = new Object();
        num1.val = 1; 
        num2.val = 2;

        this.launchAppWithValues("Board", num1, this.sage2_x, this.sage2_y + 40, "setNum");
        this.launchAppWithValues("Board", num2, this.sage2_x + 300, this.sage2_y + 40, "setNum");

        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "grey";
        this.ctx.font = "16px serif";

        this.statement = 0;
    },

    resize: function (date) {
        this.refresh(date);
    },

    draw: function (date) {

        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.element.width, this.element.height);

        this.update(date);
    },

    nextstate: function (date) {
        this.statement = (this.statement === 4 ? 3 : this.statement + 1);
        this.refresh(date);
    },

    update: function (date) {

        this.ctx.fillStyle = "red";

        switch (this.statement) {

            case 0:
                this.serverDataSetValue("FirstPlayerState", "waiting", "First player statement variable", true);
                this.serverDataSetValue("SecondPlayerState", "waiting", "Second player statement variable", true);
                this.ctx.fillText("Press R to start the game", 20, 20);
                break;

            case 1:
                this.serverDataSetValue("FirstPlayerState", "waiting", "First player statement variable", true);
                this.serverDataSetValue("SecondPlayerState", "preparation", "Second player statement variable", true);
                this.ctx.fillText("Preparing Second Player", 20, 20);
                break;

            case 2: 
                this.serverDataSetValue("FirstPlayerState", "preparation", "First player statement variable", true);
                this.serverDataSetValue("SecondPlayerState", "waiting", "Second player statement variable", true);
                this.ctx.fillText("Preparing First Player", 20, 20);
                break;

            case 3:
                this.serverDataSetValue("FirstPlayerState", "waiting", "First player statement variable", true);
                this.serverDataSetValue("SecondPlayerState", "turn", "Second player statement variable", true);
                this.ctx.fillText("First Player Turn", 20, 20);
                break;

            case 4:
                this.serverDataSetValue("FirstPlayerState", "turn", "First player statement variable", true);
                this.serverDataSetValue("SecondPlayerState", "waiting", "Second player statement variable", true);
                this.ctx.fillText("Second Player Turn", 20, 20);
                break;

        }
    }
});