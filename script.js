let outputArea = null;
let imageURLBox = null;
let topTextBox = null;
let bottomTextBox = null;
let topColorSelect = null;
let bottomColorSelect = null;
let topBgSelect = null;
let bottomBgSelect = null;
let generateBtn = null;
let topToggle = null;
let bottomToggle = null;
let rounded = null;
let blackOL = null;
let whiteOL = null;
let dog_button = null;

//The following code is experemental HTML2Canvas
//from: https://javascript.plainenglish.io/how-to-take-a-screenshot-of-a-div-with-javascript-641576de0f74#:~:text=We%20can%20use%20the%20html2canvas,it%20into%20a%20canvas%20element.&text=We%20have%20the%20getScreenOfElement%20function,html2canvas%20function%20with%20the%20element%20.
const getScreenshotOfElement = async (element) => {
    const canvas = await html2canvas(element, {allowTaint: true});
    document.querySelector('#canvascontainer').appendChild(canvas);
}
//////////////////////////////////////

//stores all the saved memes
let memeList = [];



//update local storage
function updateStorage(){
    //clear and rewrite localstorage
    localStorage.removeItem("memes");
    localStorage.setItem("memes", JSON.stringify(memeList));
}


/* displayMeme()
*
*  Recieves meme object to display on screen
*  Allowes instructions to be recieved from 
*  different sources, for instance from an event 
*  handler or a local storage reading.
*  
*  Parameters:
*  - memeObject - Contains the following properties
*       topText, bottomText, topColor, bottomColor, 
*       topBgColor, bottomBgColor, topTogle, bottomToggle, imgURL
*
*  - count      - the meme's index in the list
*/
function displayMeme(memeObject, count){
    //crate new elements and set attributes
    let memeBox = document.createElement("div");
    let topBox = document.createElement("div");
    let bottomBox = document.createElement("div");
    let imgBox = document.createElement("div");
    let topP = document.createElement("p");
    let bottomP = document.createElement("p");
    let smlMenu = document.createElement("div")
    let delBtn = document.createElement("div");
    let saveBtn = document.createElement("div");

    memeBox.setAttribute("class", "memebox");
    memeBox.setAttribute("id", "memebox"+count);
    memeBox.style.width = (memeObject.width + 8).toString() + "px";

    delBtn.setAttribute("class", "dltbtn");
    delBtn.setAttribute("id", count);
    delBtn.innerHTML = "&#9746;";

    saveBtn.setAttribute("class", "savebtn");
    saveBtn.innerHTML = "&#128190;";

    smlMenu.setAttribute("id", "smlmenu");

    imgBox.setAttribute("class", "imgbox");
    imgBox.setAttribute("id", "imgbox"+count);

    topBox.style.backgroundColor = memeObject.topBgColor;
    bottomBox.style.backgroundColor = memeObject.bottomBgColor;
    topBox.setAttribute("class", "topbox");
    bottomBox.setAttribute("class", "bottombox");

    topP.innerText = memeObject.topText;
    topP.style.color = memeObject.topColor;
    topP.setAttribute("class", "toptextoutput");
    
    bottomP.innerText = memeObject.bottomText;
    bottomP.style.color = memeObject.bottomColor;
    bottomP.setAttribute("class", "bottomtextoutput");

    //****** add some sort of parser for this to make sure it has
    //****** the proper format
    imgBox.style.backgroundImage = `url('${memeObject.imgURL}')`;
    imgBox.style.width = memeObject.width.toString() + "px";
    imgBox.style.height = memeObject.height.toString() + "px";
    imgBox.style.backgroundSize = `${memeObject.width.toString() + "px"} ${memeObject.height.toString() + "px"}`;
    
    console.log(memeObject.width + " " + memeObject.height);


    //keeping this code just incase someissue arises
    //with using a background image
    // let img = document.createElement("img");
    // img.setAttribute("src", memeObject.imgURL);
    // img.setAttribute("class", "memepic");
    // img.setAttribute("height", memeObject.height.toString() + "px");
    // img.setAttribute("width", memeObject.width.toString() + "px");
    // imgBox.append(img);

    //**Options**//

    //black and white outlines
    if(memeObject.blackOutline){
        memeBox.style.textShadow = "0 0 3px #000000";
    }

    if(memeObject.whiteOutline){
        memeBox.style.textShadow = "0 0 3px #FFFFFF";
    }

    //if the topBgToggle is checked then append the top text to the
    //top box.  If it's not checked, then append the text to the 
    //img box.
    if (memeObject.topToggle){
        topBox.append(topP);
        topBox.style.display = "block";
        topP.style.position = "relative";

        //Rounded option
        if(memeObject.rounded){
            topBox.style.borderTopLeftRadius = "30px";
            topBox.style.borderTopRightRadius = "30px";
            memeBox.style.borderTopLeftRadius = "30px";
            memeBox.style.borderTopRightRadius = "30px";
        }
    }
    else {
        imgBox.append(topP);
        topBox.style.display = "none";
        topP.style.position = "absolute";

        //Rounded option
        if(memeObject.rounded){
            imgBox.style.borderTopLeftRadius = "30px";
            imgBox.style.borderTopRightRadius = "30px";
            memeBox.style.borderTopLeftRadius = "30px";
            memeBox.style.borderTopRightRadius = "30px";
        }
    }

    //if the bottomBg Toggle is checked then append the bottom text
    //to the bottom box.  If it's not checked, then append the text
    //to the img box.
    if (memeObject.bottomToggle){
        bottomBox.append(bottomP);
        bottomBox.style.display = "block";
        bottomP.style.position = "relative";

        //Rounded option
        if(memeObject.rounded){
            bottomBox.style.borderBottomLeftRadius = "30px";
            bottomBox.style.borderBottomRightRadius = "30px";
            memeBox.style.borderBottomLeftRadius = "30px";
            memeBox.style.borderBottomRightRadius = "30px";
        }
    }
    else {
        imgBox.append(bottomP);
        bottomBox.style.display = "none";
        bottomP.style.position = "absolute";

        //Rounded option
        if(memeObject.rounded){
            imgBox.style.borderBottomLeftRadius = "30px";
            imgBox.style.borderBottomRightRadius = "30px";
            memeBox.style.borderBottomLeftRadius = "30px";
            memeBox.style.borderBottomRightRadius = "30px";
        }

    }

    smlMenu.append(delBtn);
    smlMenu.append(saveBtn);

    memeBox.append(topBox);
    memeBox.append(imgBox);
    memeBox.append(bottomBox);
    memeBox.append(smlMenu);   

    outputArea.append(memeBox);
    
    //alert();
}

//update local storage
function updateStorage(){
    //clear and rewrite localstorage
    localStorage.removeItem("memes");
    localStorage.setItem("memes", JSON.stringify(memeList));
}


function generateHandler(){

    //find out if the image needs to be resized
    //if so, resize it to fit in a 400 x 400 box
    /*
    *citation* strategy found on stack overflow
    *https://stackoverflow.com/questions/5633264/javascript-get-image-dimensions
    *answer contributed by "shumii"
    */
    //****** I may need to throw exceptions here
    //****** if the image doesn't load (i.e. bad url)
    let newImg = new Image();
    newImg.onload = function(){
        let height = newImg.height;
        let width = newImg.width;

        while(height > 525 || width > 525){
            if(height > 525){
                width = Math.floor(width/(height/525));
                height = 525;
            }
            if(width > 525){
                height = Math.floor(height/(width/525));
                width = 525;
            }
        }

        let meme = {
            topText: topTextBox.value, 
            bottomText: bottomTextBox.value, 
            topColor: topColorSelect.value, 
            bottomColor: bottomColorSelect.value, 
            topBgColor: topBgSelect.value, 
            bottomBgColor: bottomBgSelect.value, 
            topToggle: topToggle.checked, 
            bottomToggle: bottomToggle.checked,
            imgURL: imageURLBox.value,
            rounded: rounded.checked,
            blackOutline: blackOL.checked,
            whiteOutline: whiteOL.checked,
        }
        
         meme.height = height;
         meme.width = width;

        memeList.push(meme);                //add meme to list of memes
        displayMeme(meme, memeList.length); //add meme to page
        updateStorage();                //save memes to local storage
        
        //clear all the input fields to fill requirement
        // (even though it's a terrible feature)
        //document.getElementById("memeform").reset();


    }

    //if it looks like a valid url was submitted
    //carry on
    let picURL = imageURLBox.value;
    if(picURL.startsWith("http://") || picURL.startsWith("https://")){
        try{newImg.src = imageURLBox.value;} catch (err){
            console.log("something went wrong!")
        }  //once this loads, it's off and poppin!
    }else alert("Please enter a valid image URL");
    

}

//Delete list items
let outputClickHandler = function(event){

    //if a delete button was clicked
    if(event.target.classList[0] === "dltbtn"){
        let num = event.target.id;
        num--;
        memeList.splice(num, 1);
        updateStorage();
        //erase and reload the memes
        //so that they are renumbered according
        //to the new array index
        let memeBoxes = document.getElementsByClassName("memebox");
        while(memeBoxes.length > 0){
            memeBoxes[0].remove();
        }

        for(item in memeList){
            displayMeme(memeList[item], parseInt(item)+1);
        }

    }

    //if a save button was clicked
    if(event.target.classList[0] === "savebtn"){

        if(document.getElementsByTagName("canvas")[0]){
            const can = document.getElementById("canvascontainer");
            can.removeChild(can.firstElementChild);
        }

        getScreenshotOfElement(event.target.parentElement.parentElement);
    }
}


function initializeApp(){

    outputArea = document.getElementById("output");
    imageURLBox = document.getElementById("address");
    topTextBox = document.getElementById("toptext");
    bottomTextBox = document.getElementById("bottomtext");
    topColorSelect = document.getElementById("topcolor")
    bottomColorSelect = document.getElementById("bottomcolor")
    topBgSelect = document.getElementById("topbg");
    bottomBgSelect = document.getElementById("bottombg");
    generateBtn = document.getElementById("generate");
    topToggle = document.getElementById("toptoggle");
    bottomToggle = document.getElementById("bottomtoggle");
    rounded = document.getElementById("rounded");
    blackOL = document.getElementById("blackoutline");
    whiteOL = document.getElementById("whiteoutline");
    dog_button = document.getElementById("dog_button");

    //Fetching Dog image from API
    const dogRequest = new XMLHttpRequest();

    dogRequest.addEventListener('load', function(){
        const response = JSON.parse(this.responseText);
        const url = response.message;

        response.status === 'error' ? alert(`${response.code}: ${response.message} : \n Sorry, looks like this button is broken :(`) : imageURLBox.value = url;
    });

    dogRequest.addEventListener('error', function(){
        alert("There was a problem fetching a dog image.  Try again later.");
    });    


    //the dog button
    dog_button.addEventListener("click", () => {
        dogRequest.open("get", "https://dog.ceo/api/breeds/image/random");
        dogRequest.send();
    });

    //Pull data from local storage. 
    //Make sure the data is the list we expect and (done)
    //contains the objects we expect (will work on this later -maybe).
    //Retrieve and number the stored items
    if(localStorage.getItem("memes")){
        memeList = JSON.parse(localStorage.getItem("memes"));

        for(item in memeList){
                displayMeme(memeList[item], parseInt(item)+1);
        }
    } else memeList = [];

    //this will delegate to any buttons I decide to put
    //in the output area
    outputArea.addEventListener("click", outputClickHandler);

    //the function and animation for the "Generate" button
    generateBtn.addEventListener("click", generateHandler);
    generateBtn.addEventListener("mousedown", (e) => { e.target.classList.add("press") });
    generateBtn.addEventListener("mouseup", (e) => { e.target.classList.remove("press") });

}


//start app after dom has loaded
document.addEventListener("DOMContentLoaded", initializeApp);


