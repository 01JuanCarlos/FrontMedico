/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
 
 /* default:
 		stack: 5,
 		hideAfter: 3000 , //en milisegundos = 3 segundos.
 */
 
"use strict";
function tstInfo(head, text) {
    $.toast({
        heading: head,
        text: text,
        showHideTransition: 'slide',
        position: 'top-right',
        //bgColor: '#009efb',
        //textColor: 'white',
        icon: 'info',
        hideAfter: 7000
    });
}


function tstWarning(head, text) {
    $.toast({
        heading: head,
        text: text,
        showHideTransition: 'slide',
        position: 'top-right',
        //bgColor: '#ffbc34',
        //textColor: 'white',
        icon: 'warning',
        hideAfter: 7000
    });
}

function tstSuccess(head, text) {
    $.toast({
        heading: head,
        text: text,
        showHideTransition: 'slide',
        position: 'top-right',
        //bgColor: '#55ce63',
        //textColor: 'white',
        icon: 'success',
        hideAfter: 7000
    });
}
//Danger
function tstError(head, text) {
    $.toast({
        heading: head,
        text: text,
        showHideTransition: 'slide',
        position: 'top-right',
        //bgColor: '#f62d51',
        //textColor: 'white',
        icon: 'error',
        hideAfter: 7000
    });
}
