var ernLang = {
    keywords: {
        "article": "tag",
        "br": "tag",
        "div": "tag",
        "em": "tag",
        "footer": "tag",
        "form": "tag",
        "header": "tag",
        "h1": "tag",
        "h2": "tag",
        "h3": "tag",
        "h4": "tag",
        "h5": "tag",
        "h6": "tag",
        "hr": "tag",
        "i": "tag",
        "input": "tag",
        "img": "tag",
        "label": "tag",
        "main": "tag",
        "nav": "tag",
        "p": "tag",
        "section": "tag",
        "span": "tag",
        "strong": "tag",
        "textarea": "tag",
        
        "action": "attr",
        "class": "attr",
        "for": "attr",
        "href": "attr",
        "id": "attr",
        "name": "attr",
        "method": "attr",
        "src": "attr",
        "target": "attr",
        "type": "attr"
    },
    
    restrict: false,
    
    parseCode: function(text){
        var splitArray = text.split("\n"); //splits the text up by lines
        var finalText = ""; //string to append all text conversions to
        
        var prevDepth = 0; //the previous line's tab depth
        var queue = []; //queue for holding tag names that still need to be closed
        for(let i = 0; i < splitArray.length; i++){
            var str = splitArray[i];
            
            //if current line is all whitespace characters, start loop over without performing any logic
            if(!/\S/.test(str)){
                continue;
            }
            
            //find tab depth; if tab depth is less than or equal to previous tab depth, pop tag from queue so it can be closed
            var indentDepth = /^\t*/.exec(str)[0].length;
            if(prevDepth >= indentDepth){
                while(queue.length > 0 && queue[queue.length - 1].depth >= indentDepth){
                    let ele = queue.pop();
                    finalText += "\t".repeat(ele.depth) + "</" + ele.tagname + ">\n";
                }
            }
            prevDepth = indentDepth;
            finalText += "\t".repeat(indentDepth);
            
            var prevState = []; //queue for holding previous states of disregardTexts; used when ()'s are invoked
            var disregardText = false; //if a quote character is found, ignore any following text until next quote character
            var keywordPerLine = 0; //for calculating inline tag blocks
            var textOnLine = false; //also for calculating inline tag blocks
            for(let strPos = indentDepth; strPos < str.length; strPos++){
                if(str.charAt(strPos) === "\""){
                    //if quote character found, toggle disregard text and set inline tag block text flag to true
                    disregardText = !disregardText;
                    textOnLine = true;
                } else if(str.charAt(strPos) === "(" && str.charAt(strPos + 1) === "(") {
                    prevState.push(disregardText);
                    disregardText = false;
                    strPos++;
                } else if(str.charAt(strPos) === ")" && str.charAt(strPos + 1) === ")" && prevState.length > 0) {
                    disregardText = prevState.pop();
                    if(queue.length > 0){
                        finalText += "</" + queue.pop().tagname + ">";
                        if(keywordPerLine > 0){
                            keywordPerLine -= 1;
                        }
                    }
                    strPos++;
                } else if(!disregardText) {
                    //if not inside of quotes, check for keywords
                    
                    if(/[a-z]/.test(str.charAt(strPos))){
                        //if character is an alphabetical character, find what keyword it is
                        
                        //get whether or not value is a tag or an attribute
                        var keyVals = /([a-z0-9]+) *= *("[^"]*")|([a-z0-9]+)/.exec(str.substring(strPos));
                        
                        if(keyVals[1] && keyVals[2]){
                            if(this.restrict){
                                //if attribute, create attribute string
                                if(this.keywords[keyVals[1]] && this.keywords[keyVals[1]] === "attr"){
                                    finalText += keyVals[1] + "=" + keyVals[2];
                                }
                            } else {
                                finalText += keyVals[1] + "=" + keyVals[2];
                            }
                        } else if(keyVals[3]){
                            if(this.restrict){
                                //if tag, create tag string and push tag into queue for adding the closing tag later
                                if(this.keywords[keyVals[3]] && this.keywords[keyVals[3]] === "tag"){
                                    queue.push({tagname: keyVals[3], depth: indentDepth});
                                    finalText += "<" + keyVals[3];
                                    keywordPerLine += 1;
                                }
                            } else {
                                queue.push({tagname: keyVals[3], depth: indentDepth});
                                finalText += "<" + keyVals[3];
                                keywordPerLine += 1;
                            }
                        }
                        strPos += keyVals[0].length - 1;
                    } else if(str.charAt(strPos) === ":"){
                        //if colon separator, replace with closing bracket
                        finalText += ">";
                    } else if(str.charAt(strPos) === ";"){
                        //if semicolon, immediately place end tag of last queued tag
                        if(queue.length > 0){
                            finalText += "</" + queue.pop().tagname + ">";
                            if(keywordPerLine > 0){
                                keywordPerLine -= 1;
                            }
                        }
                    } else {
                        //if no special text found, add to the final result as is
                        finalText += str.charAt(strPos);
                    }
                } else {
                    //if no special text found, add to the final result as is
                    finalText += str.charAt(strPos);
                }
            }
            
            if(keywordPerLine > 1){
                //if more than one tag is found on one line, do inline tag closing
                while(queue.length > 0 && keywordPerLine > 0){
                    let ele = queue.pop();
                    finalText += "</" + ele.tagname + ">";
                    keywordPerLine -= 1;
                }
            } else if(keywordPerLine === 1 && textOnLine){
                //if inline text is found, do inline tag closing
                let ele = queue.pop();
                finalText += "</" + ele.tagname + ">";
            }
            
            //end of text line, add line break
            finalText += "\n";
        }
        
        //if tags still remain queued after all lines have been processed, pop tags and creating closing tags for them
        while(queue.length > 0){
            let ele = queue.pop();
            finalText += "\t".repeat(ele.depth) + "</" + ele.tagname + ">\n";
        }
        
        finalText = finalText.replace(/\s*<\/br>|\s*<\/hr>|\s*<\/img>|\s*<\/input>|\s*<\/link>|\s*<\/meta>/gm, "");
        return finalText.replace(/''/gm, "\"");
    }
};

// module.exports = ernLang;

function exampleCode(){
    let text = "html:\n" +
                    "\thead:\n" +
                        "\t\ttitle:\"Example\"\n" +
                        "\t\tmeta name=\"viewport\" charset=\"utf-8\" content=\"width=device-width, initial-scale=1\":\n" +
                        "\t\tlink rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css\":\n" +
                        "\t\tlink rel=\"stylesheet\" href=\"https://fonts.googleapis.com/icon?family=Material+Icons\":\n" +
                    "\tbody class=\"container\":\n" +
                        "\t\theader:\n" +
                            "\t\t\th1:\"Scribl-Er Example\"\n" +
                        "\t\tmain:\n" +
                            "\t\t\tarticle:\n" +
                                "\t\t\t\tp:\n" +
                                    "\t\t\t\t\t\"This is an example of what you can do in ((strong:\"Scribl-Er\")). It is HTML at it's core, with Pythonic syntax mixed in to make it ((em:\"easier to write and read\")).\"\n" +
                                "\t\t\t\tp:\n" +
                                    "\t\t\t\t\t\"Use this example text as a reference to go by and to ((span class=\"yellow\":\"help with the syntax\")) of ((strong:\"Scribl-Er\")). Functionality will be limited in certain areas but the basic concept can still let you create a demo webpage with ease!\"\n" +
                        "\t\thr:\n" +
                        "\t\tfooter:\n" +
                            "\t\t\tp:\"As a final note: just like in Python, in ((strong:\"Scribl-Er the ((span class=\"yellow\":\"whitespace is important\"))\")) and will determine when tags will close and where content will be located within tags.\"\n" +
                            "\t\t\tp:\"Keep this in mind and have fun!\"";
    $("#code-console").val(text);
    let code = ernLang.parseCode($("#code-console").val());
    $("#console-output").val(code);
    $("#html-viewer").attr("srcdoc", code);
    Materialize.updateTextFields();
    $("#code-console").trigger("autoresize");
    $('#console-output').trigger('autoresize');
}

function update(){
    let code = ernLang.parseCode($("#code-console").val());
    $("#console-output").val(code);
    // $("#html-viewer").html(code);
    $("#html-viewer").attr("srcdoc", code);
    Materialize.updateTextFields();
    $('#console-output').trigger('autoresize');
}

$(function(){
    exampleCode();
    $(".modal").modal({
        opacity: 0.1
    });
    //restrict starts out unchecked
    $("#restrict").on("change", function(){
        ernLang.restrict = $("#restrict:checked").length > 0;
        update();
    });
    // $("#run-to-html").on("click", function(){
    $("#code-console").on("keyup", function(){
        update();
    });
    
    $("textarea").keydown(function(e) {
        if(e.keyCode === 9) { // tab was pressed
            // get caret position/selection
            let start = this.selectionStart;
            let end = this.selectionEnd;
    
            let $this = $(this);
            let value = $this.val();
    
            // set textarea value to: text before caret + tab + text after caret
            $this.val(value.substring(0, start)
                        + "\t"
                        + value.substring(end));
    
            // put caret at right position again (add one for the tab)
            this.selectionStart = this.selectionEnd = start + 1;
    
            // prevent the focus lose
            e.preventDefault();
        }
    });
});