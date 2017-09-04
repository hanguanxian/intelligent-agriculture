var pdfCanvas = document.getElementById("viewBack");
var pdfContext = pdfCanvas.getContext("2d");

var copyCanvas = document.getElementById("viewMiddle");
var copyContext = copyCanvas.getContext("2d");

var drawCanvas = document.getElementById("viewFront");
var drawContext = drawCanvas.getContext("2d");

//var traceArray = [ ];
var traceArray = new Array();//数组代表当前页执行的所有操作，每个元素代表执行的每一步操作
var tolArray = new Array();//数组代表所有页执行的所有操作，每个元素代表第n页执行的所欲操作，每个元素由traceArray组成
var indexArray = new Array();//数组代表当前页执行的步数，每个元素代表当前页执行的第几步
var traceStr = "";

var size = 1;
var color = "#FF0000";
var canvasWidth = 840;
var canvasHeight = 600;

var index = 0;

var draw_graph = function (graphType, obj) {
    $("#viewFront").css("z-index", "8");
    chooseImg(obj);
    var canDraw = false;
    var startX;
    var startY;
    traceStr = "";
    var mousedown = function (e) {
       console.log("draw");
        console.log(preScale);
        preScale = scale;
        drawContext.strokeStyle = color;
        drawContext.lineWidth = size;
        e = e || window.event;
        canDraw = true;
        startX = e.offsetX;
        startY = e.offsetY;

        console.log("startX"+startX);
        console.log("startY"+startY);
        console.log("drawCanvas.height"+ drawCanvas.height);

        if (graphType == 'pencil') {

            traceStr = "copyContext.beginPath();";
            traceStr += "copyContext.moveTo(" + startX/preScale+"*scale"+ "," + startY/preScale+"*scale" + ");";

            drawContext.beginPath();
            drawContext.moveTo(startX/preScale+"*scale", startY/preScale+"*scale");


        } else if (graphType == 'line') {

            copyContext.strokeStyle = color;
            copyContext.lineWidth = size;
        } else if (graphType == 'rubber') {
            copyContext.clearRect(startX - size * 10, startY - size * 10, size * 20, size * 20);
            traceStr += "copyContext.clearRect(" + startX/preScale+"*scale" + "-" + size + "*10," + startY + "-" + size + "*10," + size + "*20," + size + "*20);";
        }
    }

    var mousemove = function (e) {
        var x = e.offsetX;
        var y = e.offsetY;

        if (graphType == 'square') {
            if (canDraw) {
                drawContext.beginPath();
                clearContext();
                drawContext.moveTo(startX, startY);

                drawContext.lineTo(x, startY);

                drawContext.lineTo(x, y);
                drawContext.lineTo(startX, y);
                drawContext.lineTo(startX, startY);
                drawContext.stroke();

                traceStr =
                    "clearContext();" +
                    " copyContext.beginPath();" +
                    "copyContext.moveTo(" + startX/preScale+"*scale" + "," + startY/preScale+"*scale" + ");" +
                    "copyContext.lineTo(" + x/preScale+"*scale" + "," + startY/preScale+"*scale" + ");" +
                    "copyContext.lineTo(" + x/preScale+"*scale" + "," + y/preScale+"*scale" + ");" +
                    "copyContext.lineTo(" + startX/preScale+"*scale" + "," + y/preScale+"*scale" + ");" +
                    "copyContext.lineTo(" + startX/preScale+"*scale" + "," + startY/preScale+"*scale" + ");" +
                    "copyContext.stroke();";
            }
        } else if (graphType == 'line') {
            if (canDraw) {
                clearContext();
                drawContext.beginPath();
                drawContext.moveTo(startX, startY);
                drawContext.lineTo(x, y);
                drawContext.stroke();

                traceStr =
                    " clearContext();" +
                    "copyContext.beginPath();" +
                    "copyContext.moveTo(" + startX/preScale+"*scale" + "," + startY/preScale+"*scale" + ");" +
                    "copyContext.lineTo(" + x/preScale+"*scale" + "," + y/preScale+"*scale" + ");" +
                    "copyContext.stroke();"

            }
        } else if (graphType == 'pencil') {
            if (canDraw) {
                //console.log("pencil x,y");
                //console.log(x+","+y);
                drawContext.lineTo(x, y);
                drawContext.stroke();
                traceStr += "copyContext.lineTo(" + x/preScale+"*scale" + "," + y/preScale+"*scale" + ");";
                traceStr += "copyContext.stroke();";

            }
        } else if (graphType == 'rubber') {
            clearContext();
            drawContext.lineWidth = 1;
            drawContext.beginPath();
            drawContext.strokeStyle = "#000000";
            drawContext.moveTo(x - size * 10, y - size * 10);
            drawContext.lineTo(x + size * 10, y - size * 10);
            drawContext.lineTo(x + size * 10, y + size * 10);
            drawContext.lineTo(x - size * 10, y + size * 10);
            drawContext.lineTo(x - size * 10, y - size * 10);
            drawContext.stroke();
            if (canDraw) {
                drawContext.clearRect(x - size * 10, y - size * 10, size * 20, size * 20);
                traceStr += "copyContext.clearRect(" + x/preScale+"*scale" + "-" + "size * 10," + y + " -" + " size * 10, size * 20, size * 20);";

            }

        }
    };

    var mouseup = function (e) {
        e = e || window.event;

        traceStr = "copyContext.strokeStyle = \'" + color + "\';" + "copyContext.lineWidth = " + size + ";" + traceStr;

        canDraw = false;

        /*不考虑撤销操作：20170703miaolijuan
        copyContext.clearRect(0, 0, copyCanvas.width, copyCanvas.height);
        traceArray[index] = traceStr;
        index++;
        for (var i = 0; i < index; i++) {
            eval(traceArray[i]);

        }*/
       eval(traceStr);

        saveTrace();

        console.log("sendtest...");
        connection.send({
                isMessage: true,
                toRun: true,
                data: traceStr
            });
        //traceStr = "";
    };

    var mouseover = function () {
        $(drawCanvas).css('cursor', 'crosshair');
    }

    //选择功能按钮 修改样式
    function chooseImg(obj) {
        // var imgAry = $(".drawController span");
        // for (var i = 0; i < imgAry.length; i++) {
        //     $(imgAry[i]).removeClass('border_choose');
        //     $(imgAry[i]).addClass('border_nochoose');
        // }

        $(obj).addClass("border_choose");
        $(obj).siblings('span').removeClass("border_choose");

    }


    //鼠标离开区域以外 除了涂鸦 都清空
   var mouseout = function () {
      /*  if (graphType != 'handwriting') {
            clearContext();
        }*/
    }

    $(drawCanvas).unbind();
    $(drawCanvas).bind('mousedown', mousedown);
    $(drawCanvas).bind('mousemove', mousemove);
    $(drawCanvas).bind('mouseup', mouseup);
    $(drawCanvas).bind('mouseout', mouseout);
    $(drawCanvas).bind('mouseover', mouseover);

}

function saveTrace(){

    //jumpPageInitial();
    //由于pdf文件放大存在上一页、下一页、放大、缩小等功能绘图跟着变化，因此需要为每一页保存笔画和为所有页保存笔画
    traceArray[index] = traceStr;//traceStr代表每一次划线动作，traceArray代表当前页做的所有动作语句
    index++;

    indexArray[pageNum - 1] = index;//indexArray代表第pageNum 页画了多少步。除了pdf文件，该数组仅一个元素代表当前页执行了多少步，等同于index
    tolArray[pageNum - 1] = traceArray;//tolArray代表第pageNum页上所有画图动作语句。除了pdf文件，该数组仅一个元素代表当前页执行的所有动作，等同于traceArray

}

function jumpPageInitial(){
    if(CURRENT_FILE_TYPE_ON_CANVAS === 'PDF')
    {
        //canDraw = true;
        //pdf文件翻转到下一页的分情况处理，到下一页是index初始化为0
        if (!indexArray[pageNum - 1] )
        {   index = 0;
            traceArray = [];
        } else
        {
            index = indexArray[pageNum - 1];
            traceArray = tolArray[pageNum - 1];
            if (index != traceArray.length) {
                for (var j = index; j < traceArray.length; j++)
                    traceArray[j] = "";
            }
        }
    }
}

var clearContext = function (type, obj) {
    if (!type) {

        drawContext.clearRect(0, 0, canvasWidth, canvasHeight);
    } else {

        drawContext.clearRect(0, 0, canvasWidth, canvasHeight);
        copyContext.clearRect(0, 0, canvasWidth, canvasHeight);

        //traceStr += "drawContext.clearRect(0, 0, canvasWidth, canvasHeight);copyContext.clearRect(0, 0, canvasWidth, canvasHeight);";
        /*不考虑撤销操作：20170703miaolijuan
        traceArray[index] = traceStr;
        index++;*/

        connection.send({
            isMessage: true,
            clearDraw: true
        });
        traceStr = "";

        indexArray[pageNum - 1] = index = 0;
        traceArray = [];
        tolArray[pageNum - 1] = traceArray;

        // $(obj).addClass("border_choose");
        $(obj).siblings('span').removeClass("border_choose");
    }
}