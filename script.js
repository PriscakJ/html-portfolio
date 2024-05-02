"use strict";
/*
1. select * from appointment_options where appointment_id = 'Input'
 --> return-> option_id and option_datetime (checkboxes)-> create checkboxes

2. create table options_names (columns: option_id, name)

3.select * from (appointment_options left join option_names on option_id) where appointment_id = 'input'

4. insert into appointments
5. insert into option_names
6. insert into option_id

*/
// Define isValidDateTime function globally
function isValidDateTime(datetime) {
    var dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    return dateTimeRegex.test(datetime);
}
$(function () {
    // Function to display appointments
    function displayAppointments(appointments) {
        console.log(appointments);
        appointments.forEach(function (appointment) {
            console.log(appointment.title);
            var new_div = $('<div>').addClass('appoint-div').attr('title', appointment.title).attr('id', appointment.id);
            $('#appoint_main_div').append(new_div);
            var new_btn = $('<button>').addClass('btn btn-secondary toggler').text(appointment.title);
            new_div.append(new_btn);
            var new_table = $('<table>').addClass('table');
            new_div.append(new_table);
            var new_thead = $('<thead>');
            new_table.append(new_thead);
            var new_row = $('<tr>').addClass('appoint_dates');
            new_thead.append(new_row);
            var new_th = $('<th>').text('Name');
            new_row.append(new_th);
            var new_body = $('<tbody>');
            new_table.append(new_body);
        });
    }
    ;
    // AJAX call to retrieve appointments from the database
    $.ajax({
        type: "GET",
        //url: "./Apt_Planner_Backend/serviceHandler.php",
        // url: "/Apt_Planner_Backend/serviceHandler.php",
        url: "testDB2.php",
        cache: false,
        // data: { method: "queryApts" },
        dataType: "json",
        success: function (response) {
            // Call displayAppointments function to render appointments
            displayAppointments(response);
        },
        error: function (xhr, status, error) {
            // Handle error if AJAX request fails
            console.error("AJAX request failed:", error);
        }
    });
    $('#new_appoint_btn').on("click", function () {
        console.log('New appointment button clicked');
        $('#new_apoint_div').toggle();
    });
    $('#add_new_termin').on("click", function () {
        var counter = $('.appointment-input').length + 1;
        console.log('counter', counter);
        var new_termin_label = $('<label>').attr('for', counter).text('Appointment ' + counter);
        var new_termin_input = $('<input>').attr('type', 'text').addClass('appointment-input').attr('placeholder', 'YYYY-MM-DD hh:mm');
        $('#new_appoint_div_termin').append(new_termin_label, new_termin_input);
    });
    $('#new_appoint_confirm').on('click', function () {
        var description = $('#description_input').val();
        //  const appointmentDateTime = $('#1').val() as string;
        var expiryDateTime = $('#exp_date_input').val();
        // Check the validity of date inputs
        // Check the validity of expiration date input
        var isValidExpiryDateTime = isValidDateTime(expiryDateTime);
        if (!isValidExpiryDateTime) {
            alert('Please enter a valid expiration date in the format YYYY-MM-DD hh:mm');
            return;
        }
        // Check the validity of appointment date inputs
        var isValidAppointmentDateTime = true;
        $('.appointment-input').each(function () {
            var appointmentDateTime = $(this).val();
            if (!isValidDateTime(appointmentDateTime)) {
                isValidAppointmentDateTime = false;
                return false; // Exit the loop early
            }
        });
        if (!isValidAppointmentDateTime) {
            alert('Please enter valid appointment dates in the format YYYY-MM-DD hh:mm');
            return;
        }
        // Proceed with creating the appointment
        var counter_appoints = $('.appoint-div').length + 1;
        var new_div = $('<div>').addClass('appoint-div').attr('title', description).attr('id', counter_appoints);
        $('#appoint_main_div').append(new_div);
        var new_btn = $('<button>').addClass('btn btn-secondary toggler').text(description);
        new_div.append(new_btn);
        var new_table = $('<table>').addClass('table');
        new_div.append(new_table);
        var new_thead = $('<thead>');
        new_table.append(new_thead);
        var new_row = $('<tr>').addClass('appoint_dates');
        new_thead.append(new_row);
        var new_th = $('<th>').text('Name');
        new_row.append(new_th);
        var new_body = $('<tbody>');
        new_table.append(new_body);
        var appointmentInputs = $('.appointment-input').map(function () {
            return $(this).val();
        }).get();
        for (var i = 0; i < appointmentInputs.length; i++) {
            var new_col = $('<th>').attr('scope', 'col').text(appointmentInputs[i]);
            new_row.append(new_col);
        }
        var new_name_btn = $('<button>').addClass('btn btn-info name_btn').text("+");
        new_th.append(new_name_btn);
        $('.name_btn').on("click", function () {
            console.log('name clicked');
            var new_row_name = $('<tr>');
            new_body.append(new_row_name);
            var new_form_name = $('<form>').attr({ 'method': 'post', 'action': './index4.html' });
            new_row_name.append(new_form_name);
            var new_cell_name = $('<td>');
            new_row_name.append(new_cell_name);
            var new_cell_name_input = $('<input>').attr('type', 'text').addClass('input-group').attr('placeholder', 'Name');
            new_cell_name.append(new_cell_name_input);
            for (var i = 0; i < appointmentInputs.length; i++) {
                var new_cell_check = $('<td>');
                new_row_name.append(new_cell_check);
                var new_checkbox = $('<input>').attr('type', 'checkbox').addClass('form-check-input').val(appointmentInputs[i]);
                new_cell_check.append(new_checkbox);
            }
            var new_cell_confirm_btn = $('<td>');
            new_row_name.append(new_cell_confirm_btn);
            var new_form_btn = $('<button>').attr('type', 'submit').addClass('form_btn').text('confirm');
            new_cell_confirm_btn.append(new_form_btn);
        });
    });
    $('#appoint_main_div').on('click', '.form_btn', function () {
        console.log('hello');
        console.log('Clicked form_btn');
        var data_row = $(this).closest('tr');
        console.log('data_row:', data_row);
        var parent_div = data_row.closest('.appoint-div');
        console.log('parent_div:', parent_div);
        var appoint_id_str = parent_div.attr('id'); // Get the attribute value as string
        var appoint_id; // Define appoint_id as a number or undefined
        // Check if the attribute value is not undefined and is a valid number
        if (appoint_id_str !== undefined && !isNaN(parseInt(appoint_id_str))) {
            // If it's a valid number, parse it to an integer
            appoint_id = parseInt(appoint_id_str);
        }
        else {
            // If it's not a valid number, set appoint_id to undefined
            appoint_id = undefined;
        }
        var appoint_name = parent_div.attr('title') || "";
        console.log('appoint_name:', appoint_name);
        var data_row = $(this).closest('tr');
        var data = {
            appoint_id: appoint_id,
            appoint_name: appoint_name,
            user_name: data_row.find('input[type="text"]').val(),
            checkboxes: data_row.find('input[type="checkbox"]:checked').map(function () {
                var datetimeValue = $(this).val();
                if (!isValidDateTime(datetimeValue)) {
                    alert('Please enter date and time in the format YYYY-MM-DD hh:mm');
                    return;
                }
                var timestamp = datetimeValue + ':00';
                console.log("MySQL timestamp:", timestamp);
                return timestamp;
            }).get(),
            location: $('#location_input').val(),
            expiry_date: $('#exp_date_input').val()
        };
        console.log('FormData:', data);
        // AJAX request to save User_name, checkboxes (dates) into DB (via appointment_name)
        $.ajax({
            type: 'POST',
            url: './serviceHandler.php',
            data: data,
            success: function (response) {
                // Handle success
            },
            error: function (xhr, status, error) {
                // Handle error
            }
        });
    });
    $('#appoint_main_div').on("click", ".toggler", function () {
        $(this).next().toggle();
    });
});
