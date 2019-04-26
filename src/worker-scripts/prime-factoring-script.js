export default function(number) {
    var primeArray = [],
        isPrime;

    //find divisors starting with 2
    for (var i = 2; i <= number; i++) {
        if (number % i===0) {

            //check if divisor is prime
            for(var j = 2; j <= i/2; j++) {
                if(i % j === 0) {
                    isPrime = false;
                } else {
                    isPrime = true;
                }
            }

            //if the divisor is prime
            if (isPrime === true) {
                //divide integer by prime factor & factor store in array primeArray
                number /= i
                primeArray.push(i);
            }
        }
    }

    for (var k = 0; k < primeArray.length; k++) {
        return primeArray;
    }
}