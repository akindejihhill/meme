//note, I'm getting a couple of errors in jasmine saying that things
//are undefined, when they infact are not.  This can be verified with 
//console logs in the source files.  Jasmin is crazy.



describe("a test that tests stuff", function(){
    let a;

    it("runs the test", function(){
        a = true;

        expect(a).toBe(true);
    });
});

describe("limitSize returns the maximum width/height for an image that can fit in a box 'maxDimension' in length", function(){
    it("fits an image of width 500 and height 800 into a 300 long box", function(){
        expect(limitSize(500, 800, 300)).toEqual([187,300]);
    })

    it("fits an image of width 500 and height 800 into a 300 long box", function(){
        expect(limitSize(800, 500, 300)).toEqual([300, 187]);
    })

    it("fits an image of width 250 and height 250 into a 300 long box", function(){
        expect(limitSize(250, 250, 300)).toEqual([250,250]);
    })
});

describe("createMeme creates a div with a meme", function(){
    const meme = {};

    beforeEach(function(){
        const meme = {};
        meme.topText = "test";
        meme.bottomText = "test";
        meme.topColor = "#000000";
        meme.bottomColor = "#000000";
        meme.topBgColor = "#FFFFFF";
        meme.bottomBgColor = "#FFFFFF";
        meme.topToggle = "true";
        meme.bottomToggle = "true";
        meme.imgURL = "https://images.dog.ceo/breeds/doberman/n02107142_14425.jpg";
        meme.rounded = "true";
        meme.blackOutline = "false";
        meme.whiteOutline = "false";
        meme.width = 0;
        meme.height = 0;
    });


    it("returns something", function(){
        expect(createMeme(meme, 1)).toBeNull();
    });
});


