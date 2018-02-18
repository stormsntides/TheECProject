var ernLang = {
    aliases: {
        "a": "go",
        "go": "a",
        "article": "article",
        "div": "div",
        "header": "hdr",
        "hdr": "header",
        "hr": "hr",
        "h1": "h1",
        "h2": "h2",
        "h3": "h3",
        "h4": "h4",
        "h5": "h5",
        "h6": "h6",
        "i": "icon",
        "icon": "i",
        "li": "item",
        "item": "li",
        "main": "main",
        "nav": "nav",
        "ol": "numlist",
        "numlist": "ol",
        "p": "para",
        "para": "p",
        "section": "section",
        "ul": "list",
        "list": "ul",
        
        "class": "c",
        "c": "class",
        "href": "to",
        "to": "href",
        "id": "id",
        "name": "n",
        "n": "name"
    },
    escapeRegExp: function(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    },
    tagDefineToObject: function(tagDefine){
        var tdObj = {};
        
        //find tag name by gathering all chars up until any non-alphanumeric chars are found
        tdObj.tagName = /[a-y1-6]+/.exec(tagDefine);
        tdObj.tagName = this.aliases[tdObj.tagName];
        
        //find tag attributes by finding words with an equal sign immediately after them followed by quoted text
        var re = /([a-z]+)=("[ a-z\-/]+")/gm;
        var attrArray;
        tdObj.attrs = "";
        while((attrArray = re.exec(tagDefine)) !== null){
            tdObj.attrs += " " + this.aliases[attrArray[1]] + "=" + attrArray[2];
        }
        
        return tdObj;
    },
    parseWScode: function(text){
        var oldText = text;
        
        var splitText = oldText.split("\n");
        
        var lastCheckedLevel = [];
        
        var finalArray = [];
        for(let i = 0; i < splitText.length; i++){
            var sti = splitText[i];
            
            if(/\S/.test(sti)){
                var stiFormat = "";
                var anArray;
                var aare = /[a-y1-6]+:/gm;
                while((anArray = aare.exec(sti)) !== null){
                    stiFormat = sti.replace(new RegExp(anArray[0]), "\n" + anArray[0] + "\n");
                }
                
                var beginTabs = /^\t+/.exec(sti);
                
                var currentLevel = (beginTabs ? beginTabs[0].length : 0);
                var lclLength = lastCheckedLevel.length;
                while(lclLength > 0 && lastCheckedLevel[lclLength - 1] >= currentLevel){
                    finalArray.push("\t".repeat(lastCheckedLevel.pop()) + ";");
                    lclLength--;
                }
                
                if(sti.indexOf(":") > 0){
                    lastCheckedLevel.push(currentLevel);
                }
                
                finalArray.push(sti);
            }
        }
        
        while(lastCheckedLevel.length > 0){
            finalArray.push("\t".repeat(lastCheckedLevel.pop()) + ";");
        }
        
        oldText = finalArray.join("\n");
        var newText = "";
        
        //array for keeping track of what special characters have been checked; treated as a queue
        var lastCheckedTag = [];
        for(let i = 0; i < oldText.length; i++){
            //if quote char
            if(oldText.charAt(i) === "\""){
                if(lastCheckedTag.length > 0 && lastCheckedTag[lastCheckedTag.length - 1] === "\""){
                    //pop the quote char if it's matching pair is found
                    lastCheckedTag.pop();
                } else {
                    //push a quote char if no matching pair is in the queue
                    lastCheckedTag.push("\"");
                }
            //if quote char was last special char found
            } else if(lastCheckedTag[lastCheckedTag.length - 1] === "\""){
                //treat ALL chars as regular chars, including special chars, if found inside quotes
                newText += oldText.charAt(i);
            //if not inside quotes
            } else {
                //check to see if char is alphanumeric
                if(/[a-y1-6]/.test(oldText.charAt(i))){
                    //find open code bracket
                    var tagDefine = oldText.substring(i, i + oldText.substring(i).indexOf(":") + 1);
                    var defineLength = tagDefine.length; //used later
                    
                    var tagDefObj = this.tagDefineToObject(tagDefine);
                    
                    var newTag = "<" + tagDefObj.tagName + tagDefObj.attrs + ">";
                    
                    //add html tag to final return string, push tag name for use in replacing the matching code bracket, and set
                    //i to be the length of the pervious tag define length in order to skip checking what's been checked
                    newText += newTag;
                    lastCheckedTag.push(tagDefObj.tagName);
                    
                    //minus 1 offset for for-loop statement i++
                    i += defineLength - 1;
                //if closing bracket found, check to see if there's queued special char
                } else if(oldText.charAt(i) === ";" && lastCheckedTag.length > 0) {
                    //pop the tag name from the queue and create a new end tag to append to the final return string
                    var endTag = "</" + lastCheckedTag.pop() + ">";
                    newText += endTag;
                //if no special chars found and not inside quotes, add to final return string
                } else {
                    newText += oldText.charAt(i);
                }
            }
        }
        
        return newText.replace(/''/gm, "\"");
    },
    parseCode: function(text){
        var oldText = text;
        var newText = "";
        
        //array for keeping track of what special characters have been checked; treated as a queue
        var lastCheckedTag = [];
        for(var i = 0; i < oldText.length; i++){
            //if quote char
            if(oldText.charAt(i) === "\""){
                if(lastCheckedTag.length > 0 && lastCheckedTag[lastCheckedTag.length - 1] === "\""){
                    //pop the quote char if it's matching pair is found
                    lastCheckedTag.pop();
                } else {
                    //push a quote char if no matching pair is in the queue
                    lastCheckedTag.push("\"");
                }
            //if quote char was last special char found
            } else if(lastCheckedTag[lastCheckedTag.length - 1] === "\""){
                //treat ALL chars as regular chars, including special chars, if found inside quotes
                newText += oldText.charAt(i);
            //if not inside quotes
            } else {
                //check to see if char is alphanumeric
                if(/[a-y1-6]/.test(oldText.charAt(i))){
                    //find open code bracket
                    var tagDefine = oldText.substring(i, i + oldText.substring(i).indexOf("{") + 1);
                    var defineLength = tagDefine.length; //used later
                    
                    //find tag name by gathering all chars up until any non-alphanumeric chars are found
                    // var tagName = /[a-y1-6]+/.exec(tagDefine);
                    // tagName = this.aliases[tagName];
                    
                    // var re = /([a-z]+)=("[ a-z\-/]+")/gm;
                    // var attrArray;
                    // var attrs = "";
                    // while((attrArray = re.exec(tagDefine)) !== null){
                    //     var attrVal = attrArray[2];
                    //     if(attrVal === "link-facebook"){
                    //         attrVal = this.aliases[attrVal];
                    //     }
                    //     attrs += " " + this.aliases[attrArray[1]] + "=" + attrVal;
                    // }
                    
                    var tagDefObj = this.tagDefineToObject(tagDefine);
                    
                    var newTag = "<" + tagDefObj.tagName + tagDefObj.attrs + ">";
                    
                    //add html tag to final return string, push tag name for use in replacing the matching code bracket, and set
                    //i to be the length of the pervious tag define length in order to skip checking what's been checked
                    newText += newTag;
                    lastCheckedTag.push(tagDefObj.tagName);
                    
                    //minus 1 offset for for-loop statement i++
                    i += defineLength - 1;
                //if closing bracket found, check to see if there's queued special char
                } else if(oldText.charAt(i) === "}" && lastCheckedTag.length > 0) {
                    //pop the tag name from the queue and create a new end tag to append to the final return string
                    var endTag = "</" + lastCheckedTag.pop() + ">";
                    newText += endTag;
                //if no special chars found and not inside quotes, add to final return string
                } else {
                    newText += oldText.charAt(i);
                }
            }
        }
        
        return newText.replace(/''/gm, "\"");
    },
    parseHTML: function(text){
        var oldText = text;
        var newText = text.replace(/"/gm, "''");
        
        var re = /<.+>/;
        while(re.test(oldText)){
            //FIGURE OUT HOW TO MAKE THIS CONVERT TO HTML
            var tdObj = this.tagDefineToObject(re.exec(oldText)[0]);
            
            oldText = oldText.replace(re, "%");
        }
        
        var re1 = /[^%]+/gm;
        var array;
        while((array = re1.exec(oldText)) !== null){
            var str = array[0].trim();
            if(str){
                newText = newText.replace(new RegExp(this.escapeRegExp(str)), "\"" + str + "\"");
            }
        }
        
        return newText.replace(/<\/[a-z1-6]+>/gm, "}").replace(/</gm, "").replace(/>/gm, "{");
    }
};

var keywords = {
    "article": "tag",
    "div": "tag",
    "footer": "tag",
    "header": "tag",
    "h1": "tag",
    "h2": "tag",
    "h3": "tag",
    "h4": "tag",
    "h5": "tag",
    "h6": "tag",
    "main": "tag",
    "p": "tag",
    "section": "tag",
    "span": "tag",
    
    "class": "attr",
    "id": "attr"
};

// function getKeyword(text, from){
//     var sub = text.substring(from);
//     var closest = {
//         colon: sub.indexOf(":"),
//         space: sub.indexOf(" "),
//         equals: sub.indexOf("=")
//     };
    
//     var keyword;
//     if(closest.space >= 0){
//         if(closest.colon < closest.space){
//             //tag name
//             keyword = sub.substring(0, closest.colon);
//         } else if(closest.equals >= 0){
//             if(closest.space < closest.equals){
//                 //tag name
//                 keyword = sub.substring(0, closest.space);
//             } else if(closest.space > closest.equals){
//                 //attribute name
//                 keyword = sub.substring(0, closest.equals);
//             }
//         } else {
//             //tag name
//             keyword = sub.substring(0, closest.space);
//         }
//     } else if(closest.equals >= 0){
//         if(closest.space >= 0){
//             if(closest.equals < closest.space){
//                 //attribute name
//                 keyword = sub.substring(0, closest.equals);
//             } else if(closest.equals > closest.space){
//                 //tag name
//                 keyword = sub.substring(0, closest.space);
//             }
//         } else {
//             //attribute name
//             keyword = sub.substring(0, closest.equals);
//         }
//     } else {
//         //tag name
//         keyword = sub.substring(0, closest.colon);
//     }
    
//     return keyword;
// }

function textToArray(text){
    var splitArray = text.split("\n");
    var finalText = "";
    
    var prevDepth = 0;
    var queue = [];
    for(let i = 0; i < splitArray.length; i++){
        var str = splitArray[i];
        
        var indentDepth = /^\t*/.exec(str)[0].length;
        if(prevDepth >= indentDepth){
            while(queue.length > 0 && queue[queue.length - 1].depth >= indentDepth){
                let ele = queue.pop();
                finalText += "\t".repeat(ele.depth) + "</" + ele.tagname + ">\n";
            }
        }
        prevDepth = indentDepth;
        finalText += "\t".repeat(indentDepth);
        
        var disregardText = false;
        var keywordPerLine = 0;
        var textOnLine = false;
        for(let strPos = indentDepth; strPos < str.length; strPos++){
            if(str.charAt(strPos) === "\""){
                disregardText = !disregardText;
                textOnLine = true;
            } else if(!disregardText) {
                if(/[a-z]/.test(str.charAt(strPos))){
                    var keyVals = /([a-z0-9]+) *= *("[^"]*")|([a-z0-9]+)/.exec(str.substring(strPos));
                    
                    if(keyVals[1] && keyVals[2]){
                        if(keywords[keyVals[1]] && keywords[keyVals[1]] === "attr"){
                            finalText += keyVals[1] + "=" + keyVals[2];
                        }
                    } else if(keyVals[3]){
                        if(keywords[keyVals[3]] && keywords[keyVals[3]] === "tag"){
                            queue.push({tagname: keyVals[3], depth: indentDepth});
                            finalText += "<" + keyVals[3];
                            keywordPerLine += 1;
                        }
                    }
                    
                    strPos += keyVals[0].length - 1;
                } else if(str.charAt(strPos) === ":"){
                    finalText += ">";
                } else {
                    finalText += str.charAt(strPos);
                }
            } else {
                finalText += str.charAt(strPos);
            }
        }
        
        if(keywordPerLine > 1){
            while(queue.length > 0 && keywordPerLine > 0){
                let ele = queue.pop();
                finalText += "</" + ele.tagname + ">";
                keywordPerLine -= 1;
            }
        } else if(keywordPerLine === 1 && textOnLine){
            let ele = queue.pop();
            finalText += "</" + ele.tagname + ">";
        }
        
        finalText += "\n";
    }
    
    while(queue.length > 0){
        let ele = queue.pop();
        finalText += "\t".repeat(ele.depth) + "</" + ele.tagname + ">\n";
    }
    
    return finalText;
}

function parseText(text){
    var marker = 0;
    var disregardText = false; //flag for if a quoted string is found
    var startKeyword = false; //flag for if an unquoted string is found
    
    var finalArray = [];
    for(let i = 0; i < text.length; i++){
        if(text.charAt(i) === "\n"){
            disregardText = false;
            startKeyword = false;
            finalArray.push(text.substring(marker, i));
            finalArray.push("\n");
            marker = i + 1;
        } else if(text.charAt(i) === "\""){
            if(disregardText){
                finalArray.push(text.substring(marker, i + 1));
                marker = i + 1;
            } else {
                finalArray.push(text.substring(marker, i));
                marker = i;
            }
            disregardText = !disregardText;
        } else if(!disregardText){
            if(/[a-z]/i.test(text.charAt(i)) && !startKeyword){
                startKeyword = true;
                finalArray.push(text.substring(marker, i));
                marker = i;
            } else if(/[^a-z0-9]/i.test(text.charAt(i)) && startKeyword){
                startKeyword = false;
                finalArray.push(text.substring(marker, i));
                marker = i;
            }
        }
    }
    
    var newText = "";
    var queue = [];
    var tagsOnCurrLine = 0;
    var indentDepth = 0;
    for(let i = 0; i < finalArray.length; i++){
        var eleType = keywords[finalArray[i]];
        
        if(/\t/.test(finalArray[i])){
            // indentDepth = finalArray[i].length;
            indentDepth = finalArray[i].lastIndexOf("\t") - finalArray[i].indexOf("\t") + 1;
        }
        
        if(eleType){
            if(eleType === "tag"){
                queue.push({name: finalArray[i], indent: indentDepth});
                newText += "<" + finalArray[i];
                tagsOnCurrLine += 1;
            } else if(eleType === "attr"){
                newText += finalArray[i] + finalArray[i + 1] + finalArray[i + 2];
                i += 2;
            }
        } else {
            if(/".*"/.test(finalArray[i])){
                newText += finalArray[i].replace(/"/g, "");
            } else if(/:/.test(finalArray[i])){
                newText += finalArray[i].replace(/:/, ">");
            } else {
                if(/\n/.test(finalArray[i])){
                    if(tagsOnCurrLine > 1){
                        while(tagsOnCurrLine > 0 && queue.length > 0){
                            let qobj = queue.pop();
                            newText += "\t".repeat(qobj.indent) + "</" + qobj.name + ">";
                            tagsOnCurrLine -= 1;
                        }
                    } else {
                        tagsOnCurrLine = 0;
                    }
                    indentDepth = 0;
                }
                newText += finalArray[i];
            }
        }
    }
    
    while(queue.length > 0){
        let qobj = queue.pop();
        newText += "\t".repeat(qobj.indent) + "</" + qobj.name + ">\n";
    }
    
    return newText;
}

$(document).ready(function(){
    $("#run-to-html").on("click", function(){
        console.log("Running code!");
        // var code = ernLang.parseCode($("#code-console").val());
        var code = ernLang.parseWScode($("#code-console").val());
        // $("#console-output").text(code);
        $("#console-output").val(code);
        
        console.log(textToArray($("#code-console").val()));
    });
    $("#run-to-code").on("click", function(){
        console.log("Running code!");
        var html = ernLang.parseHTML($("#code-console").val());
        // $("#console-output").text(html);
        $("#console-output").val(html);
    });
});

$("textarea").keydown(function(e) {
    if(e.keyCode === 9) { // tab was pressed
        // get caret position/selection
        var start = this.selectionStart;
        var end = this.selectionEnd;

        var $this = $(this);
        var value = $this.val();

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