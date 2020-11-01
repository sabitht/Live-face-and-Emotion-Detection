const video=document.getElementById("video")
//TO LOAD ALL THE THREE FACE DETECTION MODELS
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('models'),
    faceapi.nets.faceExpressionNet.loadFromUri('models')
]).then(beginVideo())

async function beginVideo() {
    let stream=null
    try{
        stream=await navigator.mediaDevices.getUserMedia({audio:false,video:true});
        video.srcObject=stream;
    }
    catch(err){
        alert("unable to connect to device")
        console.log(err);
    }    
}

//start detection only when the video starts/plays

video.addEventListener('play',()=>{
    //to highlight the face we put a canvas
    const canvas=faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    //canvas should have hei nd weig same as video so as to plot correct eyes,mouth etcc landmark
    const dim={width:video.width,height:video.height}
    faceapi.matchDimensions(canvas,dim)
//Refresh the detection after every 100 millisecond 
    setInterval(async()=>{
        //detectfaces
       const detections=await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
       const resizeDetection=faceapi.resizeResults(detections,dim)
       canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height)
       faceapi.draw.drawDetections(canvas,resizeDetection)
       faceapi.draw.drawFaceLandmarks(canvas,resizeDetection)
       faceapi.draw.drawFaceExpressions(canvas,resizeDetection)

    },100);
})