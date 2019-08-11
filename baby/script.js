let ops = ['nop','add','sub','set','unset'];
/**
 * @type {?SimpleFlameWorld} world
 */
let world = null;

jQuery(function($) {
    let flame_table = $('table.flames tbody');
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
        let select = $('<select class="op"></select>');
        cell.append(select);
        for(let i = 0; i < ops.length; i ++) {
             $('<option></option>').val(ops[i]).text(ops[i]).appendTo(select);
        }

        row.append(cell);
        flame_table.append(row);
    });


    $('button.start').click( () => {

        /**
         * @type {SimpleFlame[]}
         */
        let flames = [];

        flame_table.find('tr').each(function() {
            let row = $(this);
            let min_color = row.find('input.min-color').val();
            let max_color = row.find('input.max-color').val();
            let arg1 = row.find('input.arg1').val();
            let arg2 = row.find('input.arg2').val();
            let result = row.find('input.result').val();
            let op = row.find('select.op').val();
            let flame = new SimpleFlame(min_color,max_color,arg1,arg2,result,op);
            flames.push(flame);
        });

        world = new SimpleFlameWorld(flames);
    });

    $('button.single-step').click( () => {
        world.step();
    });


    function set_color(input) {
        let color = input.val();
        if (color) {
            if (chroma.valid(color)) {
                let da_color = chroma(color);
                let da_color_hex = da_color.hex();
                input.css({backgroundColor: da_color_hex});
                if (da_color.luminance() < 0.2) {
                    input.css({color: 'white'});
                } else {
                    input.css({color: 'black'});
                }
                input.css({"border-color": "black",
                    "border-width":"1px",
                    "border-style":"dashed"});
            } else {
                input.css({border: 'initial'});
            }
        } else {
            input.css({backgroundColor: 'initial'});
            input.css({color: 'initial'});
            input.css({border: 'initial'});
        }
    }

    function mark_input_non_color(input) {
        let val = input.val();
        let b_is_non_color = is_non_color(val);
        if (b_is_non_color) {
            input.css({backgroundColor: 'initial'});
            input.css({color: 'initial'});
            input.css({"border-color": "purple",
                "border-width":"2px",
                "border-style":"dashed"});
            return true;

        } else {
            input.css({backgroundColor: 'initial'});
            input.css({color: 'initial'});
            input.css({border: 'initial'});
            return false;
        }



    }

    flame_table.on( "keyup", "input.color-sensitive", function() {
        let input = $(this);
        set_color(input);
    });

    flame_table.on( "keyup", "input.maybe-color-sensitive", function() {
        let input = $(this);
        if (mark_input_non_color(input)) {return;}
        set_color(input);
    });
});