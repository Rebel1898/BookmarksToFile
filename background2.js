var loaded = false;
var index = 0;
var objetomarker = [];
var bookmarkfiles = [];

function Bookit(nivel, item, foldernum, folder) {
  this.nivel = nivel;
  this.item = item;
  this.foldernum = foldernum;
  this.folder = folder;
}

function logItems(bookmarkItem, bookmarkItems) {

  objetomarker.push(bookmarkItem);


  for (i = 0; i < objetomarker.length; i++) {
    if (index == 0) {
      // var x = "<ul id=" + objetomarker[i].id + "></ul>"
      var header = document.createElement("ul");
      header.setAttribute("id",objetomarker[i].id);
      document.getElementById("header").appendChild(header);
      var kinder = objetomarker[i].children;

      for (j = 0; j < kinder.length; j++) {
        objetomarker.push(kinder[j]);

      }
    }
    else {

      var parentname = objetomarker[i].parentId;
      var id2 = objetomarker[i].id;
      var titulo = objetomarker[i].title;
      var kinder = objetomarker[i].children;
      var url = objetomarker[i].url;
      var type = objetomarker[i].type;
      if (type == "folder") {
        
        // document.getElementById(parentname).innerHTML += "<li class='folder' name='" + id2 + "'><span class='caret caret-down'></span><input class='singlecheck' type='checkbox'><img class ='folderimage' src='Images/folder.png' height='20px' width='20px'>&nbsp;&nbsp;" + titulo + "<ul id=" + id2 + "></ul></li>"

        // "<li class='folder' name='" + id2 + "'><span class='caret caret-down'></span><input class='singlecheck' type='checkbox'><img class ='folderimage' src='Images/folder.png' height='20px' width='20px'>&nbsp;&nbsp;" + titulo + "<ul id=" + id2 + "></ul></li>"

        var folderelement = document.createElement("li");
        folderelement.setAttribute("class","folder");
        folderelement.setAttribute("name",id2);
 
        var spancaret = document.createElement("span")
        spancaret.setAttribute("class","caret caret-down");
        folderelement.appendChild(spancaret);
  
        var inputelement = document.createElement("input");
        inputelement.setAttribute("class","singlecheck");
        inputelement.setAttribute("type", "checkbox");
        folderelement.appendChild(inputelement);

        var folderimage = document.createElement("img");
        folderimage.setAttribute("class","folderimage")
        folderimage.setAttribute("src","Images/folder.png")
        folderelement.appendChild(folderimage);

        var textnode = document.createTextNode("   "+titulo +" ");
        folderelement.appendChild(textnode);
    
        var ul = document.createElement("ul");
        ul.setAttribute("id",id2);
        folderelement.appendChild(ul);
        document.getElementById(parentname).appendChild(folderelement);
        
        for (j = 0; j < kinder.length; j++) {
          objetomarker.push(kinder[j]);

        }

      }
      else {

        // document.getElementById(parentname).innerHTML += "<li class='urlfile' id='" + id2 + "'><input class='singlecheck' type='checkbox'><img src='Images/URL.png' width='20px;' height='20px;'>&nbsp;&nbsp;<a href='" + url + "'>" + titulo + "</a></li>"
        var folderelement = document.createElement("li");
        folderelement.setAttribute("class","urlfile");
        folderelement.setAttribute("id",id2);

        var inputelement = document.createElement("input");
        inputelement.setAttribute("class","singlecheck");
        inputelement.setAttribute("type", "checkbox");
        folderelement.appendChild(inputelement);

        var folderimage = document.createElement("img");
        folderimage.setAttribute("class","folderimage")
        folderimage.setAttribute("src","Images/URL.png")
        folderelement.appendChild(folderimage);

        var link = document.createElement("a");
        link.setAttribute("href",url);
        var textlink = document.createTextNode(" "+titulo+" ");
        link.appendChild(textlink);
        folderelement.appendChild(link);

        document.getElementById(parentname).appendChild(folderelement);

      }

    }
    index++;
  }
  // console.log(objetomarker);


var cerrarcarets= document.getElementsByClassName("caret caret-down")
for (j = cerrarcarets.length-1; j>=0; j--) {
cerrarcarets[j].click();
}
loaded = true;
document.getElementById("load-message").style="display:none;"


  var descargartodo = {};
  descargartodo = objetomarker;
  descargartodo.path = "";
  var rutafinal = writeparentpath(descargartodo[15].parentId, descargartodo, "");
  // console.log(rutafinal);
  for (b = 0; b < descargartodo.length; b++) {
    if (descargartodo[b].type != "folder") {
      var ruta = writeparentpath(descargartodo[b].parentId, descargartodo, "");
      var downloadUrl = descargartodo[b].url;
      var title = descargartodo[b].title + ".URL";
      var text = "[InternetShortcut]\nURL=" + downloadUrl + "\nIDList= \nHotKey=0 \nIconFile= \nIconIndex=0";
      text = text.replace(/\n/g, "\r\n");
      var link = downloadContent(title, text);
      link.path = ruta
      link.id = descargartodo[b].id;
      bookmarkfiles.push(link);
    }
    else {
    
      descargartodo[b].path = writeparentpath(descargartodo[b].parentId, descargartodo, "");
      bookmarkfiles.push(descargartodo[b]);
    }
  }

  // console.log(bookmarkfiles);
  //Download ALL
  document.getElementById('btn-save-all').addEventListener("click", (e) => {
    // console.log("Download all");
    var cajas = document.getElementsByClassName("singlecheck");
    for (a = 0; a < cajas.length; a++) {
      cajas[a].checked = true;

    }
  //  console.log(bookmarkfiles);
    GenerateZipfile(bookmarkfiles);
  }
  )
  //  
}
document.getElementById('btn-save-selected').addEventListener("click", (e) => {
  var selectedbookmarks = [];
  var selectbox = document.getElementsByClassName("singlecheck")
  for (b = 0; b < selectbox.length; b++) {
    if (selectbox[b].checked == true) {
      var id = selectbox[b].parentElement.id;
      if (id == "") {
        id = selectbox[b].parentElement.attributes.name.nodeValue
      };
      var objeto = bookmarkfiles.find(o => o.id === id);
      if (objeto != undefined) {
        selectedbookmarks.push(objeto);
      }
    }
  }
  // console.log(selectedbookmarks);

  GenerateZipfile(selectedbookmarks);
})


document.addEventListener("change", (e) => {
  if (e.target.id == "") {
    var etarget = e.target.parentElement.getElementsByTagName("input");

    // e.target.parentElement.children[1].children;
    var x = e.target.checked;
    for (b = 0; b < etarget.length; b++) {
      
      etarget[b].checked = x;
      
    }

  }

})

document.addEventListener("click", (e) => {
    // e.target.parentElement.classList.toggle("active");
    if(e.target.classList== "caret caret-down" ){
    e.target.classList.toggle("caret-down");
    var listelements = e.target.parentElement.children[3].children;
    // var estado =    listelements[0].hidden;
    // console.log(estado);
    for (b = 0; b < listelements.length; b++) {
      listelements[b].hidden= true;

    }
  }
  else if (e.target.classList == "caret"){
  e.target.classList.toggle("caret-down");
  var listelements = e.target.parentElement.children[3].children;

  for (b = 0; b < listelements.length; b++) {
    listelements[b].hidden= false;

  }}
  });

function writeparentpath(parentId, descargartodo) {
  try {
    var ruta = "";
    var objeto = descargartodo.find(o => o.id === parentId);
    if (objeto.parentId == objeto.id2) {
      return ruta = "Bookmarks";
    }
    if (objeto.parentId != undefined) {
      ruta = "\\" + objeto.title + "\\";
      ruta = writeparentpath(objeto.parentId, descargartodo) + ruta;
      ruta = ruta.replace(/\\\\/g, "\\");;
    }
    else {
      ruta = "";
    }
    return ruta
  }
  catch { }
}
function logTree(bookmarkItems) {
  logItems(bookmarkItems[0], 0);
}

function onRejected(error) {
  console.log(`An error: ${error}`);/*console*/
}

var gettingTree = browser.bookmarks.getTree();

gettingTree.then(logTree, onRejected);

/*Download*/

function onStartedDownload(id) {
  console.log(`Started downloading: ${id}`);
}

function onFailed(error) {
  console.log(`Download failed: ${error}`);
}

function downloadContent(name, content) {
  var atag = document.createElement("a");
  var file = new Blob([content], { type: 'application/octet-stream;' });
  file.name = name;  
  return file;

}
function GenerateZipfile(bookmarkfiles) {
  var atag = document.createElement("a");
  var zip = new JSZip();
  var zipitems = [];
  zipitems.push(bookmarkfiles[0]);

  for (var c = 0; c < bookmarkfiles.length; c++) {
    if (bookmarkfiles[c].type == "application/octet-stream;") {
      bookmarkfiles[c].name = bookmarkfiles[c].name.replace(/\\/g, "-");
      bookmarkfiles[c].name = bookmarkfiles[c].name.replace(/\//g, "-");
    
      var path = bookmarkfiles[c].path;
      var file ={}
      var file = bookmarkfiles[c];
      // delete file.path;
      // delete file.id;
      path = path.slice(0, -1);
      var carpeta = zip.folder(path);
      carpeta.file(bookmarkfiles[c].name, file);
    }
    else if (bookmarkfiles[c].path == undefined) { }
    else {
      if (bookmarkfiles[c].path == "Bookmarks") { 
        zip.folder(bookmarkfiles[c].path +"\\"+ bookmarkfiles[c].title); }
      else { 
        var carpeta = bookmarkfiles[c].path + bookmarkfiles[c].title;
        zip.folder(carpeta); }
    }
  }
 
  zip.generateAsync({
    type: "base64", compression: "DEFLATE",
    compressionOptions: {
      level: 9
    }
  })
    .then(function (content) {
      atag.href = "data:application/zip;base64," + content;
      atag.download = "Bookmarks";
      atag.click();

    });
}