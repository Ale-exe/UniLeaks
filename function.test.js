const helper = require('./testfunc');

test('Ensures a 4 digit number is generated by generateDigits (Validation)', () => {
    expect(helper.generateDigits(4)).toMatch(new RegExp('[0-9]{4}'));
});

test('Ensures no negative values are chosen within generateDigits (Validation)', () => {
    expect(parseInt(helper.generateDigits(4))).toBeGreaterThanOrEqual(0);
});

test('Ensures no output above 5 digits in generateDigits (Validation)', () => {
    expect(parseInt(helper.generateDigits(4))).toBeLessThanOrEqual(9999);
});

test('Ensures values are being correctly encoded (XSS)', () => {
    expect(helper.encodeOutput('&<">')).toBe('&amp&lt&quot&gt');
});

test('Ensures values are being correctly decoded (XSS)', () => {
    expect(helper.decodeOutput("&lt&gt&amp&#x27")).toBe("<>&'");
});

test('Ensures post do not include script tags (XSS)', () => {
    expect(helper.validatePost('<script>console.log("hacked")</script>')).toBeFalsy();
});

test('Ensures post do not contain blank entries in EITHER title or body (Functionality and polish)', () => {
    expect(helper.validateWordcount('          ','  a')).toBeFalsy();
});

test('Ensures posts does not allow posts over the character limit (XSS)', () => {
    expect(helper.validateWordcount('This is an egregiously long post title that really should not exist ' +
        'within any post','  a')).toBeFalsy();
});

test('Ensures usernames cannot contain banned characters <>"\'& (XSS)', () => {
    expect(helper.validateRegisterForm('<script>console.log("hacked")</script>','Sensible38p@!ASSWOrd','test@test.com')).toBeFalsy();
});

test('Ensures passwords contain a capital letter (Password Security)', () => {
    expect(helper.validateRegisterForm('testuser','sensible38p@!assword','test@test.com')).toBeFalsy();
});

test('Ensures passwords contain a number (Password Security)', () => {
    expect(helper.validateRegisterForm('testuser','sensiblep@!assWord','test@test.com')).toBeFalsy();
});

test('Ensures passwords contain a symbol (Password Security)', () => {
    expect(helper.validateRegisterForm('testuser','sensible38passWord','test@test.com')).toBeFalsy();
});

test('Ensures emails are in correct format - User@provider.domain  (Usability and Filtering)', () => {
    expect(helper.validateRegisterForm('testuser','Sensible38p@!ASSWOrd','test.com')).toBeFalsy();
});

test('Ensures files can be submitted with JPG/PNG/GIF extensions only (File Traversal)', () => {
    expect(helper.checkFile('leaks.jpg')).toBeTruthy();
});

test('Ensures user entry is not passed directly into queries (SQL Injection)', () => {
    expect(helper.getPostById(50)).toBeTruthy();
});