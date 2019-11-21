class Editor {

    constructor(textArea) {
        this.textArea = textArea;
        this.enableTab();
    }

    getText() {
        return this.textArea.value;
    }

    clear() {
        this.textArea.value = "";
    }

    enableTab() {
        this.textArea.onkeydown = function (e) {
            if (e.keyCode === 9) {
                this.value += '\t';
                return false;
            }
        }
    }

    setText(jsonText) {
        this.textArea.value = jsonText;
    }

    toJSON() {
        let json = '{ "text" : ' + JSON.stringify(this.getText()) + ' }';
        return json;
    }

}

class Terminal {

    constructor(textArea) {
        this.textArea = textArea;
    }

    print(str) {
        this.textArea.value += "\nLazarus$ > " + str;
        this.textArea.scrollTop = this.textArea.scrollHeight;
    }

    clear() {
        this.textArea.value = "Lazarus$ >";
    }
}


const SQUARE = 0,
    CIRCLE = 1,
    TRIANGLE = 2;
class Canvas {

    constructor(parent) {
        this.parent = parent;
        this.width = this.parent.offsetWidth;
        this.height = this.parent.offsetHeight;
        this.canvas = createCanvas(this.width, this.height, WEBGL);
        this.canvas.parent(parent.id);
        this.figures = [];
        this.polygons = [];
    }

    static get SQUARE() {
        return SQUARE;
    }

    static get CIRCLE() {
        return CIRCLE;
    }

    static get TRIANGLE() {
        return TRIANGLE;
    }

    resize() {
        this.updateFigs();
        this.updateSize();
        resizeCanvas(this.width, this.height);
    }

    updateFigs() {
        let xMod = this.parent.offsetWidth / this.width;
        let yMod = this.parent.offsetHeight / this.height;
        for (let i = 0; i < this.figures.length; i++) {
            this.figures[i].update(xMod, yMod, xMod);
        }
    }

    updateSize() {
        this.width = this.parent.offsetWidth;
        this.height = this.parent.offsetHeight;
    }

    addFigure(figType, size) {
        //let size = this.width / 10;
        let cX = this.width / 4 ;
        let cY = this.height / 4 ;
        let figure;
        switch (figType) {
            case Canvas.SQUARE:
                figure = new Square(cX, cY, size);
                break;
            case Canvas.CIRCLE:
                figure = new Circle(cX, cY, size);
                break;
            case Canvas.TRIANGLE:
                figure = new Triangle(cX, cY, size);
                break;
        }
        this.figures.push(figure);
    }

    addPolygon(figType, size){
        let figure;
        switch (figType) {
            case "Esfera":
                console.log("LLegue")
                figure = new Sphere(size);
                break;
        } 
        this.polygons.push(figure);
    }

    draw() {
        for (let i = 0; i < this.figures.length; i++) {
            this.figures[i].draw();
        }
        for (let i = 0; i < this.polygons.length; i++) {
            this.polygons[i].draw();
        }
        
        /*rotateX(this.angle);
        torus(50,10);
        translate(-100,0,0);
        fill(0,200,100);
        box();
        translate(230,0,0);
        fill(0,0,255)
        sphere();
        this.angle +=0.05; */
    }

    boundFigures() {
        for (let i = 0; i < this.figures.length; i++) {
            this.figures[i].bound(0, this.width, 0, this.height);
        }
    }

    clear() {
        this.figures = [];
        this.polygons = [];
    }

    mousePressed() {
        for (let i = 0; i < this.figures.length; i++) {
            this.figures[i].mousePressed();
        }
    }

    mouseReleased() {
        for (let i = 0; i < this.figures.length; i++) {
            this.figures[i].mouseReleased();
        }
    }

    setFigures(jsonFigs) {
        this.figures = [];
        for (let i = 0; i < jsonFigs.length; i++) {
            let figure;
            switch (jsonFigs[i].type) {
                case Canvas.SQUARE:
                    figure = new Square(jsonFigs[i].x, jsonFigs[i].y, jsonFigs[i].size);
                    break;
                case Canvas.CIRCLE:
                    figure = new Circle(jsonFigs[i].x, jsonFigs[i].y, jsonFigs[i].size);
                    break;
                case Canvas.TRIANGLE:
                    figure = new Triangle(jsonFigs[i].x, jsonFigs[i].y, jsonFigs[i].size);
                    break;
            }
            figure.setColor(jsonFigs[i].color);
            this.figures.push(figure);
        }
    }

    toJSON() {
        let json = '{ "figures" : [ ';
        let i = 0;
        for (; i < this.figures.length - 1; i++) {
            json += this.figures[i].toJSON() + ', ';
        }
        if (this.figures.length > 0) {
            json += this.figures[i].toJSON() + ' ';
        }
        json += '] }';
        return json;
    }

}

class Figure {

    constructor(type, x, y, size) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.size = size
        this.color = this.getRandColor();
        this.dragging = false;
        this.rollover = false;
        this.offsetX;
        this.offSetY;
        //this.divideme=1
    }

    draw() {
        //stroke(this.color);
        
        fill(this.color);
        if (this.dragging) {
            this.x = mouseX + this.offsetX;
            this.y = mouseY + this.offsetY;
        }
        translate(mouseX-width/2,0,mouseY-height/2);
        //fill(0,0,0);
    }

    getRandColor() {
        let rand = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
        let colors = ['#EE0000', '#6601FF', '#0266FF', '#00EF02', '#FEFF04', '#FE9900'];
        return colors[rand];
    }

    setColor(color) {
        this.color = color;
    }

    update(xMod, yMod, sMod) {
        this.x = this.x * xMod;
        this.y = this.y * yMod;
        this.size = this.size * sMod;
    }

    mousePressed() {
        this.dragging = this.mouseOver();
        if (this.dragging) {
            this.offsetX = this.x - mouseX;
            this.offsetY = this.y - mouseY;
        }
    }

    mouseReleased() {
        this.dragging = false;
    }

    bound(lowLimitX, upLimitX, lowLimitY, upLimitY) {
        if (this.dragging) {
            let figSizeOffset = this.size / 2;
            if (mouseX < lowLimitX + figSizeOffset) {
                this.x = lowLimitX + figSizeOffset;
            } else if (mouseX > upLimitX - figSizeOffset) {
                this.x = upLimitX - figSizeOffset;
            }

            if (mouseY < lowLimitY + figSizeOffset) {
                this.y = lowLimitY + figSizeOffset;
            } else if (mouseY > upLimitY - figSizeOffset) {
                this.y = upLimitY - figSizeOffset;
            }
        }
    }

    toJSON() {
        let json = '{ "type" : ' + this.type + ', "x" : ' + this.x + ', "y" : ' + this.y + ', "size" : ' + this.size + ', "color" : "' + this.color + '" }';
        return json;
    }

}

class Square extends Figure {

    constructor(x, y, size) {
        super(Canvas.SQUARE, x, y, size);
        this.offsetPosX;
        this.offsetPosY;
        this.setOffsetPos();
    }

    draw() {
        super.draw();
        this.setOffsetPos();
        square(this.offsetPosX, this.offsetPosY, this.size);
    }

    setOffsetPos() {
        this.offsetPosX = this.x - (this.size / 2);
        this.offsetPosY = this.y - (this.size / 2);
    }

    update(xMod, yMod, sMod) {
        super.update(xMod, yMod, sMod);
        this.setOffsetPos();
    }

    mouseOver() {
        return ((mouseX > this.offsetPosX) && (mouseX < this.offsetPosX + this.size) && (mouseY > this.offsetPosY) && (mouseY < this.offsetPosY + this.size));
    }
}

class Circle extends Figure {

    constructor(x, y, size) {
        super(Canvas.CIRCLE, x, y, size);
    }

    draw() {
        super.draw();
        circle(this.x, this.y, this.size);
    }

    mouseOver() {
        let radius = this.size / 2;
        return (this.distance(mouseX, mouseY) < radius);
    }

    distance(pX, pY) {
        let a, b, c;
        b = this.x - pX;
        b = b * b;
        c = this.y - pY;
        c = c * c;
        a = Math.sqrt(b + c);
        return a;
    }

}

class Triangle extends Figure {

    constructor(x, y, size) {
        super(Canvas.TRIANGLE, x, y, size);
        this.setVertices();
    }

    setVertices() {
        this.x1 = (this.x) - ((this.size) / 2);
        this.y1 = (this.y) + ((this.size) / 2);
        this.x2 = (this.x) + ((this.size) / 2);
        this.y2 = this.y1;
        this.x3 = this.x;
        this.y3 = (this.y) - ((this.size) / 2);
    }

    draw() {
        super.draw();
        this.setVertices();
        triangle(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3);
    }

    update(xMod, yMod, sMod) {
        super.update(xMod, yMod, sMod);
        this.setVertices();
    }

    mouseOver() {
        let area = this.area(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3);
        let a = this.area(mouseX, mouseY, this.x2, this.y2, this.x3, this.y3);
        let b = this.area(this.x1, this.y1, mouseX, mouseY, this.x3, this.y3);
        let c = this.area(this.x1, this.y1, this.x2, this.y2, mouseX, mouseY);
        let sumOfAreas = a + b + c;
        let diffAreas = area - sumOfAreas;
        let tolerance = 0.001;
        return ((diffAreas > -tolerance) && (diffAreas < tolerance));
    }

    area(x1, y1, x2, y2, x3, y3) {
        return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0);
    }

}
class Sphere{
    Sphere(radius){
        this.radius = radius;
    }
    draw(){
        rotateY(frameCount * 0.03);
        translate(mouseX-width,0,mouseY-height);
        sphere(this.radius);
    }
}

class Box{
    Box(size){
        this.size = size;
    }
    draw(){
        rotateY(frameCount * 0.01);
        translate(mouseX,0,mouseY);
        box(this.size);
    }
}