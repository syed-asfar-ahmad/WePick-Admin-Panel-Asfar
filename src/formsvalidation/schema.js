import * as Yup from "yup";
import yup from "./yup";

const university = Yup.object().shape({
  profile_image: yup?.file("Display Image", 500, 500),
  banner_image: yup?.file("Background Image", 1150, 225),
  universityName: yup?.string("University name", "alphabets", 1, 30),
  websiteURL: yup?.string("Website url", "website"),
  universityAbbreviation: yup?.string(
    "University abbreviation",
    "abbreviation",
    1,
    30
  ),
  universityDomain: yup?.string("University domain", "domain"),
  aboutUniversity: yup?.string("About university", null, 1, 500),
  courses: yup?.array("Course", 1, 10),
  tags: yup?.array("Tag", 1, 10),
  email: yup?.string("Email", "email"),
  phoneNo: yup?.string("Phone number", "contact"),
  address: yup?.string("Address", null, null, 200),
});

const schemas = {
  university,
};

export default schemas;
