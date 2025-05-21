const axios=require("axios");

module.exports.userAuthentication = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "unauthorized" });
    }
   try {
        const user = await axios.get(`${process.env.SERVER_URL}/profile`,{
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        if (!user) {
            return res.status(401).json({ message: "unauthorized" });
        }
        req.user = user.data;
    } catch (error) {
        console.log(error.message)
        return res.status(401).json({ message: error.message });
    }
    return next();
}