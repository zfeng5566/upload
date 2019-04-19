"use strict";

/*
*   Create Time : 2019/4/18
*   Author      : iwang
*
*/

const UPLOAD_STATUS_CLEAN = 1; //尚未添加文件
const UPLOAD_STATUS_WAITING = 2; //已添加文件，等待上传
const UPLOAD_STATUS_PENDDING = 3; //正在上传文件
const UPLOAD_STATUS_SUCCESS = 4; //文件上传成功
const UPLOAD_STATUS_FAILED = 5; //文件上传失败
const UPLOAD_STATUS_END = 6; //文件上传完成(无论成功或失败)


export default class SingleUploader {
  constructor(params) {
    this.initProps();
  }

  initProps() {
    this.url = "/file/upload";
    this.maxSize = 1024 * 1024 * 1000;
    this.autoUpload = true;
    this.key = "file";
    this.accept = "";//以 STOP 字符 (U+002E) 开始的文件扩展名。（例如：".jpg,.png,.doc"）一个有效的 MIME 类型，但没有扩展名 audio/* 表示音频文件 ,video/* 表示视频文件 image/* 表示图片文件
    this.file = '';
    this.uploadStatus = UPLOAD_STATUS_CLEAN;

  }

  uploadPramas() {
    return {
      test: 11111
    };
  }

  /**
   * 用户自定义文件校验函数，可修改
   * @param file 需要校验的文件
   * @param cb 验证通过调用的回调函数
   */
  validate(file, cb) {
    cb();
  }

  upload() {
    const url = this.url;
    const pramas = this.uploadPramas();
    let xhr = this.xhr = new XMLHttpRequest();
    let form = new FormData();
    form.append(this.key, this.file);
    for (let key in pramas) {
      form.append(key, pramas[key]);
    }
    this.bindEventHandles(xhr);
    xhr.open('POST', url, true);
    this.uploadStatus = UPLOAD_STATUS_PENDDING;
    xhr.send(form);
  }


  bindEventHandles(xhr) {


    xhr.addEventListener('loadstart', this.onloadstart);//	获取开始
    xhr.upload.addEventListener('progress', this.onprogress);//数据传输进行中
    xhr.addEventListener('abort', this.onabort); //获取操作终止
    xhr.addEventListener('error', this.onerror); //获取失败
    xhr.addEventListener('timeout', this.ontimeout); //获取操作在用户规定的时间内未完成
    xhr.addEventListener('load', this.onload);//获取成功
    xhr.addEventListener('loadend', this.onloadend);//获取完成（不论成功与否）
  }

  /**
   * 获取当前状态
   */
  getState() {
    return this.uploadStatus;
  }

  /**
   * 上传开始
   * @param progressEvent
   */
  onloadstart = (progressEvent) => {
    console.log('onloadstart', this, progressEvent);
  };
  /**
   * 数据传输进行中(上传进度)
   * @param progressEvent
   */
  onprogress = (progressEvent) => {
    console.log('onprogress');
  };
  /**
   * 获取操作终止
   * @param progressEvent
   */
  onabort = (progressEvent) => {
    console.log('onabort');
  };
  /**
   * 获取失败
   * @param progressEvent
   */
  onerror = (progressEvent) => {
    console.log('onerror');
  };
  /**
   * 获取操作在用户规定的时间内未完成
   * @param progressEvent
   */
  ontimeout = (progressEvent) => {
    console.log('ontimeout');
  };
  /**
   * 获取成功
   * @param progressEvent
   */
  onload = (progressEvent) => {
    console.log('onload',progressEvent);
  };
  /**
   * 获取完成（不论成功与否）
   * @param progressEvent
   */
  onloadend = (progressEvent) => {
    console.log('onloadend');
  };


  _maxSizeValidate(file, cb) {
    if (file.size > this.maxSize) {
      this.error('validate_failed');
    } else {
      this.validate(file, cb);
    }
  }

  /*
  *
  * error_type:
  *   validate_failed 验证失败
  *   upload_cancel 主动取消
  *   upload_error 上传失败
  * */
  error(error_type) {
    console.log('error', error_type);
  }

  //input change 事件钩子函数
  initUploadFile(files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this._maxSizeValidate(file, () => {
        this.uploadStatus = UPLOAD_STATUS_WAITING;
        if (this.autoUpload) {
          this.file = file;
          this.upload();
        }
      });
    }
  }

  //选择文件
  selectFile() {
    const input = document.createElement('input');
    const body = document.getElementsByTagName('body')[0];
    const changeHandle = (e) => {
      this.initUploadFile(e.target.files);
      input.removeEventListener('change', changeHandle);
    };
    input.setAttribute('style', 'height:0;width:0;');
    input.setAttribute('accept', this.accept);
    input.type = "file";
    input.addEventListener('change', changeHandle);
    body.appendChild(input);
    input.click();
  }

  /**
   * 其他方式添加需要上传文件的调用函数（例如：拖拽获取到的文件对象，调用这个函数即可上传）
   */
  addFile(file) {
    this.initUploadFile(file);
  }
}
