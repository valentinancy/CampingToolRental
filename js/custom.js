/**
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var URL = window.location,
    $BODY = $('body'),
    $MENU_TOGGLE = $('#menu_toggle'),
    $SIDEBAR_MENU = $('#sidebar-menu'),
    $SIDEBAR_FOOTER = $('.sidebar-footer'),
    $LEFT_COL = $('.left_col'),
    $RIGHT_COL = $('.right_col'),
    $NAV_MENU = $('.nav_menu'),
    $FOOTER = $('footer');

// Sidebar
$(function () {
    $SIDEBAR_MENU.find('li ul').slideUp();
    $SIDEBAR_MENU.find('li').removeClass('active');

    $SIDEBAR_MENU.find('li').on('click', function(ev) {
        var link = $('a', this).attr('href');

        // prevent event bubbling on parent menu
        if (link) {
            ev.stopPropagation();
        }
        // execute slidedown if parent menu
        else {
            if ($(this).is('.active')) {
                $(this).removeClass('active');
                $('ul', this).slideUp(function() {
                    setContentHeight();
                });
            } else {
                $SIDEBAR_MENU.find('li').removeClass('active');
                $SIDEBAR_MENU.find('li ul').slideUp();

                $(this).addClass('active');
                $('ul', this).slideDown(function() {
                    setContentHeight();
                });
            }
        }
    });

    $MENU_TOGGLE.on('click', function() {
        if ($BODY.hasClass('nav-md')) {
            $BODY.removeClass('nav-md').addClass('nav-sm', 1000);
            $LEFT_COL.removeClass('scroll-view').removeAttr('style');
            $SIDEBAR_FOOTER.hide();

            if ($SIDEBAR_MENU.find('li').hasClass('active')) {
                $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
            }
        } else {
            $BODY.removeClass('nav-sm').addClass('nav-md', 1000);
            $SIDEBAR_FOOTER.show();

            if ($SIDEBAR_MENU.find('li').hasClass('active-sm')) {
                $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
            }
        }
    });

    // check active menu
    $SIDEBAR_MENU.find('a[href="' + URL + '"]').parent('li').addClass('current-page');

    $SIDEBAR_MENU.find('a').filter(function () {
        return this.href == URL;
    }).parent('li').addClass('current-page').parent('ul').slideDown(function() {
        setContentHeight();
    }).parent().addClass('active');

    // recompute content when resizing
    $(window).smartresize(function(){
        setContentHeight();
    });

    // TODO: This is some kind of easy fix, maybe we can improve this
    var setContentHeight = function () {
        // reset height
        $RIGHT_COL.css('min-height', $(window).height());

        var bodyHeight = $BODY.height(),
            leftColHeight = $LEFT_COL.height() + $SIDEBAR_FOOTER.height(),
            contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

        // normalize content
        contentHeight -= $NAV_MENU.height() + $FOOTER.height();

        $RIGHT_COL.css('min-height', contentHeight);
    };
});

// Panel toolbox
$(function () {
    $('.collapse-link').on('click', function() {
        var $BOX_PANEL = $(this).closest('.x_panel'),
            $ICON = $(this).find('i'),
            $BOX_CONTENT = $BOX_PANEL.find('.x_content');

        // fix for some div with hardcoded fix class
        if ($BOX_PANEL.attr('style')) {
            $BOX_CONTENT.slideToggle(200, function(){
                $BOX_PANEL.removeAttr('style');
            });
        } else {
            $BOX_CONTENT.slideToggle(200);
            $BOX_PANEL.css('height', 'auto');
        }

        $ICON.toggleClass('fa-chevron-up fa-chevron-down');
    });

    $('.close-link').click(function () {
        var $BOX_PANEL = $(this).closest('.x_panel');

        $BOX_PANEL.remove();
    });
});

// Tooltip
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

// Progressbar
if ($(".progress .progress-bar")[0]) {
    $('.progress .progress-bar').progressbar(); // bootstrap 3
}

// Switchery
if ($(".js-switch")[0]) {
    var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
    elems.forEach(function (html) {
        var switchery = new Switchery(html, {
            color: '#26B99A'
        });
    });
}

// iCheck
if ($("input.flat")[0]) {
    $(document).ready(function () {
        $('input.flat').iCheck({
            checkboxClass: 'icheckbox_flat-green',
            radioClass: 'iradio_flat-green'
        });
    });
}

// Starrr
var __slice = [].slice;

(function ($, window) {
    var Starrr;

    Starrr = (function () {
        Starrr.prototype.defaults = {
            rating: void 0,
            numStars: 5,
            change: function (e, value) {
            }
        };

        function Starrr($el, options) {
            var i, _, _ref,
                    _this = this;

            this.options = $.extend({}, this.defaults, options);
            this.$el = $el;
            _ref = this.defaults;
            for (i in _ref) {
                _ = _ref[i];
                if (this.$el.data(i) !== null) {
                    this.options[i] = this.$el.data(i);
                }
            }
            this.createStars();
            this.syncRating();
            this.$el.on('mouseover.starrr', 'span', function (e) {
                return _this.syncRating(_this.$el.find('span').index(e.currentTarget) + 1);
            });
            this.$el.on('mouseout.starrr', function () {
                return _this.syncRating();
            });
            this.$el.on('click.starrr', 'span', function (e) {
                return _this.setRating(_this.$el.find('span').index(e.currentTarget) + 1);
            });
            this.$el.on('starrr:change', this.options.change);
        }

        Starrr.prototype.createStars = function () {
            var _i, _ref, _results;

            _results = [];
            for (_i = 1, _ref = this.options.numStars; 1 <= _ref ? _i <= _ref : _i >= _ref; 1 <= _ref ? _i++ : _i--) {
                _results.push(this.$el.append("<span class='glyphicon .glyphicon-star-empty'></span>"));
            }
            return _results;
        };

        Starrr.prototype.setRating = function (rating) {
            if (this.options.rating === rating) {
                rating = void 0;
            }
            this.options.rating = rating;
            this.syncRating();
            return this.$el.trigger('starrr:change', rating);
        };

        Starrr.prototype.syncRating = function (rating) {
            var i, _i, _j, _ref;

            rating || (rating = this.options.rating);
            if (rating) {
                for (i = _i = 0, _ref = rating - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
                    this.$el.find('span').eq(i).removeClass('glyphicon-star-empty').addClass('glyphicon-star');
                }
            }
            if (rating && rating < 5) {
                for (i = _j = rating; rating <= 4 ? _j <= 4 : _j >= 4; i = rating <= 4 ? ++_j : --_j) {
                    this.$el.find('span').eq(i).removeClass('glyphicon-star').addClass('glyphicon-star-empty');
                }
            }
            if (!rating) {
                return this.$el.find('span').removeClass('glyphicon-star').addClass('glyphicon-star-empty');
            }
        };

        return Starrr;

    })();
    return $.fn.extend({
        starrr: function () {
            var args, option;

            option = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            return this.each(function () {
                var data;

                data = $(this).data('star-rating');
                if (!data) {
                    $(this).data('star-rating', (data = new Starrr($(this), option)));
                }
                if (typeof option === 'string') {
                    return data[option].apply(data, args);
                }
            });
        }
    });
})(window.jQuery, window);

$(function () {
    return $(".starrr").starrr();
});

$(document).ready(function () {

    $('#stars').on('starrr:change', function (e, value) {
        $('#count').html(value);
    });


    $('#stars-existing').on('starrr:change', function (e, value) {
        $('#count-existing').html(value);
    });

});

// Table
$('table input').on('ifChecked', function () {
    check_state = '';
    $(this).parent().parent().parent().addClass('selected');
    countChecked();
});
$('table input').on('ifUnchecked', function () {
    check_state = '';
    $(this).parent().parent().parent().removeClass('selected');
    countChecked();
});

var check_state = '';
$('.bulk_action input').on('ifChecked', function () {
    check_state = '';
    $(this).parent().parent().parent().addClass('selected');
    countChecked();
});
$('.bulk_action input').on('ifUnchecked', function () {
    check_state = '';
    $(this).parent().parent().parent().removeClass('selected');
    countChecked();
});
$('.bulk_action input#check-all').on('ifChecked', function () {
    check_state = 'check_all';
    countChecked();
});
$('.bulk_action input#check-all').on('ifUnchecked', function () {
    check_state = 'uncheck_all';
    countChecked();
});

function countChecked() {
    if (check_state == 'check_all') {
        $(".bulk_action input[name='table_records']").iCheck('check');
    }
    if (check_state == 'uncheck_all') {
        $(".bulk_action input[name='table_records']").iCheck('uncheck');
    }
    var n = $(".bulk_action input[name='table_records']:checked").length;
    if (n > 0) {
        $('.column-title').hide();
        $('.bulk-actions').show();
        $('.action-cnt').html(n + ' Records Selected');
    } else {
        $('.column-title').show();
        $('.bulk-actions').hide();
    }
}

// Accordion
$(function () {
    $(".expand").on("click", function () {
        $(this).next().slideToggle(200);
        $expand = $(this).find(">:first-child");

        if ($expand.text() == "+") {
            $expand.text("-");
        } else {
            $expand.text("+");
        }
    });
});


// NProgress
if (typeof NProgress != 'undefined') {
    $(document).ready(function () {
        NProgress.start();
    });

    $(window).load(function () {
        NProgress.done();
    });
}

/**
 * Resize function without multiple trigger
 *
 * Usage:
 * $(window).smartresize(function(){
 *     // code here
 * });
 */
(function($,sr){
    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
      var timeout;

        return function debounced () {
            var obj = this, args = arguments;
            function delayed () {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null;
            }

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100);
        };
    };

    // smartresize
    jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');




function login() {
  var username = $('#username').val();
  var password = $('#password').val();

  $.ajax({
    url: 'http:/localhost:3000/api/login',
    dataType: 'text',
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    data: {
      username: username,
      password: password
    },
    success: function(response){
      obj = JSON.parse(response);
      //alert(obj.message);
      if (obj.message=="owner") {
        window.location.assign('OwnerIndex.html');
      }
      else if (obj.message=="worker") {
        window.location.assign('WorkerIndex.html');
      }
      else {
        alert('USERNAME ATAU PASSWORD YANG ANDA MASUKAN SALAH ATAU TIDAK TERDAFTAR');
      }
    },
    error: function(xhr, status, error){
      alert(error);
    },
    complete: function(){
   }
 });
}


function logout() {
  var username = localStorage.getItem('username');

  $.ajax({
    url: 'http:/localhost:3000/api/logout',
    dataType: 'text',
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    data: {
      Username: username
    },
    success: function(response){
      obj = JSON.parse(response);
      if (obj.message=="logout berhasil") {
        window.location.assign('login.html');
      }
      else {
        alert(obj.message);
      }
      // alert(obj.message);
    },
    error: function(xhr, status, error){
      alert(error);
    },
    complete: function(){
   }
 });
}

$.ajax({
  url: 'http:/localhost:3000/api/checkStatus',
  datatype: 'text',
  method: 'POST',
  contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
  success: function(response){
    // alert(response.message[0].username);
    localStorage.setItem('username', response.message[0].username);
    $('#username_login').text(localStorage.getItem('username'));
  },
  error: function(xhr, status, error){
    //alert();
  },
  complete: function(){
 }
});

function insertUser() {
  var name = $('#name').val();
  var username = $('#username').val();
  var password = $('#password').val();
  var role = $('input[name=role]:checked', '#formInsertUser').val();
  var address = $('#address').val();

  $.ajax({
    url: 'http:/localhost:3000/api/insert',
    dataType: 'text',
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    data: {
      nama: name,
      username: username,
      password: password,
      role: role,
      alamat: address
    },
    success: function(response){
      obj = JSON.parse(response);
      //alert(response);
      if (obj.message=="insert berhasil") {
        window.location.assign('OwnerInsertNewUser.html');
      }
      else {
        alert(obj.message);
      }
    },
    error: function(xhr, status, error){
      window.location.assign('OwnerInsertBerhasil.html');
    },
    complete: function(){
   }
 });
}

function insertTool() {
  var name_tool = $('#toolName').val();
  var type = $('#toolType').val();
  var price = $('#toolPrice').val();

  $.ajax({
    url: 'http:/localhost:3000/api/insertTool',
    dataType: 'text',
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    data: {
      Name_tool: name_tool,
      Type: type,
      Price: price
    },
    success: function(response){
      obj = JSON.parse(response);
      if (obj.message=="insert berhasil") {
        window.location.assign('OwnerInsertBerhasil.html');
      }
      else {
        alert(obj.message);
      }
    },
    error: function(xhr, status, error){
      //window.location.assign('OwnerInsertBerhasil.html');
    },
    complete: function(){
   }
 });
}

function insertBundle() {
  var name_bundle = $('#bundleName').val();
  var price = $('#bundlePrice').val();

  $.ajax({
    url: 'http:/localhost:3000/api/insertBundle',
    dataType: 'text',
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    data: {
      Name_bundle: name_bundle,
      Price: price
    },
    success: function(response){
      obj = JSON.parse(response);
      if (obj.message=="insert berhasil") {
        window.location.assign('OwnerInsertBerhasil.html');
      }
      else {
        alert(obj.message);
      }
    },
    error: function(xhr, status, error){
      //window.location.assign('OwnerInsertBerhasil.html');
    },
    complete: function(){
   }
 });
}

function insertRenter() {
  var name = $('#renterName').val();
  var address = $('#address').val();
  var numberPhone = $('#numberPhone').val();

  $.ajax({
    url: 'http:/localhost:3000/api/insertRenter',
    dataType: 'text',
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    data: {
      Name: name,
      Address: address,
      Number_phone: numberPhone
    },
    success: function(response){
      obj = JSON.parse(response);
      if (obj.message=="insert berhasil") {
        window.location.assign('OwnerInsertBerhasil.html');
      }
      else {
        alert(obj.message);
      }
    },
    error: function(xhr, status, error){
      //window.location.assign('OwnerInsertBerhasil.html');
    },
    complete: function(){
   }
 });
}

function toolTransaction() {
  var Id_tool = $('#toolId').val();
  var Id_renter = $('#renterId').val();
  var NumOfRent = $('#numTool').val();
  var Rental_time = $('#rentTime').val();

  $.ajax({
    url: 'http:/localhost:3000/api/rentTool',
    dataType: 'text',
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    data: {
      Id_tool: Id_tool,
      Id_renter: Id_renter,
      NumOfRent: NumOfRent,
      Rental_time: Rental_time
    },
    success: function(response){
      obj = JSON.parse(response);
      if (obj.message=="insert berhasil") {
        window.location.assign('OwnerInsertBerhasil.html');
      }
      else {
        alert(obj.message);
      }
    },
    error: function(xhr, status, error){
      window.location.assign('OwnerInsertBerhasil.html');
    },
    complete: function(){
   }
 });
}

function bundleTransaction() {
  var Id_bundle = $('#bundleId').val();
  var Id_renter = $('#renterId').val();
  var NumOfRent = $('#numBundle').val();
  var Rental_time = $('#rentTime').val();

  $.ajax({
    url: 'http:/localhost:3000/api/rentBundle',
    dataType: 'text',
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    data: {
      Id_bundle: Id_bundle,
      Id_renter: Id_renter,
      NumOfRent: NumOfRent,
      Rental_time: Rental_time
    },
    success: function(response){
      obj = JSON.parse(response);
      if (obj.message=="insert berhasil") {
        window.location.assign('OwnerInsertBerhasil.html');
      }
      else {
        alert(obj.message);
      }
    },
    error: function(xhr, status, error){
      window.location.assign('OwnerInsertBerhasil.html');
    },
    complete: function(){
   }
 });
}

function returnBundle() {
  var Id_bundle = $('#bundleId').val();
  var NumOfRent = $('#numBundle').val();

  $.ajax({
    url: 'http:/localhost:3000/api/returnBundle',
    dataType: 'text',
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    data: {
      Id_bundle: Id_bundle,
      NumOfRent: NumOfRent
    },
    success: function(response){
      obj = JSON.parse(response);
      if (obj.message=="update berhasil") {
        window.location.assign('OwnerInsertBerhasil.html');
      }
      else {
        alert(obj.message);
      }
    },
    error: function(xhr, status, error){
      window.location.assign('OwnerInsertBerhasil.html');
    },
    complete: function(){
   }
 });
}

function returnTool() {
  var Id_tool = $('#toolId').val();
  var NumOfRent = $('#numTool').val();

  $.ajax({
    url: 'http:/localhost:3000/api/returnTool',
    dataType: 'text',
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    data: {
      Id_tool: Id_tool,
      NumOfRent: NumOfRent
    },
    success: function(response){
      obj = JSON.parse(response);
      if (obj.message=="update berhasil") {
        window.location.assign('WorkerInsertBerhasil.html');
      }
      else {
        alert(obj.message);
      }
    },
    error: function(xhr, status, error){
      window.location.assign('WorkerInsertBerhasil.html');
    },
    complete: function(){
   }
 });
}


$.ajax({
  url: 'http:/localhost:3000/api/semuaorang',
  dataType: 'text',
  method: 'POST',
  contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
  success: function(response){
    obj = JSON.parse(response);

    //console.log(obj.message);
    //alert(obj.message.length);
    for (var i = 0; i < obj.message.length; i++) {
      // $('#nameDataUser').text(obj.message[i].Nama);
      // $('#idDataUser').text(obj.message[i].Id);
       tr = $('<tr/>');
       tr.append("<td>" + obj.message[i].Nama + "</td>");
       tr.append("<td>" + obj.message[i].Id + "</td>");
       tr.append("<td> <a href=''><i class='fa fa-close' onclick='deleteUser()'></i></a></td>");
       $('#bodyTableDelete').append(tr);

       tu = $('<tr/>');
      //  tu.append("<td><input type='text' name='name' class='foo' readonly value='"+obj.message[i].Id+"'></td>");
      //  tu.append("<td><input type='text' id='name' name='name' value='"+obj.message[i].Nama+"'></td>");
      //  tu.append("<td><input type='text' name='name' value='"+obj.message[i].Alamat+"'></td>");
      //  tu.append("<td><input type='text' name='name' value='"+obj.message[i].Username+"'></td>");
      //  tu.append("<td><input type='text' name='name' value='"+obj.message[i].Password+"'></td>");
      //  tu.append("<td><input type='text' name='name' readonly value='"+obj.message[i].role+"'></td>");
      //  tu.append("<td> <a href=''><i class='fa fa-check' onclick='updateUser()'></i></a></td>")
          tu.append("<td>"+obj.message[i].Id+"</td>");
          tu.append("<td contenteditable='true'>"+obj.message[i].Nama+"</td>");
          tu.append("<td contenteditable='true'>"+obj.message[i].Alamat+"</td>");
          tu.append("<td contenteditable='true'>"+obj.message[i].Username+"</td>");
          tu.append("<td contenteditable='true'>"+obj.message[i].Password+"</td>");
          tu.append("<td>"+obj.message[i].role+"</td>");
       $('#bodyTableUpdate').append(tu);

    }
  },
  error: function(xhr, status, error){
    alert(error);
  },
  complete: function(){
 }
});

$.ajax({
  url: 'http:/localhost:3000/api/allTools',
  dataType: 'text',
  method: 'POST',
  contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
  success: function(response){
    obj = JSON.parse(response);

    for (var i = 0; i < obj.message.length; i++) {
       tr = $('<tr/>');
       tr.append("<td>" + obj.message[i].Name_tool + "</td>");
       tr.append("<td>" + obj.message[i].Id_tool + "</td>");
       tr.append("<td>" + obj.message[i].Type + "</td>");
       tr.append("<td>" + obj.message[i].Price + "</td>");
       tr.append("<td> <a href=''><i class='fa fa-close' onclick='deleteTool()'></i></a></td>");
       $('#bodyTableDeleteTool').append(tr);

       tu = $('<tr/>');
       tu.append("<td><input type='text' name='name' class='foo' readonly value='"+obj.message[i].Id_tool +"'></td>");
       tu.append("<td><input type='text' name='name' value='"+obj.message[i].Name_tool +"'></td>");
       tu.append("<td><input type='text' name='name' value='"+obj.message[i].Type +"'></td>");
       tu.append("<td><input type='text' name='name' value='"+obj.message[i].Price +"'></td>");
       tu.append("<td> <a href=''><i class='fa fa-check' onclick='updateTool()'></i></a></td>")
       $('#bodyTableUpdateTool').append(tu);

      //  ts = $('<tr/>');
      //  ts.append("<td>" + obj.message[i].Id_tool + "</td>");
      //  ts.append("<td>" + obj.message[i].Name_tool + "</td>");
      //  ts.append("<td>" + obj.message[i].Type + "</td>");
      //  ts.append("<td>" + obj.message[i].Price + "</td>");
      //  ts.append("<td>" + obj.message[i].Stock + "</td>");
      //  $('#bodyTableTool').append(ts);
    }
  },
  error: function(xhr, status, error){
    alert(error);
  },
  complete: function(){
 }
});

$.ajax({
  url: 'http:/localhost:3000/api/allBundles',
  dataType: 'text',
  method: 'POST',
  contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
  success: function(response){
    obj = JSON.parse(response);

    for (var i = 0; i < obj.message.length; i++) {
       tr = $('<tr/>');
       tr.append("<td>" + obj.message[i].Name_bundle + "</td>");
       tr.append("<td>" + obj.message[i].Id_bundle + "</td>");
       tr.append("<td>" + obj.message[i].Price + "</td>");
       tr.append("<td> <a href=''><i class='fa fa-close' onclick='deleteBundle()'></i></a></td>");
       $('#bodyTableDeleteBundle').append(tr);

       tu = $('<tr/>');
       tu.append("<td><input type='text' name='name' class='foo' readonly value='"+obj.message[i].Name_bundle +"'></td>");
       tu.append("<td><input type='text' name='name' value='"+obj.message[i].Id_bundle +"'></td>");
       tu.append("<td><input type='text' name='name' value='"+obj.message[i].Price +"'></td>");
       tu.append("<td> <a href=''><i class='fa fa-check' onclick='updateBundle()'></i></a></td>")
       $('#bodyTableUpdateBundle').append(tu);

       ts = $('<tr/>');
       ts.append("<td>" + obj.message[i].Name_bundle + "</td>");
       ts.append("<td>" + obj.message[i].Id_bundle + "</td>");
       ts.append("<td>" + obj.message[i].Price + "</td>");
       ts.append("<td>" + obj.message[i].Stock + "</td>");
       $('#bodyTableBundle').append(ts);
    }
  },
  error: function(xhr, status, error){
    alert(error);
  },
  complete: function(){
 }
});

$.ajax({
  url: 'http:/localhost:3000/api/allRenters',
  dataType: 'text',
  method: 'POST',
  contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
  success: function(response){
    obj = JSON.parse(response);

    for (var i = 0; i < obj.message.length; i++) {
       tr = $('<tr/>');
       tr.append("<td>" + obj.message[i].Name + "</td>");
       tr.append("<td>" + obj.message[i].Id_renter + "</td>");
       tr.append("<td>" + obj.message[i].Number_phone + "</td>");
       tr.append("<td>" + obj.message[i].Address + "</td>");
       $('#bodyTableRenter').append(tr);
    }
  },
  error: function(xhr, status, error){
    alert(error);
  },
  complete: function(){
 }
});





var updateUser = function(e) {
    var nRow = $(this).parents('tr')[1];
    var jqTds = $('input', nRow);

    // var name = document.getElementById("updateTable");
    // var table = document.getElementById('updateTable'),
    // rows = table.getElementsByTagName('tr'),
    // i ,j ,cells, id, name, address, username, password, role, jqTds;

      var id = jqTds[0].value;
      var name = jqTds[1].value;
      var address = jqTds[2].value;
      var username = jqTds[3].value;
      var password = jqTds[4].value;
      var role = jqTds[5].value;


    $.ajax({
      url: 'http://localhost:3000/api/update',
      dataType: 'text',
      method: 'POST',
      data: {
        id: id,
        nama: name,
        alamat: address,
        username:username,
        password:password,
        role:role
      },
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      success: function(response){
      },
      error: function(xhr, status, error){
      },
      complete: function(){
     }
    });
}

      // $("#updateTable").on('click','tr',function(e){
      //       e.preventDefault();
      //       var satu = $(this).html().split('<td>');
      //       var id = satu[1].split('"');
      //       var name = satu[2].split('"');
      //       var address = satu[3].split('"');
      //       var username = satu[4].split('"');
      //       var password = satu[5].split('"');
      //       var role = satu[6].split('"');
      //       alert(id[3]+" "+name[3]+" "+address[3]+" "+username[3]+" "+password[3]+" "+role[3]+" ");
      // });

function updateNancy(e) {
   var name = document.getElementById("updateTable").rows[1].cells[1].getElementsByTagName('input')[0].value;
    var table = document.getElementById('updateTable'),
    rows = table.getElementsByTagName('tr'),
    i ,j ,cells, id, name, address, username, password, role;

    for (i = 0, j = rows.length ; i < j ; ++i) {
      //cells = rows[i].getElementsByTagName('td');
      cells = $('input', rows[i].getElementsByTagName('td'));
      if(!cells.length) {
        continue;
      }
      id = cells[0].innerHTML.value;
      name = cells[1].getElementsByTagName('input')[0].value;
      address = cells[2].innerHTML.value;
      username = cells[3].innerHTML.value;
      password = cells[4].innerHTML.value;
      role = cells[5].innerHTML.value;
    // var myTable = document.getElementById('updateTable');
    // updateTable.rows[0].cells[1].innerHTML = 'Hello';
    }

    $.ajax({
      url: 'http://localhost:3000/api/update',
      dataType: 'text',
      method: 'POST',
      data: {
        id: id,
        nama: name,
        alamat: address,
        username:username,
        password:password,
        role:role
      },
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      success: function(response){
      },
      error: function(xhr, status, error){
      },
      complete: function(){
     }
    });
}


function deleteUser(e){
    e = e || window.event;
    var data = [];
    var target = e.srcElement || e.target;
    while (target && target.nodeName !== "TR") {
        target = target.parentNode;
    }
    if (target) {
        var cells = target.getElementsByTagName("td");
    }

    $.ajax({
      url: 'http://localhost:3000/api/delete',
      dataType: 'text',
      method: 'POST',
      data: {
        id: cells[1].innerHTML
      },
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      success: function(response){
      },
      error: function(xhr, status, error){
      },
      complete: function(){
     }
    });
}

function deleteTool(e){
    e = e || window.event;
    var data = [];
    var target = e.srcElement || e.target;
    while (target && target.nodeName !== "TR") {
        target = target.parentNode;
    }
    if (target) {
        var cells = target.getElementsByTagName("td");
    }

    $.ajax({
      url: 'http://localhost:3000/api/deleteTool',
      dataType: 'text',
      method: 'POST',
      data: {
        Id_tool: cells[1].innerHTML
      },
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      success: function(response){
      },
      error: function(xhr, status, error){
      },
      complete: function(){
     }
    });
}

function deleteBundle(e){
    e = e || window.event;
    var data = [];
    var target = e.srcElement || e.target;
    while (target && target.nodeName !== "TR") {
        target = target.parentNode;
    }
    if (target) {
        var cells = target.getElementsByTagName("td");
    }

    $.ajax({
      url: 'http://localhost:3000/api/deleteBundle',
      dataType: 'text',
      method: 'POST',
      data: {
        Id_bundle: cells[1].innerHTML
      },
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      success: function(response){
      },
      error: function(xhr, status, error){
      },
      complete: function(){
     }
    });
}

function searchRenter() {
  var numberPhone = $('#numberPhone').val();

  $.ajax({
    url: 'http://localhost:3000/api/searchRenter',
    dataType: 'text',
    method: 'POST',
    data: {
      Number_phone: numberPhone
    },
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    success: function(response){
      obj = JSON.parse(response);


      for (var i = 0; i < obj.message.length; i++) {
         tr = $('<tr/>');
         tr.append("<td>" + obj.message[i].Id_renter + "</td>");
         tr.append("<td>" + obj.message[i].Name + "</td>");
         tr.append("<td>" + obj.message[i].Address + "</td>");
         tr.append("<td>" + obj.message[i].Number_phone + "</td>");
         $('#stockTool').append(tr);
      }
    },
    error: function(xhr, status, error){
    },
    complete: function(){
   }
  });
}


function checkToolByDate() {
  var day = $('#day').val();
  var month = $('#month').val();
  var year = $('#year').val();
  var date = year + "-" + month + "-" + day;
  // alert(date);

  $.ajax({
    url: 'http://localhost:3000/api/checkToolByDate',
    dataType: 'text',
    method: 'POST',
    data: {
      Rental_date1: date
    },
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    success: function(response){
      obj = JSON.parse(response);

      for (var i = 0; i < obj.message.length; i++) {
         tr = $('<tr/>');
         tr.append("<td>" + obj.message[i].Id_tool + "</td>");
         tr.append("<td>" + obj.message[i].Name_tool + "</td>");
         tr.append("<td>" + obj.message[i].Type + "</td>");
         tr.append("<td>" + obj.message[i].Price + "</td>");
         tr.append("<td>" + obj.message[i].Stock + "</td>");
         $('#stockTool').append(tr);
      }
    },
    error: function(xhr, status, error){
    },
    complete: function(){
   }
  });
}

function checkBundleByDate() {
  var day = $('#day').val();
  var month = $('#month').val();
  var year = $('#year').val();
  var date = year + "-" + month + "-" + day;
  // alert(date);

  $.ajax({
    url: 'http://localhost:3000/api/checkBundleByDate',
    dataType: 'text',
    method: 'POST',
    data: {
      Rental_date1: date
    },
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    success: function(response){
      obj = JSON.parse(response);

      for (var i = 0; i < obj.message.length; i++) {
         tr = $('<tr/>');
         tr.append("<td>" + obj.message[i].Id_tool + "</td>");
         tr.append("<td>" + obj.message[i].Name_tool + "</td>");
         tr.append("<td>" + obj.message[i].Type + "</td>");
         tr.append("<td>" + obj.message[i].Price + "</td>");
         tr.append("<td>" + obj.message[i].Stock + "</td>");
         $('#stockTool').append(tr);
      }
    },
    error: function(xhr, status, error){
    },
    complete: function(){
   }
  });
}
