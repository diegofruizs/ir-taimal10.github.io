﻿var finger;
var fingerStartDatetime;

function startFingerprint() {
    fingerStartDatetime = new Date();
    fingerprint.getIdentityString(onSuccessFingerprint, onErrorFingerprint);
}

function onSuccessFingerprint(data) {
    finger = data;
}

function onErrorFingerprint(data) {
    finger = data;
}

function getFingerprintElapsedSeconds() {
    return (new Date() - fingerStartDatetime) / 1000;
}

function NewWindow(mypage, myname, w, h, scroll) {
    var winl = (screen.width - w) / 2;
    var wint = (screen.height - h) / 2;
    winprops = 'height=' + h + ',width=' + w + ',top=' + wint + ',left=' + winl + ',scrollbars=' + scroll + ',resizable'
    win = window.open(mypage, myname, winprops)
    if (parseInt(navigator.appVersion) >= 4) { win.window.focus(); }
}

function FullScreenWindow(mypage, myname) {
    params = 'width=' + screen.width;
    params += ', height=' + screen.height;
    params += ', top=0, left=0'
    params += ', fullscreen=yes';
    params += ',scrollbars=yes';
    newwin = window.open(mypage, myname, params);
    if (parseInt(navigator.appVersion) >= 4) { newwin.window.focus(); }
}

function qs(key) {
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&");
    var match = location.search.match(new RegExp("[?&]" + key + "=([^&]+)(&|$)"));
    return match && match[1];
}

function checkBrowser() {
    if (isBrowserOutdated()) {
        document.body.innerHTML += '<div style="position:absolute;top:50px;left:' + (screen.width - 526) / 2 + 'px;width:526px"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">Su Navegador</h4></div><div class="modal-body col-sm-12"><div class="col-sm-3"><img src="assets/icon-error.png" /></div><div class="col-sm-9"><p>Su navegador debe ser actualizado para utilizar PSE!</p><p>Las seguientes versiones o superiores son necesarias para utilizar PSE: Internet Explorer 9, Firefox 40, Chrome 45, Safari 6 y Opera 35</p></div></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal" onclick="window.location.href=\'https://www.pse.com.co\'">Aceptar</button></div></div></div></div>';
        document.querySelector(".content").style.display = 'none';
    }
}

function checkBrowserForPayment() {
    if (isBrowserOutdated()) {
        checkQuerySelector();
        document.querySelector(".content").style.display = 'none';
        alert('Actualiza tu navegador antes del 15 de junio de 2016 para utilizar PSE.\n\nLas seguientes versiones o superiores son necesarias para utilizar PSE, Internet Explorer 9, Firefox 40, Chrome 45, Safari 6 y Opera 35');

        var xhttp = getXMLHttpRequest();
        xhttp.open("POST", "api/GotoDirectToBank", false);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify({ "enc": qs("enc") }));
        if (xhttp.status === 200) {
            var resp = JSON.parse(JSON.parse(xhttp.responseText));
            if (resp.Success)
                window.location.href = resp.URL;
            else
                alert(resp.ErrorMessage);
        }
        else
            alert('Ocurrió un error desconecido al seguir con la transacción');
    }
}

function getXMLHttpRequest() {
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xhttp;
}

function checkQuerySelector() {
    if (!document.querySelectorAll) {
        document.querySelectorAll = function (selectors) {
            var style = document.createElement('style'), elements = [], element;
            document.documentElement.firstChild.appendChild(style);
            document._qsa = [];

            style.styleSheet.cssText = selectors +
                '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
            window.scrollBy(0, 0);
            style.parentNode.removeChild(style);

            while (document._qsa.length) {
                element = document._qsa.shift();
                element.style.removeAttribute('x-qsa');
                elements.push(element);
            }
            document._qsa = null;
            return elements;
        };
    }

    if (!document.querySelector) {
        document.querySelector = function (selectors) {
            var elements = document.querySelectorAll(selectors);
            return (elements.length) ? elements[0] : null;
        };
    }
}

function isBrowserOutdated() {
    var outdated = false;
    if (bowser.chrome && bowser.version < 45)
        outdated = true;
    if (bowser.firefox && bowser.version < 40)
        outdated = true;
    if (bowser.msie && bowser.version < 9)
        outdated = true;
    if(bowser.safari && bowser.version < 6)
        outdated = true;
    if (bowser.opera && bowser.version < 35)
        outdated = true;
    return outdated;
}

function setupPersonalization(prefs, field_tooltips) {
    for (row = 0; row < field_tooltips.length; row++) {
        $("#" + field_tooltips[row][0]).attr("title", prefs[field_tooltips[row][1]]);
    }
}

function validateIdentification(type, value) {
    try {
        validateNotEmpty(value, "El campo número de identificación es requerido");
        validateRegExp(value, /^[a-zA-Z0-9]{1,15}$/, "El campo número de identificación debe tener de 1 hasta 15 posiciones");

        switch (type) {
            case "11": // Registro civil de nacimiento - 1 hasta 99999999999
                validateRegExp(value, /^[0-9]{1,11}$/, getMessage("REGISTRO_IDENTIFICATION_11"));
                validateRange(value, 1, 99999999999, getMessage("REGISTRO_IDENTIFICATION_11"));
                break;
            case "12": // Tarjeta de identidad - 1000000000	hasta 99999999999
                validateRegExp(value, /^[0-9]{10,11}$/, getMessage("REGISTRO_IDENTIFICATION_12"));
                validateRange(value, 1000000000, 99999999999, getMessage("REGISTRO_IDENTIFICATION_12"));
                break;
            case "13": // Cedula de ciudadania - 1	hasta 9999999999
                validateRegExp(value, /^[0-9]{1,10}$/, getMessage("REGISTRO_IDENTIFICATION_13"));
                validateRange(value, 1, 9999999999, getMessage("REGISTRO_IDENTIFICATION_13"));
                break;
            case "31": // NIT - alfanumérico de 15 posiciones
                validateRegExp(value, /^[a-zA-Z0-9]{1,15}$/, getMessage("REGISTRO_IDENTIFICATION_31"));
                break;
            case "21": // Tarjeta de extranjeria - alfanumérico de 15 posiciones
            case "22": // Cedula de extranjeria - alfanumérico de 15 posiciones
                validateRegExp(value, /^[a-zA-Z0-9]{1,15}$/, getMessage("REGISTRO_IDENTIFICATION_21"));
                break;
            case "41": // Pasaporte - alfanumérico de 15 posiciones
                validateRegExp(value, /^[a-zA-Z0-9]{1,15}$/, getMessage("REGISTRO_IDENTIFICATION_41"));
                break;
            case "42": // Documento de identificacion extranjero - alfanumérico de 15 posiciones
                validateRegExp(value, /^[a-zA-Z0-9]{1,15}$/, getMessage("REGISTRO_IDENTIFICATION_42"));
                break;
            default:
                throw new Exception("Tipo de Documento no reconecido");
        }
        return true;
    }
    catch (ex) {
        alert(ex);
        return false;
    }
}

function validateNotEmpty(val, msg) {
    if (val == null || val.toString().length == 0)
        throw msg;
}

function validateRegExp(val, expr, msg) {
    if (!expr.test(val))
        throw msg;
}

function validateRange(val, min, max, msg) {
    nbr = new Number(val);
    if (nbr < min || nbr > max)
        throw msg;
}

function getMessage(code) {
    msg="Ocorrió un error";
    $.ajax({
        url: "api/GetMessage",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ 'code': code }),
        dataType: "json",
        success: function(data) { msg=data; },
        async: false
    });
    return msg;
}
    