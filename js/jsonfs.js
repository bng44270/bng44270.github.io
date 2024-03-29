/*

JsonFS - Parse JsonFS data (generated by dir2json.sh - https://gist.github.com/bng44270/c0bc348496827c1ef7d2da91fbc342ae)

Example:

  var jsonFSObject = {
    type: 'jsonfs',
    fs : {
       docs : {
         document1 : {
           content : 'aGVsbG8gdGhlcmUgbWFuIDopCg==',
           modified : 'Tue 01 Feb 2022 09:46:21 AM CST',
           size : 19
         },
         document2 : {
           content : 'aGVsbG8gdGhlcmUgYWdhaW4gbWFuIDopCg==',
           modified : 'Tue 01 Feb 2022 09:46:21 AM CST',
           size : 25
         }
       }
    }
  };
  
  var fs = new JsonFS(jsonFSObject);
 
  fs.getFileAsString('/docs/document1');     			// will return "hello there man :)"
  fs.setFileContent('/docs/document3','this is a new file');	// creates new file
  fs.getDirectoryListing('/docs');				// returns array ['document1','document2','document3']
  fs.createDirectory('/docs/newfiles');				// creates directory "newfiles" under directory "docs"

Class methods:
  createDirectory(dirPath) - create a new directory
   getDirectoryInfo(dirPath) - return child count and size of a directory
   getDirectoryListing(dirPath) - return array of children of a directory
   getFileAsBlob(filePath, mimeType) - return the contents of a file as a Blob (mimeType is optional and defaults to text/plain)
   getFileAsString(filePath) - return the contents of a file as a string
   getFileInfo(filePath) - returns the name, parent directory, modification time, and size of a file
   setFileContent(path, text) - set the contents of a file to a string value (creates file if it does not exist)
*/

class JsonFS {
  constructor(json) {
    try {
      if (json.type != 'jsonfs') throw new Error();
      this.FS = json.fs;
    }
    catch(e) {
      throw new Error('Invalid JsonFS data');
    }
  }

  setFileContent(path,text) {
    var pathAr = path.split('/').slice(1);
    var dirPtr = this.FS;
    
    pathAr.forEach(p => {
      if (Object.keys(dirPtr).indexOf(p) > -1 && pathAr.indexOf(p) != (pathAr.length - 1)) {
        dirPtr = dirPtr[p];
      }
      else {
        if (pathAr.indexOf(p) == (pathAr.length - 1)) {
          dirPtr[p] = {
            content : btoa(text),
            modified : (new Date()).toString(),
            size : text.length
          };
        }
        else {
          throw new Error('Unknown file path (' + path + ')');
        }
      }
    });   
  }
  
  createDirectory(dirPath) {
    var pathAr = dirPath.split('/').slice(1);
    var dirPtr = this.FS;
    
    pathAr.forEach(p => {
      if (Object.keys(dirPtr).indexOf(p) > -1 && pathAr.indexOf(p) != (pathAr.length - 1)) {
        dirPtr = dirPtr[p];
      }
      else {
        if (pathAr.indexOf(p) == (pathAr.length - 1)) {
          dirPtr[p] = {};;
        }
        else {
          throw new Error('Unknown file path (' + path + ')');
        }
      }
    });
  }

  getDirectoryObject(path) {
    var pathAr = path.split('/').slice(1);
    var dirPtr = this.FS;
    
    pathAr.forEach(p => {
      if (Object.keys(dirPtr).indexOf(p) > -1) {
        dirPtr = dirPtr[p];
      }
      else {
        throw new Error('Unknown file path (' + path + ')');
      }
    });
    
    return dirPtr;    
  }
  
  isFile(path) {
    var dirObj = this.getDirectoryObject(path);
    
    var attributes = Object.keys(dirObj);
    return ('content' in attributes && 'modified' in attributes && 'size' in attributes && attributes.length == 3) ? true : false;
  }
  
  isDirectory(path) {
    var dirObj = this.getDirectoryObject(path);
    
    var attributes = Object.keys(dirObj);
    return ('content' in attributes && 'modified' in attributes && 'size' in attributes && attributes.length != 3) ? false : true;
  }
  
  getChildSize(dirObj) {
    var size = 0;
    
    Object.keys(dirObj).forEach(i => {
      if (Object.keys(dirObj[i]).indexOf('size') > -1) {
        size = size + dirObj[i]['size'];
      }
      else {
        size = size + this.getChildSize(dirObj[i]);
      }
    });
    
    return size;
  }

  getDirectoryListing(dirPath) {
    var directoryObj = this.getDirectoryObject(dirPath);
    
    if (typeof directoryObj != 'object') throw new Error('Path is not a directory (' + dirpath + ')');
    
    return Object.keys(directoryObj);
  }
  
  getDirectoryInfo(dirPath) {
    var directoryObj = this.getDirectoryObject(dirPath);
    
    if (typeof directoryObj != 'object') throw new Error('Path is not a directory (' + dirpath + ')');
    
    return {
      count : Object.keys(directoryObj).length,
      size : this.getChildSize(directoryObj)
    };
  }
  
  getFileInfo(filePath) {
    var fileObj = this.getDirectoryObject(filePath);
    var fileAr = filePath.split('/');
    
    return {
    	name : fileAr[fileAr.length - 1],
    	parent : fileAr.slice(0,-1).join('/'),
    	modified : fileObj.modified,
    	size : fileObj.size
    };
  }
  
  getFileAsBlob(filePath,mimeType='text/plain') {
    var fileObj = this.getDirectoryObject(filePath);
    
    return new Blob([atob(fileObj.content)],{type:mimeType});
  }
  
  getFileAsString(filePath) {
    var fileObj = this.getDirectoryObject(filePath);
    
    return atob(fileObj.content);
  }
}
