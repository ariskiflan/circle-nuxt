<script setup>
// soal 1
// cek angka ganjil atau genap
const cekangka = (n) => {
if (n % 2 == 0) {
    return 'genap'
} else {
    return 'ganjil' 
}
}
console.log(cekangka(2));

// soal 2
// menjulmlahkan Array
const angka = [1,2,3,4,5]

const jumlah = (n) => {
let total = 0

for (let i = 0; i < n.length; i++) {
 total += n[i]
}
return total
}
console.log(jumlah(angka));

// soal 3
// membalik string
const balikKata = (str) => {
return str.split('').reverse().join('')
}
console.log(balikKata('aris'));

// soal 4
// mencari nilai terbesar 

const angka1 = [1,2,3,4,5]

const maxNumber = (param) => {
    let max = 0
for (let i = 0; i < param.length; i++ ) {
   if (param[i] > max) {
    max = param[i]
   }
}
return max
}
console.log(maxNumber(angka1));

// soal 5
// hitung jumlah huruf vokal

const hitungVokal = (str) => {
const regex = /[aeiou]/gi
return str.match(regex).length
}
console.log(hitungVokal('hallo dunia'));

// soal 6
// menghapus nilai array yang duplikat

const angka2 = [1, 2, 3, 4, 4, 5, 6, 7, 7, 8]

const removeDuplicate = (param) => {
    const newAngka = []
    for (let i = 0; i < param.length; i++) {
        if (!newAngka.includes(param[i])) {
            newAngka.push(param[i])
        }
    }
    return newAngka
}
console.log(removeDuplicate(angka2));

// soal 7
// palindrom
const isPalindrome = (kata) => {
    const kataReverse = kata.split('').reverse().join('')
    return kata === kataReverse
}
console.log(isPalindrome('malam'));

// soal 8
// faktorial
const faktorial = (n) => {
    let hasil = 1
    for (let i = 1; i <= n; i++) {
        hasil *= i
    }
    return hasil
}
console.log(faktorial(5));

// soal 9
// gabungkan 2 array tanpa duplikat
const gabungArray = (arr1, arr2) => {
    const result = [...new Set([...arr1, ...arr2])];
    return result
}
console.log(gabungArray([1,2,2], [3,4,5,6,6]));

// 10
// hitung karakter muncul
const hitungHuruf = (text, huruf) => {
    const total = []
    for (let i = 0; i < text.length; i++) {
        if (text[i] === huruf) {
            total.push(text[i])
        }
    }
    return total.length
}
console.log(hitungHuruf('hallo dunia', 'a'));

// 11
// sum positive
const sumPositive = (arr) => {
    let sumNumber = 0
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > 0) {
        sumNumber += arr[i]
        }
    }
    return sumNumber
}
console.log(sumPositive([1, -4, 7, 12]), sumPositive([-1, -2, -3]))

// 12
// Repeat string
const repeatStr = (str, n) =>{
    if (n <= 0) {
        return ''
    }

    let result = ''
    for (let i = 0; i < n; i++) {
        result += str
    }
    return result
} 
console.log(repeatStr('ha', 3));

// 13
// Two sum
const twoSum = (arr, target) => {
    const result = []
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] + arr[j] === target) {
                result.push(i, j)
            }
        }
    }
    return result
}
console.log(twoSum([2, 7, 11, 15], 9), twoSum([3, 2, 4], 6));

// 14
// Capitalize words
const capitalizeWords = (str) => {
    if (!str) return ''
    const arrayKata = str.split(' ')
    const kapitalKata = arrayKata.map(kata => {
        return kata.charAt(0).toUpperCase() + kata.slice(1)
    }) 

    return kapitalKata.join(' ')
}
console.log(capitalizeWords('hello world'));

// 15
// Count occurrences Buat fungsi countOccurrences(arr, val) 
// yang menghitung berapa kali val muncul di dalam array.
const countOccurrences = (arr, val) => {
    const result = []
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
            result.push(arr[i])
        }
    }
    return result.length
}
console.log(countOccurrences([1, 2, 3, 2, 2], 2));


</script>

<template>
    <div>test</div>
</template>