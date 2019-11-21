let editor;
var pageState;

let bExecute = document.getElementById("ejecutar");
let bClear = document.getElementById("limpiar");
let bSave = document.getElementById("guardar");
let bLoad = document.getElementById("cargar");
let hiddenBtn = document.getElementById('real-file');

editor = new Editor(document.getElementById("editor"));

bExecute.addEventListener('click', function () {
    var code = document.getElementById('editor').value;
    Parser.parse(code);

});

bClear.addEventListener('click', function () {
    editor.clear();
    canvas.clear();
});

var textFile = null,
  makeTextFile = function (text) {
    var data = new Blob([text], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    // returns a URL you can use as a href
    return textFile;
  };

  bSave.addEventListener('click', function () {
    pageState = '{ "editor" : ' + editor.toJSON() + ', "canvas" : ' + canvas.toJSON() + ' }';
    
    var link = document.createElement('a');
    link.setAttribute('download', 'codigo.lzl');
    link.href = makeTextFile(pageState);
    document.body.appendChild(link);

    // wait for the link to be added to the document
    window.requestAnimationFrame(function () {
      var event = new MouseEvent('click');
      link.dispatchEvent(event);
      document.body.removeChild(link);
    });
    
    terminal.print('Se ha guardado la información\n');
});

hiddenBtn.addEventListener('change', function () {

    if (hiddenBtn.value) {
        file = $('#real-file')[0].files[0];
    }
    if(file){
        var reader = new FileReader()
        reader.readAsBinaryString(file)

        reader.addEventListener('load', function (e) {
            res=(e.target.result);
            loadFile(res);
          });
    }

});

function loadFile(value){
    let jsonString = value;
    let jsonObj = JSON.parse(value);
    let editorText = jsonObj.editor.text;
    let figures = jsonObj.canvas.figures;
    console.log(jsonObj);
    console.log(editorText);
    console.log(figures);
    editor.setText(editorText);
    canvas.setFigures(figures);
}

bLoad.addEventListener('click', function () {
    hiddenBtn.click();
});