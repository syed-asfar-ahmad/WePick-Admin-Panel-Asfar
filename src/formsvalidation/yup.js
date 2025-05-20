import * as Yup from "yup";
import errorMessages from "./errormessages";

const { required, stringFormat, stringRange, arrayRange } = errorMessages;

const alphabetsRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/; // Alphabets with no extra white spaces
const alphaNumericWithSpacesRegex = /^(?!\s)(?!.*\s\s)[a-zA-Z0-9 ]+$/;
const emailRegex = /^$|^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const contactNoRegex = /^\+90 \d{3} \d{3} \d{4}$/;
const usernameRegex = /^(?:[a-zA-Z0-9._]+)?$/;
const websiteUrlRegex = /^(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?$|^$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/;
const domainRegex = /^(?:[a-zA-Z0-9-]+\.)*(?:edu|com|org|net|gov|mil|info|biz|co|io|tech|ai|ac\.[a-zA-Z]{2,}|edu\.[a-zA-Z]{2,})$/;
const abbreviationRegex = /^[A-Z]+$/;

const numericRegex = /^[0-9]*$/;
const alphaNumericNoSpacesRegex = /^$|^[a-zA-Z0-9]+$/;
const PROFILE_SUPPORTED_FORMATS = ['image/png', 'image/jpeg', 'image/jpg'];

const formats = {
    username: usernameRegex,
    email: emailRegex,
    contact: contactNoRegex,
    password: passwordRegex,
    website: websiteUrlRegex,
    alphabets: alphabetsRegex,
    alphanumeric: alphaNumericWithSpacesRegex,
    domain: domainRegex,
    abbreviation: abbreviationRegex
};

const string = (title, format, min, max, length) => {
  
  let temp = Yup?.string()?.required(required(title));

  if(format) temp = temp?.matches(formats[format], stringFormat(title, format));

  if(min) temp = temp?.min(min, stringRange(title, min));
  if(max) temp = temp?.max(max, stringRange(title, null, max));
  if(length) temp = temp.test(
    'string-length',
    stringRange(title, null, null, length),
    (value) => !value || value.length === length
  );

  return temp;

};

const file = (title, width, height, notRequired) => Yup?.mixed()?.test('fileType', `${title} must have a valid file format e.g. Png/Jpeg/Jpg`, (file) => {

    if(!file && notRequired === true) return true;
    else return file && (PROFILE_SUPPORTED_FORMATS.includes(file.type) || typeof file === "string" );

  })
  ?.test('fileSize', `${title} size must be less than or equal to 1mb`, (file) => {
    
    if(!file && notRequired === true) return true;
    return typeof file === "string" || file?.size <= 1000000;

  })
  ?.test('file-dimensions', `${title} dimensions must be in a range of ${width} x ${height}`, (file) => {

    if(!file && notRequired === true) return true;
    else if(typeof file === "string") return true;

    return new Promise((resolve, reject) => {

      const tempImage = new Image();
      tempImage.src = URL?.createObjectURL(file);

      tempImage.onload = () => {

        console.log('University: width', tempImage?.width);
        console.log('University: height', tempImage?.height);

        resolve(tempImage?.width <= width && tempImage?.height <= height);
        return;
      }

      tempImage.onerror = () => {
        reject(new Error("Image could not be loaded"));
      };

    })

  })
  ?.required(`${title} is required`);

  const array = (title, min, max) => {

    let temp = Yup?.array()?.test('required', required(title), (items) => {
      return items?.length > 0;
    });
  
    if(min) temp = temp?.min(min, arrayRange(title, min));
    if(max) temp = temp?.max(max, arrayRange(title, null, max));
  
    return temp;
  
  }

const yup = {

    string,
    file,
    array
};

export default yup;