var canvas = new fabric.Canvas(document.getElementById('canvas'), {
    isDrawingMode: true
});
var drawingColor = document.getElementById('drawingColor');
var brushSize = document.getElementById('brushSize');
document.getElementById('brushSizeLabel').innerHTML = brushSize.value;

if (fabric.PencilBrush) {
    freeDrawingBrush = new fabric.PencilBrush(canvas);
    freeDrawingBrush.color = drawingColor.value;
    freeDrawingBrush.width = parseInt(brushSize.value, 10);
    var points = [[0, 0], [0, 0], [0, 0], [0, 0]];

    freeDrawingBrush.onMouseDown({ x: points[0][0], y: points[0][1] });
    for (var i = 1; i < points.length; i++) {
        freeDrawingBrush.onMouseMove({ x: points[i][0], y: points[i][1] });
    }
}


//button styling and event handling
//var currentButton = null;
//var drawButton = document.getElementById('drawButton');
//var drawingColorValue = drawingColor.value;
//drawButton.hoverColor = "#68a69c";
//drawButton.onclick = function () {
//    drawButton.style.background = "#68a69c";
//    if (currentButton != null) {
//        currentButton.style.background = "#b3b3b3";
//    }
//    currentButton = drawButton;
//    drawingColor = drawingColorValue;
//};
//var eraseButton = document.getElementById('eraseButton');
//eraseButton.hoverColor = "#e8a2a2";
//eraseButton.onclick = function () {
//    eraseButton.style.background = "#e8a2a2";
//    if (currentButton != null) {
//        currentButton.style.background = "#b3b3b3";
//    }
//    currentButton = eraseButton;
//    drawingColor.value = "#ffffff";
//};

drawingColor.onchange = function () {
    var brush = canvas.freeDrawingBrush;
    brush.color = drawingColor.value;
    drawingColorValue = drawingColor.value;
    if (currentButton.id == 'eraseButton') {
        //change to drawing
        drawButton.onclick();
    }
}

brushSize.onchange = function () {
    var brush = canvas.freeDrawingBrush;
    brush.width = parseInt(brushSize.value, 10);
    document.getElementById('brushSizeLabel').innerHTML = brushSize.value;
}
