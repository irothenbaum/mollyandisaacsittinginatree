/**
 * Run this file on the output for the get_rsvp_data.sql
 * and it will convert it into a javascript w/ padding file
 */
const fs = require('fs')
const data = require('./rsvp_data.json')
const characterset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@.'{}[],()"

let stringify = JSON.stringify(data)


let obfuscated = obfuscate(stringify)
let unobfuscated = unobfuscate(obfuscated)

if (unobfuscated === stringify) {
    fs.writeFile('./encoded.txt', obfuscated, () => {
        console.log("Done")
    })
} else {
    console.error("Didn't work")
}

function obfuscate(str) {
    let output = '';
    for(let i=0; i<str.length; i++){
        let index = characterset.indexOf(str[i])
        let char
        if (index > -1) {
            char = index
        } else {
            char = 'X' + str[i]
        }
        output += p(char)
    }
    return Buffer.from(output, 'ascii').toString('base64')
}

function unobfuscate(str) {
    let decoded = Buffer.from(str, 'base64').toString('ascii')
    let output = ''
    for(let i=0; i<decoded.length; i+=2) {
        let substr = decoded.substr(i, 2)
        let index = parseInt(substr)
        let char
        if (isNaN(index)) {
            char = substr[1]
        } else {
            char= characterset[index]
        }
        output += char
    }
    return output
}

function p(input) {
    return (('' + input).length < 2 ? '0' : '') + input
}
