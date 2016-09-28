(function draw_graph(container) {
    var graph = Flotr.draw(container, [{
        data: shiny,
        label: "Shiny Gems",
        color: "#ff0",
        lines: {
            fill: true
        },
    }, {
        data: tracked,
        label: "Tracked Gems",
    }, {
        data: percent,
        label: "Percentage",
        yaxis: 2,
        color: "#4b4",
    }, {
    }], {
        title: "Evolution",
        xaxis: {
            tickFormatter: function(n) {
                return dates[parseInt(n)];
            },
            labelsAngle: 45,
            title: "Date"
        },
        yaxis: {
            min: 0,
            title: "Amount"
        },
        y2axis: {
            color: "#4b4",
            min: 0,
            max: 100,
            title: "Percentage of compatible Gems",
            tickFormatter: function(n) {
                return n + "%  ";
            },
        },
        grid: {
            verticalLines: false,
            backgroundColor: "white"
        },
        HtmlText: false,
        legend: {
            position: "nw"
        }
    });
})(document.getElementById("evolution"));

