import bcrypt from 'bcrypt'

export const hashPassword = async (password)=>{
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password,salt)
    return hashPassword;
}

export const compare = async (plain, hash) =>{
    return await bcrypt.compare(plain,hash)
}