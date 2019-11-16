let editor;
let terminal;
var pageState;

let bExecute = document.getElementById("ejecutar");
let bClear = document.getElementById("limpiar");
let bSave = document.getElementById("guardar");
let bLoad = document.getElementById("cargar");

editor = new Editor(document.getElementById("editor"));
terminal = new Terminal(document.getElementById("terminal"));

bExecute.addEventListener('click', function () {
    canvas.addFigure(Canvas.SQUARE);
    canvas.addFigure(Canvas.CIRCLE);
    canvas.addFigure(Canvas.TRIANGLE);
    
});

bClear.addEventListener('click', function () {
    editor.clear();
    terminal.clear();
    canvas.clear();
});

bSave.addEventListener('click', function () {
    pageState = '{ "editor" : ' + editor.toJSON() + ', "canvas" : ' + canvas.toJSON() + ' }';
    terminal.print('Se ha guardado la información\n');
});

bLoad.addEventListener('click', function () {
    let jsonString = pageState;
    let jsonObj = JSON.parse(pageState);
    let editorText = jsonObj.editor.text;
    let figures = jsonObj.canvas.figures;
    console.log(jsonObj);
    console.log(editorText);
    console.log(figures);
    editor.setText(editorText);
    canvas.setFigures(figures);
});