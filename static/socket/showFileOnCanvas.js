//
// If absolute URL from the remote server is provided, configure the CORS
// header on that server.
//
var fileOnCanvasUrl = '';


//
// Disable workers to avoid yet another cross-origin issue (workers need
// the URL of the script to be loaded, and dynamically loading a cross-origin
// script does not work).
//
// PDFJS.disableWorker = true;

//
// In cases when the pdf.worker.js is located at the different folder than the
// pdf.js's one, or the pdf.js is executed via eval(), the workerSrc property
// shall be specified.
//
// PDFJS.workerSrc = '../../build/pdf.worker.js';

var pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 1,
    preScale = 1;
    /*canvas = document.getElementById('viewBack'),
    ctx = canvas.getContext('2d');*/

var SCALE_GAP = 0.1;
var CANVAS_DEFAULT_WIDTH = 840, CANVAS_DEFAULT_HEIGHT = 600;
var CURRENT_FILE_TYPE_ON_CANVAS = "NULL";/*"PDF" "IMAGE"*/

/**
 * Get page info from document, resize canvas accordingly, and render page.
 * @param num Page number.
 */
function renderPage(num) {
    pageRendering = true;
    // Using promise to fetch the page
    pdfDoc.getPage(num).then(function (page) {
        var viewport = page.getViewport(scale);
        console.log("scale:" + scale);

        pdfCanvas.height = viewport.height;
        // canvas.style.width = viewport.width + 'px';
        // canvas.width = viewport.width;
        //pdfCanvas.width = 840;
        pdfCanvas.width = viewport.width;


       copyCanvas.height = viewport.height;
        copyCanvas.width =  viewport.width;

        drawCanvas.height = viewport.height;
        drawCanvas.width =  viewport.width;

        canvasWidth = viewport.width;
        canvasHeight = viewport.height;


        console.log(pdfCanvas.width, pdfCanvas.height);

        //jumpPageInitial();

        // Render PDF page into canvas context
        var renderContext = {
            canvasContext: pdfContext,
            viewport: viewport
        };

        var renderTask = page.render(renderContext);

        // Wait for rendering to finish
        renderTask.promise.then(function () {
            pageRendering = false;
            if (pageNumPending !== null) {
                // New page rendering is pending
                renderPage(pageNumPending);
                pageNumPending = null;
            }

            //对于上一页已经有划线的情况
            drawContext.clearRect(0, 0, canvasWidth, canvasHeight);
            copyContext.clearRect(0, 0, canvasWidth, canvasHeight);
            for (var i = 0; i < index; i++) {
                eval(traceArray[i]);
            }

        });
    });

    // Update page counters
    // document.getElementById('page_num').textContent = pageNum;
}

/**
 * If another page rendering in progress, waits until the rendering is
 * finised. Otherwise, executes rendering immediately.
 */
function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

/**
 * Displays previous page.
 */
function onPrevPage() {
    if(CURRENT_FILE_TYPE_ON_CANVAS === 'PDF'){
        PrevPage();
        connection.send({
            isMessage: true,
            fileOperate: 'PrevPage'
        });
    }

}
function PrevPage(){
    if (pageNum <= 1) {
        return;
    }
    pageNum--;
    jumpPageInitial();
    queueRenderPage(pageNum);
}
document.getElementById('pre-page').addEventListener('click', onPrevPage);

/**
 * Displays next page.
 */
function onNextPage() {
    if(CURRENT_FILE_TYPE_ON_CANVAS === 'PDF'){
        NextPage();
        connection.send({
            isMessage: true,
            fileOperate: 'NextPage'
        });
    }
}

function NextPage(){
    if (pageNum >= pdfDoc.numPages ) {
        return;
    }
    pageNum++;
    /*if(!tolArray[pageNum-1])
     {   index = 0;
     traceArray = [];
     }*/
    jumpPageInitial();
    queueRenderPage(pageNum);
}
document.getElementById('next-page').addEventListener('click', onNextPage);


/**
 * Displays zoomOut page.
 */
function onPDFZoomOut() {
    //if (scale >= 2.0) {
    //    return;
    //}
    //
    //scale = scale + SCALE_GAP;
    queueRenderPage(pageNum);
}




/**
 * Displays zoomIn page.
 */
function onPDFZoomIn() {
    //if (scale <= 0.4) {
    //    return;
    //}
    //
    //scale = scale - SCALE_GAP;
    queueRenderPage(pageNum);
}


/**
 * Asynchronously downloads PDF.
 */

function showPDF(url) {
    PDFJS.getDocument(url).then(function (pdfDoc_) {
        pdfDoc = pdfDoc_;
        // document.getElementById('page_count').textContent = pdfDoc.numPages;

        // Initial/first page rendering
        renderPage(pageNum);
    });
}



document.getElementById('show-file').onclick = function () {
    var selectFile = new FileSelector();
    selectFile.selectSingleFile(function (file) {


        if (file.type === 'application/pdf') {

            //url = URL.createObjectURL(file);

            copyContext.clearRect(0, 0, canvasWidth, canvasHeight);
            scale = 1;
            CURRENT_FILE_TYPE_ON_CANVAS = 'PDF';

            //showPDF(url);

            /*var filereader = new FileReader();
            console.log("read pdf file..");
            filereader.readAsDataURL(file);

            filereader.onload = function(e){

                console.log("onload");
                connection.send({
                    isMessage: true,
                    type: 'pdf',
                    data: e.target.result
                });
            };*/

            connection.send(file);
           /* for (var i = 0; i < index; i++) {
                eval(traceArray[i]);

            }
            traceStr = "";*/

        } else {
            var re = /^(image)\//;
            if (re.test(file.type)) {
                copyContext.clearRect(0, 0, canvasWidth, canvasHeight);
                scale = 1;
                CURRENT_FILE_TYPE_ON_CANVAS = 'IMAGE';

               /* //2017.07.03:miaolijuan
                var img = document.createElement('img');
                var filereader = new FileReader();
                console.log("read image..");
                filereader.readAsDataURL(file);

                filereader.onload = function(e){
                    img.src = e.target.result;

                    showImage(img.src);

                    connection.send({
                        isMessage: true,
                        type: 'image',
                        data: img.src
                    });
                };*/
                connection.send(file);

            } else {
                alert('请选择pdf格式文件或图片,其他格式暂不支持');
            }
        }
    });
}


document.getElementById('zoom-in').onclick = function () {
    if (scale <= 0.1) {
        return;
    }

    //scale = scale - SCALE_GAP;
    /*copyContext.clearRect(0, 0, canvasWidth, canvasHeight);
    for (var i = 0; i < index; i++) {
        eval(traceArray[i]);

    }
    traceStr = "";*/

    if(CURRENT_FILE_TYPE_ON_CANVAS === 'NULL'){}
    else if(CURRENT_FILE_TYPE_ON_CANVAS === 'PDF'){
        scale = scale - SCALE_GAP;
        onPDFZoomIn();
        //drawCurrentTrace();
    }else if(CURRENT_FILE_TYPE_ON_CANVAS === 'IMAGE'){
        console.log("image zoom in ");
        scale = scale - SCALE_GAP;
        onImageZoomIn();
        setTimeout(drawCurrentTrace,100);
    }

    connection.send({
        isMessage: true,
        fileOperate: 'ZoomIn'
    });
}


document.getElementById('zoom-out').onclick = function () {
    /*if (scale >= 3.0) {
        return;
    }*/

    //scale = scale + SCALE_GAP;
    //画出当前页的所有绘图
    //copyContext.clearRect(0, 0, canvasWidth, canvasHeight);
 /*   for (var i = 0; i < index; i++) {
        eval(traceArray[i]);

    }
    traceStr = "";*/
    if(CURRENT_FILE_TYPE_ON_CANVAS === 'NULL'){}
    else if(CURRENT_FILE_TYPE_ON_CANVAS === 'PDF'){
        scale = scale + SCALE_GAP;
        onPDFZoomOut();
        //drawCurrentTrace();
    }else if(CURRENT_FILE_TYPE_ON_CANVAS === 'IMAGE'){
        console.log("image zoom out");
        scale = scale + SCALE_GAP;
        onImageZoomOut();
        //drawCurrentTrace();由于要等待图片在pdfcanvas绘图好后才能在copyCanvas上画图，否则先在copyCanvas上的绘图会被图片覆盖
        setTimeout(drawCurrentTrace,100);

    }

    connection.send({
        isMessage: true,
        fileOperate: 'ZoomOut'
    });
}

function clearFile() {
    scale = 1;

    canvasWidth = 840;
    canvasHeight = 600;

    drawCanvas.width = canvasWidth;
    drawCanvas.height = canvasHeight;

    copyCanvas.width = canvasWidth;
    copyCanvas.height = canvasHeight;

    pdfCanvas.width = CANVAS_DEFAULT_WIDTH;
    pdfCanvas.height = CANVAS_DEFAULT_HEIGHT;

    drawContext.clearRect(0, 0, canvasWidth, canvasHeight);
    copyContext.clearRect(0, 0, canvasWidth, canvasHeight);
    pdfContext.clearRect(0, 0, CANVAS_DEFAULT_WIDTH, CANVAS_DEFAULT_HEIGHT);


    traceArray = [];
    indexArray = [];
    tolArray = [];

    pageNum = 1;
}

function showImage(url) {
    var image = new Image();
    image.src = url;
    image.onload = function () {

        //默认情况下，图片小于canvas大小
        pdfCanvas.height = CANVAS_DEFAULT_HEIGHT;
        pdfCanvas.width = CANVAS_DEFAULT_WIDTH;

        console.log("after scale,image.height"+image.height*scale);
        console.log("after scale,image.width"+image.width*scale);
        if(image.height*scale >= CANVAS_DEFAULT_HEIGHT)
        {
            pdfCanvas.height = image.height*scale;

            copyCanvas.height = image.height*scale;

            drawCanvas.height = image.height*scale;

            canvasHeight = image.height*scale;

        }

        if(image.width*scale >= CANVAS_DEFAULT_WIDTH)
        {
            pdfCanvas.width = image.width*scale;

            copyCanvas.width = image.width*scale;

            drawCanvas.width = image.width*scale;

            canvasWidth = image.width*scale;
        }

        pdfContext.clearRect(0,0,pdfCanvas.width,pdfCanvas.height);
        drawContext.clearRect(0, 0, canvasWidth, canvasHeight);
        copyContext.clearRect(0, 0, canvasWidth, canvasHeight);

        // ctx.drawImage(image, 0, 0);
        pdfContext.drawImage(image,0,0,image.width,image.height,0,0,image.width*scale,image.height*scale);
    }
}

function  onImageZoomOut() {
    //if (scale >= 2.0) {
    //    return;
    //}
    //
    //scale = scale + SCALE_GAP;
    showImage(fileOnCanvasUrl);
}

function  onImageZoomIn() {
    //if (scale <= 0.4) {
    //    return;
    //}
    //
   // scale = scale - SCALE_GAP;
    showImage(fileOnCanvasUrl);
}

function drawCurrentTrace(){
    console.log("drawCurrentTrace...");

    for (var i = 0; i < index; i++) {
        eval(traceArray[i]);
    }

}