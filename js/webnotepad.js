/*
    WebNotepad - create a local-storage browser-based notepad app
    
    Usage:
    
        1) Include webnotepad.js
        
        2) Create DIV element
                  
            <div id="webnote"></div>
            
        3) Instantiate the WebNotepad using the DOM ID of the DIV
        
            var editor = new WebNotepad('webnote');

*/
class WebNotepad {
    constructor(id) {
        if (!localStorage.webnotepad_content) {
            localStorage.webnotepad_content = '[]';
        }

        this.config =  {
            parentId : id,
            selectorId : 'selector',
            editorId : 'editor',
            openNoteId : 'opennote',
            createNoteId : 'createnote',
            newNoteDisplayId : 'newnotedisplay',
            newNoteNameId : 'newnotename',
            downloadAllId : 'downloadall',
            noteListId : 'notelist',
            fontBigId : 'fontbig',
            fontSmallId : 'fontsmall',
            saveNoteId : 'savenote',
            downloadNoteId : 'dlnote',
            closeNoteId : 'closenote',
            deleteNoteId : 'deletenote',
            noteNameId : 'notename',
            noteTextBoxId : 'notepadcontent',
            notepadStatusId : 'notepadstatusbar',
            notes : JSON.parse(localStorage.webnotepad_content),
            noteExists : false,
            activeNote : null
        };

        this.interfaceInit();
        this.populateNoteList();
    }
    
    interfaceInit() {
      var htmlContent = '<div id="' + this.config.selectorId + '" style="display:block;">';
      htmlContent += '<select id="' + this.config.noteListId + '"></select><br/>';
      htmlContent += '<span id="' + this.config.newNoteDisplayId + '" style="display:none">Note Name:<input type="text" id="' + this.config.newNoteNameId + '" /><input type="button" value="Create" id="' + this.config.createNoteId + '" /></span><br/>';
      htmlContent += '<input type="button" value="Download All" id="' + this.config.downloadAllId + '" />'
      htmlContent += '</div>';
      htmlContent += '<div id="' + this.config.editorId + '" style="display:none;">';
      htmlContent += '<span style="font-weight:bold;" id="' + this.config.noteNameId + '"></span>&nbsp;&nbsp;';
      htmlContent += 'Font size:&nbsp;<input type="button" value="+" id="' + this.config.fontBigId + '" /><input type="button" value="-" id="' + this.config.fontSmallId + '" />&nbsp;&nbsp;';
      htmlContent += '<input type="button" value="Save" id="' + this.config.saveNoteId + '" />&nbsp;&nbsp;';
      htmlContent += '<input type="button" value="Download" id="' + this.config.downloadNoteId + '" />&nbsp;&nbsp;';
      htmlContent += '<input type="button" value="Close" id="' + this.config.closeNoteId + '" />&nbsp;&nbsp;';
      htmlContent += '<input type="button" value="Delete" style="color:#ffffff;background-color:#ff0000;" id="' + this.config.deleteNoteId + '" /><br/>';
      htmlContent += '<textarea style="width: 100%; height: 90%; box-sizing: border-box; font-family:courier;" id="' + this.config.noteTextBoxId + '"></textarea><br/>';
      htmlContent += '</div>';
      htmlContent += '<span id="' + this.config.notepadStatusId + '" style="color:#ff0000;"></span>';
      document.getElementById(this.config.parentId).innerHTML = htmlContent;
      
      document.getElementById(this.config.noteListId).addEventListener('change',this.changeNoteOption.bind(this),false);
      document.getElementById(this.config.newNoteNameId).addEventListener('keyup',this.checkName.bind(this),false);
      document.getElementById(this.config.createNoteId).addEventListener('click',this.createNote.bind(this),false);
      document.getElementById(this.config.downloadAllId).addEventListener('click',this.downloadAll.bind(this),false);  
      document.getElementById(this.config.fontBigId).addEventListener('click',this.fontBigger.bind(this),false);
      document.getElementById(this.config.fontSmallId).addEventListener('click',this.fontSmaller.bind(this),false);
      document.getElementById(this.config.saveNoteId).addEventListener('click',this.saveNote.bind(this),false);
      document.getElementById(this.config.downloadNoteId).addEventListener('click',this.downloadNote.bind(this),false);
      document.getElementById(this.config.closeNoteId).addEventListener('click',this.closeNote.bind(this),false);
      document.getElementById(this.config.deleteNoteId).addEventListener('click',this.deleteNote.bind(this),false);
      document.getElementById(this.config.noteTextBoxId).addEventListener('keyup',this.markAsEdited.bind(this),false);
      
    }
    
    changeNoteOption() {
        var noteSelection = document.getElementById(this.config.noteListId).options[document.getElementById(this.config.noteListId).selectedIndex].value;

        if (noteSelection != 'NONE') {
            if (noteSelection == 'CREATENEW') {
                document.getElementById(this.config.newNoteDisplayId).style.display = 'block';
            }
            else {
                document.getElementById(this.config.newNoteDisplayId).style.display = 'none';
                this.openNote();
            }
        }
        else {
            document.getElementById(this.config.newNoteDisplayId).style.display = 'none';
        }
    }

    populateNoteList() {      
      document.getElementById(this.config.noteListId).innerHTML = '<option value="NONE">--Select Note--</option><option value="CREATENEW">--Create New Note--</option>';
  
      this.config.notes.forEach(n => {
        var o = document.createElement('option');
        o.value = n.shortName;
        o.innerHTML = n.name;
        document.getElementById(this.config.noteListId).appendChild(o);
      });
    }

    checkName() {
        var noteName = document.getElementById(this.config.newNoteNameId).value;
        var noteShortName = noteName.replace(/[ \t]+/g,'_').toLowerCase();
      
      var noteExists = (this.config.notes.filter(n => n.shortName == noteShortName).length > 0) ? true : false;
      
      if (noteExists) {
        this.setStatusUI('Note already exists');
        this.config.noteExists = true;
      }
      else {
          this.setStatusUI('');
          this.config.noteExists = false;
      }
    }

    createNote() {
        if (!this.config.noteExists) {
            var noteName = document.getElementById(this.config.newNoteNameId).value;

            document.getElementById(this.config.newNoteNameId).value = '';

            var noteShortName = noteName.replace(/[ \t]+/g,'_').toLowerCase();
            this.config.notes.push({
                name : noteName,
                shortName : noteShortName,
                note : '',
                fontSize : '12pt'
            });

            localStorage.webnotepad_content = JSON.stringify(this.config.notes);
            
            document.getElementById(this.config.newNoteDisplayId).style.display = 'none';

            this.populateNoteList();

            this.openNote(noteShortName);
        }      
    }
    
    openNote(notename) {
        document.getElementById(this.config.selectorId).style.display = 'none';
        document.getElementById(this.config.editorId).style.display = 'block';
        
        var noteShortName = '';
        
        if (notename) {
            noteShortName = notename;
        }
        else {
            var selectBox = document.getElementById(this.config.noteListId).options[document.getElementById(this.config.noteListId).selectedIndex].value;
            noteShortName = selectBox.replace(/[ \t]+/g,'_').toLowerCase();
            document.getElementById(this.config.noteListId).value = 'NONE';
        }

        this.config.activeNote = this.config.notes.filter(n => n.shortName == noteShortName)[0];

        this.config.activeNote.saved = true;

        this.setNoteTextUI(this.config.activeNote.note);
        this.setFontSizeUI(this.config.activeNote.fontSize);
        this.setNoteNameUI(this.config.activeNote.name);
    }
    
    setNoteNameUI(name) {
        document.getElementById(this.config.noteNameId).innerHTML = name;
    }

    setNoteTextUI(text) {
        document.getElementById(this.config.noteTextBoxId).value = text;
    }

    setStatusUI(text) {
      document.getElementById(this.config.notepadStatusId).innerHTML = text;
    }
    
    setFontSizeUI(size) {
        document.getElementById(this.config.noteTextBoxId).style.fontSize = size;
    }

    fontBigger() {
      var newFont = (parseInt(this.config.activeNote.fontSize.replace(/pt$/,'')) + 1).toString() + 'pt';
      this.config.activeNote.fontSize = newFont;
      document.getElementById(this.config.noteTextBoxId).style.fontSize = newFont;
      this.markAsEdited();
    }
    
    fontSmaller() {
      var newFont = (parseInt(this.config.activeNote.fontSize.replace(/pt$/,'')) - 1).toString() + 'pt';
      this.config.activeNote.fontSize = newFont;
      document.getElementById(this.config.noteTextBoxId).style.fontSize = newFont;
      this.markAsEdited();
    }
    
    saveNote() {
      this.config.notes = this.config.notes.filter(n => n.shortName != this.config.activeNote.shortName);
      
      var noteText = document.getElementById(this.config.noteTextBoxId).value;

      this.config.notes.push({
          name : this.config.activeNote.name,
          shortName : this.config.activeNote.shortName,
          note : noteText,
          fontSize : this.config.activeNote.fontSize
        });
        
        this.setStatusUI('');
        this.config.activeNote.saved = true;

      localStorage.webnotepad_content = JSON.stringify(this.config.notes);
    }
    
    closeNote() {
        var doClose = true;
        
        if (!this.config.activeNote.saved) {
            doClose = confirm('Note ' + this.config.activeNote.shortName + ' is not saved.  Continue\?');
        }

        if (doClose) {
            document.getElementById(this.config.selectorId).style.display = 'block';
            document.getElementById(this.config.editorId).style.display = 'none';
            this.setStatusUI('');
            this.config.activeNote = null;
        }
    }
    
    deleteNote() {
        var doDelete = confirm('Note ' + this.config.activeNote.shortName + ' is about to be deleted.  Continue\?');
        

        if (doDelete) {
            this.config.notes = this.config.notes.filter(n => n.shortName != this.config.activeNote.shortName);
            
            localStorage.webnotepad_content = JSON.stringify(this.config.notes);
            
            this.populateNoteList();
            
            document.getElementById(this.config.selectorId).style.display = 'block';
            document.getElementById(this.config.editorId).style.display = 'none';
            this.setStatusUI('');
            this.config.activeNote = null;
        }
    }

    markAsEdited() {
      if (document.getElementById(this.config.notepadStatusId).innerHTML.length == 0) {
        document.getElementById(this.config.notepadStatusId).innerHTML = 'Modified';
        this.config.activeNote.saved = false;
      }
    }
    
    downloadAll() {
      var textToWrite = JSON.stringify(this.config.notes);
      var textFileAsBlob = new Blob([textToWrite], { type: 'application/json' });
      var fileNameToSaveAs = 'all_notes-' + new Date().toISOString().replace(/:/g,".") + ".json";
      
      var downloadLink = document.createElement("a");
      downloadLink.download = fileNameToSaveAs;
      downloadLink.innerHTML = "My Hidden Link";
      
      window.URL = window.URL || window.webkitURL;
      
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      downloadLink.onclick = function(e) {
          document.body.removeChild(e.target);
      };
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
      
      downloadLink.click();
    }
    
    downloadNote() {
      var doDownload = true;
        
      if (!this.config.activeNote.saved) {
        doDownload = confirm('Note ' + this.config.activeNote.shortName + ' is not saved.  Download saved version\?');
      }
        
        
      if (doDownload) {
        var textToWrite = this.config.activeNote.note;
        var textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
        var fileNameToSaveAs = this.config.activeNote.shortName + '-' + new Date().toISOString().replace(/:/g,".") + ".txt";
      
        var downloadLink = document.createElement("a");
        downloadLink.download = fileNameToSaveAs;
        downloadLink.innerHTML = "My Hidden Link";
      
        window.URL = window.URL || window.webkitURL;
          
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = function(e) {
          document.body.removeChild(e.target);
        };
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
      
        downloadLink.click();
      }
    }
}
