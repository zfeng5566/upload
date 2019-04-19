"use strict";
/*
*   Create Time : 2019/4/18
*   Author      : iwang
*
*/


import Uploader from './uploader.js';

const uploader = new Uploader();
window.uploader = uploader;
document.getElementById('abc').addEventListener('click', function () {
  console.log(1111111111)
  uploader.selectFile();
});