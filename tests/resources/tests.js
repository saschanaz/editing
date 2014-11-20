function setupTests()
{
    setup({explicit_done:true});
}

/**
/ Tests hould be of the form testInput(<intention name>, <start markup>, <end markup>, <data>)
/ intention: the type of intention to run, for instance 'delete'
/ startMarkup: the markup to put in the test area. For intentions that require a selection, it must be given in this form: 
/ <ELEMENT startContainer=VALUE startOffset=VALUE> and <ELEMENT endContainer=VALUE endOffset=VALUE> where
/ ELEMENT is the element that should contain the start, end, or both
/ VALUE for startContainer and endContainer is 'me' or "child0" (if you want to use a child textnode instead of the element itself for the start of the range)
/ VALUE for startOffset and endOffset should be a number
**/
function runTests()
{
    testInput("delete", "<span startContainer=child0 startOffset=1 endContainer=child0 endoffset=2>abc</span>", "<span>ac</span>");
    testInput("delete", "<span startContainer=child0 startOffset=2 endContainer=child0 endoffset=6>a word between</span>", "<span>a  between</span>");
    testInput("delete", "<ul><li startContainer=child0 startOffset=2>one</li><li endContainer=child0 endoffset=1>two</li></ul>", "<ul><li>onwo</li></ul>");
    testInput("delete", "<div startContainer=child0 startOffset=1>ab<span>level<span endContainer=child0 endoffset=2>level3<span>level 4</span></span>2</span>c</div>", "<div>a<span><span>vel3<span>level 4</span></span>2</span>c</div>");
    testInput("delete", "<div startContainer=child0 startOffset=1>ab<span endContainer=child2 endoffset=0>level<span >level3<span>level 4</span></span>2</span>c</div>", "<div>a<span>2</span>c</div>");
    clearTestDiv();
    done();
}

function testInput(intention, startMarkup, endMarkup, data)
{   
    switch (intention)
    {
        case "delete":

            
            test(function() 
                {
                    //Setup
                    var testDiv = document.querySelector("#testdiv");                    
                    testDiv.innerHTML = startMarkup;
                    var startElement = document.querySelector("[startContainer]");
                    var startContainer = startElement;
                    var startOffset = startElement.getAttribute('startOffset');
                    switch (startElement.getAttribute('startContainer'))
                    {
                    case "me":
                        // Do Nothing
                        break;
                    case "child0":
                        startContainer = startElement.childNodes[0];
                        break;
                    case "child1":
                        startContainer = startElement.childNodes[1];
                        break;
                    case "child2":
                        startContainer = startElement.childNodes[2];
                        break;
                    }
                    startElement.removeAttribute('startContainer');
                    startElement.removeAttribute('startOffset');
                    var endElement = document.querySelector("[endContainer]");
                    var endContainer = endElement;
                    var endOffset = endElement.getAttribute('endOffset');
                    switch (endElement.getAttribute('endContainer'))
                    {
                    case "me":
                        // Do Nothing
                        break;
                    case "child0":
                        endContainer = endElement.childNodes[0];
                        break;
                    case "child1":
                        endContainer = endElement.childNodes[1];
                        break;
                    case "child2":
                        endContainer = endElement.childNodes[2];
                        break;
                    }
                    endElement.removeAttribute('endContainer');
                    endElement.removeAttribute('endOffset');
                    var targetRange = document.createRange()
                    targetRange.setStart(startContainer, startOffset);
                    targetRange.setEnd(endContainer, endOffset);
                    document.getSelection().removeAllRanges();
                    document.getSelection().addRange(targetRange);
                    
                    //Run test
                    document.testIntention('delete');
                    assert_equals(testDiv.innerHTML, endMarkup);
                }, intention + ": " + startMarkup);
            break;
        default:
            
    }
}

function clearTestDiv()
{
    document.querySelector("#testdiv").innerHTML=""; 
}