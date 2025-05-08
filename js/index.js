const jpdbBaseURL = 'http://api.login2explore.com:5577';
const jpdbIRL = '/api/irl';
const jpdbIML = '/api/iml';
const dbName = 'SCHOOL-DB';
const relationName = 'STUDENT-TABLE';
const connToken = '90934688|-31949205524205343|90956190';


$(document).ready(function() {
    resetForm();
});


function resetForm() {
    $('#rollNo').val('').prop('disabled', false);
    $('#fullName').val('').prop('disabled', true);
    $('#class').val('').prop('disabled', true);
    $('#birthDate').val('').prop('disabled', true);
    $('#address').val('').prop('disabled', true);
    $('#enrollmentDate').val('').prop('disabled', true);
    $('#save').prop('disabled', true);
    $('#update').prop('disabled', true);
    $('#reset').prop('disabled', true);
    $('#rollNo').focus();
}


function checkStudent() {
    const rollNo = $('#rollNo').val().trim();
    if (!rollNo) {
        resetForm();
        return;
    }

    const jsonData = JSON.stringify({ id: rollNo });
    const getRequest = createGET_BY_KEYRequest(connToken, dbName, relationName, jsonData);

    jQuery.ajaxSetup({ async: false });
    const res = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });

    console.log("API Response:", res);

    if (res.status === 200) { 
        fillStudentData(res);
        $('#update').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#fullName').focus();
    } else if (res.status === 400) { 
        enableFormForNewEntry();
    } else {
        alert("Error checking student: " + JSON.stringify(res));
    }
}


function fillStudentData(jsonObj) {
    const data = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', data.rec_no);
    const student = data.record;
    
    $('#rollNo').prop('disabled', true);
    $('#fullName').val(student.fullName).prop('disabled', false);
    $('#class').val(student.class).prop('disabled', false);
    $('#birthDate').val(student.birthDate).prop('disabled', false);
    $('#address').val(student.address).prop('disabled', false);
    $('#enrollmentDate').val(student.enrollmentDate).prop('disabled', false);
}


function enableFormForNewEntry() {
    $('#fullName').prop('disabled', false);
    $('#class').prop('disabled', false);
    $('#birthDate').prop('disabled', false);
    $('#address').prop('disabled', false);
    $('#enrollmentDate').prop('disabled', false);
    $('#save').prop('disabled', false);
    $('#reset').prop('disabled', false);
    $('#fullName').focus();
}


function validateData() {
    const student = {
        id: $('#rollNo').val().trim(),
        fullName: $('#fullName').val().trim(),
        class: $('#class').val().trim(),
        birthDate: $('#birthDate').val().trim(),
        address: $('#address').val().trim(),
        enrollmentDate: $('#enrollmentDate').val().trim()
    };

   
    for (const [key, value] of Object.entries(student)) {
        if (!value) {
            alert(`Please enter ${key}`);
            $(`#${key}`).focus();
            return null;
        }
    }

    return JSON.stringify(student);
}


function saveData() {
    const studentData = validateData();
    if (!studentData) return;

    const putRequest = createPUTRequest(connToken, studentData, dbName, relationName);
    
    jQuery.ajaxSetup({ async: false });
    const res = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    if (res.status === 200) {
        alert('Student enrolled successfully!');
        resetForm();
    } else {
        alert('Error saving student: ' + JSON.stringify(res));
    }
}


function updateData() {
    const studentData = validateData();
    if (!studentData) return;

    const updateRequest = createUPDATERecordRequest(
        connToken, 
        studentData, 
        dbName, 
        relationName, 
        localStorage.getItem('recno')
    );

    jQuery.ajaxSetup({ async: false });
    const res = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    if (res.status === 200) {
        alert('Student updated successfully!');
        resetForm();
    } else {
        alert('Error updating student: ' + JSON.stringify(res));
    }
}