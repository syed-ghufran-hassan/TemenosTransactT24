/**
 * Fairly simply, this plug-in will take the data from an API result set
 * and sum it, returning the summed value. The data can come from any data
 * source, including column data, cells or rows.
 *
 * Note that it will attempt to 'deformat' any string based data that is passed
 * into it - i.e. it will strip any non-numeric characters in order to make a
 * best effort attempt to sum all data types. This can be useful when working
 * with formatting numbers such as currency. However the trade-off is that no
 * error is thrown if non-numeric data is passed in. You should be aware of this
 * in case unexpected values are returned - likely the input data is not what is
 * expected.
 *
 *  @name sum()
 *  @summary Sum the values in a data set.
 *  @author [Allan Jardine](http://sprymedia.co.uk)
 *  @requires DataTables 1.10+
 *
 *  @returns {Number} Summed value
 *
 *  @example
 *    // Simply get the sum of a column
 *    var table = $('#example').DataTable();
 *    table.column( 3 ).data().sum();
 *
 *  @example
 *    // Insert the sum of a column into the columns footer, for the visible
 *    // data on each draw
 *    $('#example').DataTable( {
 *      drawCallback: function () {
 *        var api = this.api();
 *        $( api.table().footer() ).html(
 *          api.column( 4, {page:'current'} ).data().sum()
 *        );
 *      }
 *    } );
 */

jQuery.fn.dataTable.Api.register('sum()', function () {
    return this.flatten().reduce(function (a, b) {
        const parseValue = (val) => {
            if (typeof val === 'string') {
                // Remove all non-numeric characters except '.' and '-'
                val = val.replace(/[^\d.-]/g, '');
            }

            const num = parseFloat(val);

            // Log a warning and return 0 if the parsed value is not a valid number
            if (isNaN(num)) {
                console.warn('Ignored non-numeric value in sum():', val);
                return 0;
            }

            return num;
        };

        const aParsed = parseValue(a);
        const bParsed = parseValue(b);

        return aParsed + bParsed;
    }, 0);
});


