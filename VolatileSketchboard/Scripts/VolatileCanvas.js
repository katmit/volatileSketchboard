
var canvas = new fabric.Canvas(document.getElementById('canvas'), {
    isDrawingMode: true
});
var drawingColor = document.getElementById('drawingColor');
var brushSize = document.getElementById('brushSize');
document.getElementById('brushSizeLabel').innerHTML = brushSize.value;

if (fabric.PencilBrush) {
    freeDrawingBrush = new fabric.PencilBrush(canvas);
    var brush = canvas.freeDrawingBrush;
    brush.color = drawingColor.value;
    brush.width = parseInt(brushSize.value, 10);
    var points = [[0, 0], [0, 0], [0, 0], [0, 0]];

    freeDrawingBrush.onMouseDown({ x: points[0][0], y: points[0][1] });
    for (var i = 1; i < points.length; i++) {
        freeDrawingBrush.onMouseMove({ x: points[i][0], y: points[i][1] });
    }
}

function openOptionsTab(tabName) {
    var i, tabcontent;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "flex";
}

//button styling and event handling
var currentButton = null;

function toggleTabSelect(toggledButtonID, buttonOptionsID, buttonBackgroundColor, isDrawingMode) {
    var clickedButton = document.getElementById(toggledButtonID);
    clickedButton.style.background = buttonBackgroundColor;
    if (currentButton != null) {
        currentButton.style.background = "#b3b3b3";
    }
    currentButton = clickedButton;
    canvas.isDrawingMode = isDrawingMode;
    openOptionsTab(buttonOptionsID);
};


var drawButton = document.getElementById('drawButton');
drawButton.onclick = function () {
    toggleTabSelect('drawButton', 'drawOptions', '#68a69c', true);
    //remove any existing selections
    canvas.deactivateAll().renderAll();
}
drawButton.onclick(); //default to this

var selectButton = document.getElementById('selectButton');
selectButton.onclick = function () {
    toggleTabSelect('selectButton', 'selectOptions', '#e8a2a2', false);
};

var importButton = document.getElementById('importButton');
importButton.onclick = function () {
    toggleTabSelect('importButton', 'importOptions', '#b56fc7', false);
};

//var exportButton = document.getElementById('exportButton');
//exportButton.onclick = function () {
//    toggleTabSelect('exportButton', 'exportOptions', '#74a382', false);
//};

var deleteButton = document.getElementById('deleteButton');
function deleteSelectedObjects (syncCanvas) {
    var activeObject = canvas.getActiveObject(),
        activeGroup = canvas.getActiveGroup();

    canvas.off('object:removed', syncCanvas);
    if (activeObject) {
        canvas.remove(activeObject);
    }
    else if (activeGroup) {
        var objectsInGroup = activeGroup.getObjects();
        canvas.discardActiveGroup();
        objectsInGroup.forEach(function (object) {
            canvas.remove(object);
        });
    }
    canvas.on('object:removed', syncCanvas);
    syncCanvas();
}

var copyButton = document.getElementById('copyButton');
var copiedObject,
    copiedObjects = new Array();
function copySelectedObjects(syncCanvas) {
    //copy the objects
    copiedObjects = new Array();
    if (canvas.getActiveGroup()) {
        canvas.getActiveGroup().getObjects().forEach(function (o) {
            var object = fabric.util.object.clone(o);
            copiedObjects.push(object);
        });
    } else if (canvas.getActiveObject()) {
        var object = fabric.util.object.clone(canvas.getActiveObject());
        copiedObject = object;
        copiedObjects = new Array();
    }

    //paste them at offset
    canvas.off('object:added', syncCanvas);
    if (copiedObjects.length > 0) {
        for (var i in copiedObjects) {
            copiedObjects[i] = fabric.util.object.clone(copiedObjects[i]);

            copiedObjects[i].set("top", copiedObjects[i].top + 20);
            copiedObjects[i].set("left", copiedObjects[i].left + 20);

            canvas.add(copiedObjects[i]);
            canvas.item(canvas.size() - 1).hasControls = true;
        }
    } else if (copiedObject) {
        copiedObject = fabric.util.object.clone(copiedObject);
        copiedObject.set("top", copiedObject.top + 20);
        copiedObject.set("left", copiedObject.left + 20);
        canvas.add(copiedObject);
        canvas.item(canvas.size() - 1).hasControls = true;
    }
    copiedObject, copiedObjects = new Array();
    canvas.on('object:added', syncCanvas);
    syncCanvas();
}

document.getElementById('imageUpload').addEventListener("change", function (e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function (f) {
        var data = f.target.result;
        fabric.Image.fromURL(data, function (img) {
            if (img.getElement() === undefined) {
                console.log('Failed to load image!');
                return;
            }
            var oImg = img.set({ left: 50, top: 50, angle: 00 }).scale(1.0);
            canvas.add(oImg);
        });
    };
    reader.readAsDataURL(file);
});

var uploadImage = document.getElementById('importImageButton');
uploadImage.onclick = function () {
    document.getElementById('imageUpload').click();
}

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

