var oldNumColumns = 0;
var initialized = false;
function reloadForm()
{
    //ctrl_layout_optionsoptionsuse_default
    var useDefault = $('#ctrl_layout_optionsoptionsuse_default');
    var customWidths_useCustomValue = $('#ctrl_layout_optionscolumn_widthsuse_custom_1');
    var customWidths = $('#ctrl_layout_optionscolumn_widthsvalue').val();
    var maxColumns = $('#ctrl_layout_optionsmaximum_columnsvalue').val();
    var numColumns = maxColumns;
    $('#ctrl_layout_optionscustom_column_widthscount').val(maxColumns);

    if (!useDefault.length || useDefault.val() == 0)
    {
        $('#edit_options').show();
    }
    else
    {
        $('#edit_options').hide();
    }

    if (!customWidths_useCustomValue.length || customWidths_useCustomValue.is(':checked'))
    {
        if (customWidths == 1)
        {
            $('#custom_widths').show();
        }
        else
        {
            $('#custom_widths').hide();
        }
    }
    else
    {
        $('#custom_widths').hide();
    }

    if (!initialized)
    {
        oldNumColumns = numColumns;
        initialized = true;
    }
    else
    {
        if (oldNumColumns != numColumns)
        {
            if (numColumns < 0)
            {
                numColumns = 0;
            }
            if (oldNumColumns > numColumns)
            {
                // Remove Fields
                var pos = oldNumColumns;
                while (pos > numColumns)
                {
                    -- pos;
                    $('.column_width').last().remove();
                }
                oldNumColumns = pos;
            }
            else if (numColumns > oldNumColumns)
            {
                var pos = oldNumColumns;
                while (pos < numColumns)
                {
                    ++ pos;
                    if (pos == 1) continue;
                    $('#custom_widths').append($('<fieldset class="column_width" id="fieldset_'+pos+'"><h2>'+pos+' Column Widths</h2></fieldset>'));
                    for (var i = 1; i < pos + 1; ++i)
                    {

                        $('#fieldset_'+pos).append($('<div class="ctrlUnit" display="style: block">' +
                        '<dt>' +
                        '<label for="ctrl_layout_optionscustom_column_widthslayouts'+pos + i +'">Column '+i+':</label>' +
                        '</dt>' +
                        '<dd>' +
                        '<input type="text" name="layout_options[custom_column_widths][layouts]['+pos+']['+i+']" class="textCtrl" id="ctrl_layout_optionscustom_column_widthslayouts'+pos + i +'">' +
                        '</dd>'));
                    }
                }
                oldNumColumns = pos;
            }
        }
    }
}

$(document).ready(function()
{
    reloadForm();

    $('#ctrl_layout_optionsoptionsuse_default').change(function() {
        reloadForm()
    });

    $('#ctrl_layout_optionscolumn_widthsuse_custom_1').change(function() {
        reloadForm()
    });

    $('#ctrl_layout_optionscolumn_widthsvalue').change(function() {
        reloadForm()
    });

    $('#ctrl_layout_optionscustom_column_widthscount').change(function() {
        reloadForm()
    });

    $('#ctrl_layout_optionsmaximum_columnsvalue').change(function() {
        reloadForm()
    });
});