import { Api, EntityLoginInfo, EntityNewReview } from '../generated/api'

const api = new Api()

export const getFeedbacks = async () => {
	const { data } = await api.review.reviewList()

	return data
}

export const createFeedback = async (newFeedback: EntityNewReview) => {
	const response = await api.review.reviewCreate(newFeedback)

	return response.status === 200
}
