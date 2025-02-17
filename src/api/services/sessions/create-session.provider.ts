import { SessionRepository } from '@/api/repositories/SessionRepository'
import { MovieRepository } from '@/api/repositories/MovieRepository'
import { movieSchema } from '@/api/schemas/movie.schemas'
import {
  createSessionSchema,
  sessionSchema,
} from '@/api/schemas/session.schemas'
import { createSessionData, sessionData } from '@/api/types/session.types'
import AppError from '@/api/errors/AppError'

export const CreateSession = async (
  sessionData: createSessionData,
): Promise<sessionData> => {
  // eslint-disable-next-line camelcase
  const { movie_id, room, capacity, day, time } =
    createSessionSchema.parse(sessionData)

  const movie = await MovieRepository.findOne({ where: { id: movie_id } })

  if (!movie) {
    throw new AppError('Bad Request', 'Customer not found.');
  }

  if (await SessionRepository.exists({ where: { room, day, time } })) {
    throw new AppError('Bad Request', 'Room is already booked for another session at this time.');
  }

  const session = SessionRepository.create({
    room,
    capacity,
    day,
    time,
    movie: movieSchema.parse(movie),
    tickets: [],
  })

  await SessionRepository.save(session)

  return sessionSchema.parse(session)
}
