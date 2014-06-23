/******************************************************************************************
#
#       Copyright 2014 Dustin Robert Hoffner
#
#       Licensed under the Apache License, Version 2.0 (the "License");
#       you may not use this file except in compliance with the License.
#       You may obtain a copy of the License at
#
#         http://www.apache.org/licenses/LICENSE-2.0
#
#       Unless required by applicable law or agreed to in writing, software
#       distributed under the License is distributed on an "AS IS" BASIS,
#       WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#       See the License for the specific language governing permissions and
#       limitations under the License.
#       
#       Projectname...................: pragm
#
#       Developer/Date................: Dustin Robert Hoffner, 16.01.2014
#       Filename......................: int_string_converter.js
#       Version/Release...............: 0.5xx
#
******************************************************************************************/


var convert_typ = function convert_typ() {

    this.str_list = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z");

    this.spezInt_to_string = function (number) {
        var temp = this.str_list[number];
        return temp;
    };


    this.spezString_to_int = function (key) {
        counter = 0;
        while (counter < 62) {
            if (this.str_list[counter] == key) {
                return counter;
            }
            counter++;
        }
    };

    this.int_to_string = function (number) {
        var h = "";
        var d;
        var c = false;
        if (number <= 61) {
            h = this.spezInt_to_string(number);
        }
        while (number > 61) {
            d = number % 62;
            c = parseInt(number / 62);
            number = c;
            h = this.spezInt_to_string(d) + "" + h;
        }
        if (c) {
            h = this.spezInt_to_string(c) + "" + h;
        }
        return h;

    };

    this.string_to_int = function (string) {
        var length = string.length;
        var counter = length - 1;
        var quad = 0;
        var sum = 0;
        while (counter >= 0) {
            var fak2 = string.substr(counter, 1);
            var fak = this.spezString_to_int(fak2);
            sum = sum + this.quadrat(62, quad) * fak;
            quad++;
            counter--;
        }
        return sum;
    };

    this.quadrat = function (fak, quad) {
        if (quad == 0) {
            return 1;
        }
        var sum = fak;
        while (quad > 1) {
            sum = sum * fak;
            quad--;
        }
        return sum;
    };

};


var convert = new convert_typ();


define(function (require, exports, module) {
    "use strict";

    var CommandManager = brackets.getModule("command/CommandManager"),
        StatusBar = brackets.getModule("widgets/StatusBar"),
        DocumentManager = brackets.getModule("document/DocumentManager"),
        Menus = brackets.getModule("command/Menus");


    var hash = function (e) {
        try {
            var r = 0;
            var l = e.length;
            for (var i = 0; i < l; i++) {
                r = (r << 5) - r + e.charCodeAt(i);
                r &= r;
            }
            return r;
        } catch (e) {}
    };

    var hl = 4;

    var generate = function (e) {
        try {
            var dat = parseInt(hash(e));
            if (dat < 0) {
                dat = dat.toString();
                var ndat = "";
                for (i = 1; i < dat.length; i++) {
                    ndat += (10 - parseInt(dat[i])).toString();
                }
                dat = parseInt(ndat);
            }
            var dat = convert.int_to_string(dat);
            var x = dat.length
            if (x > hl) {
                dat = dat.substr(0, hl);
            } else {
                x = hl - x;
                while (x > 0) {
                    dat = "0" + dat;
                    x--;
                }
            }
            return dat;
        } catch (e) {
            console.log(e);
        }
    }

    StatusBar.addIndicator("pragmspeedhash", false, true, "", "speedhash");
    document.getElementById('pragmspeedhash').innerHTML = "#init";
    var count = 0;

    var handlerChange = function () {
        var doc = DocumentManager.getCurrentDocument();
        var text = "----";
        if (doc) {
            var text = doc.getText();
        }
        document.getElementById('pragmspeedhash').innerHTML = "#" + generate(text);
        count++;
    }

    var handler = function () {
        var doc = DocumentManager.getCurrentDocument();
        var text = "----";
        if (doc) {
            var text = doc.getText();
        }
        document.getElementById('pragmspeedhash').innerHTML = "#" + generate(text);
        count++;
        $(DocumentManager.getCurrentDocument()).on("change", handlerChange);
    }

    $(DocumentManager).on("currentDocumentChange", handler);

    // We could also add a key binding at the same time:
    //menu.addMenuItem(MY_COMMAND_ID, "Ctrl-Alt-H");
    // (Note: "Ctrl" is automatically mapped to "Cmd" on Mac)
});