const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// USER INPUT
rl.question("\nMasukkan panjang password: ", function(length) {
    length = parseInt(length);
    if (isNaN(length) || length <= 0) {
        console.log("\nPanjang password harus berupa 'angka' dan 'lebih dari 0'.\n");
        rl.close();
        return;
    }
    rl.question("Haruskah password mengandung angka? (y/n): ", function(incNumbers) {
        rl.question("Haruskah password mengandung huruf besar? (y/n): ", function(incUppercase) {
            rl.question("Haruskah password mengandung karakter khusus? (y/n): ", function(incSpecial) {
                const includeNumbers = incNumbers.toLowerCase() === 'y';
                const includeUppercase = incUppercase.toLowerCase() === 'y';
                const includeSpecial = incSpecial.toLowerCase() === 'y';

                const { password, iterations, executionTime } = generatePassword(parseInt(length), includeNumbers, includeUppercase, includeSpecial);

                console.log("\nPassword yang dihasilkan: ", password);
                console.log("Jumlah perulangan brute-force: ", iterations);
                console.log(`Waktu eksekusi: ${executionTime.toFixed(2)} ms`);
                console.log("\n");

                rl.close();
            });
        });
    });
});

// LOGIC GENERATE PASSWORD
function generatePassword(length, includeNumbers, includeUppercase, includeSpecial) {
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';

    let charPool = lowerCase;
    if (includeNumbers) charPool += numbers;
    if (includeUppercase) charPool += upperCase;
    if (includeSpecial) charPool += specialChars;

    const charArray = charPool.split('');

    function bruteForce() {
        let pssementara = '';
        for (let i = 0; i < length; i++) {
            pssementara += charArray[Math.floor(Math.random() * charArray.length)];
        }
        return pssementara;
    }

    let password = '';
    let found = false;
    let iterations = 0;
    const startTime = performance.now();

    while (!found) {
        password = bruteForce();
        found = validatePassword(password, includeNumbers, includeUppercase, includeSpecial);
        iterations++;
    }

    const endTime = performance.now();
    const executionTime = endTime - startTime;

    function validatePassword(password, includeNumbers, includeUppercase, includeSpecial) {
        let hasLower = /[a-z]/.test(password);
        let hasNumber = includeNumbers ? /[0-9]/.test(password) : true;
        let hasUpper = includeUppercase ? /[A-Z]/.test(password) : true;
        let hasSpecial = includeSpecial ? /[!@#$%^&*()_+\[\]{}|;:,.<>?]/.test(password) : true;
    
        return hasLower && hasNumber && hasUpper && hasSpecial;
    }    

    return { password, iterations, executionTime };
}