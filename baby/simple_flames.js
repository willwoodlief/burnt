
function SimpleFlameWorldPart(color,value) {
    this.hex_color = color.hex('rgb');
    this.value = value;
}

function is_non_color(val) {

    let b_non_color = false;
    if (!input) { b_non_color =  true;}
    if (val.startsWith('"') || val.startsWith("'")) { b_non_color =  true;}
    if ($.isNumeric(val)) { b_non_color =  true;}
    if (!chroma.colors.hasOwnProperty(val.toLowerCase())) {
        b_non_color =  true;
    }

    if (val.startsWith('#')) {
        if (chroma.valid(val)) {
            b_non_color =  false;
        }
    }
    return b_non_color;
}

/**
 * holds a flame row
 * makes sure that min is less than max
 *
 * @param {string} min_color_in
 * @param {string} max_color_in
 * @param {string} arg1
 * @param {string} arg2
 * @param {string} res
 * @param {string} op
 */
function SimpleFlame(min_color_in, max_color_in, arg1, arg2, res, op) {

    /**
     * @param {chroma/Color} min_color
     * @param {chroma/Color}  max_color
     */
    function is_min_greater(min_color,max_color) {
        let min_rgb = min_color.rgb();
        let max_rgb = max_color.rgb();
        //first compare red, then green and then blue
        for(let i = 0; i < 3; i ++) {
            if (max_rgb[i] < min_rgb[i]) {
                return true;
            }
        }
        return false;

    }
    this.min_color = null;
    if (chroma.valid(min_color_in)) {
        this.min_color = chroma(min_color_in);
    }

    this.max_color = null;
    if (chroma.valid(max_color_in)) {
        this.max_color = chroma(max_color_in);
    }

    if (this.max_color !== null && this.min_color !== null) {
        if (is_min_greater (this.min_color,this.max_color) ) {
            let temp = this.min_color;
            this.min_color = this.max_color;
            this.max_color = temp;
        }
    }

    function parse_arg(arg) {
        let b_is_not_color = is_non_color(arg);
        if (b_is_not_color) {
            return {type: 'value', value: arg};
        } else {
            if (chroma.valid(arg) ) {
                let color = chroma(arg);
                let rgb_hex = color.hex('rgb');
                return {type: 'pointer', value: rgb_hex};
            } else {
                return {type: 'invalid', value: null};
            }
        }
    }

    this.arg1 =  parse_arg(arg1);
    this.arg2 =  parse_arg(arg2);

    this.result = res;
    let result_obj = parse_arg(res);
    if (!result_obj.value) {
        this.result = null;
    } else if (result_obj.type !== 'pointer') {
        this.result = null;
    } else {
        this.result = result_obj.value;
    }

    this.operation = op;
}

/**
 *
 * @param {SimpleFlame[]} flames
 */
function SimpleFlameWorld(flames) {

    let self = this;
    this.flames = flames;
    /**
     * @type {Object.<string, *>} color
     */
    this.colors = {};

    /**
     * is in range if there is any color set between the min and max
     * for a color to be in between, there needs to be two properties such that one has an RGB that is less or equal in each part
     *  and the other must have an RGB that is greater or equal in each part
     *  todo implement range of colors detection
     * @param min_color
     * @param max_color
     */
    function see_if_range_in_colors(min_color,max_color) {

    }


    this.do_operation = function (op,arg1,arg2,result) {
        let val1 = arg1.value;
        if (arg1.type === 'pointer') {
            let color = val1;
            if (self.colors.hasOwnProperty(color)) {
                val1 = self.colors[color];
            } else {
                val1 = null;
            }
        }

        let val2 = arg1.value;
        if (arg2.type === 'pointer') {
            let color = val2;
            if (self.colors.hasOwnProperty(color)) {
                val2 = self.colors[color];
            } else {
                val2 = null;
            }
        }

        //['nop','add','sub','set','unset'];
        let b_set_result = false;
        let b_unset_result = false;
        let result_val = null;
        switch (op) {
            case 'nop': {break;}
            case 'add': {
                b_set_result = true;
                if ($.isNumeric(val1) && $.isNumeric(val2)) {
                    result_val = val1 + val2;
                } else {
                    result_val = null;
                }
                break;
            }
            case 'sub' : {
                b_set_result = true;
                if ($.isNumeric(val1) && $.isNumeric(val2)) {
                    result_val = val1 - val2;
                } else {
                    result_val = null;
                }
                break;
            }
            case 'set' : {
                b_set_result = true;
                result_val = val1;
                break;
            }

            case 'unset' : {
                b_unset_result = true;
                break;
            }
            default :
            {
                break;
            }
        }

        if (b_set_result) {
            this.colors[result] = result_val;
        }
        if (b_unset_result) {
            delete this.colors[result] ;
        }
    };

    this.step = function() {
        for(let i = 0; i < this.flames.length; i ++) {
            let flame = this.flames[i];
            if (see_if_range_in_colors(flame.min_color,flame.max_color)) {
                this.do_operation(flame.operation,flame.arg1,flame.arg2,flame.result);
            }
        }
    };

    /**
     * @return SimpleFlameWorldPart[]
     */
    this.list_world = function() {
        let ret = [];
        for(let i in this.colors) {
            if (!this.colors.hasOwnProperty(i)) {continue;}
            let value = this.colors[i];
            let part = new SimpleFlameWorldPart(i,value);
            ret.push(part);
        }

        return ret;
    }
}