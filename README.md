misc!
===================

##cookie操作

> **初始化:**
```
 var x = settingCookie.init();
```
> **新增cookie:**
```
 x.set({key, value[, expires, path, domain, secure]});
 或者
 x.set(key, value[, expires, path, domain, secure]) ;
```
> **删除cookie:**
```
 x.remove(key);
```
> **获取cookie:**
```
 x[key];
```