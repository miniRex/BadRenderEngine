var version = '1.3';
var canvas = document.getElementById("canvas");

var centerx = canvas.clientWidth / 2;
var centery = canvas.clientHeight / 2;

var activeUpdate = false;
var rate = 15;
var resolution = 200;
var drawmode = "shader";
/*mesh = draw triangles
wireframe = draw edges
shaderedwireframe = draw the triangles with color and light and also the edges
complexwireframe = draw triangle edges
face = draw triangles with face color
shader = draw the triangles with color and light
depth = render triangles with a grayscale gradient
light = render triangles with a grayscale gradient*/

//FRAME CONTROL START
var targetFPS = 60;
var useFrameControl = true;

if (useFrameControl) {
    console.log("using frame control");
    //rate = (1s / (desired fps(100) * some stuff?(0.001)) = 10 rate!
    rate = (1 / (targetFPS * 0.001));
}
//FRAME CONTROL END

var ambientLight = 0.2; //0.2 default ambient light value
document.getElementById("alig").value = ambientLight;

document.getElementById("tr").value = rate;
document.getElementById("fr").value = (1 / (rate * 0.001)).toFixed();
document.getElementById("ftfr").checked = useFrameControl;

var triangleColor = '#ffffff';
var edgeColor = '#ffffff';

document.getElementById("dm").value = drawmode;

document.getElementById("mdmi").value = triangleColor;
document.getElementById("wdmi").value = edgeColor;

ColorSettings();
function ColorSettings() {
    document.getElementById("mdmie").style.color = triangleColor;
    document.getElementById("mdmie").style.fontSize = '18px';
    document.getElementById("wdmie").style.color = edgeColor;
    document.getElementById("wdmie").style.fontSize = '18px';
    switch (drawmode) {
        case "mesh":
            document.getElementById("mdm").setAttribute("style", "display:inline");
            document.getElementById("wdm").setAttribute("style", "display:none");
            break;
        case "wireframe":
            document.getElementById("mdm").setAttribute("style", "display:none");
            document.getElementById("wdm").setAttribute("style", "display:inline");
            break;
        case "face":
            document.getElementById("mdm").setAttribute("style", "display:none");
            document.getElementById("wdm").setAttribute("style", "display:none");
            break;
        case "shader":
            document.getElementById("mdm").setAttribute("style", "display:none");
            document.getElementById("wdm").setAttribute("style", "display:none");
            break;
        case "depth":
            document.getElementById("mdm").setAttribute("style", "display:none");
            document.getElementById("wdm").setAttribute("style", "display:none");
            break;
    }
}

function SetMeshColor() {
    var input = document.getElementById("mdmi").value;
    triangleColor = input;
    document.getElementById("mdmie").style.color = triangleColor;
}
function SetWireColor() {
    var input = document.getElementById("wdmi").value;
    if (input == "random") {
        edgeColor = GetColor();
        document.getElementById("wdmi").value = edgeColor;
    }
    else {
        edgeColor = input;
    }
    document.getElementById("wdmie").style.color = edgeColor;
}

//Set default debug values
var displayDebug = true;
var displayText = true;
//Set debug values
document.getElementById("ddebug").checked = displayDebug;
document.getElementById("dtext").checked = displayText;

document.getElementById("ires").value = resolution;

//{x position, y position, z position, light intensity 0-1 value}
var lights = [
    { x: 200, y: 50, z: -100, intensity: 0.5, range: 350, r: 255, g: 255, b: 255 },
    { x: -100, y: 50, z: -50, intensity: 0.2, range: 150, r: 255, g: 0, b: 0 }
]

var meshName = "Cube"
var camera = { x: 0, y: 0, z: 100, viewdistance: 5000 }

var vertex = [
    { x: -50, y: -50, z: -50 },
    { x: -50, y: -50, z: 50 },
    { x: -50, y: 50, z: 50 },
    { x: -50, y: 50, z: -50 },
    { x: 50, y: -50, z: 50 },
    { x: 50, y: -50, z: -50 },
    { x: 50, y: 50, z: -50 },
    { x: 50, y: 50, z: 50 }
]
var edges = [
    { str: 0, con: 1 },
    { str: 1, con: 2 },
    { str: 2, con: 3 },
    { str: 3, con: 0 },
    { str: 4, con: 5 },
    { str: 5, con: 6 },
    { str: 4, con: 7 },
    { str: 7, con: 6 },
    { str: 1, con: 4 },
    { str: 0, con: 5 },
    { str: 3, con: 6 },
    { str: 2, con: 7 }
]
        var triangles = [
            { tria: 1, trib: 4, tric: 5 },// Top
            { tria: 1, trib: 0, tric: 5 },// Top
            { tria: 2, trib: 1, tric: 0 },// Left
            { tria: 2, trib: 0, tric: 3 },// Left
            { tria: 2, trib: 1, tric: 4 },// Back
            { tria: 2, trib: 7, tric: 4 },// Back
            { tria: 3, trib: 2, tric: 7 },// Bottom
            { tria: 7, trib: 6, tric: 3 },// Bottom
            { tria: 7, trib: 6, tric: 5 },// Right
            { tria: 4, trib: 7, tric: 5 },// Right
            { tria: 5, trib: 3, tric: 0 },// Forward
            { tria: 5, trib: 6, tric: 3 } // Forward
        ]
        var faces = [
            { r: 255, g: 128, b: 0, ind: 0, inde: 1 },
            { r: 0, g: 255, b: 0, ind: 2, inde: 3 },
            { r: 0, g: 128, b: 255, ind: 4, inde: 5 },
            { r: 0, g: 0, b: 255, ind: 6, inde: 7 },
            { r: 64, g: 128, b: 162, ind: 8, inde: 9 },
            { r: 255, g: 0, b: 0, ind: 10, inde: 11 }
        ]

        var mesh = { vert: vertex, edge: edges, triangle: triangles, face: faces }

        var obj = [
            { x: 0, y: 0, z: 0 },//Position
            //X position = horizontal, Y position = vertical, Z position = frontal
            { x: 0.78, y: 0.3, z: 0.2 }, //Start rotatio
            //*No rotation*/{x:0,y:0,z:0} //Rotation (values from 0 to 360, euler angles)
            /*Start with rotation*/ { x: 0.0025, y: 0.005, z: 0 } //Rotation (values from 0 to 360, euler angles)
            //X rotation = sideways, Y rotation = top, Z rotation = Front
        ]
        var defaultObj = obj;

        var stringifyClass = {name: meshName, vertex: vertex, edges: edges, triangles: triangles, faces: faces, lights: lights, obj: obj}
        document.getElementById("jsonInput").value = JSON.stringify(stringifyClass, null, 2);

        document.getElementById("xsp").value = obj[2].x;
        document.getElementById("ysp").value = obj[2].y;
        document.getElementById("zsp").value = obj[2].z;

        function SetSpeed() {
            var input = document.getElementById("sp").value;
            const inputArray = input.split(",");
            obj[2].x = parseFloat(inputArray[0]) / 10;
            obj[2].y = parseFloat(inputArray[1]) / 10;
            obj[2].z = parseFloat(inputArray[2]) / 10;
        }

        //Relocate to center
        function Reloacte() {
            for (var i = 0; i < mesh.vert.length; i++) {
                mesh.vert[i].x += obj[0].x;
                mesh.vert[i].y += obj[0].y;
                mesh.vert[i].z += obj[0].z;
            }
        }

        Reloacte();
        RotateVertexBy(obj[1].x, obj[1].y, obj[1].z);

        var depthText = 0;

        //Canvas creation
        var c = document.getElementById("canvas");
        var ctx = c.getContext("2d");

        ctx.moveTo(0, 0);

        //Functions
        function DrawLine(start, end) {
            ctx.beginPath();
            ctx.moveTo(start.x * resolution / 100 + centerx, start.y * resolution / 100 + centery);
            ctx.lineTo(end.x * resolution / 100 + centerx, end.y * resolution / 100 + centery);
            ctx.stroke();
        }
        function SubmitCommand() {
            var input = document.getElementById("ci").value;
            document.getElementById("ci").value = "";
            var split = input.split(' ');
            if (split[0] == "res") {
                //res <width> <height>
                canvas.clientWidth = split[1];
                canvas.clientHeight = split[2];
                console.log("resolution set to " + canvas.clientWidth + "x" + canvas.clientHeight);
            }
            else if (split[0] == "light") {
                //light <idnex> <range> <x> <y> <z>
                var index = parseInt(split[1])
                lights[index].intensity = parseFloat(split[2]);
                lights[index].range = parseInt(split[3]);
                lights[index].x = parseInt(split[4]);
                lights[index].y = parseInt(split[5]);
                lights[index].z = parseInt(split[6]);
            }
            else if (split[0] == "lightpar") {
                //light <index> <parameter> <value>
                var index = parseInt(split[1])
                if (split[2] == "intensity") {
                    lights[index].intensity = parseFloat(split[3]);
                }
                else if (split[2] == "range") {
                    lights[index].range = parseInt(split[3]);
                }
            }
        }
        function MeshSave() {
            var file = new Blob([document.getElementById("jsonInput").value], {type: "application/json"});
            if (window.navigator.msSaveOrOpenBlob) // IE10+
                window.navigator.msSaveOrOpenBlob(file, "customShape");
            else { // Others
                var a = document.createElement("a"),
                url = URL.createObjectURL(file);
                a.href = url;
                a.download = "customShape";
                document.body.appendChild(a);
                a.click();
                setTimeout(function() {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);  
                }, 0); 
            }
        }
        function getRndInteger(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }
        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }
        function rgbToHex(r, g, b) {
            return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
        }
        function hexToRgb(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }
        function Lerp(a, b, time) {
            return a + time * (b - a);
        }
        function Clamp(value, min, max) {
            if (value > max) {
                return max;
            }
            else if (value < min) {
                return min;
            }
            return value;
        }
        function GetColor() {
            return '#' + Math.floor(Math.random() * 16777215).toString(16);
        }
        function GetFaceColor(index) {
            return rgbToHex(faces[index].r, faces[index].g, faces[index].b);
        }
        function GetFaceShaderColor(index, ambientLightIntensity, lightIntensity, lightR, lightG, lightB, influences) {
            var r = (Lerp(0, (faces[index].r + lightR * lightIntensity), parseFloat(ambientLightIntensity) + parseFloat(lightIntensity)) / influences).toFixed(0);
            var g = (Lerp(0, (faces[index].g + lightG * lightIntensity), parseFloat(ambientLightIntensity) + parseFloat(lightIntensity)) / influences).toFixed(0);
            var b = (Lerp(0, (faces[index].b + lightB * lightIntensity), parseFloat(ambientLightIntensity) + parseFloat(lightIntensity)) / influences).toFixed(0);
            r = Clamp(r, 0, 255);
            g = Clamp(g, 0, 255);
            b = Clamp(b, 0, 255);
            return rgbToHex(parseInt(r), parseInt(g), parseInt(b));
        }
        function ModifyVertex() {
            var index = document.getElementById("index").value;
            var input = document.getElementById("input").value;
            const inputArray = input.split(",");
            vertex[index].x = parseInt(inputArray[0]) + centerx + obj[0].x;
            vertex[index].y = parseInt(inputArray[1]) + centery + obj[0].y;
            vertex[index].z = parseInt(inputArray[2]) + obj[0].z;
        }
        function ResetMesh(meshJSON) {
            if (meshJSON) {
                console.log("mesh json recieved");
                var data = JSON.parse(meshJSON);
                mesh = { vert: data.vertex, edge: data.edges, triangle: data.triangles, face: data.faces }
                lights = data.lights;
                defaultObj = data.obj;
                meshName = data.name;
            }
            obj[0] = defaultObj[0];
            obj[1] = defaultObj[1];
            obj[2] = defaultObj[2];
            vertex = mesh.vert;
            edges = mesh.edge;
            triangles = mesh.triangle;
            faces = mesh.face;
            Reloacte();
            RotateVertexBy(obj[1].x, obj[1].y, obj[1].z);
        }
        function RotateVertex() {
            var pitch = obj[2].x * Clamp(rate, 4.166666666666667, 100) * 0.1;
            var roll = obj[2].y * Clamp(rate, 4.166666666666667, 100) * 0.1;
            var yaw = obj[2].z * Clamp(rate, 4.166666666666667, 100) * 0.1;

            var cosa = Math.cos(yaw);
            var sina = Math.sin(yaw);

            var cosb = Math.cos(pitch);
            var sinb = Math.sin(pitch);

            var cosc = Math.cos(roll);
            var sinc = Math.sin(roll);

            var Axx = cosa * cosb;
            var Ayv = cosa * sinb * sinc - sina * cosc;
            var Axz = cosa * sinb * cosc + sina * sinc;

            var Ayx = sina * cosb;
            var Ayy = sina * sinb * sinc + cosa * cosc;
            var Ayz = sina * sinb * cosc - cosa * sinc;

            var Azx = -sinb;
            var Azy = cosb * sinc;
            var Azz = cosb * cosc;
            for (var i = 0; i < vertex.length; i++) {
                var px = vertex[i].x;
                var py = vertex[i].y;
                var pz = vertex[i].z;

                vertex[i].x = Axx * px + Ayv * py + Axz * pz;
                vertex[i].y = Ayx * px + Ayy * py + Ayz * pz;
                vertex[i].z = Azx * px + Azy * py + Azz * pz;
            }
        }
        function RotateVertexBy(p, r, y) {
            var pitch = p;
            var roll = r;
            var yaw = y;

            var cosa = Math.cos(yaw);
            var sina = Math.sin(yaw);

            var cosb = Math.cos(pitch);
            var sinb = Math.sin(pitch);

            var cosc = Math.cos(roll);
            var sinc = Math.sin(roll);

            var Axx = cosa * cosb;
            var Ayv = cosa * sinb * sinc - sina * cosc;
            var Axz = cosa * sinb * cosc + sina * sinc;

            var Ayx = sina * cosb;
            var Ayy = sina * sinb * sinc + cosa * cosc;
            var Ayz = sina * sinb * cosc - cosa * sinc;

            var Azx = -sinb;
            var Azy = cosb * sinc;
            var Azz = cosb * cosc;
            for (var i = 0; i < vertex.length; i++) {
                var px = vertex[i].x;
                var py = vertex[i].y;
                var pz = vertex[i].z;

                vertex[i].x = Axx * px + Ayv * py + Axz * pz;
                vertex[i].y = Ayx * px + Ayy * py + Ayz * pz;
                vertex[i].z = Azx * px + Azy * py + Azz * pz;
            }
        }
        function GetVertexPosition() {
            var index = document.getElementById("index").value;
            document.getElementById("input").value = (vertex[index].x - centerx) + "," + (vertex[index].y - centery);
        }
        function GetDistance(ax, ay, az, bx, by, bz) {
            var dx = ax - bx;
            var dy = ay - by;
            var dz = az - bz;
            return Math.sqrt(dx * dx + dy * dy + dz * dz);
        }
        function ApplySettings() {
            var newres = document.getElementById("ires").value;
            var newtick = document.getElementById("tr").value;
            var newfrate = document.getElementById("fr").value;
            newfrate = Clamp(newfrate, 1, 240);

            document.getElementById("alig").value = Clamp(document.getElementById("alig").value, 0, 1);
            ambientLight = document.getElementById("alig").value;
            ambientLight = Clamp(ambientLight, 0, 1);

            newres = parseInt(newres);
            if (newres < 1) {
                newres = 1;
            }

            StopTickUpdate();
            resolution = newres;
            if (document.getElementById("ftfr").checked) {
                rate = (1 / (newfrate * 0.001));
                document.getElementById("tr").value = rate;
            }
            else {
                rate = newtick;
                document.getElementById("tr").value = rate;
                document.getElementById("fr").value = (1 / (rate * 0.001)).toFixed();
            }
            StartTickUpdate(rate);
        }
        function SetDrawmode() {
            var input = document.getElementById("dm").value;
            drawmode = input;
            ColorSettings();
        }
        function compare(a, b) {
            if (a.d < b.d) {
                return 1;
            }
            if (a.d > b.d) {
                return -1;
            }
            return 0;
        }

        DrawMesh();

        var frame = 0;
        var time = 0;
        function DrawMesh() {
            const currentDate = new Date();
            const framestart = currentDate.getTime();
            var customBG = document.getElementById("ubai").checked;
            //Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            //Close path, just in case
            ctx.closePath();

            if (customBG /*use bakground image*/) {
                //Fill canvas with image
                ctx.drawImage(document.getElementById("backgroundsrc"), 0, 0, canvas.clientWidth, canvas.clientHeight);
            }
            else {
                //Fill canvas with black
                ctx.fillStyle = '#000000';
                ctx.beginPath();
                ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
                ctx.stroke();
            }

            //Set draw style
            ctx.lineWidth = 3;
            ctx.font = "10px Arial";
            ctx.fillStyle = '#ffffff';

            //Create depth array to store depth data
            var depthIndex = [faces.length];
            for (var di = 0; di < faces.length; di++) {
                depthIndex[di] = { i: di, d: 0, u: false };
            }

            if (drawmode == "face") {
                //Get depth values
                for (var i = 0; i < faces.length; i++) {
                    depthIndex[i].d += vertex[triangles[faces[i].ind].tria].z + vertex[triangles[faces[i].ind].trib].z + vertex[triangles[faces[i].ind].tric].z;
                    depthIndex[i].d += vertex[triangles[faces[i].inde].tria].z + vertex[triangles[faces[i].inde].trib].z + vertex[triangles[faces[i].inde].tric].z;
                    depthIndex[i].u = false;
                }
                //Order by depth value
                depthIndex.sort(compare);
                //Draw
                for (var i = 0; i < faces.length; i++) {
                    var avrz = vertex[triangles[faces[depthIndex[i].i].ind].tria].z + vertex[triangles[faces[depthIndex[i].i].ind].trib].z + vertex[triangles[faces[depthIndex[i].i].ind].tric].z;
                    avrz = avrz / 3;

                    if (avrz < camera.viewdistance) {
                        ctx.beginPath();
                        ctx.moveTo(vertex[triangles[faces[depthIndex[i].i].ind].tria].x * resolution / 100 + centerx, vertex[triangles[faces[depthIndex[i].i].ind].tria].y * resolution / 100 + centery);
                        ctx.lineTo(vertex[triangles[faces[depthIndex[i].i].ind].trib].x * resolution / 100 + centerx, vertex[triangles[faces[depthIndex[i].i].ind].trib].y * resolution / 100 + centery);
                        ctx.lineTo(vertex[triangles[faces[depthIndex[i].i].ind].tric].x * resolution / 100 + centerx, vertex[triangles[faces[depthIndex[i].i].ind].tric].y * resolution / 100 + centery);
                        ctx.lineTo(vertex[triangles[faces[depthIndex[i].i].inde].tria].x * resolution / 100 + centerx, vertex[triangles[faces[depthIndex[i].i].inde].tria].y * resolution / 100 + centery);
                        ctx.lineTo(vertex[triangles[faces[depthIndex[i].i].inde].trib].x * resolution / 100 + centerx, vertex[triangles[faces[depthIndex[i].i].inde].trib].y * resolution / 100 + centery);
                        ctx.lineTo(vertex[triangles[faces[depthIndex[i].i].inde].tric].x * resolution / 100 + centerx, vertex[triangles[faces[depthIndex[i].i].inde].tric].y * resolution / 100 + centery);
                        ctx.closePath();
                        ctx.fillStyle = GetFaceColor(depthIndex[i].i);
                        ctx.fill();
                    }
                }
            }
            else if (drawmode == "shader") {
                //Get depth values
                for (var i = 0; i < faces.length; i++) {
                    depthIndex[i].d += vertex[triangles[faces[i].ind].tria].z + vertex[triangles[faces[i].ind].trib].z + vertex[triangles[faces[i].ind].tric].z;
                    depthIndex[i].d += vertex[triangles[faces[i].inde].tria].z + vertex[triangles[faces[i].inde].trib].z + vertex[triangles[faces[i].inde].tric].z;
                    depthIndex[i].u = false;
                }
                //Order by depth value
                depthIndex.sort(compare);
                //Draw
                for (var i = 0; i < faces.length; i++) {
                    //Get light intensity
                    var lightInFaceA = 0;
                    var lightInFaceAR = 0;
                    var lightInFaceAG = 0;
                    var lightInFaceAB = 0;
                    var lightInFaceB = 0;
                    var lightInFaceBR = 0;
                    var lightInFaceBG = 0;
                    var lightInFaceBB = 0;
                    var ainfluences = 0;
                    var binfluences = 0;
                    if (lights.length > 0) {
                        for (var l = 0; l < lights.length; l++) {
                            var avrx = vertex[triangles[faces[depthIndex[i].i].ind].tria].x + vertex[triangles[faces[depthIndex[i].i].ind].trib].x + vertex[triangles[faces[depthIndex[i].i].ind].tric].x;
                            avrx = avrx / 3;
                            var avry = vertex[triangles[faces[depthIndex[i].i].ind].tria].y + vertex[triangles[faces[depthIndex[i].i].ind].trib].y + vertex[triangles[faces[depthIndex[i].i].ind].tric].y;
                            avry = avry / 3;
                            var avrz = vertex[triangles[faces[depthIndex[i].i].ind].tria].z + vertex[triangles[faces[depthIndex[i].i].ind].trib].z + vertex[triangles[faces[depthIndex[i].i].ind].tric].z;
                            avrz = avrz / 3;
                            var arange = GetDistance(avrx, avry, avrz, lights[l].x, lights[l].y, lights[l].z);
                            if (arange < lights[l].range) {
                                ainfluences++;
                            }
                            arange = Clamp(arange, 0, lights[l].range);
                            lightInFaceA += (arange * lights[l].intensity) / lights[l].range;
                            lightInFaceAR += (arange * lights[l].r) / lights[l].range;
                            lightInFaceAG += (arange * lights[l].g) / lights[l].range;
                            lightInFaceAB += (arange * lights[l].b) / lights[l].range;

                            var bvrx = vertex[triangles[faces[depthIndex[i].i].inde].tria].x + vertex[triangles[faces[depthIndex[i].i].inde].trib].x + vertex[triangles[faces[depthIndex[i].i].inde].tric].x;
                            bvrx = bvrx / 3;
                            var bvry = vertex[triangles[faces[depthIndex[i].i].inde].tria].y + vertex[triangles[faces[depthIndex[i].i].inde].trib].y + vertex[triangles[faces[depthIndex[i].i].inde].tric].y;
                            bvry = bvry / 3;
                            var bvrz = vertex[triangles[faces[depthIndex[i].i].inde].tria].z + vertex[triangles[faces[depthIndex[i].i].inde].trib].z + vertex[triangles[faces[depthIndex[i].i].inde].tric].z;
                            bvrz = bvrz / 3;
                            var brange = GetDistance(bvrx, bvry, bvrz, lights[l].x, lights[l].y, lights[l].z);
                            if (brange < lights[l].range) {
                                binfluences++;
                            }
                            brange = Clamp(brange, 0, lights[l].range);
                            lightInFaceB += (brange * lights[l].intensity) / lights[l].range;
                            lightInFaceBR += (brange * lights[l].r) / lights[l].range;
                            lightInFaceBG += (brange * lights[l].g) / lights[l].range;
                            lightInFaceBB += (brange * lights[l].b) / lights[l].range;
                        }
                    }
                    lightInFaceA = Clamp(lightInFaceA, 0, 1);
                    lightInFaceAR = Clamp(lightInFaceAR / ainfluences, 0, 255);
                    lightInFaceAG = Clamp(lightInFaceAG / ainfluences, 0, 255);
                    lightInFaceAB = Clamp(lightInFaceAB / ainfluences, 0, 255);
                    lightInFaceB = Clamp(lightInFaceB, 0, 1);
                    lightInFaceBR = Clamp(lightInFaceBR / binfluences, 0, 255);
                    lightInFaceBG = Clamp(lightInFaceBG / binfluences, 0, 255);
                    lightInFaceBB = Clamp(lightInFaceBB / binfluences, 0, 255);

                    var avrz = vertex[triangles[faces[depthIndex[i].i].ind].tria].z + vertex[triangles[faces[depthIndex[i].i].ind].trib].z + vertex[triangles[faces[depthIndex[i].i].ind].tric].z;
                    avrz = avrz / 3;

                    if (avrz < camera.viewdistance) {
                        //Draw main face
                        ctx.beginPath();
                        ctx.moveTo(vertex[triangles[faces[depthIndex[i].i].ind].tria].x * resolution / 100 + centerx, vertex[triangles[faces[depthIndex[i].i].ind].tria].y * resolution / 100 + centery);
                        ctx.lineTo(vertex[triangles[faces[depthIndex[i].i].ind].trib].x * resolution / 100 + centerx, vertex[triangles[faces[depthIndex[i].i].ind].trib].y * resolution / 100 + centery);
                        ctx.lineTo(vertex[triangles[faces[depthIndex[i].i].ind].tric].x * resolution / 100 + centerx, vertex[triangles[faces[depthIndex[i].i].ind].tric].y * resolution / 100 + centery);
                        ctx.closePath();
                        ctx.fillStyle = GetFaceShaderColor(depthIndex[i].i, ambientLight, lightInFaceA, lightInFaceAR, lightInFaceAG, lightInFaceAB, ainfluences);
                        ctx.fill();
                        //Draw second face
                        ctx.moveTo(vertex[triangles[faces[depthIndex[i].i].inde].tria].x * resolution / 100 + centerx, vertex[triangles[faces[depthIndex[i].i].inde].tria].y * resolution / 100 + centery);
                        ctx.lineTo(vertex[triangles[faces[depthIndex[i].i].inde].trib].x * resolution / 100 + centerx, vertex[triangles[faces[depthIndex[i].i].inde].trib].y * resolution / 100 + centery);
                        ctx.lineTo(vertex[triangles[faces[depthIndex[i].i].inde].tric].x * resolution / 100 + centerx, vertex[triangles[faces[depthIndex[i].i].inde].tric].y * resolution / 100 + centery);
                        ctx.closePath();
                        ctx.fillStyle = GetFaceShaderColor(depthIndex[i].i, ambientLight, lightInFaceB, lightInFaceBR, lightInFaceBG, lightInFaceBB, binfluences);
                        ctx.fill();
                    }
                }
            }
            else if (drawmode == "shaderwireframe") {
                //Get depth values
                for (var i = 0; i < faces.length; i++) {
                    depthIndex[i].d += vertex[triangles[faces[i].ind].tria].z + vertex[triangles[faces[i].ind].trib].z + vertex[triangles[faces[i].ind].tric].z;
                    depthIndex[i].d += vertex[triangles[faces[i].inde].tria].z + vertex[triangles[faces[i].inde].trib].z + vertex[triangles[faces[i].inde].tric].z;
                    depthIndex[i].u = false;
                }
                //Order by depth value
                depthIndex.sort(compare);
                //Draw
                for (var i = 0; i < faces.length; i++) {
                    //Get light intensity
                    var lightInFaceA = 0;
                    var lightInFaceAR = 0;
                    var lightInFaceAG = 0;
                    var lightInFaceAB = 0;
                    var lightInFaceB = 0;
                    var lightInFaceBR = 0;
                    var lightInFaceBG = 0;
                    var lightInFaceBB = 0;
                    var ainfluences = 0;
                    var binfluences = 0;
                    if (lights.length > 0) {
                        for (var l = 0; l < lights.length; l++) {
                            var avrx = vertex[triangles[faces[depthIndex[i].i].ind].tria].x + vertex[triangles[faces[depthIndex[i].i].ind].trib].x + vertex[triangles[faces[depthIndex[i].i].ind].tric].x;
                            avrx = avrx / 3;
                            var avry = vertex[triangles[faces[depthIndex[i].i].ind].tria].y + vertex[triangles[faces[depthIndex[i].i].ind].trib].y + vertex[triangles[faces[depthIndex[i].i].ind].tric].y;
                            avry = avry / 3;
                            var avrz = vertex[triangles[faces[depthIndex[i].i].ind].tria].z + vertex[triangles[faces[depthIndex[i].i].ind].trib].z + vertex[triangles[faces[depthIndex[i].i].ind].tric].z;
                            avrz = avrz / 3;
                            var arange = GetDistance(avrx, avry, avrz, lights[l].x, lights[l].y, lights[l].z);
                            if (arange < lights[l].range) {
                                ainfluences++;
                            }
                            arange = Clamp(arange, 0, lights[l].range);
                            lightInFaceA += (arange * lights[l].intensity) / lights[l].range;
                            lightInFaceAR += (arange * lights[l].r) / lights[l].range;
                            lightInFaceAG += (arange * lights[l].g) / lights[l].range;
                            lightInFaceAB += (arange * lights[l].b) / lights[l].range;

                            var bvrx = vertex[triangles[faces[depthIndex[i].i].inde].tria].x + vertex[triangles[faces[depthIndex[i].i].inde].trib].x + vertex[triangles[faces[depthIndex[i].i].inde].tric].x;
                            bvrx = bvrx / 3;
                            var bvry = vertex[triangles[faces[depthIndex[i].i].inde].tria].y + vertex[triangles[faces[depthIndex[i].i].inde].trib].y + vertex[triangles[faces[depthIndex[i].i].inde].tric].y;
                            bvry = bvry / 3;
                            var bvrz = vertex[triangles[faces[depthIndex[i].i].inde].tria].z + vertex[triangles[faces[depthIndex[i].i].inde].trib].z + vertex[triangles[faces[depthIndex[i].i].inde].tric].z;
                            bvrz = bvrz / 3;
                            var brange = GetDistance(bvrx, bvry, bvrz, lights[l].x, lights[l].y, lights[l].z);
                            if (brange < lights[l].range) {
                                binfluences++;
                            }
                            brange = Clamp(brange, 0, lights[l].range);
                            lightInFaceB += (brange * lights[l].intensity) / lights[l].range;
                            lightInFaceBR += (brange * lights[l].r) / lights[l].range;
                            lightInFaceBG += (brange * lights[l].g) / lights[l].range;
                            lightInFaceBB += (brange * lights[l].b) / lights[l].range;
                        }
                    }
                    lightInFaceA = Clamp(lightInFaceA, 0, 1);
                    lightInFaceAR = Clamp(lightInFaceAR / ainfluences, 0, 255);
                    lightInFaceAG = Clamp(lightInFaceAG / ainfluences, 0, 255);
                    lightInFaceAB = Clamp(lightInFaceAB / ainfluences, 0, 255);
                    lightInFaceB = Clamp(lightInFaceB, 0, 1);
                    lightInFaceBR = Clamp(lightInFaceBR / binfluences, 0, 255);
                    lightInFaceBG = Clamp(lightInFaceBG / binfluences, 0, 255);
                    lightInFaceBB = Clamp(lightInFaceBB / binfluences, 0, 255);

                    var avrz = vertex[triangles[faces[depthIndex[i].i].ind].tria].z + vertex[triangles[faces[depthIndex[i].i].ind].trib].z + vertex[triangles[faces[depthIndex[i].i].ind].tric].z;
                    avrz = avrz / 3;

                    if (avrz < camera.viewdistance) {
                        //Draw main face
                        ctx.beginPath();
                        ctx.moveTo(vertex[triangles[faces[depthIndex[i].i].ind].tria].x * resolution / 100 + centerx, vertex[triangles[faces[depthIndex[i].i].ind].tria].y * resolution / 100 + centery);
                        ctx.lineTo(vertex[triangles[faces[depthIndex[i].i].ind].trib].x * resolution / 100 + centerx, vertex[triangles[faces[depthIndex[i].i].ind].trib].y * resolution / 100 + centery);
                        ctx.lineTo(vertex[triangles[faces[depthIndex[i].i].ind].tric].x * resolution / 100 + centerx, vertex[triangles[faces[depthIndex[i].i].ind].tric].y * resolution / 100 + centery);
                        ctx.closePath();
                        ctx.fillStyle = GetFaceShaderColor(depthIndex[i].i, ambientLight, lightInFaceA, lightInFaceAR, lightInFaceAG, lightInFaceAB, ainfluences);
                        ctx.fill();
                        //Draw second face
                        ctx.moveTo(vertex[triangles[faces[depthIndex[i].i].inde].tria].x * resolution / 100 + centerx, vertex[triangles[faces[depthIndex[i].i].inde].tria].y * resolution / 100 + centery);
                        ctx.lineTo(vertex[triangles[faces[depthIndex[i].i].inde].trib].x * resolution / 100 + centerx, vertex[triangles[faces[depthIndex[i].i].inde].trib].y * resolution / 100 + centery);
                        ctx.lineTo(vertex[triangles[faces[depthIndex[i].i].inde].tric].x * resolution / 100 + centerx, vertex[triangles[faces[depthIndex[i].i].inde].tric].y * resolution / 100 + centery);
                        ctx.closePath();
                        ctx.fillStyle = GetFaceShaderColor(depthIndex[i].i, ambientLight, lightInFaceB, lightInFaceBR, lightInFaceBG, lightInFaceBB, binfluences);
                        ctx.fill();
                    }
                }
                for (var i = 0; i < edges.length; i++) {
                    var index = edges[i].str;
                    var conection = edges[i].con;
                    ctx.strokeStyle = edgeColor + "59";
                    DrawLine(vertex[index], vertex[conection]);
                }
            }
            else if (drawmode == "light") {
                //Get depth values
                for (var i = 0; i < faces.length; i++) {
                    depthIndex[i].d += vertex[triangles[faces[i].ind].tria].z + vertex[triangles[faces[i].ind].trib].z + vertex[triangles[faces[i].ind].tric].z;
                    depthIndex[i].d += vertex[triangles[faces[i].inde].tria].z + vertex[triangles[faces[i].inde].trib].z + vertex[triangles[faces[i].inde].tric].z;
                    depthIndex[i].u = false;
                }
                //Order by depth value
                depthIndex.sort(compare);
                //Draw
                for (var i = 0; i < faces.length; i++) {
                    //Get light intensity
                    var lightInFaceA = 0;
                    var lightInFaceAR = 0;
                    var lightInFaceAG = 0;
                    var lightInFaceAB = 0;
                    var lightInFaceB = 0;
                    var lightInFaceBR = 0;
                    var lightInFaceBG = 0;
                    var lightInFaceBB = 0;
                    var ainfluences = 0;
                    var binfluences = 0;
                    if (lights.length > 0) {
                        for (var l = 0; l < lights.length; l++) {
                            var avrx = vertex[triangles[faces[depthIndex[i].i].ind].tria].x + vertex[triangles[faces[depthIndex[i].i].ind].trib].x + vertex[triangles[faces[depthIndex[i].i].ind].tric].x;
                            avrx = avrx / 3;
                            var avry = vertex[triangles[faces[depthIndex[i].i].ind].tria].y + vertex[triangles[faces[depthIndex[i].i].ind].trib].y + vertex[triangles[faces[depthIndex[i].i].ind].tric].y;
                            avry = avry / 3;
                            var avrz = vertex[triangles[faces[depthIndex[i].i].ind].tria].z + vertex[triangles[faces[depthIndex[i].i].ind].trib].z + vertex[triangles[faces[depthIndex[i].i].ind].tric].z;
                            avrz = avrz / 3;
                            var arange = GetDistance(avrx, avry, avrz, lights[l].x, lights[l].y, lights[l].z);
                            if (arange < lights[l].range) {
                                ainfluences++;
                            }
                            arange = Clamp(arange, 0, lights[l].range);
                            lightInFaceA += (arange * lights[l].intensity) / lights[l].range;
                            lightInFaceAR += (arange * lights[l].r) / lights[l].range;
                            lightInFaceAG += (arange * lights[l].g) / lights[l].range;
                            lightInFaceAB += (arange * lights[l].b) / lights[l].range;

                            var bvrx = vertex[triangles[faces[depthIndex[i].i].inde].tria].x + vertex[triangles[faces[depthIndex[i].i].inde].trib].x + vertex[triangles[faces[depthIndex[i].i].inde].tric].x;
                            bvrx = bvrx / 3;
                            var bvry = vertex[triangles[faces[depthIndex[i].i].inde].tria].y + vertex[triangles[faces[depthIndex[i].i].inde].trib].y + vertex[triangles[faces[depthIndex[i].i].inde].tric].y;
                            bvry = bvry / 3;
                            var bvrz = vertex[triangles[faces[depthIndex[i].i].inde].tria].z + vertex[triangles[faces[depthIndex[i].i].inde].trib].z + vertex[triangles[faces[depthIndex[i].i].inde].tric].z;
                            bvrz = bvrz / 3;
                            var brange = GetDistance(bvrx, bvry, bvrz, lights[l].x, lights[l].y, lights[l].z);
                            if (brange < lights[l].range) {
                                binfluences++;
                            }
                            brange = Clamp(brange, 0, lights[l].range);
                            lightInFaceB += (brange * lights[l].intensity) / lights[l].range;
                            lightInFaceBR += (brange * lights[l].r) / lights[l].range;
                            lightInFaceBG += (brange * lights[l].g) / lights[l].range;
                            lightInFaceBB += (brange * lights[l].b) / lights[l].range;
                        }
                    }
                    lightInFaceA = Clamp(lightInFaceA, 0, 1);
                    lightInFaceAR = Clamp(lightInFaceAR / ainfluences, 0, 255);
                    lightInFaceAG = Clamp(lightInFaceAG / ainfluences, 0, 255);
                    lightInFaceAB = Clamp(lightInFaceAB / ainfluences, 0, 255);
                    lightInFaceB = Clamp(lightInFaceB, 0, 1);
                    lightInFaceBR = Clamp(lightInFaceBR / binfluences, 0, 255);
                    lightInFaceBG = Clamp(lightInFaceBG / binfluences, 0, 255);
                    lightInFaceBB = Clamp(lightInFaceBB / binfluences, 0, 255);

                    var avrz = vertex[triangles[faces[depthIndex[i].i].ind].tria].z + vertex[triangles[faces[depthIndex[i].i].ind].trib].z + vertex[triangles[faces[depthIndex[i].i].ind].tric].z;
                    avrz = avrz / 3;

                    if (avrz < camera.viewdistance) {
                        //Draw main face
                        ctx.beginPath();
                        ctx.moveTo(vertex[triangles[faces[depthIndex[i].i].ind].tria].x * resolution / 100 + centerx, vertex[triangles[faces[depthIndex[i].i].ind].tria].y * resolution / 100 + centery);
                        ctx.lineTo(vertex[triangles[faces[depthIndex[i].i].ind].trib].x * resolution / 100 + centerx, vertex[triangles[faces[depthIndex[i].i].ind].trib].y * resolution / 100 + centery);
                        ctx.lineTo(vertex[triangles[faces[depthIndex[i].i].ind].tric].x * resolution / 100 + centerx, vertex[triangles[faces[depthIndex[i].i].ind].tric].y * resolution / 100 + centery);
                        ctx.closePath();
                        var lca = Math.round(ambientLight * 255 + ((lightInFaceAR + lightInFaceAG + lightInFaceAB) / 3 * lightInFaceA));
                        ctx.fillStyle = rgbToHex(lca, lca, lca);
                        ctx.fill();

                        //Draw second face
                        ctx.moveTo(vertex[triangles[faces[depthIndex[i].i].inde].tria].x * resolution / 100 + centerx, vertex[triangles[faces[depthIndex[i].i].inde].tria].y * resolution / 100 + centery);
                        ctx.lineTo(vertex[triangles[faces[depthIndex[i].i].inde].trib].x * resolution / 100 + centerx, vertex[triangles[faces[depthIndex[i].i].inde].trib].y * resolution / 100 + centery);
                        ctx.lineTo(vertex[triangles[faces[depthIndex[i].i].inde].tric].x * resolution / 100 + centerx, vertex[triangles[faces[depthIndex[i].i].inde].tric].y * resolution / 100 + centery);
                        ctx.closePath();
                        var lcb = Math.round(ambientLight * 255 + ((lightInFaceBR + lightInFaceBG + lightInFaceBB) / 3 * lightInFaceB));
                        ctx.fillStyle = rgbToHex(lcb, lcb, lcb);
                        ctx.fill();
                    }
                }
            }
            else
            {
                 //Draw mesh
                 if (drawmode == "wireframe") {
                    for (var i = 0; i < edges.length; i++) {
                        var index = edges[i].str;
                        var conection = edges[i].con;
                        ctx.strokeStyle = edgeColor;
                        DrawLine(vertex[index], vertex[conection]);
                    }
                 }
                if (drawmode == "complexwireframe") {
                    for (var i = 0; i < triangles.length; i++) {
                        ctx.strokeStyle = edgeColor;
                        DrawLine(vertex[triangles[i].tria], vertex[triangles[i].trib]);
                        DrawLine(vertex[triangles[i].trib], vertex[triangles[i].tric]);
                        DrawLine(vertex[triangles[i].tric], vertex[triangles[i].tria]);
                    }
                }
                else if (drawmode == "mesh") {
                    for (var i = 0; i < triangles.length; i++) {
                        if (drawmode == "mesh") {
                            ctx.beginPath();
                            ctx.moveTo(vertex[triangles[i].tria].x * resolution / 100 + centerx, vertex[triangles[i].tria].y * resolution / 100 + centery);
                            ctx.lineTo(vertex[triangles[i].trib].x * resolution / 100 + centerx, vertex[triangles[i].trib].y * resolution / 100 + centery);
                            ctx.lineTo(vertex[triangles[i].tric].x * resolution / 100 + centerx, vertex[triangles[i].tric].y * resolution / 100 + centery);
                            ctx.closePath();
                            ctx.fillStyle = triangleColor;
                            ctx.fill();
                        }
                    }
                }
                else if (drawmode == "depth") {
                    //Get depth values
                    for (var i = 0; i < faces.length; i++) {
                        depthIndex[i].d += vertex[triangles[faces[i].ind].tria].z + vertex[triangles[faces[i].ind].trib].z + vertex[triangles[faces[i].ind].tric].z;
                        depthIndex[i].d += vertex[triangles[faces[i].inde].tria].z + vertex[triangles[faces[i].inde].trib].z + vertex[triangles[faces[i].inde].tric].z;
                        depthIndex[i].u = false;
                    }
                    //Order by depth value
                    depthIndex.sort(compare);
                    //Draw
                    for (var i = 0; i < faces.length; i++) {
                        ctx.beginPath();
                        ctx.moveTo(vertex[triangles[faces[depthIndex[i].i].ind].tria].x * resolution / 100 + centerx, vertex[triangles[faces[depthIndex[i].i].ind].tria].y * resolution / 100 + centery);
                        ctx.lineTo(vertex[triangles[faces[depthIndex[i].i].ind].trib].x * resolution / 100 + centerx, vertex[triangles[faces[depthIndex[i].i].ind].trib].y * resolution / 100 + centery);
                        ctx.lineTo(vertex[triangles[faces[depthIndex[i].i].ind].tric].x * resolution / 100 + centerx, vertex[triangles[faces[depthIndex[i].i].ind].tric].y * resolution / 100 + centery);
                        ctx.lineTo(vertex[triangles[faces[depthIndex[i].i].inde].tria].x * resolution / 100 + centerx, vertex[triangles[faces[depthIndex[i].i].inde].tria].y * resolution / 100 + centery);
                        ctx.lineTo(vertex[triangles[faces[depthIndex[i].i].inde].trib].x * resolution / 100 + centerx, vertex[triangles[faces[depthIndex[i].i].inde].trib].y * resolution / 100 + centery);
                        ctx.lineTo(vertex[triangles[faces[depthIndex[i].i].inde].tric].x * resolution / 100 + centerx, vertex[triangles[faces[depthIndex[i].i].inde].tric].y * resolution / 100 + centery);
                        ctx.closePath();
                        var dc = Math.round((depthIndex[depthIndex[i].i].d / 100 + 10) * 255 / 50);
                        ctx.fillStyle = rgbToHex(dc, dc, dc);
                        ctx.fill();
                    }
                }
            }

            //Draw text
            if (displayDebug) {
                if (true /*draw light points*/) {
                    for (var l = 0; l < lights.length; l++) {
                        ctx.beginPath();
                        var scale = lights[l].z * -1 - camera.z / 10;
                        if (scale < 0) {
                            scale *= -1;
                        }
                        var posx = lights[l].x * resolution / 100 + centerx;
                        var posy = lights[l].y * resolution / 100 + centery;
                        ctx.drawImage(document.getElementById("lighticon"), posx, posy, 25, 25);
                        if (displayText) {
                            ctx.beginPath();
                            ctx.font = "italic 9px Courier";
                            ctx.fillStyle = (customBG ? "#000000" : "#ffffff");
                            ctx.fillText("light [" + l + "]", posx, posy + 35);
                            ctx.fillText("inintensity: " + lights[l].intensity, posx, posy + 45);
                            ctx.fillStyle = rgbToHex(lights[l].r, lights[l].g, lights[l].b);
                            ctx.fillText("rgb: " + lights[l].r + ", " + lights[l].g + ", " + lights[l].b, posx, posy + 55);
                            ctx.fillStyle = (customBG ? "#000000" : "#ffffff");
                            ctx.fillText("range: " + lights[l].range / 10, posx, posy + 65);
                            ctx.fillText("location: " + lights[l].x / 10 + ", " + lights[l].y / 10 + ", " + lights[l].z / 10, posx, posy + 75);
                            ctx.fill();
                            ctx.closePath();
                        }
                    }
                }
                ctx.font = "8px Courier";

                for (var i = 0; i < vertex.length; i++) {
                    if (true /*draw vertex points*/) {
                        //Draw point
                        ctx.beginPath();
                        ctx.arc(vertex[i].x * resolution / 100 + centerx, vertex[i].y * resolution / 100 + centery, 2 /*Dot size (default = 2)*/, 0, 2 * Math.PI, false);
                        ctx.fillStyle = '#ffffff';
                        ctx.fill();
                    }

                    if (displayText) {
                        //Text outline
                        var xv = ((vertex[i].x - centerx) / 100).toFixed(2);
                        var yv = ((vertex[i].y - centery) / 100).toFixed(2);
                        var zv = (vertex[i].z / 10).toFixed(2);
                        ctx.fillStyle = '#000000';
                        var posx = (vertex[i].x * resolution / 100 + centerx);
                        var posy = (vertex[i].y * resolution / 100 + centery);
                        ctx.fillText('(id:' + i + ')', posx + 4, posy + 10);
                        ctx.fillText(xv + ',' + yv + ',' + zv, posx + 4, posy + 20);
                        ctx.fillText('(id:' + i + ')', posx, posy + 10);
                        ctx.fillText(xv + ',' + yv + ',' + zv, posx, posy + 20);
                        ctx.fillText('(id:' + i + ')', posx + 2, posy + 12);
                        ctx.fillText(xv + ',' + yv + ',' + zv, posx + 2, posy + 22);
                        ctx.fillText('(id:' + i + ')', posx + 2, posy + 8);
                        ctx.fillText(xv + ',' + yv + ',' + zv, posx + 2, posy + 18);

                        //Text
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText('(id:' + i + ')', posx + 2, posy + 10);
                        ctx.fillText(xv + ',' + yv + ',' + zv, posx + 2, posy + 20);
                    }
                }

                //Finaly close the path
                ctx.closePath();
            }

            const otherDate = new Date();
            const frameend = otherDate.getTime();
            const frameTimeSec = frameend / 100000000000000;

            //Debug info
            ctx.fillStyle = (customBG ? "#000000" : "#ffffff");
            time += frameTimeSec;
            ctx.font = ctx.font = "bold 8pt Courier";
            ctx.fillText(meshName + ".json", 5, 15);
            ctx.font = ctx.font = "8pt Courier";
            ctx.fillText('frame: ' + frame + " | time: " + time.toFixed(2) + "s | averge fps: " + (frame / time).toFixed(1), 5, 50);
            ctx.fillText('tickrate: ' + rate.toFixed(1) + " (affect fps)", 5, 65);
            ctx.fillText('calls per second: ' + (1 / frameTimeSec).toFixed(1), 5, 80);
            ctx.fillText('resolution: ' + canvas.clientWidth + 'x' + canvas.clientHeight, 5, 95);
            ctx.fillText('window size: ' + window.innerWidth + 'x' + window.innerHeight, 5, 110);

            ctx.fillText('speed: x:' + (obj[1].x * 10).toFixed(2) + ',y:' + (obj[1].y * 10).toFixed(2) + ',z:' + (obj[1].z * 10).toFixed(2), 5, 130);
            ctx.fillText('vertex count: ' + vertex.length, 5, 145);
            ctx.fillText('edge count: ' + edges.length, 5, 160);
            ctx.fillText('triangle count: ' + triangles.length, 5, 175);
            ctx.fillText('light count: ' + lights.length, 5, 190);

            ctx.font = ctx.font = "italic 8pt Courier";
            ctx.fillText('[DEBUG INFO UPDATES ARE AFFECTED BY FRAMERATE]', canvas.clientWidth / 2 - 140, 12);
            ctx.font = ctx.font = "8pt Courier";

            if (drawmode == "face") {
                var pos = 0;
                for (var i = 0; i < depthIndex.length; i++) {
                    ctx.fillStyle = GetFaceColor(i);
                    ctx.fillText('∎', 5, 190 + pos * 15);
                    ctx.fillStyle = (customBG ? "#000000" : "#ffffff");
                    ctx.fillText('face [' + depthIndex[i].i + '] depth: ' + (depthIndex[i].d / 100).toFixed(2), 20, 190 + pos * 15);
                    pos++;
                }
            }
            else if (drawmode == "depth") {
                var pos = 0;
                for (var i = 0; i < depthIndex.length; i++) {
                    var dc = Math.round((depthIndex[depthIndex[i].i].d / 100 + (camera.z / 10)) * 255 / 50); //0 dis = 0,0,0 / 50 dis = 1,1,1 / cam dis
                    ctx.fillStyle = rgbToHex(dc, dc, dc);
                    ctx.fillText('∎', 5, 190 + pos * 15);
                    ctx.fillStyle = (customBG ? "#000000" : "#ffffff");
                    ctx.fillText('face [' + depthIndex[i].i + '] depth: ' + (depthIndex[i].d / 100).toFixed(2), 20, 190 + pos * 15);
                    pos++;
                }
            }

            ctx.fillText('frame delay: ' + (frameend - framestart) + 'ms~', 5, 35);

            ctx.fillRect(0, canvas.clientHeight - 17, 37, 17);
            ctx.fillStyle = (customBG ? "#ffffff" : "#000000");
            ctx.fillText('v' + version, 5, canvas.clientHeight - 5);
        }

        var intervalId;
        StartTickUpdate(rate);
        function StartTickUpdate(newr) {
            if (!activeUpdate) {
                intervalId = window.setInterval(function () {
                Tick();
                }, newr);
                activeUpdate = true;
            }
        }

        function StopTickUpdate() {
            if (activeUpdate) {
                clearInterval(intervalId);
                activeUpdate = false;
            }
        }

        function Tick() {
            DrawMesh();
            if (document.getElementById("amr").checked) {
                RotateVertex();
            }

            frame++;
        }

        function Debug() {
            displayDebug = document.getElementById("ddebug").checked;
            displayText = document.getElementById("dtext").checked;
        }
        function ReRender() {
            frame = 0;
            DrawMesh();
        }

        //Event listeners
        const selectElementDM = document.querySelector('.drawm');
        selectElementDM.addEventListener('change', (event) => {
            console.log(event.target.value);
            SetDrawmode();
        });