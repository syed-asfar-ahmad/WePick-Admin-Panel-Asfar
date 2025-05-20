const messages = {
    username: 'must contain only alphanumeric characters, underscores and periods',
    email: 'must contain a valid email address',
    password: 'must contain both letters and digits. Special characters are allowed',
    contact: 'must be valid e.g. +90 312 213 2965',
    website: 'must be a valid url e.g. www.example.com',
    alphabets: 'must contain only alphabets',
    alphanumeric: 'must contain alphanumeric values',
    domain: 'must be a valid domain e.g. .edu, .com, .org, .net, .gov, .mil, .info, .biz, .co, .io, .tech, .ai,',
    abbreviation: 'must contain only uppercase characters'
};

const stringFormat = (title, format) => format && `${title} ${messages[format]}`;
const required = (title) => title && `${title} is required`;
const stringRange = (title, min, max, length) => {
    if(min) return `${title} must contain at least ${min} characters`;
    if(max) return `${title} must contain at most ${max} characters`;
    if(length) return `${title} must contain ${length} characters`;
};

const arrayRange = (title, min, max, length) => {
    if(min) return `${title} must contain at least ${min} value`;
    if(max) return `${title} must contain at most ${max} values`;
    if(length) return `${title} must contain ${length} values`;
}

const errorMessages = {
    required,
    stringFormat,
    stringRange,
    arrayRange
}

export default errorMessages;