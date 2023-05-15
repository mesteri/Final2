const images = document.querySelectorAll("img");
let currentPage = 1;
let keyword = "";
let selectedImage = "";
var SpeechRec = new p5.SpeechRec();
let pword = "";
SpeechRec.continuous = true;
SpeechRec.interimResults = true;
let loadedImages = []; // store loaded images in an array
let loaded = false; // flag to indicate whether all images are loaded
let imageSize = 400; // size of each image
let numImages = 2; // number of images to display
let loadedeffect = Math.floor(Math.random() * 3) + 1;
let myVideo;
let myCanvas;
let otherVideo;
let videoWidth = 640;
let videoHeight = 360;
let oldPixels = new Array(videoWidth * videoHeight * 4); // Initialize the array with the correct length


function setup() {
  myCanvas = createCanvas(1860, 1050);
  SpeechRec.start();
  SpeechRec.onResult = setResult;
  SpeechRec.onStart = onStart;
  background(255);
  
  showImage = createImage(videoWidth, videoHeight);

  // Requesting video from createCapture
  let constraints = {
    video: {
      mandatory: {
        minWidth: videoWidth,
        minHeight: videoHeight
      },
      optional: [{
        maxFrameRate: 30
      }]
    },
  };

  myVideo = createCapture(constraints, function(stream) {
    // Need to use the callback to get at the video stream

    // Get a stream from the canvas
    let canvasStream = myCanvas.elt.captureStream(30);
 
    myVideo.size(videoWidth, videoHeight);
  });
  myVideo.elt.muted = true;
  myVideo.hide();
}
 
function displayImages(keyword, page) {
    fetch(`https://apis.scrimba.com/unsplash/search/photos?query=${keyword}&page=${page}`)
        .then(res => res.json())
        .then(data => { 
            loadedImages = []; // clear loaded images
            for(let i = 0; i < numImages; i++) {
                let img = loadImage(data.results[i].urls.small, () => {
                    loadedImages.push(img);
                    if (loadedImages.length === numImages) {
                        loaded = true; // set loaded flag when all images are loaded
                       // redraw(); // redraw canvas when all images are loaded but I outcommented at the moment for increase the speed.
                    }
                });
            }
        })
}



function draw() {
  
//IMAGES
  
  picLoaderOriginal();
  
//VIDEO
// Do the threshold 1 time in setup
 showImage.loadPixels();
 myVideo.loadPixels();
 // insertVideo();
 GraphVideoEffect1();
}
  
function onStart(){
    pword = SpeechRec.resultString;
}

// Use this for showing the pics in HTML for checking
//function showPic(){
//    let keyword = "speech"; // set a default keyword
//    displayImages(keyword, currentPage);
//}
  
function setResult(){
    if(SpeechRec.resultConfidence < 0.005 || pword == SpeechRec.resultString){ //float value (0.0-1.0) representing the confidence level of the speech synthesizer that resultString is what was actually spoken by the user.
        return 0;
    }
    pword = SpeechRec.resultString;
    console.log(pword);
    let keyword = pword;
    console.log(keyword);
    switch(SpeechRec.resultString){  
        case pword:
            displayImages(keyword, currentPage); // call displayImages function with the recognized keyword
            break;
    }
}

function picLoaderOriginal(){
if (loaded) {
    for (let i = 0; i < numImages; i++) {
      let xPosition = random (0, width-imageSize);
      let yPosition = random (0, height-imageSize);
        tint(255, 255);
    image(loadedImages[i], xPosition * i, yPosition *i, imageSize, imageSize);
  }
  loaded = false; // reset loaded flag for next batch of images
}
}

function picLoaderPosterFilter() {
  if (loaded) {
      for (let i = 0; i < numImages; i++) {
        let xPosition = random (0, width-imageSize);
      let yPosition = random (0, height-imageSize);
      let loadedPicture = loadedImages[i];
      // create a new graphics buffer to apply the filter
      let pg = createGraphics(imageSize, imageSize);
      pg.image(loadedPicture, 0, 0, imageSize, imageSize);
      pg.filter(POSTERIZE, 3); // apply posterize filter
      // draw the filtered image to the canvas
       tint(255, 255);
      image(pg, xPosition * i, yPosition * i, imageSize, imageSize);
    }
    loaded = false; // reset loaded flag for next batch of images
  }
}

function picLoaderBW() {
  if (loaded) {
      for (let i = 0; i < numImages; i++) {
        let xPosition = random (0, width-imageSize);
        let yPosition = random (0, height-imageSize);
      let loadedPicture = loadedImages[i];
      // create a new graphics buffer to apply the filter
      let pg = createGraphics(imageSize, imageSize);
      pg.image(loadedPicture, 0, 0, imageSize, imageSize);
      pg.filter(GRAY, 3); // apply filter
      // draw the filtered image to the canvas
      tint(255, 255);
      image(pg, xPosition * i, yPosition * i, imageSize, imageSize);
    }
    loaded = false; // reset loaded flag for next batch of images
  }
}

function insertVideo(){  
  for (let i = 0; i < myVideo.pixels.length; i += 4) {
    let r = myVideo.pixels[i];
    let g = myVideo.pixels[i + 1];
    let b = myVideo.pixels[i + 2];
    let oldr = oldPixels[i];
    let oldg = oldPixels[i + 1];
    let oldb = oldPixels[i + 2];

    if (dist(r, g,  oldr, oldg) >  25) {
      showImage.pixels[i] = r;
      showImage.pixels[i + 1] = g;
      showImage.pixels[i + 2] = b;
      showImage.pixels[i + 3] = 255;
    } else {
      showImage.pixels[i] = 127;
      showImage.pixels[i + 1] = 127;
      showImage.pixels[i + 2] = 127;
      showImage.pixels[i + 3] = 30;
    }
    oldPixels[i] = myVideo.pixels[i];
    oldPixels[i + 1] = myVideo.pixels[i + 1];
    oldPixels[i + 2] = myVideo.pixels[i + 2];
  }
  showImage.updatePixels();
       
    let scaleFactor = 5; // set the scale factor to X to increase the size by Xhundred %
    let scaledWidth = videoWidth * scaleFactor; // calculate the new width of the image
    let scaledHeight = videoHeight * scaleFactor; // calculate the new height of the image
    tint(255, 100);
    image(showImage, (width/2)-(scaledWidth/2), height-scaledHeight, scaledWidth, scaledHeight); //center of bottom
  
}


function insertVideoEffect1(){  
  for (let i = 0; i < myVideo.pixels.length; i += 4) {
    let r = myVideo.pixels[i];
    let g = myVideo.pixels[i + 1];
    let b = myVideo.pixels[i + 2];
    let oldr = oldPixels[i];
    let oldg = oldPixels[i + 1];
    let oldb = oldPixels[i + 2];

    if (dist(r, g,  oldr, oldg) >  25) {
      showImage.pixels[i] = r;
      showImage.pixels[i + 1] = g;
      showImage.pixels[i + 2] = b;
      showImage.pixels[i + 3] = 255;
    } else {
      showImage.pixels[i] = 127;
      showImage.pixels[i + 1] = 127;
      showImage.pixels[i + 2] = 127;
      showImage.pixels[i + 3] = 30;
    }
    oldPixels[i] = myVideo.pixels[i];
    oldPixels[i + 1] = myVideo.pixels[i + 1];
    oldPixels[i + 2] = myVideo.pixels[i + 2];
  }
  showImage.updatePixels();
    
    let scaleFactor = 5; // set the scale factor to X to increase the size by Xhundred %
    let scaledWidth = videoWidth * scaleFactor; // calculate the new width of the image
    let scaledHeight = videoHeight * scaleFactor; // calculate the new height of the image
    tint(255, 100);
    image(showImage, (width/2)-(scaledWidth/2), height-scaledHeight, scaledWidth, scaledHeight); //center of bottom
  
}

function GraphVideoEffect1(){  
  for (let i = 0; i < myVideo.pixels.length; i += 4) {
    let r = myVideo.pixels[i];
    let g = myVideo.pixels[i + 1];
    let b = myVideo.pixels[i + 2];
    let oldr = oldPixels[i];
    let oldg = oldPixels[i + 1];
    let oldb = oldPixels[i + 2];

    if (dist(r, g,  oldr, oldg) >  25) {
      showImage.pixels[i] = r;
      showImage.pixels[i + 1] = g;
      showImage.pixels[i + 2] = b;
      showImage.pixels[i + 3] = 255;
    } else {
      showImage.pixels[i] = 255;
      showImage.pixels[i + 1] = 255;
      showImage.pixels[i + 2] = 255;
      showImage.pixels[i + 3] = 255;
    }
    oldPixels[i] = myVideo.pixels[i];
    oldPixels[i + 1] = myVideo.pixels[i + 1];
    oldPixels[i + 2] = myVideo.pixels[i + 2];
  }
  showImage.updatePixels();
  
    let scaleFactor = 3; // set the scale factor to X to increase the size by Xhundred %
    let scaledWidth = videoWidth * scaleFactor; // calculate the new width of the image
    let scaledHeight = videoHeight * scaleFactor; // calculate the new height of the image
    tint(255, 10);
    //image(showImage, (width/2)-(scaledWidth/2), height-scaledHeight, scaledWidth, scaledHeight); //Center of bottom
    //image(showImage, (width/2)-(scaledWidth/2), height/2-scaledHeight, scaledWidth, scaledHeight); //Center of upscreen
    image(showImage, width-(scaledWidth), height-scaledHeight, scaledWidth, scaledHeight); // Right Down Corner
  
}