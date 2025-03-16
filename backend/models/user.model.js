import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
    },
    cartItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            quantity: {
                type: Number,
                default: 1,
            },
        },
    ],
    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer",
    },
}, { 
    timestamps: true 
    }
);

//pre save hook to hash the password before saving the user model
//password는 사용자가 입력한 비밀번호, this.password는 userSchema에 정의된 password
//this.isModified("password")는 password가 수정되었는지 확인하는 함수
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }   
});
//this는 현재 저장하거나 수정 중인 특정 문서(객체) 자체를 의미!
//추후에 사용할 함수, 입력된 값과 데이터베이스에 저장된 값이 일치하는지 확인
//this.password는 userSchema에 정의된 password
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;