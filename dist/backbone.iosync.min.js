/*!
 * backbone.iobind
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 * https://github.com/logicalparadox/backbone.iobind
 */

(function(a){var b,c,d,e;typeof window=="undefined"||typeof require=="function"?(c=require("jquery"),b=require("underscore"),d=require("backbone"),e=d,typeof module!="undefined"&&(module.exports=e)):(c=this.$,b=this._,d=this.Backbone,e=this),d.sync=function(a,e,g){var h=b.extend({},g);h.url?h.url=b.result(h,"url"):h.url=b.result(e,"url")||f();var i=h.url.split("/"),j=i[0]!==""?i[0]:i[1];!h.data&&e&&(h.data=h.attrs||e.toJSON(g)||{}),h.patch===!0&&h.data.id==null&&e&&(h.data.id=e.id);var k=e.socket||d.socket||window.socket,l=c.Deferred();k.emit(j+":"+a,h.data,function(a,b){a?(g.error&&g.error(a),l.reject()):(g.success&&g.success(b),l.resolve())});var m=l.promise();return e.trigger("request",e,m,g),m};var f=function(){throw new Error('A "url" property or function must be specified')}})()