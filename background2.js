detectarSOyMarcarOpcioninicial();

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
      var header = document.createElement("ul");
      header.setAttribute("id", objetomarker[i].id);
      document.getElementById("header").appendChild(header);
      var kinder = objetomarker[i].children;

      for (j = 0; j < kinder.length; j++) {
        objetomarker.push(kinder[j]);

      }
    }
    else {

      var parentname = objetomarker[i].parentId;
      var id2 = objetomarker[i].id;
      var url = objetomarker[i].url;
      var titulo = objetomarker[i].title;

      var kinder = objetomarker[i].children;

      var type = objetomarker[i].type;
      if (type == "folder") {
        if (titulo == "") { titulo = "No title" }
        var folderelement = document.createElement("li");
        folderelement.setAttribute("class", "folder");
        folderelement.setAttribute("name", id2);

        var spancaret = document.createElement("span")
        spancaret.setAttribute("class", "caret caret-down");
        folderelement.appendChild(spancaret);

        var inputelement = document.createElement("input");
        inputelement.setAttribute("class", "singlecheck");
        inputelement.setAttribute("type", "checkbox");
        folderelement.appendChild(inputelement);

        var folderimage = document.createElement("img");
        folderimage.setAttribute("class", "folderimage")
        folderimage.setAttribute("src", "Images/folder.png")
        folderelement.appendChild(folderimage);

        var textnode = document.createTextNode("   " + titulo + " ");
        folderelement.appendChild(textnode);

        var ul = document.createElement("ul");
        ul.setAttribute("id", id2);
        folderelement.appendChild(ul);
        document.getElementById(parentname).appendChild(folderelement);

        for (j = 0; j < kinder.length; j++) {
          objetomarker.push(kinder[j]);

        }

      }
      else {
        if (titulo == "") { titulo = url }
        var folderelement = document.createElement("li");
        folderelement.setAttribute("class", "urlfile");
        folderelement.setAttribute("id", id2);

        var inputelement = document.createElement("input");
        inputelement.setAttribute("class", "singlecheck");
        inputelement.setAttribute("type", "checkbox");
        folderelement.appendChild(inputelement);

        var folderimage = document.createElement("img");
        folderimage.setAttribute("class", "folderimage")
        folderimage.setAttribute("src", "Images/URL.png")
        folderelement.appendChild(folderimage);

        var link = document.createElement("a");
        link.setAttribute("href", url);
        var textlink = document.createTextNode(" " + titulo + " ");
        link.appendChild(textlink);
        folderelement.appendChild(link);

        document.getElementById(parentname).appendChild(folderelement);

      }
    }
    index++;
  }


  var cerrarcarets = document.getElementsByClassName("caret caret-down")
  for (j = cerrarcarets.length - 1; j >= 0; j--) {
    cerrarcarets[j].click();
  }
  loaded = true;
  document.getElementById("load-message").style = "display:none;"


  var descargartodo = {};
  descargartodo = objetomarker;
  descargartodo.path = "";



  for (b = 0; b < descargartodo.length; b++) {
    if (descargartodo[b].type != "folder") {
      var ruta = writeparentpath(descargartodo[b].parentId, descargartodo, "");
      var downloadUrl = descargartodo[b].url;
      var title = descargartodo[b].title;
      var text = "[InternetShortcut]\nURL=" + downloadUrl + "\nIDList= \nHotKey=0 \nIconFile= \nIconIndex=0";
      text = text.replace(/\n/g, "\r\n");

      var textLinuxDesktop = "[Desktop Entry]\nVersion=1.0\nType=Link\nName=" + title + "\nComment=Acceso directo a una web\nIcon=text-html\nURL=" + downloadUrl

      var textMac = `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0"><dict><key>URL</key><string>${downloadUrl}</string></dict></plist>`;


      var link = {};
      link.title = title;
      link.text = text;
      link.textMac = textMac;
      link.textLinuxDesktop = textLinuxDesktop;


      link.path = ruta
      link.id = descargartodo[b].id;
      bookmarkfiles.push(link);
    }
    else {

      descargartodo[b].path = writeparentpath(descargartodo[b].parentId, descargartodo, "");
      descargartodo[b].text = null;
      bookmarkfiles.push(descargartodo[b]);
    }
  }

  //Download ALL
  document.getElementById('btn-save-all').addEventListener("click", (e) => {
    var cajas = document.getElementsByClassName("singlecheck");
    for (a = 0; a < cajas.length; a++) {
      cajas[a].checked = true;

    }
    GenerateZipfile(bookmarkfiles);
  }
  )
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
  GenerateZipfile(selectedbookmarks);
})


document.addEventListener("change", (e) => {
  if (e.target.id == "") {
    var etarget = e.target.parentElement.getElementsByTagName("input");

    var x = e.target.checked;
    for (b = 0; b < etarget.length; b++) {
      etarget[b].checked = x;
    }

  }

})

document.addEventListener("click", (e) => {
  if (e.target.classList == "caret caret-down") {
    e.target.classList.toggle("caret-down");
    var listelements = e.target.parentElement.children[3].children;
    for (b = 0; b < listelements.length; b++) {
      listelements[b].hidden = true;
    }
  }
  else if (e.target.classList == "caret") {
    e.target.classList.toggle("caret-down");
    var listelements = e.target.parentElement.children[3].children;
    for (b = 0; b < listelements.length; b++) {
      listelements[b].hidden = false;

    }
  }
});




function writeparentpath(parentId, descargartodo) {
  try {
    var ruta = "";
    var objeto = descargartodo.find(o => o.id === parentId);
    if (objeto.parentId == objeto.id2) {
      return ruta = "Bookmarks";
    }
    if (objeto.parentId != undefined) {
      ruta = "/" + objeto.title + "/";
      ruta = writeparentpath(objeto.parentId, descargartodo) + ruta;
      ruta = ruta.replace(/\/{2,}/g, "/");
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
  console.log(`An error: ${error}`);
}

var gettingTree = browser.bookmarks.getTree();

gettingTree.then(logTree, onRejected);

function onStartedDownload(id) {
  console.log(`Started downloading: ${id}`);
}

function onFailed(error) {
  console.log(`Download failed: ${error}`);
}

function GenerateZipfile(bookmarkfiles) {

  var extension = document.getElementById("OS").value;
  var newzipitems = {};

  for (var c = 1; c < bookmarkfiles.length; c++) {
    if (bookmarkfiles[c].type == "folder") {
      var path = bookmarkfiles[c].path;
      newzipitems[path + "/" + bookmarkfiles[c].title] = null;
    }

    else if (bookmarkfiles[c].path == undefined) { }
    else {
      var title = (bookmarkfiles[c].path + "/" + bookmarkfiles[c].title + extension).replace(/\/{2,}/g, "/");
      var texto = extension === ".webloc" ? bookmarkfiles[c].textMac : extension === ".desktop-url" ? bookmarkfiles[c].textLinuxDesktop : bookmarkfiles[c].text;
      newzipitems[title] = fflate.strToU8(texto);
    }
  }
  let zipped = fflate.zipSync(newzipitems);
  let blob = new Blob([zipped], { type: 'application/zip' });
  let link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = ReturnFileName("Bookmarks_", ".zip");
  link.click();
}

function ReturnFileName(cadena, extension) {
  const ahora = new Date();
  const dd = String(ahora.getDate()).padStart(2, '0');
  const MM = String(ahora.getMonth() + 1).padStart(2, '0'); // Meses van de 0-11
  const yyyy = ahora.getFullYear();
  const HH = String(ahora.getHours()).padStart(2, '0');
  const mm = String(ahora.getMinutes()).padStart(2, '0');
  return cadena + `${dd}.${MM}.${yyyy}_${HH}.${mm}` + extension;
}

async function detectarSOyMarcarOpcioninicial() {
  const info = await browser.runtime.getPlatformInfo();
  switch (info.os) {
    case "mac":
      document.getElementById('OS').value = ".webloc";
      break;
    case "linux":
      document.getElementById('OS').value = ".desktop";
      break;
    default:
      document.getElementById('OS').value = ".url";
  }
}