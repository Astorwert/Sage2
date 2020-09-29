var helloFIT = SAGE2_App.extend({

    init: function (data) {

        this.SAGE2Init("div", data);
        this.element.id = "div" + this.id;

        this.element.innerHTML = "<i style=\"font-size: 24px; color: Orange\">Hello FIT!</i>";

        this.element.style.background = "white";
    },
});