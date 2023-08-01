const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')

const EMAIL_PATTERN =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const PASSWORD_PATTERN = /^.{8,}$/i;
const URL_PATTERN = /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?\/?$/gm;
const SALT_ROUNDS = 10;

const companySchema = new Schema({
    companyName: {
        type: String,
        required: [true, "El nombre de la empresa es requerido"]
    },
    email: {
        type: String,
        required: [true, "El correo electrónico es requerido"],
        unique: true,
        match: [EMAIL_PATTERN, "Por favor, introduce un correo electrónico válido"]
    },
    password: {
        type: String,
        required: [true, "La contraseña es requerida"],
        match: [PASSWORD_PATTERN, "La contraseña debe contener al menos 8 dígitos"]
    },
    active: {
        type: Boolean,
        default: false
    },
    province: {
        type: String,
        required: [true, "La provincia es requerida"]
    },
    city: {
        type: String,
        required: [true, "La ciudad es requerida"]
    },
    locationdata: {
        type: { type: String },
        coordinates: [Number]
    },
    website: {
        type: String,
        match: [URL_PATTERN, "Por favor introduce una dirección web válida"]
    },
    phone: {
        type: String
    },
    avatar: {
        type: String,
        default: "https://static.thenounproject.com/png/5034901-200.png"
    },
    isCompany: {
        type: Boolean,
        default: true
    }
}, 
{
    timestamps: true,
    virtuals: true
});

companySchema.virtual("rooms", {
    ref:"Room",
    localField: "_id",
    foreignField: "company",
    justOne: false,
});

companySchema.pre('save', function(next) {

    if(this.isModified('password')) {
        bcrypt
        .hash(this.password, SALT_ROUNDS)
        .then((hash) => {
            this.password = hash;
            next();
        })
        .catch(err => next(err));
    } else {
        next();
    }
});

companySchema.methods.checkPassword = function(password) {
    return bcrypt.compare(password, this.password);
}

const Company = mongoose.model('Company', companySchema);

module.exports = Company;