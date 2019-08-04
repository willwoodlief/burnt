var ops = ['add','sub','set','unset'];

jQuery(function($) {
    $('button.new-flame').click( () => {
        let row = $('<tr></tr>');

        let cell = $('<td></td>');
        cell.append('<input class="color-sensitive  min-color">');
        row.append(cell);

        cell = $('<td></td>');
        cell.append('<input class="color-sensitive max-color">');
        row.append(cell);

        cell = $('<td></td>');
        cell.append('<input class="maybe-color-sensitive arg1">');
        row.append(cell);

        cell = $('<td></td>');
        cell.append('<input class="maybe-color-sensitive arg2">');
        row.append(cell);

        cell = $('<td></td>');
        cell.append('<input class="color-sensitive result">');
        row.append(cell);

        cell = $('<td></td>');
        let select = $('<select></select>');
        cell.append(select);
        for(let i = 0; i < ops.length; i ++) {
             $('<option></option>').val(ops[i]).text(ops[i]).appendTo(select);
        }

        row.append(cell);
        $('table.flames tbody').append(row);
    });



    $( 'table.flames tbody' ).on( "keyup", "input.color-sensitive", function() {
        let input = $(this);
        let color = input.val();
        if (chroma.valid(color) ) {
            let da_color = chroma(color).hex();
            input.css({backgroundColor: da_color});
        }
    });

    $( 'table.flames tbody' ).on( "keyup", "input.maybe-color-sensitive", function() {
        let input = $(this);
        let color = input.val();
        if (chroma.valid(color) ) {
            let da_color = chroma(color).hex();
            input.css({backgroundColor: da_color});
        }

    });
});