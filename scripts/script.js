//store references to the DOM elements that we be required
//using one global element instead of many
const elements = {};

//stores all the saved memes
let memeList = [];

/**
 * The following code is experemental HTML2Canvas
 * from: https://javascript.plainenglish.io/how-to-take-a-screenshot-of-a-div-with-javascript-641576de0f74#:~:text=We%20can%20use%20the%20html2canvas,it%20into%20a%20canvas%20element.&text=We%20have%20the%20getScreenOfElement%20function,html2canvas%20function%20with%20the%20element%20.
 * @param {*} element 
 */
async function getScreenshotOfElement(element){
    const canvas = await html2canvas(element, {allowTaint: true});
    return canvas;
}

/**Clears and rewrites localstorage
 * This impure function is not really
 * that nessesary, but it avoids repeated
 * code */
function updateStorage(){
    localStorage.removeItem("memes");
    localStorage.setItem("memes", JSON.stringify(memeList));
}

/* createMeme()
*
*  Recieves meme object to display on screen
*  Creates Dom elements needed to display the result
* 
*  Parameters:
*  - memeObject - Contains the following properties
*       topText, bottomText, topColor, bottomColor, 
*       topBgColor, bottomBgColor, topTogle, bottomToggle, imgURL
*
*  - count      - the meme's index in the list
*/
function createMeme(memeObject, count){
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

    return memeBox;
}

/**
 * limit the dimentions to maxDimension. Adjust
 * the smaller side proportionately
 * @param {*} width 
 * @param {*} height 
 * @param {*} maxDimension 
 * @returns 
 */
function limitSize(width, height, maxDimension){
    while(height > maxDimension || width > maxDimension){
        if(height > maxDimension){
            width = Math.floor(width/(height/maxDimension));
            height = maxDimension;
        }
        if(width > maxDimension){
            height = Math.floor(height/(width/maxDimension));
            width = maxDimension;
        }
    }

    return [width,height];
}

/**
 * Generates a meme when the 'Generate' button is clicked.
 */
function generateHandler(){
    //****** I may need to throw exceptions here
    //****** if the image doesn't load (i.e. bad url)
    let newImg = new Image();
    newImg.onload = function(){
        let height = newImg.height;
        let width = newImg.width;

        // const meme = {
        //     topText: elements.topTextBox.value, 
        //     bottomText: elements.bottomTextBox.value, 
        //     topColor: elements.topColorSelect.value, 
        //     bottomColor: elements.bottomColorSelect.value, 
        //     topBgColor: elements.topBgSelect.value, 
        //     bottomBgColor: elements.bottomBgSelect.value, 
        //     topToggle: elements.topToggle.checked, 
        //     bottomToggle: elements.bottomToggle.checked,
        //     imgURL: elements.imageURLBox.value,
        //     rounded: elements.rounded.checked,
        //     blackOutline: elements.blackOL.checked,
        //     whiteOutline: elements.whiteOL.checked,
        // }

        // console.log(meme);
        // //what is going on here?  When the above console.log is commented out the
        // //app breaks and 'meme' has no properties defined.  Why?
        // //Answer: Turns out creating an object with lots of values to pull from the
        // //UI takes too long and is practically asyncronous, and the rest of the
        // //program continues without the values.  To get around it I had
        // //to create the object, and then assign each property separately.
        

        const meme = {};
        meme.topText = elements.topTextBox.value;
        meme.bottomText = elements.bottomTextBox.value;
        meme.topColor = elements.topColorSelect.value;
        meme.bottomColor = elements.bottomColorSelect.value;
        meme.topBgColor = elements.topBgSelect.value;
        meme.bottomBgColor = elements.bottomBgSelect.value;
        meme.topToggle = elements.topToggle.checked;
        meme.bottomToggle = elements.bottomToggle.checked;
        meme.imgURL = elements.imageURLBox.value;
        meme.rounded = elements.rounded.checked;
        meme.blackOutline = elements.blackOL.checked;
        meme.whiteOutline = elements.whiteOL.checked;

        [width, height] = limitSize(width, height, 525);
        
        meme.height = height;
        meme.width = width;

        memeList.push(meme);                //add meme to list of memes
        const memeBox = createMeme(meme, memeList.length); //add meme to page
        elements.outputArea.append(memeBox);
        updateStorage();                //save memes to local storage
    }

    //if it looks like a valid url was submitted
    //carry on
    let picURL = elements.imageURLBox.value;
    if(picURL.startsWith("http://") || picURL.startsWith("https://")){
        try{newImg.src = elements.imageURLBox.value;} catch (err){
            console.log("something went wrong!")
        }  //once this loads, it's off and poppin!
    }else alert("Please enter a valid image URL");
}

/**
 * Click handler for buttons in the output area
 * Two so far: Delete output or Create a png
 */
async function outputClickHandler(event){

    //if a delete button was clicked
    if(event.target.classList[0] === "dltbtn"){
        let num = event.target.id;
        num--;
        memeList.splice(num, 1);    //note: memList is a global variable
        updateStorage();
        //erase and reload the memes
        //so that they are renumbered according
        //to the new array index
        let memeBoxes = document.getElementsByClassName("memebox");
        while(memeBoxes.length > 0){
            memeBoxes[0].remove();
        }

        //reloading memes onto the page
        for(item in memeList){
            const memeBox = createMeme(memeList[item], parseInt(item)+1); //add meme to page
            elements.outputArea.append(memeBox);
        }

    }

    //if a save button was clicked
    if(event.target.classList[0] === "savebtn"){

        //remove old canvas image if exists
        if(document.getElementsByTagName("canvas")[0]){
            const can = document.getElementById("canvascontainer");
            can.removeChild(can.firstElementChild);
        }

        //create new image in the canvas
        const canvas = await getScreenshotOfElement(event.target.parentElement.parentElement);
        document.querySelector('#canvascontainer').appendChild(canvas);
    }
}

/**sets up the page for its various inputs and functions.  
 * Certain sections could be their own impure functions, but since they would 
 * be side-effecty AF and are only used once, may as well just leave them here.
 * Functional sections are separated for readability*/
function initializeApp(){

    //When it comes to DOM manipulation we love our side effects
    //but at least these are contained by only one global object.
    elements.outputArea = document.getElementById("output");
    elements.imageURLBox = document.getElementById("address");
    elements.topTextBox = document.getElementById("toptext");
    elements.bottomTextBox = document.getElementById("bottomtext");
    elements.topColorSelect = document.getElementById("topcolor")
    elements.bottomColorSelect = document.getElementById("bottomcolor")
    elements.topBgSelect = document.getElementById("topbg");
    elements.bottomBgSelect = document.getElementById("bottombg");
    elements.generateBtn = document.getElementById("generate");
    elements.topToggle = document.getElementById("toptoggle");
    elements.bottomToggle = document.getElementById("bottomtoggle");
    elements.rounded = document.getElementById("rounded");
    elements.blackOL = document.getElementById("blackoutline");
    elements.whiteOL = document.getElementById("whiteoutline");
    elements.dogButton = document.getElementById("dogbutton");

     ////////////////////////////////////////////////////////////////
    //Setup an API request to be sent when the dogButton is pressed
    const dogRequest = new XMLHttpRequest();

    dogRequest.addEventListener('load', function(){
        const response = JSON.parse(this.responseText);
        const url = response.message;

        response.status === 'error' ? alert(`${response.code}: ${response.message} : \n Sorry, looks like this button is broken :(`) : elements.imageURLBox.value = url;
    });

    dogRequest.addEventListener('error', function(){
        alert("There was a problem fetching a dog image.  Try again later.");
    });    


    //the dog button
    elements.dogButton.addEventListener("click", () => {
        dogRequest.open("get", "https://dog.ceo/api/breeds/image/random");
        dogRequest.send();
    });
     //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////

    //Pull data from local storage. 
    //Retrieve and number the stored items
    if(localStorage.getItem("memes")){
        memeList = JSON.parse(localStorage.getItem("memes"));

        for(item in memeList){
                const memeBox = createMeme(memeList[item], parseInt(item)+1); //add meme to page
                elements.outputArea.append(memeBox);
        }
    } else memeList = [];

    //Creates a delegator for any buttons I decide to put in the output area
    elements.outputArea.addEventListener("click", outputClickHandler);

    //the function and animation for the "Generate" button
    elements.generateBtn.addEventListener("click", generateHandler);
    elements.generateBtn.addEventListener("mousedown", (e) => { e.target.classList.add("press") });
    elements.generateBtn.addEventListener("mouseup", (e) => { e.target.classList.remove("press") });

}


//start app after dom has loaded
document.addEventListener("DOMContentLoaded", initializeApp);


