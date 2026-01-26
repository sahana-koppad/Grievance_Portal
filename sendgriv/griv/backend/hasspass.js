import bcrypt from "bcryptjs";

const password = "somu@123";
bcrypt.hash(password, 10).then((hash) => {
  console.log("Hash for vijay@123:", hash);
});
