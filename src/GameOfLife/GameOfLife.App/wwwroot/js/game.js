const dimension = 10;
var roundCounter = 0;
var runningInterval;
const cellRenderSize = 10;
const gapRenderSize = 1;

var game = {
    get cells() {
        let data = localStorage.getItem("game-data");
        if (data) {
            return JSON.parse(data);
        }
        return [];
    },
    set cells(c) {
        console.log("a");
        localStorage.setItem("game-data", JSON.stringify(c));
    },
    get lastLoaded() {
        let data = localStorage.getItem("last-loaded-game-data");
        if (data) {
            return JSON.parse(data);
        }
        return [];
    },
    set lastLoaded(c) {
        localStorage.setItem("last-loaded-game-data", JSON.stringify(c));
    },
    loadBoard: function(c) {
        this.lastLoaded = c;
        this.cells = c;
    },
    cellsSaved: function () {
        return localStorage.getItem("game-data") ? true : false;
    },
    isLive: function (cells, x, y) {
        return cells.some(c => c.x === x && c.y === y);
    },

    setDead: function (cells, x, y) {
        return cells.filter(c => !(c.x === x && c.y === y));
    },
    setLive: function (cells, x, y) {
        cells.push(new Cell(x, y));
    },
    toggleState: function (x, y) {
        console.log("toggling:" + x + " " + y);
        let cells = this.cells;
        if (this.isLive(cells, x, y)) {
            this.cells = this.setDead(cells, x, y);
        }
        else {
            this.setLive(cells, x, y);
            this.cells = cells;
        }
    },
    getLiveNeighbors: function (cells, i, j) {
        let sum = 0;
        sum += this.isLive(cells, i - 1, j - 1);
        sum += this.isLive(cells, i - 1, j);
        sum += this.isLive(cells, i - 1, j + 1);
        sum += this.isLive(cells, i, j - 1);
        sum += this.isLive(cells, i, j + 1);
        sum += this.isLive(cells, i + 1, j - 1);
        sum += this.isLive(cells, i + 1, j);
        sum += this.isLive(cells, i + 1, j + 1);
        return sum;
    },
    simulateRound: function () {
        let cells = this.cells;
        let minX = Math.min.apply(Math, cells.map(c => c.x)) - 1;
        let minY = Math.min.apply(Math, cells.map(c => c.y)) - 1;
        let maxX = Math.max.apply(Math, cells.map(c => c.x)) + 2;
        let maxY = Math.max.apply(Math, cells.map(c => c.y)) + 2;

        var nextRoundCells = [];
        for (let i = minX; i < maxX; i++) {
            for (let j = minY; j < maxY; j++) {
                let liveNeighbors = this.getLiveNeighbors(cells, i, j);
                if (liveNeighbors < 2 || liveNeighbors > 3) {
                    // die
                }
                else if (liveNeighbors === 2 && this.isLive(cells, i, j)) {
                    // keep alive
                    nextRoundCells.push(new Cell(i, j));
                }
                else if (liveNeighbors === 3) {
                    // born
                    nextRoundCells.push(new Cell(i, j));
                }
            }
        }
        this.cells = nextRoundCells;
    }
}

function start() {
    if (!runningInterval) {
        runningInterval = setInterval(simulateRound, getInterval());
    }
}

function stop() {
    if (runningInterval) {
        clearInterval(runningInterval);
        runningInterval = undefined;
    }
}

function simulateRound() {
    game.simulateRound();
    redraw();

    roundCounter++;
    $('#counter').text(roundCounter);
}

function getInterval() {
    let delay = 1 / parseInt($('#speed').val()) * 10000;
    console.log(delay);
    return delay;
}

function Cell(x, y) {
    this.x = x;
    this.y = y;
}


function clear(canvas) {
    let ctx = canvas.getContext('2d');

    // Clear the entire canvas
    let p1 = ctx.transformedPoint(0, 0);
    let p2 = ctx.transformedPoint(canvas.width, canvas.height);
    ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
}

function redraw() {
    console.log("redrawing");
    var canvas = $("#gameCanvas")[0];
    clear(canvas);
    drawGame(canvas, game.cells);
}

function drawGame(canvas, data) {
    function drawBackground(ctx) {
        // Create a pattern, offscreen
        const patternCanvas = document.createElement('canvas');
        const patternContext = patternCanvas.getContext('2d');

        // Give the pattern a width and height of 50
        patternCanvas.width = cellRenderSize + gapRenderSize;
        patternCanvas.height = cellRenderSize + gapRenderSize;

        // Give the pattern a background color and draw an arc
        patternContext.fillStyle = '#fec';
        patternContext.fillRect(0, 0, patternCanvas.width - gapRenderSize, patternCanvas.height - gapRenderSize);

        let transformMatrix;
        if (ctx.getTransform) {
            transformMatrix = ctx.getTransform();
        } else {
            transformMatrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
        }

        const pattern = ctx.createPattern(patternCanvas, 'repeat');
        ctx.fillStyle = pattern;
        ctx.fillRect(-transformMatrix.e / transformMatrix.a, -transformMatrix.f / transformMatrix.d, canvas.width / transformMatrix.a, canvas.height / transformMatrix.d);
    }

    
    if (canvas.getContext) {
        let ctx = canvas.getContext('2d');

        drawBackground(ctx);

        ctx.fillStyle = '#000';

        data.forEach(cell => {
            ctx.fillRect(cell.x * (cellRenderSize + gapRenderSize),
                cell.y * (cellRenderSize + gapRenderSize),
                cellRenderSize,
                cellRenderSize);
        });
    }
}

function getCellIndexesByCoords(point) {
    return { x: Math.floor(point.x / (cellRenderSize + gapRenderSize)), y: Math.floor(point.y / (cellRenderSize + gapRenderSize)) }
}

function updateText(input) {
    $("#speed-text").text(input.value);
}

function handleCanvasClick(e) {
    let canvasElement = $("#gameCanvas");
    let canvas = canvasElement[0];
    console.log('click: ' + e.offsetX + '/' + e.offsetY);
    let transformedPoint = canvas.getContext('2d').transformedPoint(e.offsetX, e.offsetY);
    let indexes = getCellIndexesByCoords(transformedPoint);
    game.toggleState(indexes.x, indexes.y);

    redraw();
}

function reset() {
    game.loadBoard(game.lastLoaded);
    setInitialState();
}

function setInitialState() {
    roundCounter = 0;
    let slider = $('#speed');
    slider.val(localStorage.getItem("simulation-speed"));
    updateText(slider[0]);
    if (!game.cellsSaved()) {
        let cells = [];
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                cells.push(new Cell(i, j));
            }
        }
        game.cells = cells;
    }
    
    redraw();
}

function saveCurrent() {
    let title = prompt("Enter title");
    let data = {
        Title: title,
        Data: JSON.stringify(game.cells),
        IsPublic: true
    };
    $.ajax({
        type: "POST",
        url: '/api/games',
        contentType: "application/json",
        error: function(xhr, status, errorThrown) {
            var err = "Status: " + status + " " + errorThrown;
            console.log(err);
        },
        data: JSON.stringify(data)
    }).done(function(data) {
        console.log(data.result);
        reloadSavedGames();
    });
}

function reloadSavedGames() {
    $.ajax({
        type: "GET",
        url: '/api/games',
        contentType: "application/json",
        error: function (xhr, status, errorThrown) {
            var err = "Status: " + status + " " + errorThrown;
            console.log(err);
        }
    }).done(function (data) {
        
        $("#saved-games").html("").append(data);
        $("[data-game]").each(function(i,c) {
            drawGame(c, JSON.parse($(this).attr("data-game")));
        });
    });
}

function loadSaved(id) {
    let data = $("#saved-game-" + id).attr("data-game");
    game.loadBoard(JSON.parse(data));
    redraw();
}

$(document).ready(function () {
    let canvasElement = $("#gameCanvas");
    let canvas = canvasElement[0];


    addControls(canvas, handleCanvasClick);

    setInitialState();

    $('#speed').change(function (o) {
        if (runningInterval) {
            clearInterval(runningInterval);
            runningInterval = undefined;
            start();
        }

        console.log(o.target.value);
        localStorage.setItem("simulation-speed", o.target.value);
    });

    if (window.userLoggedIn) {
        reloadSavedGames();
    }
});