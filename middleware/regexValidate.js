
async function validEmail(email) {
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const result = await regexEmail.test(email)
    return result
}

async function validPassword(pass) {
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const result = await regexPassword.test(pass)
    return result
}

async function validName(name) {
    const regexName = /^[A-Za-z\s]*$/;

    const result = await regexName.test(name)
    return result
}

module.exports = {
    validEmail
    , validName, validPassword
}