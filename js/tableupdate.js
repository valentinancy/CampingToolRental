var $TABLE = $('#table');
var $BTN = $('#export-btn');
var $EXPORT = $('#export');

// A few jQuery helpers for exporting only
jQuery.fn.pop = [].pop;
jQuery.fn.shift = [].shift;

$BTN.click(function () {
  var $rows = $TABLE.find('tr:not(:hidden)');
  var headers = [];
  var data = [];

  // Get the headers (add special header logic here)
  $($rows.shift()).find('th:not(:empty)').each(function () {
    if ($(this).text() == 'User ID') {
      $(this).text('id');
    }
    if ($(this).text() == 'Name') {
      $(this).text('nama');
    }
    if ($(this).text() == 'Addess') {
      $(this).text('alamat');
    }

    headers.push($(this).text().toLowerCase());
  });

  // Turn all existing rows into a loopable array
  $rows.each(function (j) {
    var $td = $(this).find('td');
    var h = {};

    // Use the headers from earlier to name our hash keys
    headers.forEach(function (header, i) {
      h[header] = $td.eq(i).text();
    });
    data.push(h);
    // alert(data[j].id+" "+data[j].nama);
    $.ajax({
      url: 'http://localhost:3000/api/update',
      dataType: 'text',
      method: 'POST',
      data: {
        id: data[j].id,
        nama: data[j].nama,
        alamat: data[j].alamat,
        username:data[j].username,
        password:data[j].password,
        role:data[j].role
      },
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      success: function(response){
      },
      error: function(xhr, status, error){
      },
      complete: function(){
     }
    });
  });

  // Output the result
  // $EXPORT.text(JSON.stringify(data));
});
