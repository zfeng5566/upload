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

const ACCEPT_PARAMES = [
  'url',
  'maxSize',
  'autoUpload',
  'key',
  'accept',
  'data',
  'file',


  'validate',//验证file
  'onValidateError',//验证失败
  'onStart',//上传开始事件钩子函数
  'onProgress',//上传进度钩子函数
  'onError',//上传失败钩子函数
  'onSuccess',//上传成功钩子函数（ 200 响应码的成功g）
  'onEnd',//上传完成 （成功或失败）
];


export default class SingleUploader {
  constructor(params = {}) {
    this._initprops(params);
  }

  /**
   * 动态添加上传参数
   * @return {JSON}
   */
  uploadpramas() {
    return {
      test: 11111
    };
  }

  /**
   * 用户自定义文件校验函数，可修改
   * @param file 需要校验的文件
   * @param cb 验证通过调用的回调函数
   * @param errorcb 验证失败调用的回调函数
   */
  validate(file, cb, errorcb) {
    cb();
  }


//选择文件
  selectFile() {
    const input = document.createElement('input');
    const body = document.getElementsByTagName('body')[0];
    const changehandle = (e) => {
      this._inituploadfile(e.target.files);
      input.removeEventListener('change', changehandle);
    };
    input.setAttribute('style', 'height:0;width:0;');
    input.setAttribute('accept', this.accept);
    input.type = "file";
    input.addEventListener('change', changehandle);
    // body.appendchild(input);
    input.click();
  }

  /**
   * 其他方式添加需要上传文件的调用函数（例如：拖拽获取到的文件对象，调用这个函数即可上传）
   */
  addFile(file) {
    this._inituploadfile(file);
  }

  /**
   * 开始上传(如果不是自动上传的化，执行这个函数start即可开始上传)
   */
  start() {
    if (!this.file) {
      console.warn('could not find the file to upload');
    } else if (this.uploadstatus !== UPLOAD_STATUS_PENDDING) {
      this._upload();
    } else {
      console.warn('there are uploading');
    }
  }

  /**
   * 获取当前状态
   */
  getState() {
    return this.uploadstatus;
  }


  onStart = (progressevent) => {
    console.log('onloadstart', this, progressevent);
  };
  onProgress = (progressevent) => {
    console.log('onProgress');
  };

  onError = (error_type, progrssevent) => {
    console.log('error', error_type, progrssevent);
  };
  onSuccess = (progressevent) => {
    console.log('onload', progressevent);
  };
  onEnd = (progressevent) => {
    console.log('onloadend');
  };
  _onabort = (progressevent) => {
    this.onError('abort', progressevent);
  };
  _onerror = (progressevent) => {
    this.onError('error', progressevent);
  };
  _ontimeout = (progressevent) => {
    this.onError('timeout', progressevent);
  };


  onValidateError = (error_msg) => {
  };

  _maxsizevalidate(file, cb) {
    if (file.size > this.maxsize) {
      this.onValidateError('validate_failed');
    } else {
      this.validate(file, cb);
    }
  }

  //初始化参数
  _initprops(params) {
    this.url = "/file/upload";
    this.maxsize = 1024 * 1024 * 1000;
    this.autoupload = true;
    this.key = "file";
    this.accept = "";//以 stop 字符 (u+002e) 开始的文件扩展名。（例如：".jpg,.png,.doc"）一个有效的 mime 类型，但没有扩展名 audio/* 表示音频文件 ,video/* 表示视频文件 image/* 表示图片文件
    this.file = '';
    this.data = {};
    this.uploadstatus = UPLOAD_STATUS_CLEAN;


    for (let i = 0; i < ACCEPT_PARAMES.length; i++) {
      const key = ACCEPT_PARAMES[i];
      if (params[key]) {
        this[key] = params[key];
      }
    }
  }

//xhr添加事件监听句柄
  _bindeventhandles(xhr) {
    xhr.addEventListener('loadstart', () => {
      this.uploadstatus = UPLOAD_STATUS_PENDDING;
    });
    xhr.addEventListener('loadstart', this.onStart);//	获取开始
    xhr.upload.addEventListener('progress', this.onProgress);//数据传输进行中

    xhr.addEventListener('abort', this._onabort); //获取操作终止
    xhr.addEventListener('error', this._onerror); //获取失败
    xhr.addEventListener('timeout', this._ontimeout); //获取操作在用户规定的时间内未完成

    xhr.addEventListener('load', this.onSuccess);//获取成功

    xhr.addEventListener('loadend', () => {
      this.uploadstatus = UPLOAD_STATUS_END;
    });
    xhr.addEventListener('loadend', this.onEnd);//获取完成（不论成功与否）
  }

  //开始上传
  _upload() {
    const url = this.url;
    const pramas = this.uploadpramas();
    let xhr = this.xhr = new XMLHttpRequest();
    let form = new FormData();
    form.append(this.key, this.file);
    for (let key in this.data) {
      form.append(key, pramas[key]);
    }
    for (let key in pramas) {
      form.append(key, pramas[key]);
    }
    this._bindeventhandles(xhr);
    xhr.open('post', url, true);
    this.uploadstatus = UPLOAD_STATUS_PENDDING;
    xhr.send(form);
  }

  //input change 事件钩子函数
  _inituploadfile(files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this._maxsizevalidate(file, () => {
        this.uploadstatus = UPLOAD_STATUS_WAITING;
        if (this.autoupload) {
          this.file = file;
          this._upload();
        }
      });
    }
  }
}
