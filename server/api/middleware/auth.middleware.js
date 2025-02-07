import jwt from "jsonwebtoken"

export const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth.token

  if (!token) {
    return next(new Error("Authentication error: Token required"))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    socket.userId = decoded.id
    next()
  } catch (err) {
    next(new Error("Authentication error: Invalid token"))
  }
}

