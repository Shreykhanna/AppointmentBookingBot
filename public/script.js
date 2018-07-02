var  unavailableDates=[];
function unavailable(date) {
    dmy = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    if ($.inArray(dmy,unavailableDates) == -1) {
        return [true, ""];
    } else {
        return [false, "", "Unavailable"];
    }
}
$(document).ready(function () {
    $(function () {
        $("#datepicker").datepicker({
            dateFormat: 'dd-mm-yy',
            changeMonth: true,
            changeYear: true,
            minDate:0,
            beforeShowDay:unavailable,
        });
    });
});
