/*!
 * backbone.iobind
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 * https://github.com/logicalparadox/backbone.iobind
 */

(function(a,b){if(typeof define=="function"&&define.amd)define(["backbone","underscore","socket.io","jquery"],b);else if(typeof exports=="object"){var c=require("underscore"),d=require("backbone"),e=require("socket.io-client"),f=require("jquery");module.exports=b(d,c,e,f)}else b(a.Backbone,a._,a.io,a.jQuery||a.Zepto||a.ender||a.$)})(this,function(a,b,c,d){a.sync=function(c,f,g){var h=b.extend({},g);h.url?h.url=b.result(h,"url"):h.url=b.result(f,"url")||e();var i=h.url.split("/"),j=i[0]!==""?i[0]:i[1];!h.data&&f&&(h.data=h.attrs||f.toJSON(g)||{}),h.patch===!0&&h.data.id==null&&f&&(h.data.id=f.id);var k=f.socket||a.socket||window.socket,l=d.Deferred();k.emit(j+":"+c,h.data,function(a,b){a?(g.error&&g.error(a),l.reject()):(g.success&&g.success(b),l.resolve())});var m=l.promise();return f.trigger("request",f,m,g),m};var e=function(){throw new Error('A "url" property or function must be specified')};return a})