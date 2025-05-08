const jpdbBaseURL = 'http://api.login2explore.com:5577';
const jpdbIRL = '/api/irl';
const jpdbIML = '/api/iml';
const dbName = 'SCHOOL-DB';
const relationName = 'STUDENT-TABLE';
const connToken = '90934688|-31949205524205343|90956190';      

$(document).ready(function() {
    resetForm();
    $('#rollNo').focus();
});


function resetForm() {
    $('#rollNo').val('').prop('disabled', false);
    $('#fullName').val('');
    $('#class').val('');
    $('#birthDate').val('');
    $('#address').val('');
    $('#enrollmentDate').val('');
    $('#save').prop('disabled', false);
    $('#update').prop('disabled', true);
    $('#reset').prop('disabled', true);
    $('#rollNo').focus();
}


function getStudent() {
    const rollNo = $('#rollNo').val().trim();
    if (!rollNo) return;

    const jsonData = JSON.stringify({ id: rollNo });
    const getRequest = createGET_BY_KEYRequest(connToken, dbName, relationName, jsonData);

    jQuery.ajaxSetup({ async: false });
    const res = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });

    if (res.status === 200) { 
        fillStudentData(res);
        $('#update').prop('disabled', false);
    } else { 
        $('#save').prop('disabled', false);
    }
    $('#reset').prop('disabled', false);
}


function fillStudentData(jsonObj) {
    const data = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', data.rec_no);
    const student = data.record;
    
    $('#rollNo').prop('disabled', true);
    $('#fullName').val(student.fullName);
    $('#class').val(student.class);
    $('#birthDate').val(student.birthDate);
    $('#address').val(student.address);
    $('#enrollmentDate').val(student.enrollmentDate);
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
        alert('Error saving student: ' + res.message);
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
        alert('Error updating student: ' + res.message);
    }
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

    // Check for empty fields
    for (const [key, value] of Object.entries(student)) {
        if (!value) {
            alert(`Please enter ${key}`);
            $(`#${key}`).focus();
            return null;
        }
    }

    return JSON.stringify(student);
}