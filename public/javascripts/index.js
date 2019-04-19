"use strict";
/*
*   Create Time : 2019/4/18
*   Author      : iwang
*
*/


import SingleUploader from './uploader.js';

const uploader = new SingleUploader({
  onsuccess(event) {
    console.log(111111, event);
  }
});
window.uploader = uploader;
document.getElementById('abc').addEventListener('click', function () {
  uploader.selectFile();
});