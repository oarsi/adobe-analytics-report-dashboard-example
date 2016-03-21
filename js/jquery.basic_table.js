function BasicTable(id, config) {
  //id = id || '';
  config = config || {};

  var class_name = id.replace('#', '') || '';

  this.createTable = function () {
    var columnHeadings = "";
    var columns = "";
    if (config['columns']) {
      for (var i in config['columns']) {
        columnHeadings += "<th>"+config['columns'][i] + "</th>\n";
        columns += "<td>&nbsp;</td>\n";
      }
    }

    var html = "<!-- data table -->                     \
    <table class=\""+class_name+"\">                    \
      <tbody>                                           \
      <tr>"+ columnHeadings + "</tr>                    \
      </tbody>                                          \
    </table>                                            \
    <!-- Hidden table used for cloning -->              \
    <table class=\"clone-table\" style=\"display: none;\">         \
      <tbody>                                           \
      <tr>"+ columns + "</tr>                           \
      </tbody>                                          \
    </table>";
    $(id).hide().html(html);
  }

  this.update = function (data) {
    this.createTable();
    // create the table with the table data
    var tbody = $(id + ' .'+class_name).find("tbody");
    $(data).each(function (i, page) {
        var row = $(id + ' .clone-table').find("tr:nth-child(1)").clone();
        row.find("td:nth-child(1)").addClass('tableValue');
        row.find("td:nth-child(1)").html(page[0]);

        row.find("td:last-child").html(page[1].toString().commaSeparate());
        row.find("td:last-child").addClass('counts');
        row.appendTo(tbody);
    });

    $(id).show();
  }
}
