'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ipModel = new Schema({
    budgetYear      : { type: String, required: true }, //ปีงบประมาณ
    nameOnMedia     : { type: String, required: true }, //ชื่อผลงาน
    inventor        : { type: [String], required: true }, //ผู้ประดิษฐ์
    beLongTo        : { type: String, required: true }, //สังกัด
    holderOfRight   : { type: String, required: true }, //ผู้ทรงสิทธิ
    ipType          : { type: String, required: true }, //ประเภท
    requestNo       : { type: String, required: true }, //เลขที่คำขอ
    submitDate      : { type: Date, default: '-' },     //วันที่ยื่นคำขอ
    finalStatus     : { type: String, default: true },  //สถานะสุดท้าย
    addEditing      : { type: String, default: "-" },   //แก้ไขเพิ่มเติม
    adsNo           : { type: String, default: "-" },   //เลขประกาศโฆษณา
    adsDate         : { type: Date, default: "-"},      //วันที่ประกาศโฆษณา
    regNo           : { type: String, default: "-"},    //เลขที่รับจดทะเบียน
    regDate         : { type: Date, default: "-"},      //วันที่รับจดทะเบียน
    expDate         : { type: Date, default: "-"},      //วันที่หมดอายุ
    feePay          : { type: String, default: "-"},    //ครบกำหนดชำระรายปี
    notiFeePay      : { type: String, default: "-"},    //แจ้งเตือนชำระค่าธรรมเนียมรายปี
    other           : { type: String, default: "-"},    //อื่นๆ
    industType      : { type: String, required: true},  //ประเภทอุตสาหกรรม
    util            : { type: String, default: "-"},    //การใช้ประโยชน์
    note            : { type: String, default: "-"},    //หมายเหตุ
}, { timestamps: true });

var ip = mongoose.model('IP', ipModel, 'IP');
module.exports = ip;
