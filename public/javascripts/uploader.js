"use strict";

/*
*   Create Time : 2019/4/18
*   Author      : iwang
*
*/
let index = 0;

function id() {
  return 'file_' + (++index);
}

class UploadFile {
  constructor(file, uploader) {
    this.uploader = uploader;
    this.file = file;
    this.id = id();
  }

  upload() {
    const uploader = this.uploader;
    const url = this.uploader.url;
    const pramas = uploader.uploadPramas();
    let xhr = new XMLHttpRequest();
    let form = new FormData();
    form.append(uploader.key, this.file);
    for (let key in pramas) {
      form.append(key, pramas[key]);
    }

    xhr.open('POST', url, true);
    xhr.send(form);
  }
}

export default class Uploader {
  constructor(params) {
    this.initProps();
  }

  initProps() {
    this.url = "/upload";
    this.maxSize = 1024 * 1024 * 20;
    this.autoUpload = true;
    this.key = "file";
    this.files = [];
    this.uploadStatus = 1; //1 干净的，没有上传任务  2 已添加文件尚未上传 3上传中 4上传成功 5上传失败
  }

  uploadPramas() {
    return {
      test:11111
    };
  }

  validate(file, cb) {

  }

  initUploadFile(files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uploadFile = new UploadFile(file, this);

      if (this.autoUpload) {
        uploadFile.upload();
      }

      this.files.push(uploadFile);
    }
  }

  selectFile() {
    console.log(this);
    const input = document.createElement('input');
    const body = document.getElementsByTagName('body')[0];

    const changeHandle = (e) => {
      this.initUploadFile(e.target.files);
      input.removeEventListener('change', changeHandle);
    };
    input.setAttribute('style', 'height:0;width:0;');
    input.type = "file";
    input.addEventListener('change', changeHandle);
    body.appendChild(input);
    input.click();
  }
}
